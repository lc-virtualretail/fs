"""Convert a PDF to Markdown preserving bold, italic, and headers.
Uses pdfplumber with column detection for two-column layouts.
Fixes ligatures (ﬁ→fi, ﬂ→fl) and syllable-break hyphens."""
import sys
import re
import pdfplumber
from collections import Counter


def fix_ligatures(text: str) -> str:
    """Replace unicode ligature characters and broken ligature spaces."""
    for old, new in {
        "\ufb01": "fi", "\ufb02": "fl", "\ufb00": "ff",
        "\ufb03": "ffi", "\ufb04": "ffl", "\ufb06": "st",
    }.items():
        text = text.replace(old, new)
    # Broken ligatures: "fi " or "fl " with a space where the PDF split them
    text = re.sub(r"(?<=[a-záéíóúüñA-ZÁÉÍÓÚÜÑ])fi ([a-záéíóúüñ])", r"fi\1", text)
    text = re.sub(r"(?<=[a-záéíóúüñA-ZÁÉÍÓÚÜÑ])fl ([a-záéíóúüñ])", r"fl\1", text)
    text = re.sub(r"(?<=[a-záéíóúüñA-ZÁÉÍÓÚÜÑ])ff ([a-záéíóúüñ])", r"ff\1", text)
    text = re.sub(r"(?<![a-záéíóúüñA-ZÁÉÍÓÚÜÑ])fi ([a-záéíóúüñ])", r"fi\1", text)
    text = re.sub(r"(?<![a-záéíóúüñA-ZÁÉÍÓÚÜÑ])fl ([a-záéíóúüñ])", r"fl\1", text)
    return text


def fix_hyphenation(text: str) -> str:
    """Rejoin words broken by soft hyphens (U+00AD) or hyphens at line breaks."""
    text = re.sub(r"\u00AD\s*\n\s*", "", text)
    text = re.sub(
        r"([a-záéíóúüñA-ZÁÉÍÓÚÜÑ])-\n\s*([a-záéíóúüñ])",
        r"\1\2",
        text,
    )
    return text


def filter_page_chars(page) -> list:
    """Filter out page numbers, sidebar navigation, and duplicate chars."""
    chars = page.chars
    if not chars:
        return []

    filtered = []
    seen_positions = set()
    for c in chars:
        # Skip bottom page numbers
        if c['top'] > 740:
            continue
        # Skip sidebar navigation (UltBol font at right edge, size ~8.5)
        if c['x0'] > 520 and c.get('size', 0) < 9:
            continue
        # Skip duplicate chars at same position
        pos_key = (round(c['x0'], 1), round(c['top'], 1), c['text'])
        if pos_key in seen_positions:
            continue
        seen_positions.add(pos_key)
        filtered.append(c)

    return filtered


def detect_columns(chars) -> float | None:
    """Detect if page has two columns. Returns split x-coordinate or None."""
    if not chars:
        return None

    # Look for a gap in character x-positions between x=280 and x=340
    x_occupied = set()
    for c in chars:
        for x in range(int(c['x0']), int(c['x1']) + 1):
            x_occupied.add(x)

    # Find continuous gap in the expected column-gap zone
    gap_start = None
    gap_end = None
    for x in range(280, 340):
        if x not in x_occupied:
            if gap_start is None:
                gap_start = x
            gap_end = x
        else:
            if gap_start is not None and gap_end - gap_start >= 5:
                break
            gap_start = None
            gap_end = None

    if gap_start is not None and gap_end is not None and gap_end - gap_start >= 5:
        return (gap_start + gap_end) / 2

    return None


def extract_column_text(chars_filtered, x0, x1):
    """Extract text from a vertical slice of the page."""
    chars = [c for c in chars_filtered if c['x0'] >= x0 - 1 and c['x1'] <= x1 + 1]
    if not chars:
        return ""

    # Group chars into lines by top position (within 2px tolerance)
    lines = {}
    for c in chars:
        top = round(c['top'], 0)
        # Find existing line within tolerance
        matched = None
        for existing_top in lines:
            if abs(existing_top - top) < 3:
                matched = existing_top
                break
        if matched is not None:
            lines[matched].append(c)
        else:
            lines[top] = [c]

    # Sort lines by vertical position, chars within line by x position
    result_lines = []
    for top in sorted(lines.keys()):
        line_chars = sorted(lines[top], key=lambda c: c['x0'])
        # Build line text, detecting bold/italic from fontname
        parts = []
        current_text = ""
        current_style = None  # None, 'bold', 'italic', 'bolditalic'

        for i, c in enumerate(line_chars):
            fontname = c.get('fontname', '').lower()
            is_bold = 'bold' in fontname or 'black' in fontname or 'bol' in fontname
            is_italic = 'italic' in fontname or 'oblique' in fontname or 'ita' in fontname
            style = ('bolditalic' if is_bold and is_italic
                     else 'bold' if is_bold
                     else 'italic' if is_italic
                     else None)

            # Check for space gap between characters
            if i > 0:
                prev_x1 = line_chars[i-1]['x1']
                gap = c['x0'] - prev_x1
                char_width = c['x1'] - c['x0']
                if gap > char_width * 0.3 and gap > 1.5:
                    if style != current_style:
                        parts.append((current_style, current_text))
                        current_text = " " + c['text']
                        current_style = style
                    else:
                        current_text += " " + c['text']
                    continue

            if style != current_style:
                parts.append((current_style, current_text))
                current_text = c['text']
                current_style = style
            else:
                current_text += c['text']

        parts.append((current_style, current_text))

        # Format line with markdown
        formatted_parts = []
        for style, text in parts:
            if not text:
                continue
            text = fix_ligatures(text)
            if style == 'bolditalic':
                formatted_parts.append(f"***{text.strip()}*** " if text.strip() else text)
            elif style == 'bold':
                formatted_parts.append(f"**{text.strip()}** " if text.strip() else text)
            elif style == 'italic':
                formatted_parts.append(f"*{text.strip()}* " if text.strip() else text)
            else:
                formatted_parts.append(text)

        line_text = "".join(formatted_parts).rstrip()
        if line_text.strip():
            result_lines.append(line_text)

    return "\n".join(result_lines)


def detect_headers(text: str, chars_filtered, x0_bound, x1_bound) -> str:
    """Detect headers by font size and format them as markdown headers."""
    # Get body text size (most common)
    sizes = [c['size'] for c in chars_filtered
             if c['x0'] >= x0_bound - 1 and c['x1'] <= x1_bound + 1]
    if not sizes:
        return text
    body_size = Counter(round(s, 1) for s in sizes).most_common(1)[0][0]

    # Group chars by line to find header lines
    lines_by_top = {}
    for c in chars_filtered:
        if c['x0'] < x0_bound - 1 or c['x1'] > x1_bound + 1:
            continue
        top = round(c['top'], 0)
        matched = None
        for existing_top in lines_by_top:
            if abs(existing_top - top) < 3:
                matched = existing_top
                break
        if matched is not None:
            lines_by_top[matched].append(c)
        else:
            lines_by_top[top] = [c]

    header_line_texts = set()
    for top in sorted(lines_by_top.keys()):
        line_chars = lines_by_top[top]
        avg_size = sum(c['size'] for c in line_chars) / len(line_chars)
        if avg_size > body_size + 1.5:
            line_text = "".join(c['text'] for c in sorted(line_chars, key=lambda c: c['x0']))
            line_text = fix_ligatures(line_text.strip())
            if line_text and len(line_text) > 1:
                # Determine header level
                if avg_size > body_size + 6:
                    level = 1
                elif avg_size > body_size + 3:
                    level = 2
                else:
                    level = 3
                header_line_texts.add((line_text, level))

    # Replace matching lines in text with header format
    result_lines = []
    for line in text.split("\n"):
        clean = line.replace("**", "").replace("*", "").strip()
        matched = False
        for header_text, level in header_line_texts:
            if clean and header_text.startswith(clean[:20]) and len(clean) > 2:
                result_lines.append(f"\n{'#' * level} {clean}\n")
                matched = True
                break
        if not matched:
            result_lines.append(line)

    return "\n".join(result_lines)


def pdf_to_markdown(pdf_path: str, out_path: str):
    pdf = pdfplumber.open(pdf_path)
    total = len(pdf.pages)
    print(f"Processing {total} pages...")

    md_parts: list[str] = []

    for pg_idx, page in enumerate(pdf.pages):
        chars_filtered = filter_page_chars(page)
        split_x = detect_columns(chars_filtered)

        if split_x is not None:
            # Two-column page: extract left then right
            left_text = extract_column_text(chars_filtered, 0, split_x)
            right_text = extract_column_text(chars_filtered, split_x, page.width)

            # Apply header detection
            left_text = detect_headers(left_text, chars_filtered, 0, split_x)
            right_text = detect_headers(right_text, chars_filtered, split_x, page.width)

            page_text = left_text + "\n\n" + right_text
        else:
            # Single column
            text = extract_column_text(chars_filtered, 0, page.width)
            page_text = detect_headers(text, chars_filtered, 0, page.width)

        page_text = page_text.strip()
        if page_text:
            md_parts.append(f"\n---\n*Página {pg_idx + 1}*\n\n{page_text}")

        if (pg_idx + 1) % 50 == 0:
            print(f"  {pg_idx + 1}/{total} pages done")

    result = "\n".join(md_parts)

    # Post-process
    result = fix_hyphenation(result)
    result = re.sub(r'\*\*\*\*', '', result)
    result = re.sub(r'\n{4,}', '\n\n\n', result)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(result)

    print(f"Done: {total} pages -> {out_path}")


if __name__ == "__main__":
    pdf_path = sys.argv[1] if len(sys.argv) > 1 else r"d:\PROJECTS\FadingSuns\DOC\Fading Suns - Libro PJ - Ebook.pdf"
    out_path = sys.argv[2] if len(sys.argv) > 2 else r"d:\PROJECTS\FadingSuns\DOC\Fading Suns - Libro PJ.md"
    pdf_to_markdown(pdf_path, out_path)

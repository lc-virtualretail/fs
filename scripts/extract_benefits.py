import os, re, json

tmpdir = os.environ.get('TEMP', 'C:/Users/LC/AppData/Local/Temp')

with open(os.path.join(tmpdir, 'benefits_columns.txt'), 'r', encoding='utf-8') as f:
    benefits_text = f.read()

def normalize_for_search(s):
    """Remove accents and normalize for PDF text matching"""
    replacements = {
        '\u00c1':'A', '\u00e1':'a', '\u00c9':'E', '\u00e9':'e',
        '\u00cd':'I', '\u00ed':'i', '\u00d3':'O', '\u00f3':'o',
        '\u00da':'U', '\u00fa':'u', '\u00d1':'N', '\u00f1':'n',
        '\u00dc':'U', '\u00fc':'u', '\ufffd':'o',
    }
    for k, v in replacements.items():
        s = s.replace(k, v)
    return s

def find_benefit_desc(name, text):
    upper_name = name.upper()
    no_accent = normalize_for_search(upper_name)

    # Also normalize the text for searching
    norm_text = normalize_for_search(text)

    for search, search_text in [(upper_name, text), (no_accent, norm_text)]:
        pos = search_text.find(search)
        if pos >= 0:
            # Always use original text for extraction, just use normalized for position
            snippet = text[pos:pos+2000]
            ben_match = re.search(r'Benefi?\s*cio\s*:', snippet)
            if ben_match:
                desc = snippet[ben_match.end():ben_match.end()+600].strip()
                lines = desc.split('\n')
                result_lines = []
                for line in lines:
                    stripped = line.strip()
                    if not stripped:
                        continue
                    if re.match(r'^[A-Z\u00c0-\u00ff\s]{8,}$', stripped):
                        break
                    result_lines.append(stripped)
                    if len(' '.join(result_lines)) > 300:
                        break
                result = ' '.join(result_lines)
                result = re.sub(r'(\w)\s{2,}(\w)', r'\1 \2', result)
                return result[:350]
            else:
                lines = snippet.split('\n')
                desc_lines = []
                skip_types = ['Vocaci', 'Clase ', 'Libre ', 'Requisit', '--- PAGE', 'LEFT', 'RIGHT']
                for line in lines[1:8]:
                    stripped = line.strip()
                    if not stripped:
                        continue
                    if any(s in stripped for s in skip_types):
                        continue
                    desc_lines.append(stripped)
                    if len(' '.join(desc_lines)) > 200:
                        break
                return ' '.join(desc_lines)[:300] if desc_lines else None
    return None

all_benefits = [
    'Abogado Magistrado', 'Abrelatas', 'Absolucion', 'Acceso al Registro de Criminales',
    'Acompanamiento', 'Acuerdo de Pasaje', 'Adjunto de Casa',
    'Agente Secreto', 'Agilidad', 'Agitador', 'Ahorros',
    'Alentar', 'Amante', 'Amigo Animal', 'Amigos en Altas Esferas',
    'Analizar Personalidad', 'Antropologo', 'Aprender de los Errores',
    'Apuntar donde Duele', 'Armado hasta los Dientes', 'Armadura de Pureza',
    'Armadura de Santidad', 'Armonizar', 'Arte del Insulto',
    'Artes Marciales', 'Asesor Financiero', 'Autoridad', 'Autonomo',
    'Aventurarse en las Tinieblas',
    'Bendicion de San Lextius', 'Bendicion del Santo', 'Botanico', 'Burocracia',
    'Calculador', 'Camaleon', 'Campeon',
    'Cargo Gremial', 'Cartografo', 'Cartulario', 'Caza de Brujas',
    'Centro de Atencion', 'Chantaje', 'Chivos Expiatorios',
    'Comprender Nivel Tecnologico', 'Condicionamiento Mental',
    'Confesor de la Casa', 'Congraciarse', 'Conexion Empatica',
    'Conocimiento Superficial', 'Conocimiento Wyrd',
    'Consejero', 'Consejo Privado', 'Contorsionista',
    'Contrarrestar las Tinieblas', 'Cuerpo Sutil', 'Cuestor',
    'Cuidar del Rebano', 'Curtido',
    'Danza de la Destruccion', 'De Confianza', 'Deducir',
    'Delegar', 'Derechos de Autor', 'Dominio del Terreno',
    'Dos Pistolas',
    'Elaborar Elixir', 'Embargo', 'Empleador', 'Epifania',
    'Escamoteo', 'Escudo de la Ley', 'Esgrima',
    'Espiritu Maquina', 'Estafa a Largo Plazo', 'Estomago',
    'Extensor de Memoria',
    'Fabricar Dispositivo de Energia', 'Fabricar Tecnologia Asombrosa', 'Falsificador',
    'Fondo de Cobertura', 'Fortaleza en la Fe',
    'Golpe de Efecto', 'Gospel', 'Guardaespaldas', 'Guardar Secretos',
    'Heroe del Pueblo', 'Hierofante',
    'Iluminado', 'Iman para los Problemas', 'Imbuir Filacteria', 'Imbuir Sagrario',
    'Imperioso', 'Implacable', 'Impuesto sobre la Renta', 'Impuestos',
    'Incubacion', 'Indulgencia', 'Inalterable', 'Ingenioso',
    'Inspirador', 'Inspirar Miedo', 'Insensibilizado', 'Instinto Marcial',
    'Intocable', 'Intrepido', 'Intruso', 'Inviolabilidad',
    'Juego Sucio',
    'Legado', 'Leva', 'Leyenda Viviente', 'Libertinaje', 'Linguista',
    'Llamamiento a la Penitencia', 'Llave Maestra',
    'Maestro del Engano', 'Mantok', 'Maton a Sueldo', 'Mecanico',
    'Mecenas de las Artes', 'Medalla al Merito', 'Medalla al Valor',
    'Medalla de la Orden', 'Melomano', 'Memoria Perfecta', 'Mente Estrategica',
    'Mentor', 'Microconfesiones', 'Miembro de Aquelarre', 'Miembro del Consejo',
    'Mimesis',
    'Nacido con Estrella', 'Nacido en el Campo de Batalla', 'Nada que Perder',
    'Nadar con Tiburones', 'Nobleza Obliga',
    'Oido Absoluto', 'Ojo Experto', 'Olor de la Bruja', 'Oracion Terapeutica',
    'Orden Monastica', 'Ordenacion Religiosa', 'Orientado',
    'Palabras Liberadoras', 'Paragon de la Orden', 'Partidarios',
    'Pase de Acceso Ilimitado', 'Pastor del Rebano', 'Percepcion Mejorada',
    'Persecutor', 'Piloto de Acrobacias', 'Planificador de Ruta',
    'Poderes Psiquicos', 'Polimata', 'Porte Noble', 'Prestamista',
    'Privilegio de Adjunto Imperial', 'Privilegio Imperial', 'Punteria', 'Punteria Asistida',
    'Rango de Derviche', 'Rango Militar',
    'Recrear Artefacto', 'Red de Mentiras', 'Regreso Triunfal',
    'Reputacion de Cazador', 'Reputacion Profesional', 'Resistente',
    'Respiracion Coordinada', 'Respetable',
    'Resurgir de las Cenizas', 'Riqueza', 'Ritos Teurgicos',
    'Sabueso', 'Sacerdote Secular', 'Santificar Armas y Armadura',
    'Segunda Piel', 'Sello Inquisitorial', 'Sermon Virtuoso',
    'Sirviente', 'Suerte del Principiante', 'Suplica',
    'Tahur', 'Talisman Sintonizado', 'Temerario', 'Terrateniente',
    'Titulo Nobiliario', 'Tonalidad', 'Tutor',
    'Verdugo', 'Vigia', 'Virtuoso', 'Voto de Pobreza',
    'Zona de Autonomia Temporal',
    'Era una broma',
]

results = {}
not_found = []
for name in all_benefits:
    desc = find_benefit_desc(name, benefits_text)
    if desc:
        results[name] = desc
    else:
        not_found.append(name)

output_path = os.path.join(tmpdir, 'benefit_extracts.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Found: {len(results)}")
print(f"Not found ({len(not_found)}): {not_found}")

# Print some examples
for name in ['Imperioso', 'Esgrima', 'Riqueza', 'Absolucion', 'Cargo Gremial']:
    if name in results:
        print(f"\n--- {name} ---")
        print(results[name][:200])

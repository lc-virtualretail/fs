# Plan: Corrección completa de vocaciones

## Resumen del problema

Los datos de `src/data/vocations.ts` no fueron transcritos del PDF. La estructura es correcta pero el contenido de cada vocación (competencias, características, habilidades, beneficios, equipo) está inventado en las 48 vocaciones.

Errores adicionales:
- **Espía** solo está disponible para Noble → debe estar en Noble, Sacerdote y Mercader
- **Adjunto Imperial** solo está en Sacerdote → debe estar en Sacerdote y Mercader (con stat blocks distintos)
- **Independiente** no puede ver vocaciones de Mercader → el PDF dice "elige una vocación libre o de mercader"
- Los beneficios son listas inventadas de 4 → el PDF tiene 6-8 beneficios distintos por vocación

## Cambios en tipos (`src/types/rules.ts`)

Añadir campo opcional `especial` a `VocationDefinition` para Psíquico, Teúrgo y Derviche:

```typescript
export interface VocationDefinition {
  id: string
  nombre: string
  clase: ClassId[]
  descripcion: string
  libre: boolean
  especial?: string  // NUEVO: e.g. "Recibes 1 punto en Psi. No puedes ganar Teúrgia."
  carrera: {
    competencias: string[]
    caracteristicas: CharacteristicBonus[]
    habilidades: SkillBonus[]
    beneficios: string[]
    equipo: string[]
  }
}
```

## Cambios estructurales en datos

### Espía (1 entrada, multiclase)
```
clase: ['noble', 'sacerdote', 'mercader']  // antes solo ['noble']
```
El stat block es idéntico en las 3 clases según el PDF.

### Adjunto Imperial (2 entradas separadas)
- `id: 'adjunto-imperial'` → `clase: ['sacerdote']` (stat block sacerdotal, pág. 66)
- `id: 'adjunto-imperial-mercader'` → `clase: ['mercader']` (stat block mercader, pág. 80)

### Independiente (fix en código)
- `getVocationsByClass('independiente')` debe devolver: vocaciones libres + vocaciones de mercader
- `StepVocation.tsx` usa su propio filtro, también debe corregirse

## Correcciones por vocación (datos del PDF)

### NOBLE (pág. 54–62)

| Vocación | Competencias PDF | Características PDF | Habilidades PDF |
|---|---|---|---|
| Caballero Exp. | Armas Militares o Armas a Distancia; Saber Red Salto (bárbaras) o Armadura Combate | CON+1, FE+1, FUE+2, PRE+1 | CaC 2 o Disp 2; Empatía 1/Obs 1; Encanto 2/Impr 2; Pelear 1; Superviv 2; Vigor 2 |
| Comandante | Monta/Saber Marcial/Vehículos Guerra; Armas Militares | CON+1, INT+1, PRE+2, VOL+1/FE+1 | Academia 1; CaC 1; Conducir/Superviv 1; Disparar 1; Impresionar 3; Introspección 1; Vigor 2 |
| Conspirador | Saber (rival); Venenos/Saber Usos | INTU+1, PER+3, PRE+1 | Academia 1; Chariat 2; Disfraz 1; Encanto/Impr 2; Observar 2; Prestidig 1; Sigilo 1 |
| Cortesano | Saber Usos (Catedral/Vulgo); Saber | INT+2, PRE+3 | Academia 1; Artes 1; Charitat 1; CaC/Disp 1; Encanto 3; Impr 2; Representar 1 |
| Duelista | Armadura Combate; Armas Militares | CON+1, DES+1, FUE+2, PER+1/VOL+1 | Charitat/Repres 1; CaC 3; Empatía/Intros 1; Encanto/Impr 1; Pelear/Disp 2; Vigor 2 |
| Entusiasta | Instrumento Musical; Instrumento/Saber | DES+2, INT+2, PRE+1 | Academia 2; Artes 2; Charitat/Enc/Impr 1; Conducir/Pilotar 1; Empatía/Intros 1; Observar 1; Oficios/Tecnorr 1; Representar 1 |
| Espía | 1 libre (identidad); Bajos Fondos/Tortura/Venenos | DES+1, INT+1, PER+2, PRE+1 | Charitat 2; Empatía/Sigilo 1; Observar 2; +5 libres |
| Incógnito | 2 libres (identidad) | INTU+1, INT+1, PER+2, PRE+1 | Charitat 2; Empatía/Intros 1; Observar 2; +5 libres |
| Lord | 2 Saberes gobierno | CON+1, FE+2/VOL+2, PRE+2 | Academia 2; Disparar 1; Empatía 1; Encanto 1; Impr 2; Obs 1; Pelear/CaC 1; Superviv/Vigor 1 |
| Orden Caballería | Armadura/Saber Red Salto; Armas Militares/Distancia | FE+2, FUE+2, VOL+1 | CaC 2; Curar 1; Disparar 2; Encanto/Impr 2; Pelear 1; Vigor 2 |
| Ronin | Armas Militares/Distancia; Saber | CON+2/DES+2/FUE+2, INT+2, PER+1 | CaC/Disp 2; Empatía 1; Enc/Charitat 1; Impr 2; Obs 2; Pelear 1; Superviv 1 |
| Sibarita | Saber; Saber/Instrumento | CON+1/VOL+1, INTU+1, PRE+3 | Artes 2; Charitat 2; Disfraz/Prestidig 1; Enc/Impr 2; Obs 1; Repres 1; Vigor 1 |

### SACERDOTE (pág. 65–76)

| Vocación | Competencias PDF | Características PDF | Habilidades PDF |
|---|---|---|---|
| Adjunto Imperial | Armadura Combate/Armas; Saber Red Salto | CON+1, FE+1/VOL+1, INTU+1/PER+1, PRE+2 | CaC/Disp/Pelear 1; Curar 2; Empatía/Intros 1; Enc/Impr 2; Observar 2; Superviv 1; Vigor 1 |
| Clero | Hablar (latín); Leer (latín) | FE+1/VOL+1, INT+3, PRE+1 | Academia 2; Charitat/Empatía 1; Enc/Impr 2; Interfaz 1; Introspección 2; Observar 2 |
| Confesor | Saber; Saber Usos (Vulgo/Corte) | FE+1, INTU+2, PRE+2 | Curar 1; Empatía 3; Encanto 2; Impr 1; Intros 1; Observar 2 |
| Corista | Artes Escénicas (Música); Artes Escénicas (Canto) | FE+1, INTU+2, PRE+2 | Empatía/Obs 1; Encanto 2; Introspección 2; Representar 5 |
| Escriba | Leer (latín); Hablar (latín)/Saber Usos | FE+1/VOL+1, INT+2, INTU+2 | Academia 2; Artes 3; Charitat/Obs 2; Encanto 1; Interfaz 1; Intros 1 |
| Espía | (mismo que Noble) | (mismo) | (mismo) |
| Fraile | Saber; Usos del Vulgo | CON+1/FE+1, INTU+1, PRE+3 | Artes/Oficios 1; Charitat/Obs 1; Empatía 2; Enc/Impr 3; Conducir/Superviv 1; Representar 2 |
| Hermano Batalla | Armadura; Armas Distancia/Militares | CON+1, DES+1, FE+1/VOL+1, FUE+2 | CaC 2; Disparar 2; Impr 1; Intros 1; Pelear 2; Superviv 1; Vigor 1 |
| Inquisidor | Saber; Saber Usos/Tortura | CON+1/DES+1, PER+1, PRE+2, VOL+1 | Charitat/Empatía 2; Disp/Vigor 1; Enc/Impr 2; Intros 1; Observar 2; Representar 2 |
| Mendicante | Saber Red Salto; Usos Vulgo/Saber | CON+1, FE+1/VOL+1, PER+1, PRE+2 | Conducir/Superviv 1; Enc/Impr 2; Empatía/Charitat 1; Disp/Intros/Pelear 2; Repres 2; Vigor 2 |
| Monje | 2 Saberes (tradición) | CON+1, FE+2, VOL+2 | 3 tradiciones: Ascética, Marcial o Académica (default: Ascética) |
| Ocultista | Leer latín/Tecnología Extraña; Saber Oculto | FE+2/VOL+2, INT+1, INTU+2 | Academia 2; Interfaz/Superviv 1; Intros 2; Intrusión 1; Observar 2; Sigilo 1; Tecnorr 1 |
| Oniromante | Saber/Saber Usos; Saber Oculto | INTU+2, PER+1, PRE+2 | Academia 1; Charitat/Encanto 2; Empatía 3; Curar 2; Intros 1; Observar 1 |
| Sanador | Saber Médico; Saber Médico/Saber | DES+1, FE+2, INT+2 | Academia 1; Curar 3; Empatía 2; Encanto 2; Intros 1; Observar 1 |
| Templario | Armadura/Saber Marcial; Armas Distancia/Militares | DES+1, CON+1, FE+1/VOL+1, FUE+2 | CaC 2; Curar 1; Disparar 2; Impr 1; Intros 1; Pelear 2; Vigor 1 |

### MERCADER (pág. 78–89)

| Vocación | Competencias PDF | Características PDF | Habilidades PDF |
|---|---|---|---|
| Abogado | Saber; Saber Usos (Catedral/Corte) | FE+1/VOL+1, INTU+2, PRE+2 | Academia 2; Charitat 2; Empatía/Intros 1; Encanto 2; Interfaz 1; Representar 2 |
| Adjunto Imperial (mercader) | Armadura/Armas; Saber Red Salto | CON+1/DES+1, INT+2, INTU+1/PER+1, PRE+1 | Conducir/Pilotar 2; CaC/Disp/Pelear 1; Enc/Impr 1; Interfaz/Intrusión 1; Obs 1; Superviv 1; Tecnorr 2; Vigor 1 |
| Banquero | Armas Distancia/Saber Usos/Saber; Máquinas Pensantes | DES+1/FUE+1, FE+1/VOL+1, INT+1, PRE+2 | Academia 2; Alquimia/Prestidig 1; CaC/Disp/Pelear 2; Empatía/Obs 1; Enc/Impr 2; Interfaz 2 |
| Cadenero | Bajos Fondos; Transporte | FUE+2, PER+2, PRE+1 | Conducir/Pilotar 1; CaC 2; Impr 2; Observar 1; Pelear 2; Vigor 2 |
| Cazarrecompensas | Armas Distancia; Bajos Fondos/Transporte | DES+2/FUE+2, INTU+1, PER+1, PRE+1 | Conducir 1; CaC/Pelear 2; Charitat/Impr 2; Disparar 2; Interfaz 1; Observar 1; Pilotar 1 |
| Comerciante | Armas Distancia/Saber; Saber Usos | INT+1, INTU+1, PER+1, PRE+2 | Charitat/Encanto 3; CaC/Pelear 1; Disparar 1; Empatía 2; Representar 2; Prestidig 1 |
| Detective | Armas Distancia/Saber; Bajos Fondos | DES+1/FUE+1, INTU+1, PER+2, PRE+1 | Charitat 2; Disfraz/Empatía 1; Disparar 1; Enc/Impr 1; Intrusión 2; Observar 2; Pelear 1 |
| Espía (mercader) | (mismo que Noble) | (mismo) | (mismo) |
| Explorador | Armas Distancia/Operaciones/Transporte; Ciencias Vida/Saber | CON+1, INT+1, INTU+1, PER+2 | Conducir/Pilotar 1; Curar 1; Disparar 1; Observar 1; Sigilo 1; Superviv 2; Trato Animales 2; Vigor 1 |
| Ladrón | Armas Distancia/Saber; Bajos Fondos | DES+2, INTU+1, PER+2 | Charitat 2; CaC/Disp/Pelear 1; Disfraz/Tecnorr 1; Intrusión 2; Obs 1; Prestidig 1; Sigilo 2 |
| Magnate | Saber; Saber Científico/Saber Usos | FE+1/VOL+1, INT+1, INTU+1, PRE+2 | Alquimia 2; Charitat 2; CaC/Disp 1; Empatía/Intros 1; Enc/Impr 2; Oficios/Tecnorr 1; Repres 1 |
| Mercenario | Armadura/Armamento Pesado; Armas Distancia | CON+1, DES+2, FUE+2 | Conducir/Obs 1; CaC 1; Curar 1; Disparar 3; Impr 1; Pelear 1; Vigor 2 |
| Piloto Estelar | Operaciones a Bordo; Máquinas Pensantes/Vehículos Espaciales | DES+2, INT+2, INTU+1 | Conducir 1; Disparar 1; Enc/Impr 1; Interfaz 2; Observar 1; Pilotar 3; Tecnorr 1 |
| Recuperador | Armas Distancia/Operaciones/Transporte; Saber/Bajos Fondos | DES+1, INT+1, INTU+1, PER+2 | Conducir/Pilotar 1; Pelear/CaC/Disp 1; Intrusión 3; Charitat 1; Observar 1; Sigilo 1; Tecnorr 2 |
| Tecnorredentor | Saber Tecnológico; Ciencia/Máquinas Pensantes/Oficio | DES+1, INT+2, INTU+2 | Academia 1; Conducir/Pilotar 1; Disparar 1; Interfaz 2; Observar 1; Oficios 1; Tecnorr 3 |

### LIBRES (pág. 93–100, 270)

| Vocación | Competencias PDF | Características PDF | Habilidades PDF |
|---|---|---|---|
| Amateur | 2 libres | 5 puntos libres | 10 puntos libres |
| Artista | 2 Saberes (arte) | DES+1, INTU+3, PER+1 | Academia 1; Artes 3; Charitat/Enc 1; Empatía/Intros 2; Observar 2; Prestidig/Vigor 1 |
| Derviche | Armadura Combate/Saber Oculto; Armas Distancia/Militares/Saber Marcial | 5 puntos libres (default: DES/FUE+1, INT/PRE+1, INTU/PER+1, VOL+2) | 10 puntos libres (default: CaC 2; Disp 1; Impr 2; Intros 2; Pelear 2; Vigor 1) |
| Erudito | 2 Saberes/Ciencias | INT+3, INTU+1, PER+1 | Academia 3; Alquimia/Oficios 1; Interfaz 2; Intros 3; Observar 1 |
| Mercúreo | **3 Saberes** | DES+1/FE+1, INT+2/INTU+2, PER+1, PRE+1 | Artes/Repres 1; Encanto 1; Disfraz/Prestidig 1; Pelear/CaC/Disp 1; Charitat 3; Intrusión 1; Observar 1; Tecnorr 1 |
| Pirata | Armas Distancia/Militares; Armadura/Operaciones Bordo | DES+1, INT+1, INTU+1, PER+2 | Charitat 2; CaC/Disp 3; Intrusión 1; Pilotar 2; Tecnorr 2 |
| Psíquico | 2 Saberes | **4 puntos** + 1 Psi gratis (default: INTU+1, PER+1, VOL+2) | 10 puntos (default: Charitat 2; CaC/Disp/Pelear 1; Empatía 1; Enc/Impr 2; Intros 3; Vigor 1) |
| Teúrgo | 2 Saberes | **4 puntos** + 1 Teúrgia gratis (default: FE+2, INTU+1, VOL+1) | 10 puntos libres |
| Trotamundos | Saber; Saber Científico/Saber Tecnológico | CON+1, INT+1, INTU+1, PER+2 | Academia 2; Tecnorr/TratoAnim 2; Charitat/Enc/Impr 1; Conducir/Pilotar/Superviv 2; Intrusión 1; Observar 2 |

## Archivos a modificar

### 1. `src/types/rules.ts`
- Añadir `especial?: string` a `VocationDefinition`

### 2. `src/data/vocations.ts`
- Reescribir todas las 48 vocaciones con datos correctos del PDF
- Cambiar Espía a `clase: ['noble', 'sacerdote', 'mercader']`
- Añadir nueva entrada `adjunto-imperial-mercader` con `clase: ['mercader']`
- Mercúreo: 3 competencias en el array

### 3. `src/data/vocations.ts` (función)
- `getVocationsByClass`: añadir lógica especial para `independiente`

### 4. `src/pages/CharacterCreator/StepVocation.tsx`
- Corregir filtro de vocaciones para `independiente` (incluir mercader)

## Notas de implementación

- **Espía/Incógnito**: Los +5 puntos libres de habilidad se modelan como 5 entradas con `alternativas: [todas las habilidades]`
- **Monje**: Se implementa con tradición Ascética por defecto; la descripción menciona las 3 tradiciones
- **Psíquico/Teúrgo**: `especial` explica el punto gratis de Psi/Teúrgia; las características se modelan con 4 puntos + el especial
- **Derviche**: Al estar en capítulo 5, se modela con distribuciones por defecto
- **Mercúreo**: El array de competencias tiene 3 elementos (válido con el tipo actual)
- Los **beneficios** se listan tal como aparecen en el PDF (6-8 por vocación)

import { CLASSES } from '../src/data/classes'
import { FACTIONS } from '../src/data/factions'
import { VOCATIONS } from '../src/data/vocations'
import { BENEFIT_TOOLTIPS } from '../src/data/tooltips'

const allBenefits = new Set<string>()

for (const c of CLASSES) {
  allBenefits.add(c.educacion.beneficioArquetipico)
  for (const b of c.educacion.beneficiosDeClase) allBenefits.add(b)
}
for (const f of FACTIONS) {
  if (f.beneficio) allBenefits.add(f.beneficio)
}
for (const v of VOCATIONS) {
  for (const b of v.carrera.beneficios) allBenefits.add(b)
}

const missing = [...allBenefits].filter(b => !BENEFIT_TOOLTIPS[b]).sort()
console.log(`Total unique benefits: ${allBenefits.size}`)
console.log(`Missing tooltips: ${missing.length}`)
if (missing.length > 0) {
  for (const m of missing) console.log(`  - ${m}`)
}

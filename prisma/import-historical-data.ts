import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('Uvoz istorijskih podataka za Srbiju...')

  // Učitaj JSON
  const jsonPath = path.join(process.cwd(), 'data', 'serbia_historical.json')
  const rawData = fs.readFileSync(jsonPath, 'utf-8')
  const data = JSON.parse(rawData)

  const salaryData = data.serbia_salary_eur_diesel.salary_december_net_rsd
  const eurRates = data.serbia_salary_eur_diesel.eur_rsd_annual_avg
  const dieselPrices = data.serbia_salary_eur_diesel.diesel_rsd_per_litre_annual_avg

  // Kombinuj sve po godinama
  const years = salaryData.map((s: any) => s.year)

  for (const year of years) {
    const salaryEntry = salaryData.find((s: any) => s.year === year)
    const eurEntry = eurRates.find((e: any) => e.year === year)
    const dieselEntry = dieselPrices.find((d: any) => d.year === year)

    await prisma.serbiaHistoricalData.upsert({
      where: { year },
      update: {
        netSalaryRsd: salaryEntry?.net_dec_rsd || null,
        eurRsdRate: eurEntry?.avg_rsd_per_eur || null,
        dieselRsdPerLitre: dieselEntry?.avg_rsd_per_litre || null
      },
      create: {
        year,
        netSalaryRsd: salaryEntry?.net_dec_rsd || null,
        eurRsdRate: eurEntry?.avg_rsd_per_eur || null,
        dieselRsdPerLitre: dieselEntry?.avg_rsd_per_litre || null
      }
    })

    console.log(`✅ ${year}: Plata ${salaryEntry?.net_dec_rsd || 'N/A'} RSD, Kurs ${eurEntry?.avg_rsd_per_eur || 'N/A'}, Dizel ${dieselEntry?.avg_rsd_per_litre || 'N/A'}`)
  }

  console.log('✅ Svi istorijski podaci uvezeni!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

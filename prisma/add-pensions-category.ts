import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Dodavanje penzija kao kategorija...')

  // Kreiraj kategoriju penzije
  const pensionsCategory = await prisma.category.create({
    data: {
      name: 'Penzije',
      slug: 'pensions'
    }
  })

  console.log('✅ Kategorija penzije kreirana')

  // Dodaj proizvod "Prosečna penzija"
  const pensionProduct = await prisma.product.create({
    data: {
      name: 'Prosečna penzija',
      slug: 'average-pension',
      unit: '€/mesec',
      categoryId: pensionsCategory.id
    }
  })

  console.log('✅ Proizvod "Prosečna penzija" kreiran')

  // Svi land-ovi i njihove penzije (Nov/Dec 2025)
  const pensionData = [
    { code: 'RS', pension: 400 },
    { code: 'DE', pension: 1543 },
    { code: 'AT', pension: 1592 },
    { code: 'FR', pension: 1509 },
    { code: 'IT', pension: 1292 },
    { code: 'HR', pension: 490 },
    { code: 'HU', pension: 525 },
    { code: 'RO', pension: 387 },
    { code: 'BG', pension: 350 },
    { code: 'GR', pension: 1076 },
    { code: 'SI', pension: 1100 }
  ]

  const countries = await prisma.country.findMany()
  const countryMap = new Map(countries.map(c => [c.code, c.id]))

  console.log('Dodavanje cena...')

  for (const { code, pension } of pensionData) {
    const countryId = countryMap.get(code)
    if (!countryId) continue

    await prisma.priceRecord.create({
      data: {
        value: pension,
        valueEur: pension,
        countryId,
        productId: pensionProduct.id,
        source: 'Official Statistics',
        date: new Date('2025-11-15')
      }
    })
  }

  console.log('✅ Sve penzije dodate!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

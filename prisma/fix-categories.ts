import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Brisanje stare penzije kategorije...')
  
  // Obriši penzije kategoriju ako postoji
  const pensionsCategory = await prisma.category.findUnique({ where: { slug: 'pensions' } })
  if (pensionsCategory) {
    await prisma.priceRecord.deleteMany({ 
      where: { product: { categoryId: pensionsCategory.id } } 
    })
    await prisma.product.deleteMany({ where: { categoryId: pensionsCategory.id } })
    await prisma.category.delete({ where: { id: pensionsCategory.id } })
    console.log('✅ Obrisana stara penzije kategorija')
  }

  // Kreiraj novu kategoriju "Ekonomski pokazatelji"
  const economicCategory = await prisma.category.create({
    data: {
      name: 'Ekonomski pokazatelji',
      slug: 'economic-indicators'
    }
  })
  console.log('✅ Kreirana kategorija "Ekonomski pokazatelji"')

  // Dodaj proizvode
  const salaryProduct = await prisma.product.create({
    data: {
      name: 'Prosečna neto plata',
      slug: 'average-net-salary',
      unit: '€/mesec',
      categoryId: economicCategory.id
    }
  })

  const pensionProduct = await prisma.product.create({
    data: {
      name: 'Prosečna penzija',
      slug: 'average-pension',
      unit: '€/mesec',
      categoryId: economicCategory.id
    }
  })

  const dieselProduct = await prisma.product.create({
    data: {
      name: 'Cena dizela',
      slug: 'diesel-price',
      unit: '€/litar',
      categoryId: economicCategory.id
    }
  })

  console.log('✅ Proizvodi kreirani')

  // Plate po zemljama (Nov/Dec 2025)
  const salaries = [
    { code: 'RS', value: 850 },
    { code: 'DE', value: 2800 },
    { code: 'AT', value: 2900 },
    { code: 'FR', value: 2500 },
    { code: 'IT', value: 2100 },
    { code: 'HR', value: 1300 },
    { code: 'HU', value: 1400 },
    { code: 'RO', value: 1100 },
    { code: 'BG', value: 950 },
    { code: 'GR', value: 1500 },
    { code: 'SI', value: 1800 }
  ]

  // Penzije po zemljama - SRBIJA 250€
  const pensions = [
    { code: 'RS', value: 250 },
    { code: 'DE', value: 1543 },
    { code: 'AT', value: 1592 },
    { code: 'FR', value: 1509 },
    { code: 'IT', value: 1292 },
    { code: 'HR', value: 490 },
    { code: 'HU', value: 525 },
    { code: 'RO', value: 387 },
    { code: 'BG', value: 350 },
    { code: 'GR', value: 1076 },
    { code: 'SI', value: 1100 }
  ]

  // Dizel po zemljama (€/litar)
  const diesels = [
    { code: 'RS', value: 1.60 },
    { code: 'DE', value: 1.65 },
    { code: 'AT', value: 1.55 },
    { code: 'FR', value: 1.75 },
    { code: 'IT', value: 1.70 },
    { code: 'HR', value: 1.50 },
    { code: 'HU', value: 1.58 },
    { code: 'RO', value: 1.48 },
    { code: 'BG', value: 1.35 },
    { code: 'GR', value: 1.68 },
    { code: 'SI', value: 1.52 }
  ]

  const countries = await prisma.country.findMany()
  const countryMap = new Map(countries.map(c => [c.code, c.id]))

  console.log('Dodavanje cena...')

  // Dodaj plate
  for (const { code, value } of salaries) {
    const countryId = countryMap.get(code)
    if (!countryId) continue

    await prisma.priceRecord.create({
      data: {
        value,
        valueEur: value,
        countryId,
        productId: salaryProduct.id,
        source: 'Official Statistics',
        date: new Date('2025-11-15')
      }
    })
  }
  console.log('✅ Plate dodate')

  // Dodaj penzije
  for (const { code, value } of pensions) {
    const countryId = countryMap.get(code)
    if (!countryId) continue

    await prisma.priceRecord.create({
      data: {
        value,
        valueEur: value,
        countryId,
        productId: pensionProduct.id,
        source: 'Official Statistics',
        date: new Date('2025-11-15')
      }
    })
  }
  console.log('✅ Penzije dodate')

  // Dodaj dizel
  for (const { code, value } of diesels) {
    const countryId = countryMap.get(code)
    if (!countryId) continue

    await prisma.priceRecord.create({
      data: {
        value,
        valueEur: value,
        countryId,
        productId: dieselProduct.id,
        source: 'Official Statistics',
        date: new Date('2025-11-15')
      }
    })
  }
  console.log('✅ Dizel dodat')

  // Ažuriraj EconomicIndicator za penziju Srbije
  await prisma.economicIndicator.updateMany({
    where: {
      type: 'PENSION_AVG',
      country: { code: 'RS' }
    },
    data: {
      value: 250,
      valueEur: 250
    }
  })
  console.log('✅ Penzija Srbije ažurirana na 250€')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

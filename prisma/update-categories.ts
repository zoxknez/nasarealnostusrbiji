import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Brisanje nepotrebnih kategorija...')

  // Prvo obriši proizvode iz tih kategorija
  const categoriesToDelete = await prisma.category.findMany({
    where: {
      slug: {
        in: ['clothing', 'tech', 'entertainment', 'services']
      }
    },
    select: { id: true }
  })

  const categoryIds = categoriesToDelete.map(c => c.id)

  if (categoryIds.length > 0) {
    // Obriši price records
    await prisma.priceRecord.deleteMany({
      where: {
        product: {
          categoryId: { in: categoryIds }
        }
      }
    })

    // Obriši proizvode
    await prisma.product.deleteMany({
      where: {
        categoryId: { in: categoryIds }
      }
    })

    // Obriši kategorije
    await prisma.category.deleteMany({
      where: {
        id: { in: categoryIds }
      }
    })
  }

  console.log('✅ Obrisane nepotrebne kategorije')

  // Dodaj VAŽNE kategorije
  const healthcare = await prisma.category.upsert({
    where: { slug: 'healthcare' },
    update: {},
    create: {
      name: 'Zdravstvo',
      slug: 'healthcare'
    }
  })

  const education = await prisma.category.upsert({
    where: { slug: 'education' },
    update: {},
    create: {
      name: 'Obrazovanje',
      slug: 'education'
    }
  })

  const taxes = await prisma.category.upsert({
    where: { slug: 'taxes' },
    update: {},
    create: {
      name: 'Porezi i Doprinosi',
      slug: 'taxes'
    }
  })

  console.log('Dodavanje proizvoda...')

  // ZDRAVSTVO
  await prisma.product.upsert({
    where: { slug: 'doctor-visit' },
    update: {},
    create: {
      name: 'Pregled kod lekara (privatno)',
      slug: 'doctor-visit',
      unit: 'pregled',
      categoryId: healthcare.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'medication-antibiotics' },
    update: {},
    create: {
      name: 'Antibiotik (pakovanje)',
      slug: 'medication-antibiotics',
      unit: 'pakovanje',
      categoryId: healthcare.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'dental-checkup' },
    update: {},
    create: {
      name: 'Stomatolog (kontrola)',
      slug: 'dental-checkup',
      unit: 'pregled',
      categoryId: healthcare.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'health-insurance' },
    update: {},
    create: {
      name: 'Privatno zdravstveno osiguranje',
      slug: 'health-insurance',
      unit: 'mesečno',
      categoryId: healthcare.id
    }
  })

  // OBRAZOVANJE
  await prisma.product.upsert({
    where: { slug: 'kindergarten' },
    update: {},
    create: {
      name: 'Vrtić (javni)',
      slug: 'kindergarten',
      unit: 'mesečno',
      categoryId: education.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'university-tuition' },
    update: {},
    create: {
      name: 'Fakultet (godišnja školarina)',
      slug: 'university-tuition',
      unit: 'godišnje',
      categoryId: education.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'english-course' },
    update: {},
    create: {
      name: 'Kurs engleskog (mesečno)',
      slug: 'english-course',
      unit: 'mesečno',
      categoryId: education.id
    }
  })

  // POREZI (vezano za platu od 850€ u Srbiji)
  await prisma.product.upsert({
    where: { slug: 'income-tax-rate' },
    update: {},
    create: {
      name: 'Porez na dohodak (%)',
      slug: 'income-tax-rate',
      unit: 'procenat',
      categoryId: taxes.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'social-contributions' },
    update: {},
    create: {
      name: 'Doprinosi za soc. osiguranje (%)',
      slug: 'social-contributions',
      unit: 'procenat',
      categoryId: taxes.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'vat-rate' },
    update: {},
    create: {
      name: 'PDV - standardna stopa (%)',
      slug: 'vat-rate',
      unit: 'procenat',
      categoryId: taxes.id
    }
  })

  console.log('✅ Proizvodi dodati')

  // Dodaj cene
  const countries = await prisma.country.findMany()
  
  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: ['doctor-visit', 'medication-antibiotics', 'dental-checkup', 'health-insurance',
             'kindergarten', 'university-tuition', 'english-course',
             'income-tax-rate', 'social-contributions', 'vat-rate']
      }
    }
  })

  const prices: Record<string, Record<string, number>> = {
    'doctor-visit': {
      'RS': 25, 'DE': 50, 'AT': 60, 'FR': 45, 'IT': 40,
      'HR': 35, 'HU': 30, 'RO': 20, 'BG': 20, 'GR': 40, 'SI': 50
    },
    'medication-antibiotics': {
      'RS': 5, 'DE': 15, 'AT': 15, 'FR': 10, 'IT': 12,
      'HR': 8, 'HU': 7, 'RO': 5, 'BG': 6, 'GR': 10, 'SI': 12
    },
    'dental-checkup': {
      'RS': 20, 'DE': 70, 'AT': 80, 'FR': 60, 'IT': 50,
      'HR': 40, 'HU': 35, 'RO': 25, 'BG': 20, 'GR': 50, 'SI': 60
    },
    'health-insurance': {
      'RS': 50, 'DE': 200, 'AT': 180, 'FR': 150, 'IT': 120,
      'HR': 80, 'HU': 60, 'RO': 40, 'BG': 35, 'GR': 100, 'SI': 150
    },
    'kindergarten': {
      'RS': 150, 'DE': 400, 'AT': 350, 'FR': 300, 'IT': 280,
      'HR': 200, 'HU': 180, 'RO': 120, 'BG': 100, 'GR': 250, 'SI': 300
    },
    'university-tuition': {
      'RS': 1000, 'DE': 0, 'AT': 0, 'FR': 200, 'IT': 1500,
      'HR': 800, 'HU': 1200, 'RO': 600, 'BG': 500, 'GR': 800, 'SI': 0
    },
    'english-course': {
      'RS': 50, 'DE': 100, 'AT': 120, 'FR': 90, 'IT': 80,
      'HR': 60, 'HU': 55, 'RO': 40, 'BG': 35, 'GR': 70, 'SI': 90
    },
    // POREZI (stvarne stope za 2025)
    'income-tax-rate': {
      'RS': 10, 'DE': 14, 'AT': 20, 'FR': 11, 'IT': 23,
      'HR': 20, 'HU': 15, 'RO': 10, 'BG': 10, 'GR': 9, 'SI': 16
    },
    'social-contributions': {
      'RS': 36.05, 'DE': 40, 'AT': 41, 'FR': 48, 'IT': 43,
      'HR': 37, 'HU': 33.5, 'RO': 41.5, 'BG': 32, 'GR': 39, 'SI': 38
    },
    'vat-rate': {
      'RS': 20, 'DE': 19, 'AT': 20, 'FR': 20, 'IT': 22,
      'HR': 25, 'HU': 27, 'RO': 19, 'BG': 20, 'GR': 24, 'SI': 22
    }
  }

  const exchangeRates: Record<string, number> = {
    'RS': 117, 'HU': 400, 'RO': 5, 'BG': 1.96, 'HR': 7.5
  }

  console.log('Dodavanje cena...')

  for (const product of products) {
    const productPrices = prices[product.slug]
    if (!productPrices) continue

    for (const country of countries) {
      const priceEur = productPrices[country.code]
      if (priceEur === undefined) continue

      let priceLocal = priceEur
      if (exchangeRates[country.code]) {
        priceLocal = priceEur * exchangeRates[country.code]
      }

      await prisma.priceRecord.create({
        data: {
          value: priceLocal,
          valueEur: priceEur,
          countryId: country.id,
          productId: product.id,
          source: 'Manual Entry',
          isManual: true,
          date: new Date('2025-12-01')
        }
      })
    }
  }

  console.log('✅ Sve cene dodate!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

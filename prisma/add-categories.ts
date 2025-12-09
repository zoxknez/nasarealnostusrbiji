import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Dodajem nove kategorije i proizvode...')

  // Stanovanje
  const housing = await prisma.category.upsert({
    where: { slug: 'housing' },
    update: {},
    create: {
      name: 'Stanovanje',
      slug: 'housing'
    }
  })

  // Odeća
  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Odeća',
      slug: 'clothing'
    }
  })

  // Tehnologija
  const tech = await prisma.category.upsert({
    where: { slug: 'tech' },
    update: {},
    create: {
      name: 'Tehnologija',
      slug: 'tech'
    }
  })

  // Zabava
  const entertainment = await prisma.category.upsert({
    where: { slug: 'entertainment' },
    update: {},
    create: {
      name: 'Zabava',
      slug: 'entertainment'
    }
  })

  // Usluge
  const services = await prisma.category.upsert({
    where: { slug: 'services' },
    update: {},
    create: {
      name: 'Usluge',
      slug: 'services'
    }
  })

  console.log('Dodajem proizvode...')

  // STANOVANJE
  await prisma.product.upsert({
    where: { slug: 'rent-1bed-center' },
    update: {},
    create: {
      name: 'Kirija (1 soba, centar)',
      slug: 'rent-1bed-center',
      unit: 'mesečno',
      categoryId: housing.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'utilities' },
    update: {},
    create: {
      name: 'Režije (struja, voda, gas)',
      slug: 'utilities',
      unit: 'mesečno',
      categoryId: housing.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'internet' },
    update: {},
    create: {
      name: 'Internet (50 Mbps)',
      slug: 'internet',
      unit: 'mesečno',
      categoryId: housing.id
    }
  })

  // ODEĆA
  await prisma.product.upsert({
    where: { slug: 'jeans' },
    update: {},
    create: {
      name: 'Jeans (Levi\'s)',
      slug: 'jeans',
      unit: 'par',
      categoryId: clothing.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'sneakers' },
    update: {},
    create: {
      name: 'Patike (Nike)',
      slug: 'sneakers',
      unit: 'par',
      categoryId: clothing.id
    }
  })

  // TEHNOLOGIJA
  await prisma.product.upsert({
    where: { slug: 'iphone-15' },
    update: {},
    create: {
      name: 'iPhone 15 (128GB)',
      slug: 'iphone-15',
      unit: 'komad',
      categoryId: tech.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'laptop-midrange' },
    update: {},
    create: {
      name: 'Laptop (mid-range)',
      slug: 'laptop-midrange',
      unit: 'komad',
      categoryId: tech.id
    }
  })

  // ZABAVA
  await prisma.product.upsert({
    where: { slug: 'cinema-ticket' },
    update: {},
    create: {
      name: 'Bioskop (ulaznica)',
      slug: 'cinema-ticket',
      unit: 'ulaznica',
      categoryId: entertainment.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'gym-membership' },
    update: {},
    create: {
      name: 'Teretana (članarina)',
      slug: 'gym-membership',
      unit: 'mesečno',
      categoryId: entertainment.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'restaurant-dinner' },
    update: {},
    create: {
      name: 'Restoran (večera za 2)',
      slug: 'restaurant-dinner',
      unit: 'večera',
      categoryId: entertainment.id
    }
  })

  // USLUGE
  await prisma.product.upsert({
    where: { slug: 'haircut-men' },
    update: {},
    create: {
      name: 'Šišanje (muško)',
      slug: 'haircut-men',
      unit: 'usluga',
      categoryId: services.id
    }
  })

  await prisma.product.upsert({
    where: { slug: 'taxi-5km' },
    update: {},
    create: {
      name: 'Taksi (5km)',
      slug: 'taxi-5km',
      unit: 'vožnja',
      categoryId: services.id
    }
  })

  console.log('✅ Kategorije i proizvodi uspešno dodati!')

  // Dodaj cene za nove proizvode
  const countries = await prisma.country.findMany()

  // Get product IDs
  const productSlugs = [
    'rent-1bed-center', 'utilities', 'internet',
    'jeans', 'sneakers',
    'iphone-15', 'laptop-midrange',
    'cinema-ticket', 'gym-membership', 'restaurant-dinner',
    'haircut-men', 'taxi-5km'
  ]
  
  const products = await prisma.product.findMany({
    where: { slug: { in: productSlugs } }
  })

  // Prosečne cene u EUR (aproksimativno iz Numbeo podataka za Dec 2025)
  const prices: Record<string, Record<string, number>> = {
    // STANOVANJE
    'rent-1bed-center': {
      'RS': 350, 'DE': 900, 'AT': 850, 'FR': 800, 'IT': 700,
      'HR': 550, 'HU': 500, 'RO': 400, 'BG': 380, 'GR': 500, 'SI': 650
    },
    'utilities': {
      'RS': 100, 'DE': 250, 'AT': 240, 'FR': 180, 'IT': 160,
      'HR': 140, 'HU': 120, 'RO': 90, 'BG': 85, 'GR': 130, 'SI': 150
    },
    'internet': {
      'RS': 20, 'DE': 35, 'AT': 40, 'FR': 30, 'IT': 28,
      'HR': 25, 'HU': 18, 'RO': 10, 'BG': 12, 'GR': 30, 'SI': 35
    },
    // ODEĆA
    'jeans': {
      'RS': 70, 'DE': 80, 'AT': 85, 'FR': 90, 'IT': 85,
      'HR': 75, 'HU': 70, 'RO': 65, 'BG': 60, 'GR': 75, 'SI': 80
    },
    'sneakers': {
      'RS': 100, 'DE': 110, 'AT': 115, 'FR': 120, 'IT': 110,
      'HR': 105, 'HU': 100, 'RO': 95, 'BG': 90, 'GR': 105, 'SI': 110
    },
    // TEHNOLOGIJA
    'iphone-15': {
      'RS': 950, 'DE': 950, 'AT': 950, 'FR': 950, 'IT': 950,
      'HR': 950, 'HU': 950, 'RO': 950, 'BG': 950, 'GR': 950, 'SI': 950
    },
    'laptop-midrange': {
      'RS': 700, 'DE': 750, 'AT': 750, 'FR': 800, 'IT': 750,
      'HR': 700, 'HU': 680, 'RO': 650, 'BG': 630, 'GR': 700, 'SI': 750
    },
    // ZABAVA
    'cinema-ticket': {
      'RS': 5, 'DE': 12, 'AT': 11, 'FR': 10, 'IT': 9,
      'HR': 7, 'HU': 6, 'RO': 5, 'BG': 6, 'GR': 8, 'SI': 9
    },
    'gym-membership': {
      'RS': 30, 'DE': 40, 'AT': 45, 'FR': 35, 'IT': 40,
      'HR': 35, 'HU': 30, 'RO': 25, 'BG': 25, 'GR': 35, 'SI': 40
    },
    'restaurant-dinner': {
      'RS': 30, 'DE': 60, 'AT': 55, 'FR': 50, 'IT': 50,
      'HR': 40, 'HU': 35, 'RO': 30, 'BG': 28, 'GR': 40, 'SI': 45
    },
    // USLUGE
    'haircut-men': {
      'RS': 7, 'DE': 20, 'AT': 18, 'FR': 15, 'IT': 15,
      'HR': 12, 'HU': 10, 'RO': 8, 'BG': 7, 'GR': 12, 'SI': 15
    },
    'taxi-5km': {
      'RS': 4, 'DE': 15, 'AT': 12, 'FR': 10, 'IT': 10,
      'HR': 7, 'HU': 6, 'RO': 5, 'BG': 4, 'GR': 8, 'SI': 10
    }
  }

  const exchangeRates: Record<string, number> = {
    'RS': 117, 'HU': 400, 'RO': 5, 'BG': 1.96, 'HR': 7.5
  }

  console.log('Dodajem cene...')

  for (const product of products) {
    const productPrices = prices[product.slug]
    if (!productPrices) continue

    for (const country of countries) {
      const priceEur = productPrices[country.code]
      if (!priceEur) continue

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

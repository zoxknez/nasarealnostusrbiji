import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌍 Seeding real data (Nov/Dec 2025)...')

  // Get all countries
  const serbia = await prisma.country.findUnique({ where: { code: 'RS' } })
  const germany = await prisma.country.findUnique({ where: { code: 'DE' } })
  const austria = await prisma.country.findUnique({ where: { code: 'AT' } })
  const france = await prisma.country.findUnique({ where: { code: 'FR' } })
  const italy = await prisma.country.findUnique({ where: { code: 'IT' } })
  const croatia = await prisma.country.findUnique({ where: { code: 'HR' } })
  const hungary = await prisma.country.findUnique({ where: { code: 'HU' } })
  const romania = await prisma.country.findUnique({ where: { code: 'RO' } })
  const bulgaria = await prisma.country.findUnique({ where: { code: 'BG' } })
  const greece = await prisma.country.findUnique({ where: { code: 'GR' } })
  const slovenia = await prisma.country.findUnique({ where: { code: 'SI' } })

  if (!serbia || !germany || !austria) {
    throw new Error('Countries not found! Run seed.ts first.')
  }

  // Get products
  const milk = await prisma.product.findUnique({ where: { slug: 'milk-1l' } })
  const bread = await prisma.product.findUnique({ where: { slug: 'bread-500g' } })
  const eggs = await prisma.product.findUnique({ where: { slug: 'eggs-12' } })
  const diesel = await prisma.product.findUnique({ where: { slug: 'diesel-1l' } })
  const gasoline = await prisma.product.findUnique({ where: { slug: 'gasoline-1l' } })

  if (!milk || !bread || !diesel) {
    throw new Error('Products not found! Run seed.ts first.')
  }

  // Exchange rate (Dec 2025): 1 EUR = 117 RSD (approx)
  const eurToRsd = 117

  // ====================
  // ECONOMIC INDICATORS
  // ====================

  const economicData = [
    // Serbia
    { countryId: serbia.id, type: 'SALARY_NET_AVG', value: 99631, valueEur: 851, year: 2025, month: 11 }, // ~850 EUR
    { countryId: serbia.id, type: 'PENSION_AVG', value: 46800, valueEur: 400, year: 2025, month: 11 }, // ~400 EUR
    { countryId: serbia.id, type: 'TAX_VAT_STANDARD', value: 20, valueEur: 20, year: 2025, month: null },

    // Germany
    { countryId: germany.id, type: 'SALARY_NET_AVG', value: 3200, valueEur: 3200, year: 2025, month: 11 },
    { countryId: germany.id, type: 'PENSION_AVG', value: 1350, valueEur: 1350, year: 2025, month: 11 },
    { countryId: germany.id, type: 'TAX_VAT_STANDARD', value: 19, valueEur: 19, year: 2025, month: null },

    // Austria
    { countryId: austria.id, type: 'SALARY_NET_AVG', value: 3000, valueEur: 3000, year: 2025, month: 11 },
    { countryId: austria.id, type: 'PENSION_AVG', value: 1400, valueEur: 1400, year: 2025, month: 11 },
    { countryId: austria.id, type: 'TAX_VAT_STANDARD', value: 20, valueEur: 20, year: 2025, month: null },

    // France
    { countryId: france.id, type: 'SALARY_NET_AVG', value: 2600, valueEur: 2600, year: 2025, month: 11 },
    { countryId: france.id, type: 'PENSION_AVG', value: 1350, valueEur: 1350, year: 2025, month: 11 },
    { countryId: france.id, type: 'TAX_VAT_STANDARD', value: 20, valueEur: 20, year: 2025, month: null },

    // Italy
    { countryId: italy.id, type: 'SALARY_NET_AVG', value: 2300, valueEur: 2300, year: 2025, month: 11 },
    { countryId: italy.id, type: 'PENSION_AVG', value: 1200, valueEur: 1200, year: 2025, month: 11 },
    { countryId: italy.id, type: 'TAX_VAT_STANDARD', value: 22, valueEur: 22, year: 2025, month: null },

    // Croatia
    { countryId: croatia.id, type: 'SALARY_NET_AVG', value: 1400, valueEur: 1400, year: 2025, month: 11 },
    { countryId: croatia.id, type: 'PENSION_AVG', value: 550, valueEur: 550, year: 2025, month: 11 },
    { countryId: croatia.id, type: 'TAX_VAT_STANDARD', value: 25, valueEur: 25, year: 2025, month: null },

    // Hungary (HUF: 1 EUR = 390 HUF)
    { countryId: hungary.id, type: 'SALARY_NET_AVG', value: 624000, valueEur: 1600, year: 2025, month: 11 },
    { countryId: hungary.id, type: 'PENSION_AVG', value: 218400, valueEur: 560, year: 2025, month: 11 },
    { countryId: hungary.id, type: 'TAX_VAT_STANDARD', value: 27, valueEur: 27, year: 2025, month: null },

    // Romania (RON: 1 EUR = 4.95 RON)
    { countryId: romania.id, type: 'SALARY_NET_AVG', value: 7425, valueEur: 1500, year: 2025, month: 11 },
    { countryId: romania.id, type: 'PENSION_AVG', value: 2475, valueEur: 500, year: 2025, month: 11 },
    { countryId: romania.id, type: 'TAX_VAT_STANDARD', value: 19, valueEur: 19, year: 2025, month: null },

    // Bulgaria (BGN: 1 EUR = 1.96 BGN)
    { countryId: bulgaria.id, type: 'SALARY_NET_AVG', value: 2744, valueEur: 1400, year: 2025, month: 11 },
    { countryId: bulgaria.id, type: 'PENSION_AVG', value: 882, valueEur: 450, year: 2025, month: 11 },
    { countryId: bulgaria.id, type: 'TAX_VAT_STANDARD', value: 20, valueEur: 20, year: 2025, month: null },

    // Greece
    { countryId: greece.id, type: 'SALARY_NET_AVG', value: 1600, valueEur: 1600, year: 2025, month: 11 },
    { countryId: greece.id, type: 'PENSION_AVG', value: 850, valueEur: 850, year: 2025, month: 11 },
    { countryId: greece.id, type: 'TAX_VAT_STANDARD', value: 24, valueEur: 24, year: 2025, month: null },

    // Slovenia
    { countryId: slovenia.id, type: 'SALARY_NET_AVG', value: 1800, valueEur: 1800, year: 2025, month: 11 },
    { countryId: slovenia.id, type: 'PENSION_AVG', value: 900, valueEur: 900, year: 2025, month: 11 },
    { countryId: slovenia.id, type: 'TAX_VAT_STANDARD', value: 22, valueEur: 22, year: 2025, month: null },
  ]

  for (const data of economicData) {
    await prisma.economicIndicator.upsert({
      where: {
        countryId_type_year_month: {
          countryId: data.countryId,
          type: data.type as any,
          year: data.year,
          month: data.month ?? 1, // Prisma requires non-null for unique constraint
        },
      },
      update: data,
      create: data,
    })
  }

  console.log('✅ Economic indicators seeded')

  // ====================
  // PRICE RECORDS (Dec 2025)
  // ====================

  const priceData = [
    // MILK (1L)
    { countryId: serbia.id, productId: milk.id, value: 165, valueEur: 1.41, source: 'Manual' },
    { countryId: germany.id, productId: milk.id, value: 1.15, valueEur: 1.15, source: 'Manual' },
    { countryId: austria.id, productId: milk.id, value: 1.30, valueEur: 1.30, source: 'Manual' },
    { countryId: france.id, productId: milk.id, value: 1.25, valueEur: 1.25, source: 'Manual' },
    { countryId: italy.id, productId: milk.id, value: 1.40, valueEur: 1.40, source: 'Manual' },
    { countryId: croatia.id, productId: milk.id, value: 1.35, valueEur: 1.35, source: 'Manual' },
    { countryId: hungary.id, productId: milk.id, value: 468, valueEur: 1.20, source: 'Manual' }, // 390 HUF/EUR
    { countryId: romania.id, productId: milk.id, value: 5.94, valueEur: 1.20, source: 'Manual' },
    { countryId: bulgaria.id, productId: milk.id, value: 2.35, valueEur: 1.20, source: 'Manual' },
    { countryId: greece.id, productId: milk.id, value: 1.45, valueEur: 1.45, source: 'Manual' },
    { countryId: slovenia.id, productId: milk.id, value: 1.25, valueEur: 1.25, source: 'Manual' },

    // BREAD (500g)
    { countryId: serbia.id, productId: bread.id, value: 85, valueEur: 0.73, source: 'Manual' },
    { countryId: germany.id, productId: bread.id, value: 1.80, valueEur: 1.80, source: 'Manual' },
    { countryId: austria.id, productId: bread.id, value: 2.00, valueEur: 2.00, source: 'Manual' },
    { countryId: france.id, productId: bread.id, value: 1.50, valueEur: 1.50, source: 'Manual' },
    { countryId: italy.id, productId: bread.id, value: 2.20, valueEur: 2.20, source: 'Manual' },
    { countryId: croatia.id, productId: bread.id, value: 1.40, valueEur: 1.40, source: 'Manual' },
    { countryId: hungary.id, productId: bread.id, value: 507, valueEur: 1.30, source: 'Manual' },
    { countryId: romania.id, productId: bread.id, value: 5.45, valueEur: 1.10, source: 'Manual' },
    { countryId: bulgaria.id, productId: bread.id, value: 1.76, valueEur: 0.90, source: 'Manual' },
    { countryId: greece.id, productId: bread.id, value: 1.60, valueEur: 1.60, source: 'Manual' },
    { countryId: slovenia.id, productId: bread.id, value: 1.70, valueEur: 1.70, source: 'Manual' },

    // EGGS (12 pack)
    { countryId: serbia.id, productId: eggs.id, value: 330, valueEur: 2.82, source: 'Manual' },
    { countryId: germany.id, productId: eggs.id, value: 3.50, valueEur: 3.50, source: 'Manual' },
    { countryId: austria.id, productId: eggs.id, value: 3.80, valueEur: 3.80, source: 'Manual' },
    { countryId: france.id, productId: eggs.id, value: 3.20, valueEur: 3.20, source: 'Manual' },
    { countryId: italy.id, productId: eggs.id, value: 3.40, valueEur: 3.40, source: 'Manual' },
    { countryId: croatia.id, productId: eggs.id, value: 3.30, valueEur: 3.30, source: 'Manual' },
    { countryId: hungary.id, productId: eggs.id, value: 1170, valueEur: 3.00, source: 'Manual' },
    { countryId: romania.id, productId: eggs.id, value: 14.85, valueEur: 3.00, source: 'Manual' },
    { countryId: bulgaria.id, productId: eggs.id, value: 5.29, valueEur: 2.70, source: 'Manual' },
    { countryId: greece.id, productId: eggs.id, value: 3.60, valueEur: 3.60, source: 'Manual' },
    { countryId: slovenia.id, productId: eggs.id, value: 3.40, valueEur: 3.40, source: 'Manual' },

    // DIESEL (1L)
    { countryId: serbia.id, productId: diesel.id, value: 195, valueEur: 1.67, source: 'NIS' },
    { countryId: germany.id, productId: diesel.id, value: 1.60, valueEur: 1.60, source: 'Manual' },
    { countryId: austria.id, productId: diesel.id, value: 1.55, valueEur: 1.55, source: 'Manual' },
    { countryId: france.id, productId: diesel.id, value: 1.70, valueEur: 1.70, source: 'Manual' },
    { countryId: italy.id, productId: diesel.id, value: 1.75, valueEur: 1.75, source: 'Manual' },
    { countryId: croatia.id, productId: diesel.id, value: 1.52, valueEur: 1.52, source: 'Manual' },
    { countryId: hungary.id, productId: diesel.id, value: 624, valueEur: 1.60, source: 'Manual' },
    { countryId: romania.id, productId: diesel.id, value: 7.43, valueEur: 1.50, source: 'Manual' },
    { countryId: bulgaria.id, productId: diesel.id, value: 2.94, valueEur: 1.50, source: 'Manual' },
    { countryId: greece.id, productId: diesel.id, value: 1.68, valueEur: 1.68, source: 'Manual' },
    { countryId: slovenia.id, productId: diesel.id, value: 1.58, valueEur: 1.58, source: 'Manual' },

    // GASOLINE (1L)
    { countryId: serbia.id, productId: gasoline.id, value: 185, valueEur: 1.58, source: 'NIS' },
    { countryId: germany.id, productId: gasoline.id, value: 1.75, valueEur: 1.75, source: 'Manual' },
    { countryId: austria.id, productId: gasoline.id, value: 1.65, valueEur: 1.65, source: 'Manual' },
    { countryId: france.id, productId: gasoline.id, value: 1.85, valueEur: 1.85, source: 'Manual' },
    { countryId: italy.id, productId: gasoline.id, value: 1.90, valueEur: 1.90, source: 'Manual' },
    { countryId: croatia.id, productId: gasoline.id, value: 1.60, valueEur: 1.60, source: 'Manual' },
    { countryId: hungary.id, productId: gasoline.id, value: 663, valueEur: 1.70, source: 'Manual' },
    { countryId: romania.id, productId: gasoline.id, value: 7.92, valueEur: 1.60, source: 'Manual' },
    { countryId: bulgaria.id, productId: gasoline.id, value: 3.14, valueEur: 1.60, source: 'Manual' },
    { countryId: greece.id, productId: gasoline.id, value: 1.85, valueEur: 1.85, source: 'Manual' },
    { countryId: slovenia.id, productId: gasoline.id, value: 1.70, valueEur: 1.70, source: 'Manual' },
  ]

  for (const data of priceData) {
    await prisma.priceRecord.create({
      data: {
        ...data,
        isManual: true,
      },
    })
  }

  console.log('✅ Price records seeded')
  console.log('🎉 All real data loaded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

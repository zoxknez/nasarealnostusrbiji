import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Dodavanje Food i Transport kategorija...')

  // Create Food category
  const food = await prisma.category.upsert({
    where: { slug: 'food' },
    update: { name: 'Hrana i Piće' },
    create: { name: 'Hrana i Piće', slug: 'food' },
  })
  console.log('✅ Kreirana kategorija: Hrana i Piće')

  // Create Transport category
  const transport = await prisma.category.upsert({
    where: { slug: 'transport' },
    update: { name: 'Transport i Gorivo' },
    create: { name: 'Transport i Gorivo', slug: 'transport' },
  })
  console.log('✅ Kreirana kategorija: Transport i Gorivo')

  // Get countries
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

  if (!serbia || !germany || !austria || !france || !italy || !croatia || !hungary || !romania || !bulgaria || !greece || !slovenia) {
    throw new Error('Neke zemlje ne postoje u bazi!')
  }

  // Create Food Products
  const milk = await prisma.product.upsert({
    where: { slug: 'milk-1l' },
    update: { name: 'Mleko (1L)', unit: 'l', categoryId: food.id },
    create: { name: 'Mleko (1L)', slug: 'milk-1l', unit: 'l', categoryId: food.id },
  })
  console.log('✅ Kreiran proizvod: Mleko (1L)')

  const bread = await prisma.product.upsert({
    where: { slug: 'bread-500g' },
    update: { name: 'Hleb (500g)', unit: 'piece', categoryId: food.id },
    create: { name: 'Hleb (500g)', slug: 'bread-500g', unit: 'piece', categoryId: food.id },
  })
  console.log('✅ Kreiran proizvod: Hleb (500g)')

  const eggs = await prisma.product.upsert({
    where: { slug: 'eggs-12' },
    update: { name: 'Jaja (12 kom)', unit: 'pack', categoryId: food.id },
    create: { name: 'Jaja (12 kom)', slug: 'eggs-12', unit: 'pack', categoryId: food.id },
  })
  console.log('✅ Kreiran proizvod: Jaja (12 kom)')

  // Create Transport Product - Gasoline
  const gasoline = await prisma.product.upsert({
    where: { slug: 'gasoline-1l' },
    update: { name: 'Benzin (1L)', unit: 'l', categoryId: transport.id },
    create: { name: 'Benzin (1L)', slug: 'gasoline-1l', unit: 'l', categoryId: transport.id },
  })
  console.log('✅ Kreiran proizvod: Benzin (1L)')

  // Add price records for Milk
  const milkPrices = [
    { countryId: serbia.id, value: 153, valueEur: 1.31 },
    { countryId: germany.id, value: 1.09, valueEur: 1.09 },
    { countryId: austria.id, value: 1.25, valueEur: 1.25 },
    { countryId: france.id, value: 1.20, valueEur: 1.20 },
    { countryId: italy.id, value: 1.35, valueEur: 1.35 },
    { countryId: croatia.id, value: 1.15, valueEur: 1.15 },
    { countryId: hungary.id, value: 450, valueEur: 1.15 },
    { countryId: romania.id, value: 6.50, valueEur: 1.31 },
    { countryId: bulgaria.id, value: 2.40, valueEur: 1.23 },
    { countryId: greece.id, value: 1.40, valueEur: 1.40 },
    { countryId: slovenia.id, value: 1.30, valueEur: 1.30 },
  ]

  for (const price of milkPrices) {
    await prisma.priceRecord.create({
      data: {
        productId: milk.id,
        countryId: price.countryId,
        value: price.value,
        valueEur: price.valueEur,
        source: 'Manual',
        isManual: true,
      }
    })
  }
  console.log('✅ Dodato 11 cena za Mleko')

  // Add price records for Bread
  const breadPrices = [
    { countryId: serbia.id, value: 90, valueEur: 0.77 },
    { countryId: germany.id, value: 1.50, valueEur: 1.50 },
    { countryId: austria.id, value: 1.80, valueEur: 1.80 },
    { countryId: france.id, value: 1.40, valueEur: 1.40 },
    { countryId: italy.id, value: 1.60, valueEur: 1.60 },
    { countryId: croatia.id, value: 1.20, valueEur: 1.20 },
    { countryId: hungary.id, value: 520, valueEur: 1.33 },
    { countryId: romania.id, value: 4.50, valueEur: 0.91 },
    { countryId: bulgaria.id, value: 1.80, valueEur: 0.92 },
    { countryId: greece.id, value: 1.50, valueEur: 1.50 },
    { countryId: slovenia.id, value: 1.70, valueEur: 1.70 },
  ]

  for (const price of breadPrices) {
    await prisma.priceRecord.create({
      data: {
        productId: bread.id,
        countryId: price.countryId,
        value: price.value,
        valueEur: price.valueEur,
        source: 'Manual',
        isManual: true,
      }
    })
  }
  console.log('✅ Dodato 11 cena za Hleb')

  // Add price records for Eggs
  const eggsPrices = [
    { countryId: serbia.id, value: 380, valueEur: 3.25 },
    { countryId: germany.id, value: 2.50, valueEur: 2.50 },
    { countryId: austria.id, value: 2.80, valueEur: 2.80 },
    { countryId: france.id, value: 2.90, valueEur: 2.90 },
    { countryId: italy.id, value: 3.20, valueEur: 3.20 },
    { countryId: croatia.id, value: 2.60, valueEur: 2.60 },
    { countryId: hungary.id, value: 980, valueEur: 2.51 },
    { countryId: romania.id, value: 14.00, valueEur: 2.83 },
    { countryId: bulgaria.id, value: 5.80, valueEur: 2.97 },
    { countryId: greece.id, value: 3.50, valueEur: 3.50 },
    { countryId: slovenia.id, value: 2.90, valueEur: 2.90 },
  ]

  for (const price of eggsPrices) {
    await prisma.priceRecord.create({
      data: {
        productId: eggs.id,
        countryId: price.countryId,
        value: price.value,
        valueEur: price.valueEur,
        source: 'Manual',
        isManual: true,
      }
    })
  }
  console.log('✅ Dodato 11 cena za Jaja')

  // Add price records for Gasoline
  const gasolinePrices = [
    { countryId: serbia.id, value: 185, valueEur: 1.58 },
    { countryId: germany.id, value: 1.65, valueEur: 1.65 },
    { countryId: austria.id, value: 1.45, valueEur: 1.45 },
    { countryId: france.id, value: 1.75, valueEur: 1.75 },
    { countryId: italy.id, value: 1.80, valueEur: 1.80 },
    { countryId: croatia.id, value: 1.50, valueEur: 1.50 },
    { countryId: hungary.id, value: 650, valueEur: 1.66 },
    { countryId: romania.id, value: 7.50, valueEur: 1.52 },
    { countryId: bulgaria.id, value: 2.90, valueEur: 1.48 },
    { countryId: greece.id, value: 1.70, valueEur: 1.70 },
    { countryId: slovenia.id, value: 1.55, valueEur: 1.55 },
  ]

  for (const price of gasolinePrices) {
    await prisma.priceRecord.create({
      data: {
        productId: gasoline.id,
        countryId: price.countryId,
        value: price.value,
        valueEur: price.valueEur,
        source: 'Manual',
        isManual: true,
      }
    })
  }
  console.log('✅ Dodato 11 cena za Benzin')

  console.log('\n🎉 Sve kategorije i proizvodi uspešno dodati!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

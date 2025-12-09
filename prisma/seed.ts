import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Create Categories
  const food = await prisma.category.upsert({
    where: { slug: 'food' },
    update: {},
    create: { name: 'Hrana i Piće', slug: 'food' },
  })
  
  const transport = await prisma.category.upsert({
    where: { slug: 'transport' },
    update: {},
    create: { name: 'Transport i Gorivo', slug: 'transport' },
  })

  // 2. Create Products
  const products = [
    { name: 'Mleko (1L)', slug: 'milk-1l', unit: 'l', categoryId: food.id },
    { name: 'Hleb (500g)', slug: 'bread-500g', unit: 'piece', categoryId: food.id },
    { name: 'Jaja (12 kom)', slug: 'eggs-12', unit: 'pack', categoryId: food.id },
    { name: 'Dizel (1L)', slug: 'diesel-1l', unit: 'l', categoryId: transport.id },
    { name: 'Benzin (1L)', slug: 'gasoline-1l', unit: 'l', categoryId: transport.id },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }

  // 3. Create Countries
  const countries = [
    { code: 'RS', name: 'Srbija', currency: 'RSD' },
    { code: 'DE', name: 'Nemačka', currency: 'EUR' },
    { code: 'AT', name: 'Austrija', currency: 'EUR' },
    { code: 'FR', name: 'Francuska', currency: 'EUR' },
    { code: 'IT', name: 'Italija', currency: 'EUR' },
    { code: 'HR', name: 'Hrvatska', currency: 'EUR' },
    { code: 'HU', name: 'Mađarska', currency: 'HUF' },
    { code: 'RO', name: 'Rumunija', currency: 'RON' },
    { code: 'BG', name: 'Bugarska', currency: 'BGN' },
    { code: 'GR', name: 'Grčka', currency: 'EUR' },
    { code: 'SI', name: 'Slovenija', currency: 'EUR' },
  ]

  for (const c of countries) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    })
  }

  console.log('Seed completed!')
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

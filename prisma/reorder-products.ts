import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Ažuriranje redosleda proizvoda u ekonomskim pokazateljima...')

  const category = await prisma.category.findUnique({
    where: { slug: 'economic-indicators' },
    include: { products: true }
  })

  if (!category) {
    console.log('Kategorija nije pronađena')
    return
  }

  // Definiši redosled
  const order = [
    'average-net-salary',
    'average-pension', 
    'diesel-price'
  ]

  // Ažuriraj ID-ove da budu po redosledu
  for (let i = 0; i < order.length; i++) {
    const product = category.products.find(p => p.slug === order[i])
    if (product) {
      // Privremeno setuj na visok broj da izbegnemo konflikte
      await prisma.product.update({
        where: { id: product.id },
        data: { id: 1000 + i }
      })
    }
  }

  // Sada ih vrati na prave ID-eve 1, 2, 3
  for (let i = 0; i < order.length; i++) {
    await prisma.product.update({
      where: { id: 1000 + i },
      data: { id: i + 1 }
    })
  }

  console.log('✅ Redosled proizvoda ažuriran:')
  console.log('1. Prosečna neto plata')
  console.log('2. Prosečna penzija')
  console.log('3. Cena dizela')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

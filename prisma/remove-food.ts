import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Brisanje kategorije Hrana i Piće...')

  // Nađi kategoriju hrane
  const foodCategory = await prisma.category.findUnique({
    where: { slug: 'food' },
    include: { products: true }
  })

  if (!foodCategory) {
    console.log('Kategorija Hrana već ne postoji.')
    return
  }

  console.log(`Pronađena kategorija: ${foodCategory.name}`)
  console.log(`Proizvodi za brisanje: ${foodCategory.products.map(p => p.name).join(', ')}`)

  // Prvo obriši sve price records za proizvode hrane
  for (const product of foodCategory.products) {
    await prisma.priceRecord.deleteMany({
      where: { productId: product.id }
    })
    console.log(`  ✓ Obrisane cene za: ${product.name}`)
  }

  // Zatim obriši proizvode
  await prisma.product.deleteMany({
    where: { categoryId: foodCategory.id }
  })
  console.log(`  ✓ Obrisani svi proizvodi iz kategorije`)

  // Na kraju obriši kategoriju
  await prisma.category.delete({
    where: { id: foodCategory.id }
  })
  console.log(`  ✓ Obrisana kategorija: ${foodCategory.name}`)

  console.log('\n✅ Kategorija Hrana i Piće uspešno obrisana!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

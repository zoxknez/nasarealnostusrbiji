import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Brisanje svih kategorija osim ekonomskih pokazatelja...')

  // Nađi sve kategorije osim economic-indicators
  const categoriesToDelete = await prisma.category.findMany({
    where: {
      slug: {
        not: 'economic-indicators'
      }
    }
  })

  for (const category of categoriesToDelete) {
    console.log(`Brišem kategoriju: ${category.name}`)
    
    // Prvo obriši sve price records za proizvode u ovoj kategoriji
    await prisma.priceRecord.deleteMany({
      where: {
        product: {
          categoryId: category.id
        }
      }
    })

    // Zatim obriši proizvode
    await prisma.product.deleteMany({
      where: {
        categoryId: category.id
      }
    })

    // Na kraju obriši kategoriju
    await prisma.category.delete({
      where: {
        id: category.id
      }
    })
  }

  console.log('✅ Sve nepotrebne kategorije obrisane!')
  console.log('Ostala samo kategorija: Ekonomski pokazatelji')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          priceRecords: true
        }
      }
    }
  })
  
  console.log('Categories:', categories.length)
  categories.forEach(cat => {
    console.log(`\n${cat.name} (${cat.slug}):`)
    console.log(`  Products: ${cat.products.length}`)
    cat.products.forEach(p => {
      console.log(`    - ${p.name}: ${p.priceRecords.length} prices`)
    })
  })

  const products = await prisma.product.findMany()
  console.log('\nTotal products:', products.length)
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })

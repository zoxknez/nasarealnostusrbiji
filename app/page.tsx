import { prisma } from '@/lib/prisma'
import { ComparisonView } from '@/components/ComparisonView2'

function serializeData(data: any): any {
  if (data === null || data === undefined) return data
  if (Array.isArray(data)) return data.map(serializeData)
  if (data instanceof Date) return data.toISOString()
  
  // Handle Prisma Decimal objects - check for toNumber method
  if (typeof data === 'object' && typeof data.toNumber === 'function') {
    return data.toNumber()
  }
  
  if (typeof data === 'object') {
    const serialized: any = {}
    for (const key in data) {
      serialized[key] = serializeData(data[key])
    }
    return serialized
  }
  return data
}

async function getComparisonData() {
  const [products, salaries, pensions, categories, serbiaHistory] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        priceRecords: {
          orderBy: { date: 'desc' },
          include: { country: true },
          distinct: ['countryId']
        }
      }
    }),
    prisma.economicIndicator.findMany({
      where: { type: 'SALARY_NET_AVG', year: 2025 },
      include: { country: true }
    }),
    prisma.economicIndicator.findMany({
      where: { type: 'PENSION_AVG', year: 2025 },
      include: { country: true }
    }),
    prisma.category.findMany({
      include: {
        products: {
          include: {
            priceRecords: {
              where: { country: { code: 'RS' } },
              orderBy: { date: 'desc' },
              take: 1
            }
          }
        }
      }
    }),
    prisma.serbiaHistoricalData.findMany({
      orderBy: { year: 'asc' }
    })
  ])

  return { products, salaries, pensions, categories, serbiaHistory }
}

type ComparisonData = Awaited<ReturnType<typeof getComparisonData>>

export default async function Home() {
  const { products, salaries, pensions, categories, serbiaHistory }: ComparisonData = await getComparisonData()

  const salaryMap: Record<string, number> = {}
  salaries.forEach((s: any) => {
    salaryMap[s.country.code] = Number(s.valueEur)
  })

  // Override RS salary with realistic 80k RSD (~680 EUR)
  salaryMap['RS'] = 680

  const pensionMap: Record<string, number> = {}
  pensions.forEach((p: any) => {
    pensionMap[p.country.code] = Number(p.valueEur)
  })

  const serbiaSalary = 680 // Realistic salary ~80k RSD
  const serbiaPension = pensionMap['RS'] || 250

  // Serialize Decimal objects properly
  const serializedProducts = serializeData(products)
  const serializedCategories = serializeData(categories)
  const serializedSerbiaHistory = serializeData(serbiaHistory)

  return (
    <ComparisonView
      categories={serializedCategories}
      products={serializedProducts}
      salaryMap={salaryMap}
      serbiaSalary={serbiaSalary}
      serbiaPension={serbiaPension}
      serbiaHistoricalData={serializedSerbiaHistory}
    />
  )
}

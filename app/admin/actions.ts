'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAdminData() {
  const countries = await prisma.country.findMany({ orderBy: { name: 'asc' } })
  const products = await prisma.product.findMany({ 
    include: { category: true },
    orderBy: { name: 'asc' } 
  })
  return { countries, products }
}

export async function addPriceRecord(formData: FormData) {
  const countryId = parseInt(formData.get('countryId') as string)
  const productId = parseInt(formData.get('productId') as string)
  const value = parseFloat(formData.get('value') as string)
  const source = formData.get('source') as string

  if (!countryId || !productId || !value) {
    throw new Error('Missing required fields')
  }

  const country = await prisma.country.findUnique({ where: { id: countryId } })
  if (!country) throw new Error('Country not found')

  let valueEur = value
  if (country.currency === 'RSD') {
    valueEur = value / 117.0
  } else if (country.currency !== 'EUR') {
    valueEur = value
  }

  await prisma.priceRecord.create({
    data: {
      countryId,
      productId,
      value,
      valueEur,
      source,
      isManual: true,
    },
  })

  revalidatePath('/admin')
  revalidatePath('/')
}

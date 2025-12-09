import { getAdminData, addPriceRecord } from './actions'

type AdminData = Awaited<ReturnType<typeof getAdminData>>

export default async function AdminPage() {
  const { countries, products }: AdminData = await getAdminData()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Panel - Unos Cena</h1>
        
        <form action={addPriceRecord} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Država</label>
            <select name="countryId" className="w-full p-2 border rounded-md bg-white text-black">
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.currency})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proizvod</label>
            <select name="productId" className="w-full p-2 border rounded-md bg-white text-black">
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.unit}) - {p.category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cena (u lokalnoj valuti)</label>
            <input 
              type="number" 
              step="0.01" 
              name="value" 
              required 
              className="w-full p-2 border rounded-md text-black"
              placeholder="npr. 150.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Izvor (Opciono)</label>
            <input 
              type="text" 
              name="source" 
              className="w-full p-2 border rounded-md text-black"
              placeholder="npr. Maxi, Pijaca, NIS"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sačuvaj Cenu
          </button>
        </form>
      </div>
    </div>
  )
}

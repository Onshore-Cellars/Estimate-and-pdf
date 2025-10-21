export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-navy mb-4">
            Wine & Spirits Catalog Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional PDF catalog generation for wine and spirits products
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-navy mb-4">API Endpoint</h2>
          <div className="bg-gray-100 p-4 rounded">
            <code className="text-sm">POST /api/generate-catalog</code>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Generates three types of PDF catalogs:
                <ul className="list-circle list-inside ml-6 mt-1">
                  <li>Single Product Catalog (A5 Landscape)</li>
                  <li>Multi-Product Catalog with Rates (A4 Portrait)</li>
                  <li>Multi-Product Catalog without Rates (A4 Portrait)</li>
                </ul>
              </li>
              <li>Automatic product sorting and grouping</li>
              <li>Professional layout with custom styling</li>
              <li>Image handling with category-specific fallbacks</li>
              <li>Price calculation with discount display</li>
              <li>Optional Shopify upload integration</li>
              <li>Optional Zoho Books estimate update</li>
            </ul>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-navy mb-4">Request Format</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "items": [
    {
      "Item ID": "123",
      "Item Name": "Example Wine",
      "Category": "Red",
      "SKU": "WINE001",
      "Selling Price": 29.99,
      "Discount (%)": 10,
      "Quantity On Hand": 50,
      "Ordered Quantity": 6,
      "Description": "Description text",
      "ABV": 0.135,
      "Country": "France",
      "Region": "Bordeaux",
      "Appellation": "Pauillac",
      "Parker Points": "95",
      "Image URL": "https://...",
      "Tasting Notes": "Rich and complex...",
      ...
    }
  ],
  "customer_name": "Customer Name",
  "customer_number": "CUST001",
  "reference_number": "REF-2024-001",
  "document_type": "Estimate",
  "estimate_id": "EST001",
  "user_email": "user@example.com"
}`}
          </pre>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Built with Next.js and @react-pdf/renderer</p>
          <p className="mt-2">Deployed on Vercel</p>
        </div>
      </div>
    </main>
  );
}

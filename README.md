# Wine & Spirits Catalog Generator

A Next.js application deployed on Vercel that generates professional PDF catalogs for wine and spirits products. This system replicates the functionality previously done via Google Apps Script + Google Slides.

## Features

- **Three Catalog Types**:
  - Single Product Catalog (A5 Landscape) - Detailed one-product-per-page format
  - Multi-Product Catalog with Rates (A4 Portrait) - 7 products per page with pricing
  - Multi-Product Catalog without Rates (A4 Portrait) - Same layout without pricing

- **Smart Product Processing**:
  - Automatic sorting by type, category, country, region, and appellation
  - Intelligent grouping (wines and spirits grouped by category if ≥4 items)
  - Filters out "Other Items" category

- **Professional Layout**:
  - Custom-designed templates matching brand guidelines
  - Navy (#0A1E3E) and Gold (#C8A882) color scheme
  - Responsive image handling with category-specific fallbacks
  - Price display with strikethrough for discounts

- **Integrations**:
  - Shopify upload (uploads PDF to Shopify CDN)
  - Zoho Books estimate update (updates custom field with PDF URL)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Onshore-Cellars/Estimate-and-pdf.git
cd Estimate-and-pdf
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your actual credentials.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Usage

### POST /api/generate-catalog

Generate PDF catalogs from product data.

**Request Body:**

```json
{
  "items": [
    {
      "Item ID": "string",
      "Item Name": "string",
      "Category": "string",
      "SKU": "string",
      "Selling Price": 0,
      "Discount (%)": 0,
      "Quantity On Hand": 0,
      "Ordered Quantity": 0,
      "Description": "string",
      "ABV": 0,
      "Country": "string",
      "Region": "string",
      "Appellation": "string",
      "Parker Points": "string",
      "Image URL": "string",
      "Shopify URL": "string",
      "Tasting Notes": "string",
      "Style Multi Select": "string",
      "Grapes Blend": "string",
      "Pairs With": "string",
      "Serving Suggestion": "string",
      "Ageing": "string",
      "Sweetness": "string",
      "Drinking Window": "string"
    }
  ],
  "customer_name": "string",
  "customer_number": "string",
  "reference_number": "string",
  "sales_order_number": "string",
  "estimate_number": "string",
  "document_type": "Estimate" | "Sales Order",
  "estimate_id": "string",
  "sales_order_id": "string",
  "user_email": "string"
}
```

**Response:**

```json
{
  "success": true,
  "catalogs": {
    "singleCatalog": "base64_encoded_pdf",
    "multiCatalogWithRates": "base64_encoded_pdf",
    "multiCatalogNoRates": "base64_encoded_pdf"
  },
  "shopifyUrl": "https://cdn.shopify.com/...",
  "metadata": {
    "totalItems": 0,
    "groups": [
      {
        "category": "string",
        "itemCount": 0,
        "detail": "string"
      }
    ]
  }
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/api/generate-catalog \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "Item ID": "001",
        "Item Name": "Château Margaux 2015",
        "Category": "Red",
        "SKU": "MAR2015",
        "Selling Price": 450.00,
        "Discount (%)": 10,
        "Quantity On Hand": 12,
        "Ordered Quantity": 6,
        "Description": "Premier Grand Cru Classé",
        "ABV": 0.135,
        "Country": "France",
        "Region": "Bordeaux",
        "Appellation": "Margaux",
        "Parker Points": "98",
        "Image URL": "https://example.com/image.jpg",
        "Tasting Notes": "Elegant and powerful...",
        "Grapes Blend": "Cabernet Sauvignon, Merlot",
        "Pairs With": "Red meat, Game",
        "Drinking Window": "2025-2045"
      }
    ],
    "customer_name": "Fine Wine Co",
    "customer_number": "CUST001",
    "reference_number": "EST-2024-001",
    "document_type": "Estimate",
    "estimate_id": "EST001",
    "user_email": "sales@example.com"
  }'
```

## Product Sorting Logic

Products are sorted in the following order:

1. **By Type**: Wine → Non-Alcoholic → Spirits → Sake → Beer → Water → Softs
2. **Within Wine**: Sparkling → Rosé → White → Red → Sweet → Port → Sherry → Madeira → Orange Wine → Kosher
3. **Within Category**: Country (France → Italy → Others alphabetically) → Region → Appellation → SKU

## Grouping Logic

- **Wine categories**: Grouped separately if ≥4 items, otherwise merged into "Other Wines"
- **Spirit categories**: Grouped separately if ≥4 items, otherwise merged into "Other Spirits"
- **Other types**: Grouped by main type (Sake, Beer, etc.)

## Environment Variables

Required environment variables for integrations:

```env
# Shopify Configuration
SHOPIFY_ACCESS_TOKEN=your_shopify_access_token
SHOPIFY_SHOP_DOMAIN=onshorecellars.myshopify.com

# Zoho Books Configuration
ZOHO_ORG_ID=your_zoho_org_id
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REGION=com
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
npm run build
```

### Manual Deployment

Build for production:
```bash
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── generate-catalog/
│   │       └── route.ts          # Main API endpoint
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── components/
│   └── pdf/
│       ├── SingleProductCatalog.tsx
│       ├── MultiProductCatalog.tsx
│       ├── TitlePage.tsx
│       └── SeparatorPage.tsx
├── lib/
│   ├── sorting.ts                 # Product sorting logic
│   ├── grouping.ts                # Product grouping logic
│   ├── textProcessing.ts          # Text utilities
│   ├── imageUtils.ts              # Image handling
│   └── integrations/
│       ├── shopify.ts             # Shopify upload
│       └── zoho.ts                # Zoho Books integration
├── types/
│   └── catalog.ts                 # TypeScript interfaces
└── next.config.js                 # Next.js configuration
```

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **PDF Generation**: @react-pdf/renderer
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

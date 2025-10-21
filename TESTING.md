# API Testing Guide

This document provides instructions for testing the Wine & Spirits Catalog Generator API.

## Prerequisites

- Server running on `http://localhost:3000` (use `npm run dev`)
- `curl` and `jq` installed (for command-line testing)

## Testing the API

### 1. Basic API Test

```bash
curl -X POST http://localhost:3000/api/generate-catalog \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "Item ID": "001",
        "Item Name": "Test Wine",
        "Category": "Red",
        "SKU": "TEST001",
        "Selling Price": 50.00,
        "Discount (%)": 0,
        "Quantity On Hand": 10,
        "Description": "Test description",
        "ABV": 0.13,
        "Country": "France",
        "Region": "Bordeaux",
        "Appellation": "Pauillac",
        "Image URL": "",
        "Tasting Notes": "Test tasting notes"
      }
    ],
    "customer_name": "Test Customer",
    "customer_number": "CUST001",
    "reference_number": "TEST-001",
    "document_type": "Estimate",
    "user_email": "test@example.com"
  }'
```

### 2. Save PDFs to Files

```bash
# Create output directory
mkdir -p ./output

# Generate and save all catalogs
RESPONSE=$(curl -s -X POST http://localhost:3000/api/generate-catalog \
  -H "Content-Type: application/json" \
  -d @./test-data.json)

# Extract and save Single Product Catalog
echo "$RESPONSE" | jq -r '.catalogs.singleCatalog' | base64 -d > ./output/single-catalog.pdf

# Extract and save Multi-Product Catalog with Rates
echo "$RESPONSE" | jq -r '.catalogs.multiCatalogWithRates' | base64 -d > ./output/multi-catalog-rates.pdf

# Extract and save Multi-Product Catalog without Rates
echo "$RESPONSE" | jq -r '.catalogs.multiCatalogNoRates' | base64 -d > ./output/multi-catalog-no-rates.pdf
```

### 3. Check API Response Metadata

```bash
curl -s -X POST http://localhost:3000/api/generate-catalog \
  -H "Content-Type: application/json" \
  -d @./test-data.json | jq '.metadata'
```

Expected response:
```json
{
  "totalItems": 2,
  "groups": [
    {
      "category": "Other Wines",
      "itemCount": 2,
      "detail": "Other Wines - France"
    }
  ]
}
```

## Test Cases

### Test Case 1: Single Product (Red Wine)

**Input:**
- 1 Red wine from France

**Expected Output:**
- Single Catalog: 1 page (A5 landscape)
- Multi Catalog: 1 page (A4 portrait)
- Grouping: "Other Wines" (less than 4 items)

### Test Case 2: Multiple Products (Mixed Types)

**Input:**
- 4 Red wines from France
- 2 Sparkling wines from France
- 3 Spirits (Gin)

**Expected Output:**
- Single Catalog: 9 pages
- Multi Catalog: 2 pages (7 items on page 1, 2 items on page 2)
- Grouping:
  - Red wines as separate group (4 items)
  - Other Wines (Sparkling, 2 items)
  - Other Spirits (Gin, 3 items)

### Test Case 3: Discount Pricing

**Input:**
- Product with 10% discount

**Expected Output:**
- Price displays as: €̶4̶5̶0̶.̶0̶0̶ €405.00
- Strikethrough on original price

### Test Case 4: Missing Images

**Input:**
- Products with empty "Image URL"

**Expected Output:**
- Fallback images based on category

### Test Case 5: Champagne Detection

**Input:**
- Sparkling wine with appellation "champagne"

**Expected Output:**
- Appellation cleaned to empty string
- Champagne fallback image used

## Verifying PDF Output

After generating PDFs, verify:

1. **File Size**: PDFs should be between 2-10 KB for small catalogs
2. **Page Count**: Use `pdfinfo` to verify page count
3. **Visual Quality**: Open in PDF viewer to check layout

```bash
# Install pdfinfo (part of poppler-utils)
# Ubuntu/Debian: sudo apt-get install poppler-utils

# Check PDF details
pdfinfo ./output/single-catalog.pdf
```

## Performance Testing

Test generation time for large catalogs:

```bash
time curl -s -X POST http://localhost:3000/api/generate-catalog \
  -H "Content-Type: application/json" \
  -d @./large-catalog.json > /dev/null
```

**Expected**: <10 seconds for 100 products

## Integration Testing

### Shopify Upload (requires environment variables)

Set environment variables:
```bash
export SHOPIFY_ACCESS_TOKEN=your_token
export SHOPIFY_SHOP_DOMAIN=onshorecellars.myshopify.com
```

Test with estimate:
```bash
curl -X POST http://localhost:3000/api/generate-catalog \
  -H "Content-Type: application/json" \
  -d '{
    ...
    "document_type": "Estimate",
    "estimate_id": "test_est_001",
    ...
  }' | jq '.shopifyUrl'
```

## Troubleshooting

### Issue: "Failed to generate PDF"

**Solution**: Check that all required fields are present in the request

### Issue: Images not loading

**Solution**: Verify Image URLs are accessible or fallback images are configured

### Issue: Sorting incorrect

**Solution**: Check that Category field matches expected values in type mapping

## Sample Test Data Files

See `test/sample-request.json` for a complete example request.

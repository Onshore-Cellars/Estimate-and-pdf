# PDF Catalog Generator

A Python tool for generating professional PDF catalogs from product data. Perfect for creating product catalogs, price lists, and promotional materials.

## Features

- 📄 Generate PDF catalogs from JSON data
- 🎨 Two output formats: detailed layout and table format
- 📐 Support for multiple page sizes (Letter, A4)
- 🖼️ Optional product image support
- 💼 Professional, clean design
- 🚀 Easy-to-use command-line interface

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Onshore-Cellars/Estimate-and-pdf.git
cd Estimate-and-pdf
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Quick Start - Generate a Sample Catalog

```bash
python generate_catalog.py --sample -o my_catalog.pdf
```

This will generate a sample catalog with example products.

### Generate from Your Own Data

1. Create a JSON file with your products (see `examples/products.json` for format):

```json
[
  {
    "name": "Product Name",
    "sku": "PROD-001",
    "description": "Product description",
    "price": 99.99
  }
]
```

2. Generate the catalog:

```bash
python generate_catalog.py -i products.json -o catalog.pdf
```

### Command-Line Options

```
usage: generate_catalog.py [-h] [-i INPUT] [-o OUTPUT] [--sample] [--title TITLE]
                           [--pagesize {letter,A4}] [--table] [--images]

options:
  -i, --input INPUT           Input JSON file with product data
  -o, --output OUTPUT         Output PDF file path (default: catalog.pdf)
  --sample                    Generate a sample catalog with example products
  --title TITLE               Catalog title (default: Product Catalog)
  --pagesize {letter,A4}      Page size (default: letter)
  --table                     Generate catalog in table format
  --images                    Include product images (if available in data)
```

### Examples

**Generate with custom title:**
```bash
python generate_catalog.py --sample -o catalog.pdf --title "Wine Collection 2025"
```

**Generate in A4 format:**
```bash
python generate_catalog.py -i products.json -o catalog.pdf --pagesize A4
```

**Generate table format:**
```bash
python generate_catalog.py -i products.json -o catalog.pdf --table
```

## JSON Data Format

Your JSON file should contain an array of product objects with the following fields:

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `name` | Yes | string | Product name |
| `price` | Yes | number | Product price |
| `description` | No | string | Product description |
| `sku` | No | string | Product SKU/code |
| `image` | No | string | Path to product image |

See `examples/products.json` for a complete example.

## Using as a Python Module

You can also use the catalog generator programmatically:

```python
from catalog_generator import CatalogGenerator

# Create generator
generator = CatalogGenerator(title="My Catalog")

# Define products
products = [
    {
        'name': 'Product 1',
        'sku': 'PROD-001',
        'description': 'A great product',
        'price': 99.99
    }
]

# Generate PDF
generator.generate(products, 'output.pdf')

# Or generate table format
generator.generate_table_format(products, 'output_table.pdf')
```

## Requirements

- Python 3.6+
- ReportLab 4.0+

## License

This project is open source and available for use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

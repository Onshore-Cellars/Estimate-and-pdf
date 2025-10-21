# Quick Start Guide

## Installation
```bash
pip install -r requirements.txt
```

## Basic Usage

### 1. Generate a Sample Catalog
```bash
python generate_catalog.py --sample -o catalog.pdf
```

### 2. Generate from Your Data
Create a `products.json` file:
```json
[
  {
    "name": "Product Name",
    "sku": "SKU-001",
    "description": "Product description",
    "price": 99.99
  }
]
```

Generate the catalog:
```bash
python generate_catalog.py -i products.json -o catalog.pdf
```

### 3. Customize Your Catalog

#### Table Format
```bash
python generate_catalog.py -i products.json -o catalog.pdf --table
```

#### Custom Title
```bash
python generate_catalog.py --sample -o catalog.pdf --title "My Collection"
```

#### A4 Paper Size
```bash
python generate_catalog.py --sample -o catalog.pdf --pagesize A4
```

## Run Tests
```bash
python test_catalog.py
```

## Programmatic Usage
```python
from catalog_generator import CatalogGenerator

generator = CatalogGenerator(title="My Catalog")
products = [{"name": "Product", "price": 10.99}]
generator.generate(products, 'output.pdf')
```

#!/usr/bin/env python3
"""
Command-line interface for PDF Catalog Generator
"""

import argparse
import json
import sys
from catalog_generator import CatalogGenerator, create_sample_catalog


def load_products_from_json(filepath):
    """Load product data from a JSON file."""
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File '{filepath}' not found.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in '{filepath}': {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description='Generate PDF catalogs from product data',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Generate a sample catalog
  python generate_catalog.py --sample -o my_catalog.pdf
  
  # Generate from JSON file
  python generate_catalog.py -i products.json -o catalog.pdf
  
  # Generate table format
  python generate_catalog.py -i products.json -o catalog.pdf --table
  
  # Custom title and A4 page size
  python generate_catalog.py -i products.json -o catalog.pdf --title "Wine Collection" --pagesize A4
        """
    )
    
    parser.add_argument(
        '-i', '--input',
        help='Input JSON file with product data',
        type=str
    )
    
    parser.add_argument(
        '-o', '--output',
        help='Output PDF file path (default: catalog.pdf)',
        type=str,
        default='catalog.pdf'
    )
    
    parser.add_argument(
        '--sample',
        help='Generate a sample catalog with example products',
        action='store_true'
    )
    
    parser.add_argument(
        '--title',
        help='Catalog title (default: Product Catalog)',
        type=str,
        default='Product Catalog'
    )
    
    parser.add_argument(
        '--pagesize',
        help='Page size: letter or A4 (default: letter)',
        choices=['letter', 'A4'],
        default='letter'
    )
    
    parser.add_argument(
        '--table',
        help='Generate catalog in table format',
        action='store_true'
    )
    
    parser.add_argument(
        '--images',
        help='Include product images (if available in data)',
        action='store_true'
    )
    
    args = parser.parse_args()
    
    # Validate arguments
    if not args.sample and not args.input:
        parser.error("Either --sample or --input must be specified")
    
    # Load products
    if args.sample:
        print("Generating sample catalog...")
        products = create_sample_catalog()
    else:
        print(f"Loading products from {args.input}...")
        products = load_products_from_json(args.input)
        if not isinstance(products, list):
            print("Error: JSON file must contain a list of products")
            sys.exit(1)
    
    print(f"Loaded {len(products)} product(s)")
    
    # Set page size
    from reportlab.lib.pagesizes import letter, A4
    pagesize = A4 if args.pagesize == 'A4' else letter
    
    # Create generator
    generator = CatalogGenerator(pagesize=pagesize, title=args.title)
    
    # Generate catalog
    try:
        if args.table:
            print("Generating table format catalog...")
            generator.generate_table_format(products, args.output)
        else:
            print("Generating detailed format catalog...")
            generator.generate(products, args.output, include_images=args.images)
        
        print(f"✓ Successfully generated catalog: {args.output}")
    except Exception as e:
        print(f"Error generating catalog: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Simple tests for the PDF Catalog Generator
"""

import os
import sys
import tempfile
from catalog_generator import CatalogGenerator, create_sample_catalog


def test_sample_catalog_generation():
    """Test generating a catalog with sample data."""
    print("Testing sample catalog generation...")
    
    generator = CatalogGenerator(title="Test Catalog")
    products = create_sample_catalog()
    
    # Generate to temporary file
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        output_path = tmp.name
    
    try:
        result = generator.generate(products, output_path)
        
        # Check file exists
        assert os.path.exists(result), f"PDF not generated: {result}"
        
        # Check file size (should be > 0)
        size = os.path.getsize(result)
        assert size > 0, f"PDF file is empty: {size} bytes"
        
        print(f"  ✓ Generated PDF: {size} bytes")
        return True
        
    finally:
        # Clean up
        if os.path.exists(output_path):
            os.remove(output_path)


def test_table_format():
    """Test generating a catalog in table format."""
    print("Testing table format generation...")
    
    generator = CatalogGenerator(title="Test Table Catalog")
    products = create_sample_catalog()
    
    # Generate to temporary file
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        output_path = tmp.name
    
    try:
        result = generator.generate_table_format(products, output_path)
        
        # Check file exists
        assert os.path.exists(result), f"PDF not generated: {result}"
        
        # Check file size (should be > 0)
        size = os.path.getsize(result)
        assert size > 0, f"PDF file is empty: {size} bytes"
        
        print(f"  ✓ Generated table PDF: {size} bytes")
        return True
        
    finally:
        # Clean up
        if os.path.exists(output_path):
            os.remove(output_path)


def test_custom_products():
    """Test generating a catalog with custom products."""
    print("Testing custom products...")
    
    generator = CatalogGenerator(title="Custom Products")
    
    products = [
        {
            'name': 'Test Product 1',
            'sku': 'TEST-001',
            'description': 'This is a test product',
            'price': 10.99
        },
        {
            'name': 'Test Product 2',
            'price': 25.50
        }
    ]
    
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        output_path = tmp.name
    
    try:
        result = generator.generate(products, output_path)
        
        # Check file exists and has content
        assert os.path.exists(result), "PDF not generated"
        size = os.path.getsize(result)
        assert size > 0, "PDF file is empty"
        
        print(f"  ✓ Generated custom PDF: {size} bytes")
        return True
        
    finally:
        if os.path.exists(output_path):
            os.remove(output_path)


def test_a4_pagesize():
    """Test generating a catalog with A4 page size."""
    print("Testing A4 page size...")
    
    from reportlab.lib.pagesizes import A4
    
    generator = CatalogGenerator(pagesize=A4, title="A4 Test Catalog")
    products = [{'name': 'Test', 'price': 10}]
    
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        output_path = tmp.name
    
    try:
        result = generator.generate(products, output_path)
        
        assert os.path.exists(result), "PDF not generated"
        size = os.path.getsize(result)
        assert size > 0, "PDF file is empty"
        
        print(f"  ✓ Generated A4 PDF: {size} bytes")
        return True
        
    finally:
        if os.path.exists(output_path):
            os.remove(output_path)


def run_all_tests():
    """Run all tests."""
    print("="*60)
    print("Running PDF Catalog Generator Tests")
    print("="*60)
    
    tests = [
        test_sample_catalog_generation,
        test_table_format,
        test_custom_products,
        test_a4_pagesize
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"  ✗ FAILED: {e}")
            failed += 1
    
    print("="*60)
    print(f"Results: {passed} passed, {failed} failed")
    print("="*60)
    
    return failed == 0


if __name__ == '__main__':
    success = run_all_tests()
    sys.exit(0 if success else 1)

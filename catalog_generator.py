"""
PDF Catalog Generator

A simple tool to generate product catalogs in PDF format.
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.platypus import Image as RLImage
from datetime import datetime
import os


class CatalogGenerator:
    """Generate PDF catalogs from product data."""
    
    def __init__(self, pagesize=letter, title="Product Catalog"):
        """
        Initialize the catalog generator.
        
        Args:
            pagesize: Page size (default: letter, can use A4)
            title: Catalog title
        """
        self.pagesize = pagesize
        self.title = title
        self.styles = getSampleStyleSheet()
        
    def generate(self, products, output_path, include_images=False):
        """
        Generate a PDF catalog from product data.
        
        Args:
            products: List of product dictionaries with keys:
                     - name: Product name
                     - description: Product description
                     - price: Product price
                     - sku: Product SKU (optional)
                     - image: Path to product image (optional)
            output_path: Path where PDF will be saved
            include_images: Whether to include product images
        
        Returns:
            Path to generated PDF
        """
        # Create the PDF document
        doc = SimpleDocTemplate(
            output_path,
            pagesize=self.pagesize,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=1*inch,
            bottomMargin=0.75*inch
        )
        
        # Container for the 'Flowable' objects
        elements = []
        
        # Add title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=30,
            alignment=1  # Center
        )
        elements.append(Paragraph(self.title, title_style))
        
        # Add generation date
        date_style = self.styles['Normal']
        date_text = f"Generated on {datetime.now().strftime('%B %d, %Y')}"
        elements.append(Paragraph(date_text, date_style))
        elements.append(Spacer(1, 0.5*inch))
        
        # Add products
        for idx, product in enumerate(products):
            elements.extend(self._create_product_entry(product, include_images))
            
            # Add a page break after every 3 products (except for the last one)
            if (idx + 1) % 3 == 0 and idx < len(products) - 1:
                elements.append(PageBreak())
            else:
                elements.append(Spacer(1, 0.3*inch))
        
        # Build PDF
        doc.build(elements)
        
        return output_path
    
    def _create_product_entry(self, product, include_images=False):
        """Create flowable elements for a product entry."""
        elements = []
        
        # Product name
        name_style = ParagraphStyle(
            'ProductName',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#2c5aa0'),
            spaceAfter=6
        )
        elements.append(Paragraph(product.get('name', 'Unnamed Product'), name_style))
        
        # SKU if available
        if 'sku' in product and product['sku']:
            sku_style = self.styles['Normal']
            elements.append(Paragraph(f"<i>SKU: {product['sku']}</i>", sku_style))
            elements.append(Spacer(1, 0.1*inch))
        
        # Product image if available and requested
        if include_images and 'image' in product and product['image']:
            if os.path.exists(product['image']):
                try:
                    img = RLImage(product['image'], width=2*inch, height=2*inch)
                    elements.append(img)
                    elements.append(Spacer(1, 0.1*inch))
                except Exception as e:
                    print(f"Warning: Could not load image {product['image']}: {e}")
        
        # Description
        if 'description' in product and product['description']:
            desc_style = self.styles['Normal']
            elements.append(Paragraph(product['description'], desc_style))
            elements.append(Spacer(1, 0.1*inch))
        
        # Price
        if 'price' in product:
            price_style = ParagraphStyle(
                'Price',
                parent=self.styles['Normal'],
                fontSize=14,
                textColor=colors.HexColor('#1a7a1a'),
                fontName='Helvetica-Bold'
            )
            price_text = f"Price: ${product['price']:.2f}" if isinstance(product['price'], (int, float)) else f"Price: {product['price']}"
            elements.append(Paragraph(price_text, price_style))
        
        return elements
    
    def generate_table_format(self, products, output_path):
        """
        Generate a PDF catalog in table format.
        
        Args:
            products: List of product dictionaries
            output_path: Path where PDF will be saved
        
        Returns:
            Path to generated PDF
        """
        doc = SimpleDocTemplate(
            output_path,
            pagesize=self.pagesize,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=1*inch,
            bottomMargin=0.75*inch
        )
        
        elements = []
        
        # Add title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=30,
            alignment=1
        )
        elements.append(Paragraph(self.title, title_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Prepare table data
        data = [['SKU', 'Product Name', 'Description', 'Price']]
        
        for product in products:
            row = [
                product.get('sku', 'N/A'),
                product.get('name', 'Unnamed'),
                product.get('description', '')[:50] + '...' if len(product.get('description', '')) > 50 else product.get('description', ''),
                f"${product['price']:.2f}" if isinstance(product.get('price'), (int, float)) else product.get('price', 'N/A')
            ]
            data.append(row)
        
        # Create table
        table = Table(data, colWidths=[1*inch, 2*inch, 3*inch, 1*inch])
        
        # Style the table
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c5aa0')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
        ]))
        
        elements.append(table)
        
        # Build PDF
        doc.build(elements)
        
        return output_path


def create_sample_catalog():
    """Create a sample catalog with example products."""
    products = [
        {
            'name': 'Chateau Margaux 2015',
            'sku': 'WIN-001',
            'description': 'A prestigious Bordeaux wine from one of the finest estates. Rich, complex, with notes of blackcurrant, cedar, and tobacco.',
            'price': 850.00
        },
        {
            'name': 'Dom Pérignon Vintage 2012',
            'sku': 'CHAMP-001',
            'description': 'Iconic champagne with intense fruit and floral notes. Perfect for celebrations.',
            'price': 250.00
        },
        {
            'name': 'Macallan 18 Year Old',
            'sku': 'WHIS-001',
            'description': 'Highland single malt Scotch whisky aged for 18 years in sherry oak casks. Rich and smooth.',
            'price': 320.00
        },
        {
            'name': 'Penfolds Grange 2016',
            'sku': 'WIN-002',
            'description': 'Australia\'s most celebrated wine. Full-bodied Shiraz with exceptional aging potential.',
            'price': 650.00
        },
        {
            'name': 'Hennessy XO Cognac',
            'sku': 'COG-001',
            'description': 'Extra Old cognac blended from over 100 eaux-de-vie. Deep, powerful, and elegant.',
            'price': 200.00
        }
    ]
    
    return products


if __name__ == '__main__':
    # Generate sample catalog
    generator = CatalogGenerator(title="Onshore Cellars - Premium Collection")
    products = create_sample_catalog()
    
    # Generate detailed format
    output_file = 'catalog_detailed.pdf'
    generator.generate(products, output_file)
    print(f"Generated detailed catalog: {output_file}")
    
    # Generate table format
    output_file_table = 'catalog_table.pdf'
    generator.generate_table_format(products, output_file_table)
    print(f"Generated table catalog: {output_file_table}")

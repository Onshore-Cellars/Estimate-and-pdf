import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { CatalogRequest } from '@/types/catalog';
import { sortItems } from '@/lib/sorting';
import { groupItems, getCategoryDetail } from '@/lib/grouping';
import { allQuantitiesAreOne } from '@/lib/textProcessing';
import { SingleProductCatalog } from '@/components/pdf/SingleProductCatalog';
import { MultiProductCatalog } from '@/components/pdf/MultiProductCatalog';
import { uploadToShopify } from '@/lib/integrations/shopify';
import { updateZohoEstimate } from '@/lib/integrations/zoho';

export async function POST(request: NextRequest) {
  try {
    const body: CatalogRequest = await request.json();

    // Validate request
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Process items
    const sortedItems = sortItems(body.items);
    const groupedItems = groupItems(sortedItems);
    const hideQuantity = allQuantitiesAreOne(body.items);

    // Generate PDFs
    const catalogResults: {
      singleCatalog?: Buffer;
      multiCatalogWithRates?: Buffer;
      multiCatalogNoRates?: Buffer;
      shopifyUrl?: string;
      error?: string;
    } = {};

    try {
      // Generate Single Product Catalog
      const singleCatalog = (
        <SingleProductCatalog
          items={sortedItems}
          showQuantity={!hideQuantity}
        />
      );
      const singleCatalogBuffer = await renderToBuffer(singleCatalog);
      catalogResults.singleCatalog = singleCatalogBuffer;

      // Generate Multi-Product Catalog with Rates
      const multiCatalogWithRates = (
        <MultiProductCatalog
          groups={groupedItems}
          showRates={true}
        />
      );
      const multiCatalogWithRatesBuffer = await renderToBuffer(multiCatalogWithRates);
      catalogResults.multiCatalogWithRates = multiCatalogWithRatesBuffer;

      // Generate Multi-Product Catalog without Rates
      const multiCatalogNoRates = (
        <MultiProductCatalog
          groups={groupedItems}
          showRates={false}
        />
      );
      const multiCatalogNoRatesBuffer = await renderToBuffer(multiCatalogNoRates);
      catalogResults.multiCatalogNoRates = multiCatalogNoRatesBuffer;

      // Handle Shopify upload for estimates
      if (body.document_type === 'Estimate' && body.estimate_id) {
        try {
          const shopifyUrl = await uploadToShopify(
            multiCatalogWithRatesBuffer,
            body.customer_number,
            body.estimate_number || body.estimate_id
          );
          catalogResults.shopifyUrl = shopifyUrl;

          // Update Zoho Books estimate
          if (body.estimate_id) {
            await updateZohoEstimate(body.estimate_id, shopifyUrl);
          }
        } catch (uploadError) {
          console.error('Shopify/Zoho upload error:', uploadError);
          catalogResults.error = uploadError instanceof Error ? uploadError.message : 'Upload failed';
        }
      }

      // Return PDFs as base64 for download
      return NextResponse.json({
        success: true,
        catalogs: {
          singleCatalog: catalogResults.singleCatalog?.toString('base64'),
          multiCatalogWithRates: catalogResults.multiCatalogWithRates?.toString('base64'),
          multiCatalogNoRates: catalogResults.multiCatalogNoRates?.toString('base64'),
        },
        shopifyUrl: catalogResults.shopifyUrl,
        uploadError: catalogResults.error,
        metadata: {
          totalItems: sortedItems.length,
          groups: groupedItems.map(g => ({
            category: g.category,
            itemCount: g.items.length,
            detail: getCategoryDetail(g),
          })),
        },
      });
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      return NextResponse.json(
        {
          error: 'Failed to generate PDF',
          details: pdfError instanceof Error ? pdfError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

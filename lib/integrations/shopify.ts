interface ShopifyConfig {
  SHOP_DOMAIN: string;
  ACCESS_TOKEN: string;
  API_VERSION: string;
}

export async function uploadToShopify(
  pdfBuffer: Buffer,
  customerNumber: string,
  invoiceNumber: string
): Promise<string> {
  const config: ShopifyConfig = {
    SHOP_DOMAIN: process.env.SHOPIFY_SHOP_DOMAIN || 'onshorecellars.myshopify.com',
    ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN || '',
    API_VERSION: '2024-01',
  };

  if (!config.ACCESS_TOKEN) {
    throw new Error('SHOPIFY_ACCESS_TOKEN is not configured');
  }

  try {
    // 1. Get theme ID
    const themesResponse = await fetch(
      `https://${config.SHOP_DOMAIN}/admin/api/${config.API_VERSION}/themes.json`,
      {
        headers: {
          'X-Shopify-Access-Token': config.ACCESS_TOKEN,
        },
      }
    );

    if (!themesResponse.ok) {
      throw new Error(`Failed to fetch themes: ${themesResponse.statusText}`);
    }

    const { themes } = await themesResponse.json();
    const mainTheme = themes.find((t: any) => t.role === 'main') || themes[0];

    if (!mainTheme) {
      throw new Error('No theme found');
    }

    // 2. Upload as theme asset
    const fileName = `catalog_${customerNumber}_${invoiceNumber}.pdf`;
    const base64Content = pdfBuffer.toString('base64');

    const assetResponse = await fetch(
      `https://${config.SHOP_DOMAIN}/admin/api/${config.API_VERSION}/themes/${mainTheme.id}/assets.json`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': config.ACCESS_TOKEN,
        },
        body: JSON.stringify({
          asset: {
            key: `assets/${fileName}`,
            attachment: base64Content,
          },
        }),
      }
    );

    if (!assetResponse.ok) {
      throw new Error(`Failed to upload asset: ${assetResponse.statusText}`);
    }

    const { asset } = await assetResponse.json();
    return (
      asset.public_url ||
      `https://cdn.shopify.com/s/files/1/0995/6758/t/${mainTheme.id}/assets/${fileName}`
    );
  } catch (error) {
    console.error('Shopify upload error:', error);
    throw error;
  }
}

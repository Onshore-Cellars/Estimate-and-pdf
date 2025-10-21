interface ZohoConfig {
  ORGANIZATION_ID: string;
  REFRESH_TOKEN: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REGION: string;
}

export async function updateZohoEstimate(
  estimateId: string,
  pdfUrl: string
): Promise<void> {
  const config: ZohoConfig = {
    ORGANIZATION_ID: process.env.ZOHO_ORG_ID || '',
    REFRESH_TOKEN: process.env.ZOHO_REFRESH_TOKEN || '',
    CLIENT_ID: process.env.ZOHO_CLIENT_ID || '',
    CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET || '',
    REGION: process.env.ZOHO_REGION || 'com',
  };

  if (!config.REFRESH_TOKEN || !config.CLIENT_ID || !config.CLIENT_SECRET) {
    throw new Error('Zoho credentials are not configured');
  }

  try {
    // 1. Get access token
    const tokenResponse = await fetch(
      `https://accounts.zoho.${config.REGION}/oauth/v2/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          refresh_token: config.REFRESH_TOKEN,
          client_id: config.CLIENT_ID,
          client_secret: config.CLIENT_SECRET,
          grant_type: 'refresh_token',
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get Zoho access token: ${tokenResponse.statusText}`);
    }

    const { access_token } = await tokenResponse.json();

    // 2. Get current estimate
    const getResponse = await fetch(
      `https://books.zoho.${config.REGION}/api/v3/estimates/${estimateId}?organization_id=${config.ORGANIZATION_ID}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    );

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch estimate: ${getResponse.statusText}`);
    }

    const { estimate } = await getResponse.json();

    // 3. Update custom field
    let customFields = estimate.custom_fields || [];
    const fieldIndex = customFields.findIndex(
      (f: any) => f.api_name === 'cf_sugesstionlist'
    );

    if (fieldIndex >= 0) {
      customFields[fieldIndex].value = pdfUrl;
    } else {
      customFields.push({ api_name: 'cf_sugesstionlist', value: pdfUrl });
    }

    // 4. Update estimate
    const updateResponse = await fetch(
      `https://books.zoho.${config.REGION}/api/v3/estimates/${estimateId}?organization_id=${config.ORGANIZATION_ID}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          custom_fields: customFields,
          customer_id: estimate.customer_id,
          estimate_date: estimate.estimate_date,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Failed to update estimate: ${updateResponse.statusText}`);
    }
  } catch (error) {
    console.error('Zoho update error:', error);
    throw error;
  }
}

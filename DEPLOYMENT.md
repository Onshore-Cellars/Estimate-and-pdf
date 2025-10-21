# Deployment Guide

This guide provides step-by-step instructions for deploying the Wine & Spirits Catalog Generator to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Code pushed to GitHub repository

## Deployment Steps

### 1. Connect to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select `Onshore-Cellars/Estimate-and-pdf`

### 2. Configure Build Settings

Vercel should auto-detect Next.js settings. Verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3. Set Environment Variables

In the Vercel dashboard, go to:
**Settings** → **Environment Variables**

Add the following variables:

#### Shopify Integration (Optional)

```
SHOPIFY_ACCESS_TOKEN=your_shopify_access_token
SHOPIFY_SHOP_DOMAIN=onshorecellars.myshopify.com
```

#### Zoho Books Integration (Optional)

```
ZOHO_ORG_ID=your_zoho_organization_id
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REGION=com
```

**Note**: Set these for Production, Preview, and Development environments as needed.

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 1-2 minutes)
3. Once deployed, you'll receive a URL like: `https://your-project.vercel.app`

### 5. Verify Deployment

Test the API endpoint:

```bash
curl -X POST https://your-project.vercel.app/api/generate-catalog \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "customer_name": "Test",
    "customer_number": "TEST001",
    "reference_number": "REF-001",
    "document_type": "Estimate",
    "user_email": "test@example.com"
  }'
```

## Custom Domain (Optional)

### Add Custom Domain

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `catalog.onshorecellars.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

### SSL Certificate

Vercel automatically provisions SSL certificates for all domains.

## Monitoring

### View Logs

1. Go to your project in Vercel
2. Click on a deployment
3. View "Functions" tab to see API logs

### Error Tracking

Monitor errors in:
- Vercel dashboard → Deployments → Functions
- Check runtime logs for API errors

## Environment-Specific Settings

### Production

- Use production Shopify/Zoho credentials
- Enable error tracking
- Set appropriate rate limits

### Preview (Staging)

- Use test/sandbox credentials
- Test new features before production

### Development

- Use local development server
- Test with `.env.local` file

## Scaling Considerations

### Serverless Function Limits

Vercel serverless functions have:
- **Execution Time**: 10s (Hobby), 60s (Pro)
- **Memory**: 1024 MB default
- **Payload Size**: 4.5 MB

For large catalogs (>100 products), consider:
- Breaking into batches
- Upgrading to Vercel Pro
- Using background jobs

### Optimizations

1. **Caching**: Add caching headers for repeated requests
2. **Image CDN**: Use Shopify CDN for product images
3. **Compression**: Enable response compression

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Push to `main` branch
- **Preview**: Pull requests and other branches

### Manual Deployments

Redeploy from Vercel dashboard:
1. Go to Deployments
2. Click "..." on any deployment
3. Select "Redeploy"

## Rollback

To rollback to a previous version:

1. Go to Deployments
2. Find the working deployment
3. Click "..." → "Promote to Production"

## Troubleshooting

### Build Failures

**Issue**: Build fails during deployment

**Solution**:
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`

### Runtime Errors

**Issue**: API returns 500 errors

**Solution**:
- Check function logs in Vercel
- Verify environment variables are set
- Test locally with same data

### Slow Performance

**Issue**: PDF generation takes too long

**Solution**:
- Reduce number of products per request
- Optimize images
- Consider upgrading Vercel plan

## Security Best Practices

1. **Never commit** `.env` files with real credentials
2. **Use environment variables** for all secrets
3. **Rotate credentials** regularly
4. **Limit API access** with authentication (if needed)
5. **Monitor usage** for unusual activity

## Support

For issues specific to:
- **Vercel**: https://vercel.com/support
- **Next.js**: https://nextjs.org/docs
- **This Application**: Create an issue in the GitHub repository

## Updating Production

To deploy updates:

1. Make changes locally
2. Test thoroughly: `npm run build && npm run start`
3. Commit and push to GitHub
4. Vercel automatically deploys to production

For critical updates:
1. Create a preview deployment first
2. Test the preview URL
3. Promote to production when verified

---

**Deployment Checklist:**

- [ ] Code pushed to GitHub
- [ ] Vercel project created and connected
- [ ] Environment variables configured
- [ ] Build successful
- [ ] API endpoint tested
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring set up
- [ ] Documentation updated

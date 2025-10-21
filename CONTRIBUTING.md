# Contributing Guide

Thank you for considering contributing to the Wine & Spirits Catalog Generator! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

### Getting Started

1. **Fork the repository**
   ```bash
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/Estimate-and-pdf.git
   cd Estimate-and-pdf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your development credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   └── generate-catalog/
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   └── pdf/                # PDF components
│       ├── SingleProductCatalog.tsx
│       ├── MultiProductCatalog.tsx
│       ├── TitlePage.tsx
│       └── SeparatorPage.tsx
├── lib/                     # Utility functions
│   ├── sorting.ts          # Product sorting logic
│   ├── grouping.ts         # Product grouping logic
│   ├── textProcessing.ts   # Text utilities
│   ├── imageUtils.ts       # Image handling
│   └── integrations/       # External integrations
│       ├── shopify.ts
│       └── zoho.ts
├── types/                   # TypeScript types
│   └── catalog.ts
└── public/                  # Static assets
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define proper types for all functions and components
- Avoid `any` type when possible

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Use meaningful prop names

### Naming Conventions

- **Files**: camelCase for utilities, PascalCase for components
- **Functions**: camelCase (e.g., `generateSortKey`)
- **Components**: PascalCase (e.g., `SingleProductCatalog`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `WINE_CATEGORY_ORDER`)

### Code Formatting

This project uses ESLint. Run before committing:

```bash
npm run lint
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### 2. Make Your Changes

- Keep changes focused and atomic
- Write clear, descriptive commit messages
- Test your changes thoroughly

### 3. Test Your Changes

```bash
# Build the project
npm run build

# Run linter
npm run lint

# Test the API manually
curl -X POST http://localhost:3000/api/generate-catalog \
  -H "Content-Type: application/json" \
  -d @./test-data.json
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new sorting option for spirits"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### PR Description

Include:
- **What**: Brief description of changes
- **Why**: Reason for the changes
- **How**: Technical approach (if complex)
- **Testing**: How you tested the changes

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Changes are documented (README, comments)
- [ ] No console.log statements left in code
- [ ] Build succeeds (`npm run build`)
- [ ] Linter passes (`npm run lint`)
- [ ] Tested manually with sample data
- [ ] No breaking changes (or clearly documented)

## Common Development Tasks

### Adding a New Product Category

1. Update `lib/sorting.ts`:
   ```typescript
   const typeMap: { [key: string]: string } = {
     // Add new category
     "Your Category": "Type",
     ...
   };
   ```

2. Add to sorting order if needed
3. Update fallback images in `lib/imageUtils.ts`
4. Test with sample data

### Modifying PDF Layout

1. Edit component in `components/pdf/`
2. Update styles using @react-pdf/renderer StyleSheet
3. Test PDF generation
4. Verify A4/A5 page sizes

### Adding a New Integration

1. Create new file in `lib/integrations/`
2. Export async functions
3. Add environment variables to `.env.example`
4. Document in README
5. Add error handling

## Testing

### Manual Testing

Create test data files:
```json
{
  "items": [...],
  "customer_name": "Test Customer",
  ...
}
```

Test with curl:
```bash
curl -X POST http://localhost:3000/api/generate-catalog \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

### Regression Testing

Before submitting PR:
- Test with various product combinations
- Test with missing fields
- Test with large catalogs (50+ items)
- Test discount calculations
- Verify image fallbacks

## Debugging

### Server-Side Debugging

Add console.log statements in API routes:
```typescript
console.log('Processing items:', sortedItems.length);
```

View in terminal running `npm run dev`

### PDF Debugging

Save generated PDFs locally:
```bash
curl -s ... | jq -r '.catalogs.singleCatalog' | base64 -d > debug.pdf
```

Open in PDF viewer to inspect layout

## Documentation

### Code Comments

- Use JSDoc for functions:
  ```typescript
  /**
   * Sorts items according to catalog rules
   * @param items - Array of product items
   * @returns Sorted and processed items
   */
  export function sortItems(items: ProductItem[]): ProcessedItem[] {
    ...
  }
  ```

### README Updates

Update README.md when:
- Adding new features
- Changing API structure
- Adding environment variables
- Modifying deployment process

## Questions or Issues?

- **Bug Reports**: Create a GitHub issue with:
  - Clear description
  - Steps to reproduce
  - Expected vs actual behavior
  - Sample data (if applicable)

- **Feature Requests**: Create a GitHub issue with:
  - Use case description
  - Proposed solution
  - Alternative approaches considered

- **Questions**: Open a GitHub Discussion

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing! 🎉

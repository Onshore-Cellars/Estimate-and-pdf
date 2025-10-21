export interface ProductItem {
  "Item ID": string;
  "Item Name": string;
  "Category": string;
  "SKU": string;
  "Selling Price": number;
  "Discount (%)": number;
  "Quantity On Hand": number;
  "Ordered Quantity"?: number;
  "Description": string;
  "ABV": number;
  "Country": string;
  "Region": string;
  "Appellation": string;
  "Parker Points"?: string;
  "Image URL": string;
  "Shopify URL"?: string;
  "Tasting Notes": string;
  "Style Multi Select"?: string;
  "Grapes Blend"?: string;
  "Pairs With"?: string;
  "Serving Suggestion"?: string;
  "Ageing"?: string;
  "Core List"?: string;
  "Sweetness"?: string;
  "Drinking Window"?: string;
}

export interface CatalogRequest {
  items: ProductItem[];
  customer_name: string;
  customer_number: string;
  reference_number: string;
  sales_order_number?: string;
  estimate_number?: string;
  document_type: "Sales Order" | "Estimate";
  estimate_id?: string;
  sales_order_id?: string;
  user_email: string;
}

export interface ProcessedItem extends ProductItem {
  type: string;
  sortKey: string;
}

export interface GroupedItems {
  category: string;
  items: ProcessedItem[];
  countries: string[];
  appellation?: string;
  region?: string;
  country?: string;
}

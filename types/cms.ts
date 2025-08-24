export type CollectionType = "designs" | "templates" | "mixed";

export interface Design {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  images?: string[]; // stored image URLs
  signature?: string; // author/signature
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  blueprint?: Record<string, any>; // template blueprint / layout params
  assets?: string[]; // asset references (e.g., mockups)
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

// A product is the combination of a design + template
export interface Product {
  id: string;
  name: string; // usually derived from design.name or a combined name
  description?: string; // combination of design and template descriptions
  tags?: string[]; // merged tags
  designId: string;
  templateId: string;
  signature?: string;
  price?: number;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Collection {
  id: string;
  name: string;
  type: CollectionType;
  itemIds: string[]; // ids of designs or templates
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface BulkUploadOptions {
  collectionId?: string;
  overwrite?: boolean; // overwrite existing items with the same name
  tags?: string[]; // tags to apply to all uploaded items
  notify?: boolean; // send notification after upload
}

export interface BulkUploadResult {
  uploaded: number;
  failed: number;
  files: { name: string; size: number; type?: string }[];
  errors?: { file: string; message: string }[];
}

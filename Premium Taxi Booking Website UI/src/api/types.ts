export type CarStatus = "available" | "sold" | "inactive";
export type QuoteStatus = "new" | "contacted" | "quoted" | "closed";
export type ContactMethod = "phone" | "email" | "whatsapp";

export interface Car {
  _id: string;
  name: string;
  brand: string;
  model?: string;
  year: number;
  description: string;
  images: string[];
  location: string;
  fuelType: string;
  transmission: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  status: CarStatus;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRequest {
  _id: string;
  carId: Car | string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message: string;
  preferredContactMethod: ContactMethod;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Stats { totalCars: number; activeCars: number; soldCars: number; totalQuoteRequests: number; newQuoteRequests: number; contactedRequests: number; quotedRequests: number; }
export interface PaginatedCars { items: Car[]; pagination: { page: number; limit: number; total: number; pages: number } }
export interface GalleryImage { _id: string; url: string; publicId?: string; alt: string; createdAt: string; }
export interface OfficeLocation { name: string; address: string; phone?: string; email?: string; mapEmbedUrl?: string; directionsUrl?: string; }
export interface GoogleReview { authorName: string; profilePhotoUrl?: string; rating: number; text: string; relativePublishTimeDescription?: string; publishTime?: string; }
export interface GoogleReviews { rating?: number; userRatingCount?: number; reviews: GoogleReview[]; configured: boolean; }
export interface SocialLink { platform: string; url: string; }

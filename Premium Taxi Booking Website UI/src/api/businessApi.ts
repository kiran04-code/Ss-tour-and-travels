import { request } from "./client";
import type { GalleryImage, GoogleReviews, OfficeLocation, SocialLink } from "./types";
export const businessApi = {
  getGallery: () => request<GalleryImage[]>("/gallery"),
  createGalleryImage: (image: Pick<GalleryImage, "url" | "publicId" | "alt">) => request<GalleryImage>("/gallery", { method: "POST", body: JSON.stringify(image) }),
  deleteGalleryImage: (id: string) => request<null>(`/gallery/${id}`, { method: "DELETE" }),
  getLocation: () => request<OfficeLocation>("/business/location"),
  getGoogleReviews: () => request<GoogleReviews>("/business/google-reviews"),
  getSocialLinks: () => request<SocialLink[]>("/business/social-links"),
};

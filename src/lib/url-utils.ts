// Base URL for the platform
const BASE_URL = import.meta.env.PROD ? "https://pushnshop.com" : window.location.origin;

export const generateLinkSlotUrl = (slotNumber: number): string => {
  return `${BASE_URL}/P${slotNumber}`;
};

export const generateProductUrl = (productId: string): string => {
  return `${BASE_URL}/products/${productId}`;
};

export const isLinkSlotUrl = (path: string): boolean => {
  return /^\/P\d+$/.test(path);
};

export const getLinkSlotNumber = (path: string): number | null => {
  const match = path.match(/^\/P(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};
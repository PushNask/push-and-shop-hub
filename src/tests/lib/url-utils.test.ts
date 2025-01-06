import { describe, it, expect } from "vitest";
import { 
  generateLinkSlotUrl, 
  generateProductUrl, 
  isLinkSlotUrl,
  getLinkSlotNumber 
} from "@/lib/url-utils";

describe("URL Utilities", () => {
  describe("generateLinkSlotUrl", () => {
    it("generates correct link slot URL", () => {
      expect(generateLinkSlotUrl(1)).toMatch(/\/P1$/);
      expect(generateLinkSlotUrl(120)).toMatch(/\/P120$/);
    });
  });

  describe("generateProductUrl", () => {
    it("generates correct product URL", () => {
      expect(generateProductUrl("123")).toMatch(/\/products\/123$/);
    });
  });

  describe("isLinkSlotUrl", () => {
    it("returns true for valid link slot URLs", () => {
      expect(isLinkSlotUrl("/P1")).toBe(true);
      expect(isLinkSlotUrl("/P120")).toBe(true);
    });

    it("returns false for invalid link slot URLs", () => {
      expect(isLinkSlotUrl("/products/123")).toBe(false);
      expect(isLinkSlotUrl("/P0")).toBe(false);
      expect(isLinkSlotUrl("/P121")).toBe(false);
      expect(isLinkSlotUrl("/P1a")).toBe(false);
    });
  });

  describe("getLinkSlotNumber", () => {
    it("returns correct slot number for valid URLs", () => {
      expect(getLinkSlotNumber("/P1")).toBe(1);
      expect(getLinkSlotNumber("/P120")).toBe(120);
    });

    it("returns null for invalid URLs", () => {
      expect(getLinkSlotNumber("/products/123")).toBe(null);
      expect(getLinkSlotNumber("/P0")).toBe(null);
      expect(getLinkSlotNumber("/P121")).toBe(null);
      expect(getLinkSlotNumber("/P1a")).toBe(null);
    });
  });
});
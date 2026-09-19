/**
 * Parsed from the Yotpo widget container object.
 */
export type WidgetInstance = {
  className:
    | "ReviewsMainWidget"
    | "ReviewsStarRatingsWidget"
    | "ReviewsSeoPage"
    | "PromotedProducts"
    | "ReviewsCarousel"
    | "ReviewsTab"
    | "LegacyReviewHighlights"
    | "LegacyYotpoBadge"
    | "LegacyEmbeddedWidget";
  instanceId: string;
};

export type WidgetData = {
  typeId: string;
  className: WidgetInstance["className"];
  classDisplayName: string;
  variantDisplayName: string;
  isLegacy: boolean;
  instanceId: string;
};

/**
 * Just basic product data that we can easily get from Yotpo API without
 * any authentication mechanism.
 */
export type SimpleProductData = {
  isFound: boolean;
  yotpoInternalId: string;
  productId: string;
  name: string;
  url: string;
};

/**
 * The current store context. We've de-coupled this to provide a unified interface
 * for storing, retrieving, and refreshing the appKey and productId values.
 */
export type Store = {
  isLoading: () => Promise<boolean>;
  appKey: string;
  productId: string;
  isValid: () => boolean;
  setSession: (appKey: string, productId: string) => void;
};

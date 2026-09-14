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
    | "QuestionsAndAnswers"
    | "ReviewsTab";
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

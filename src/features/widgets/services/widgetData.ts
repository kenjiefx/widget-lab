import { WidgetInstance, WidgetData } from "../../../types";

export function mapWidgetInstanceToWidgetData(
  widgetInstance: WidgetInstance,
): Array<WidgetData> {
  if (widgetInstance.className === "ReviewsMainWidget") {
    return [
      {
        typeId: "1",
        classDisplayName: "Reviews Widget",
        variantDisplayName: "",
        isLegacy: false,
        className: widgetInstance.className,
        instanceId: widgetInstance.instanceId,
      },
    ];
  }
  if (widgetInstance.className === "ReviewsStarRatingsWidget") {
    return [
      {
        typeId: "2",
        classDisplayName: "Star Ratings",
        variantDisplayName: "Product Page",
        isLegacy: false,
        className: widgetInstance.className,
        instanceId: widgetInstance.instanceId,
      },
      {
        typeId: "3",
        classDisplayName: "Star Ratings",
        variantDisplayName: "Collections Page",
        isLegacy: false,
        className: widgetInstance.className,
        instanceId: widgetInstance.instanceId,
      },
    ];
  }
  if (widgetInstance.className === "PromotedProducts") {
    return [
      {
        typeId: "4",
        classDisplayName: "Promoted Products",
        variantDisplayName: "",
        isLegacy: false,
        className: widgetInstance.className,
        instanceId: widgetInstance.instanceId,
      },
    ];
  }
  if (widgetInstance.className === "ReviewsCarousel") {
    return [
      {
        typeId: "5",
        classDisplayName: "Reviews Carousel",
        variantDisplayName: "Home Page",
        isLegacy: false,
        className: widgetInstance.className,
        instanceId: widgetInstance.instanceId,
      },
      {
        typeId: "6",
        classDisplayName: "Reviews Carousel",
        variantDisplayName: "Product Page",
        isLegacy: false,
        className: widgetInstance.className,
        instanceId: widgetInstance.instanceId,
      },
    ];
  }
  if (widgetInstance.className === "ReviewsTab") {
    return [
      {
        typeId: "8",
        classDisplayName: "Reviews Tab",
        variantDisplayName: "",
        isLegacy: false,
        className: widgetInstance.className,
        instanceId: widgetInstance.instanceId,
      },
      {
        typeId: "9",
        classDisplayName: "Reviews Tab",
        variantDisplayName: "Product Specific",
        isLegacy: false,
        className: widgetInstance.className,
        instanceId: widgetInstance.instanceId,
      },
    ];
  }
  if (widgetInstance.className === "ReviewsSeoPage") {
    return [
      {
        typeId: "7",
        classDisplayName: "SEO Page Widget",
        variantDisplayName: "",
        isLegacy: false,
        className: widgetInstance.className,
        instanceId: widgetInstance.instanceId,
      },
    ];
  }
  return [];
}

export function getLegacyWidgetData(): Array<WidgetData> {
  return [
    {
      typeId: "20",
      classDisplayName: "Reviews Widget",
      variantDisplayName: "",
      isLegacy: true,
      className: "ReviewsMainWidget",
      instanceId: "not-applicable",
    },
    {
      typeId: "21",
      classDisplayName: "Star Ratings",
      variantDisplayName: "",
      isLegacy: true,
      className: "ReviewsStarRatingsWidget",
      instanceId: "not-applicable",
    },
    {
      typeId: "22",
      classDisplayName: "Reviews Carousel",
      variantDisplayName: "",
      isLegacy: true,
      className: "ReviewsCarousel",
      instanceId: "not-applicable",
    },
    {
      typeId: "23",
      classDisplayName: "Review Highlights",
      variantDisplayName: "",
      isLegacy: true,
      className: "LegacyReviewHighlights",
      instanceId: "not-applicable",
    },
    {
      typeId: "24",
      classDisplayName: "SEO Page Widget",
      variantDisplayName: "",
      isLegacy: true,
      className: "ReviewsSeoPage",
      instanceId: "not-applicable",
    },
    {
      typeId: "25",
      classDisplayName: "Yotpo Badge",
      variantDisplayName: "",
      isLegacy: true,
      className: "LegacyYotpoBadge",
      instanceId: "not-applicable",
    },
    {
      typeId: "26",
      classDisplayName: "Embedded Widget",
      variantDisplayName: "",
      isLegacy: true,
      className: "LegacyEmbeddedWidget",
      instanceId: "not-applicable",
    },
  ];
}

export function getWidgetDataByTypeId(typeId: string): WidgetData | null {
  const widgetData: Array<WidgetData> = getLegacyWidgetData();
  const classNames: Array<WidgetInstance["className"]> = [
    "ReviewsMainWidget",
    "ReviewsStarRatingsWidget",
    "ReviewsCarousel",
    "LegacyReviewHighlights",
    "ReviewsSeoPage",
    "PromotedProducts",
    "ReviewsTab",
  ];
  for (const className of classNames) {
    const widgetInstance = mapWidgetInstanceToWidgetData({
      className,
      instanceId: "dummy",
    });
    widgetData.push(...widgetInstance);
  }
  for (const widget of widgetData) {
    if (widget.typeId === typeId) {
      return widget;
    }
  }
  return null;
}

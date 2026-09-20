(function () {
  window.__WDGCONF = {
    getWidgetHTML: function (appKey, productId, widgetId, widgetTypeId) {
      if (widgetTypeId === "1") {
        return `<div class="yotpo-widget-instance" data-yotpo-instance-id="${widgetId}" data-yotpo-product-id="${productId}"></div>`;
      }
      if (widgetTypeId === "2") {
        return `<div class="yotpo-widget-instance" data-yotpo-instance-id="${widgetId}" data-yotpo-product-id="${productId}" data-yotpo-cart-product-id="${productId}" data-yotpo-section-id="product"></div>`;
      }
      if (widgetTypeId === "3") {
        return `<div class="yotpo-widget-instance" data-yotpo-instance-id="${widgetId}" data-yotpo-product-id="${productId}" data-yotpo-cart-product-id="${productId}" data-yotpo-section-id="collection"></div>`;
      }
      if (widgetTypeId === "4") {
        return `<div class="yotpo-widget-instance" data-yotpo-instance-id="${widgetId}" data-yotpo-product-id="${productId}"></div>`;
      }
      if (widgetTypeId === "5") {
        return `<div class="yotpo-widget-instance" data-yotpo-instance-id="${widgetId}"></div>`;
      }
      if (widgetTypeId === "6") {
        return `<div class="yotpo-widget-instance" data-yotpo-instance-id="${widgetId}" data-yotpo-product-id="${productId}"></div>`;
      }
      if (widgetTypeId === "7") {
        return `<div class="yotpo-widget-instance" data-yotpo-instance-id="${widgetId}"></div>`;
      }
      if (widgetTypeId === "8") {
        return `<div class="yotpo-widget-instance" data-yotpo-instance-id="${widgetId}"></div>`;
      }
      if (widgetTypeId === "9") {
        return `<div class="yotpo-widget-instance" data-yotpo-instance-id="${widgetId}" data-yotpo-product-id="${productId}"></div>`;
      }
      if (widgetTypeId === "20") {
        return `<div class="yotpo yotpo-main-widget" data-product-id="${productId}"></div>`;
      }
      if (widgetTypeId === "21") {
        return `<div class="yotpo bottomLine" data-product-id="${productId}"></div>`;
      }
      if (widgetTypeId === "22") {
        return `<div class="yotpo yotpo-reviews-carousel" data-background-color="transparent"  data-mode="top_rated"  data-type="both"  data-count="6"  data-show-bottomline="1"  data-autoplay-enabled="1"  data-autoplay-speed="3000"  data-show-navigation="1">&nbsp;</div>`;
      }
      if (widgetTypeId === "23") {
        return `<div class="yotpo yotpo-shoppers-say" data-product-id="${productId}">&nbsp;</div>`;
      }
      if (widgetTypeId === "24") {
        return `<div id="yotpo-testimonials-custom-tab"></div>`;
      }
      if (widgetTypeId === "25") {
        return `<div id="y-badges" class="yotpo yotpo-badge badge-init"></div>`;
      }
      if (widgetTypeId === "26") {
        return `<div id="y-embedded-widget" class="yotpo embedded-widget" data-product-id="top_rated_products" data-layout="basic" data-width="100" data-reviews="5" data-header-text="Top Rated Products" data-header-background-color="919191" data-body-background-color="FFFFFF" data-font-size="18" data-font-color="FFFFFF">&nbsp;</div>`;
      }
      return "";
    },
  };
})();

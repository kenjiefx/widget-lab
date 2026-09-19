(function () {
  function renderErrorInWidgetContainer(errorMessage) {
    document.querySelector("#widget_container").innerHTML =
      `<div class="yotpo-widget-error">${errorMessage}</div>`;
  }
  window.onPreviewInit = function (renderInWidgetContainer) {
    const appKey = new URLSearchParams(window.location.search).get("appKey");
    if (!appKey || appKey.trim() === "") {
      renderErrorInWidgetContainer("Missing appKey parameter");
      return;
    }
    const productId = new URLSearchParams(window.location.search).get(
      "productId",
    );
    if (!productId || productId.trim() === "") {
      renderErrorInWidgetContainer("Missing productId parameter");
      return;
    }
    const widgetId = new URLSearchParams(window.location.search).get(
      "widgetId",
    );
    if (!widgetId || widgetId.trim() === "") {
      renderErrorInWidgetContainer("Missing widgetId parameter");
      return;
    }
    const widgetTypeId = new URLSearchParams(window.location.search).get(
      "widgetTypeId",
    );
    if (!widgetTypeId || widgetTypeId.trim() === "") {
      renderErrorInWidgetContainer("Missing widgetTypeId parameter");
      return;
    }
    const widgetHTML = renderInWidgetContainer(
      appKey,
      productId,
      widgetId,
      widgetTypeId,
    );
    document.querySelector("#widget_container").innerHTML = widgetHTML;
    const isLegacy = Number(widgetTypeId) >= 20;
    if (!isLegacy) {
      var e = document.createElement("script");
      ((e.type = "text/javascript"),
        (e.async = true),
        (e.src = `//cdn-widgetsrepository.yotpo.com/v1/loader/${appKey}`));
      var t = document.getElementsByTagName("script")[0];
      t.parentNode.insertBefore(e, t);
    } else {
      var e = document.createElement("script");
      ((e.type = "text/javascript"),
        (e.async = true),
        (e.src = `//staticw2.yotpo.com/${appKey}/widget.js?v2enforce=true`));
      var t = document.getElementsByTagName("script")[0];
      t.parentNode.insertBefore(e, t);
    }
  };
})();

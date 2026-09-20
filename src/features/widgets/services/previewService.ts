export function generatePreviewUrl(p: {
  appKey: string;
  productId: string;
  widgetId: string;
  widgetTypeId: string;
  language: string;
  reloadKey: string;
}) {
  const { appKey, productId, widgetId, widgetTypeId, language, reloadKey } = p;
  const params = new URLSearchParams({
    appKey,
    productId,
    widgetId,
    widgetTypeId,
    lang: language,
    _r: reloadKey.toString(),
  });
  return `/widgets/preview.html?${params.toString()}`;
}

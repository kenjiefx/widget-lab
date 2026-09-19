export function generatePreviewUrl(p: {
  appKey: string;
  productId: string;
  widgetId: string;
  widgetTypeId: string;
  reloadKey: string;
}) {
  const { appKey, productId, widgetId, widgetTypeId, reloadKey } = p;
  const params = new URLSearchParams({
    appKey,
    productId,
    widgetId,
    widgetTypeId,
    _r: reloadKey.toString(),
  });
  return `/widgets/preview.html?${params.toString()}`;
}

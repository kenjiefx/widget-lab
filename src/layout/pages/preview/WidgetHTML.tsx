import HTMLCodeBlock from "../../../features/code/html/HTMLCodeBlock";
import { getWidgetDataByTypeId } from "../../../features/widgets/services/widgetData";

type Props = {
  appKey: string;
  productId: string;
  widgetId: string;
  widgetTypeId: string;
};

export default function WidgetHTML({
  appKey,
  productId,
  widgetId,
  widgetTypeId,
}: Props) {
  const widgetHTML: string =
    typeof window !== "undefined" && window.__WDGCONF?.getWidgetHTML
      ? window.__WDGCONF.getWidgetHTML(
          appKey,
          productId,
          widgetId,
          widgetTypeId,
        )
      : "";

  const widgetData = getWidgetDataByTypeId(widgetTypeId);

  function generateLoaderComment() {
    return `<!-- Loader -->`;
  }

  function generateCommentTitle() {
    if (widgetData) {
      if (widgetData.variantDisplayName !== "") {
        return `<!-- ${widgetData.classDisplayName} - ${widgetData.variantDisplayName} ${widgetData.isLegacy ? "(Legacy)" : ""} -->`;
      }
      return `<!-- ${widgetData.classDisplayName} ${widgetData.isLegacy ? "(Legacy)" : ""} -->`;
    }
    return "";
  }

  function generateWidgetLoaderScript() {
    if (widgetData) {
      if (!widgetData.isLegacy) {
        return `<script type="text/javascript" src="https://cdn-widgetsrepository.yotpo.com/v1/loader/${appKey}"></script>`;
      } else {
        return `<script type="text/javascript">
  (function e(){
    var e=document.createElement("script");
    e.type="text/javascript",
    e.async=true,
    e.src="//staticw2.yotpo.com/${appKey}/widget.js?v2enforce=true";
    var t=document.getElementsByTagName("script")[0];
    t.parentNode.insertBefore(e,t)
  })();
</script>`;
      }
    }
    return "";
  }
  const loaderComment = generateLoaderComment();
  const loaderScript = generateWidgetLoaderScript();
  const commentTitle = generateCommentTitle();
  const currentCode = [loaderComment, loaderScript, commentTitle, widgetHTML]
    .filter(Boolean)
    .join("\n");

  return <HTMLCodeBlock htmlCode={currentCode} filename={`widget.html`} />;
}

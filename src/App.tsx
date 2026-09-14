import { useEffect, useState } from "react";
import Header from "./layout/Header";
import StartPage from "./layout/StartPage";
import getWidgetInstanceIds from "./features/loader/services/getWidgetInstanceIds";
import { WidgetInstance } from "./types";
import WidgetPreviewContainer from "./features/widgets/components/WidgetPreviewContainer";
import PreviewPage from "./layout/PreviewPage";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [widgetInstanceId, setWidgetInstanceId] = useState<string | null>(null);
  const [widgetInstances, setWidgetInstances] = useState<WidgetInstance[]>([]);
  const urlParams = new URLSearchParams(window.location.search);
  const appKey = urlParams.get("appKey") || "";
  const productId = urlParams.get("productId") || "";
  const widgetType = urlParams.get("widget") || "ReviewsMainWidget";
  useEffect(() => {
    async function fetchWidgets() {
      setIsLoading(true);
      if (appKey === "" || productId === "") {
        setIsLoading(false);
        return;
      }
      const widgetInstances = await getWidgetInstanceIds({ appKey });
      const targetInstance = widgetInstances.find(
        (widget) => widget.className === widgetType,
      );
      console.log("Target widget instance:", targetInstance);
      if (targetInstance) {
        setWidgetInstanceId(targetInstance.instanceId);
      }
      setWidgetInstances(widgetInstances);
      setIsLoading(false);
    }
    fetchWidgets();
  }, []);
  const isPreviewPage = appKey !== "" && productId !== "";
  return (
    <div className="App">
      <Header />
      {isPreviewPage ? (
        <main>
          <PreviewPage
            appKey={appKey}
            productId={productId}
            widgetId={widgetInstanceId || ""}
            widgetType={widgetType}
            widgetInstances={widgetInstances}
          />
        </main>
      ) : (
        <main>
          <StartPage />
        </main>
      )}
    </div>
  );
}

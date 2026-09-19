import { useEffect, useState } from "react";
import Header from "./layout/Header";
import StartPage from "./layout/StartPage";
import getWidgetInstanceIds from "./features/loader/services/getWidgetInstanceIds";
import { WidgetData, WidgetInstance } from "./types";
import WidgetPreviewContainer from "./features/widgets/components/WidgetPreviewContainer";
import PreviewPage from "./layout/PreviewPage";
import useStoreContext from "./features/store/hooks/useStoreContext";
import {
  getLegacyWidgetData,
  mapWidgetInstanceToWidgetData,
} from "./features/widgets/services/widgetData";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [widgetInstanceId, setWidgetInstanceId] = useState<string | null>(null);
  const [widgetData, setWidgetData] = useState<WidgetData[]>([]);
  const { appKey, productId } = useStoreContext();
  const urlParams = new URLSearchParams(window.location.search);
  const widgetType = "ReviewsMainWidget";
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
      if (targetInstance) {
        setWidgetInstanceId(targetInstance.instanceId);
      }
      const allWidgetData: WidgetData[] = [];
      for (const instance of widgetInstances) {
        const widgetData = mapWidgetInstanceToWidgetData(instance);
        if (widgetData.length === 0) {
          continue;
        }
        allWidgetData.push(...widgetData);
      }
      const legacyWidgets = getLegacyWidgetData();
      setWidgetData([...allWidgetData, ...legacyWidgets]);
      setIsLoading(false);
    }
    fetchWidgets();
  }, []);
  const isPreviewPage = appKey !== "" && productId !== "";
  return (
    <div className="App">
      <Header isPreviewPage={isPreviewPage} />
      {isPreviewPage ? (
        <main>
          <PreviewPage
            appKey={appKey}
            productId={productId}
            widgetId={widgetInstanceId || ""}
            widgetTypeId={"1"}
            widgetType={widgetType}
            widgetData={widgetData}
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

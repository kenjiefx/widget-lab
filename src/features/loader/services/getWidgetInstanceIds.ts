import { WidgetInstance } from "../../../types";

export default function getWidgetInstanceIds({
  appKey,
}: {
  appKey: string;
}): Promise<Array<WidgetInstance>> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `/loader/bridge.html?appKey=${appKey}`;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "LOADER_BRIDGE_SUCCESS") {
        cleanup();
        resolve(event.data.instances);
      } else if (event.data?.type === "LOADER_BRIDGE_ERROR") {
        cleanup();
        reject(new Error(event.data.error));
      }
    };

    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
    };

    // Set fallback timeout if iframe fails or hangs
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Yotpo iframe extraction timed out"));
    }, 5000);

    window.addEventListener("message", handleMessage);
    document.body.appendChild(iframe);
  });
}

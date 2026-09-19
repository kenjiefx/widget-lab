import { useEffect, useState } from "react";
import { SimpleProductData } from "../../../types";

export function useProductSimpleDataGetter(p: {
  appKey: string;
  productId: string;
}) {
  const { appKey, productId } = p;
  const apiUrl = `https://api-cdn.yotpo.com/v3/storefront/store/${appKey}/product/${productId}/reviews`;
  const [data, setData] = useState<SimpleProductData>({
    isFound: false,
    yotpoInternalId: "",
    productId: "",
    name: "",
    url: "",
    imageUrl: "",
  });

  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (undefined === result || null === result) {
        throw new Error("Invalid response data");
      }
      if (!(typeof result === "object")) {
        throw new Error("Invalid response data type");
      }
      if (!("products" in result)) {
        throw new Error("Missing 'products' field in response");
      }
      if (!Array.isArray(result.products)) {
        throw new Error("'products' field is not an array");
      }
      for (let i = 0; i < result.products.length; i++) {
        const product = result.products[i];
        if (product.domainKey === productId) {
          setData({
            isFound: true,
            productId: product.domainKey,
            yotpoInternalId: product.id,
            name: product.name,
            url: product.productLink,
            imageUrl: product.imageLink,
          });
          return;
        }
      }
      setData({
        isFound: false,
        yotpoInternalId: "",
        productId: "",
        name: "",
        url: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (undefined === appKey || null === appKey || "" === appKey) {
      setIsLoading(false);
      return;
    }
    if (undefined === productId || null === productId || "" === productId) {
      setIsLoading(false);
      return;
    }
    fetchData();
  }, []);
  return { simpleProductData: data, isLoading };
}

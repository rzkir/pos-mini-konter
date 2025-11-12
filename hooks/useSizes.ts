import { useCallback, useEffect, useState } from "react";

import { ProductSizeService } from "@/services/productSizeService";

export const useSizes = () => {
  const [sizes, setSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSizes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductSizeService.getAll();
      setSizes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sizes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSizes();
  }, [fetchSizes]);

  return {
    sizes,
    loading,
    error,
    refreshSizes: fetchSizes,
  };
};

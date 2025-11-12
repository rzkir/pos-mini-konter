import { useCallback, useEffect, useState } from "react";

import { SupplierService } from "@/services/supplierService";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SupplierService.getAll();
      setSuppliers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch suppliers"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return {
    suppliers,
    loading,
    error,
    refreshSuppliers: fetchSuppliers,
  };
};

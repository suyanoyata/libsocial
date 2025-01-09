import { useFiltersStore } from "@/features/catalog/hooks/useFiltersStore";
import { useEffect, useState } from "react";

export const useAddToFilters = (filterKey: "genres") => {
  const [id, setId] = useState(0);
  const { filters, setFilters } = useFiltersStore();

  useEffect(() => {
    if (id == 0) return;
    if (filters[filterKey].includes(id)) {
      setFilters({
        ...filters,
        [filterKey]: filters[filterKey].filter((item) => item !== id),
      });
      return;
    }
    setFilters({
      ...filters,
      [filterKey]: [...filters[filterKey], id],
    });
  }, [id]);

  return { setId };
};

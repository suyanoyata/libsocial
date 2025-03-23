import { siteIds } from "@/const/site-fields";
import { Title } from "@/features/shared/types/title";
import { api } from "@/lib/axios";
import { useProperties } from "@/store/use-properties";
import { useQuery } from "@tanstack/react-query";

export const useTitleInfo = (slug_url: string, site: string) => {
  const { siteId } = useProperties();

  const siteProperties = siteIds[siteId];

  return useQuery<Title>({
    queryKey: ["title-info", slug_url, site],
    queryFn: async () => {
      return (
        await api.get(`/${siteProperties.type}/${slug_url}?${siteProperties.fields}`)
      ).data.data;
    },
    enabled: !!slug_url,
  });
};

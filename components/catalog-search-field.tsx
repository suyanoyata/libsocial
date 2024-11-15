import useDebounce from "@/hooks/useDebounce";
import { api, site_id } from "@/lib/axios";
import { Anime } from "@/types/anime.type";
import { useQuery } from "@tanstack/react-query";
import { TextInput } from "react-native";

export const CatalogSearch = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (s: string) => void;
}) => {
  const value = useDebounce(search.trim(), 500);

  useQuery<Anime[]>({
    queryKey: ["search-anime-data", value],

    queryFn: async () => {
      if (value == "") return;
      const response = await api.get(
        `/anime?q=${value}&fields[]=rate_avg&fields[]=rate&fields[]=releaseDate&`,
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 1,
    enabled: !!value,
    refetchOnMount: false,
  });

  useQuery<Anime[]>({
    queryKey: ["search-manga-data", value],

    queryFn: async () => {
      if (value == "") return;
      const response = await api.get(
        `/manga?q=${value}&fields[]=rate_avg&fields[]=rate&fields[]=releaseDate&site_id[]=3&site_id[]=${site_id}`,
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!value,
  });

  return (
    <TextInput
      onChangeText={setSearch}
      value={search}
      placeholderTextColor="rgba(255,255,255,0.6)"
      style={{
        backgroundColor: "rgba(255,255,255,0.1)",
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginHorizontal: 12,
        borderRadius: 6,
        color: "rgba(255,255,255,0.6)",
      }}
      placeholder="Искать"
    />
  );
};

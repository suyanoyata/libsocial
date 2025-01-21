import { Title } from "@/features/shared/types/title";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useTitleInfo = (slug_url: string, site: string) => {
  return useQuery<Title>({
    queryKey: ["title-info", slug_url, site],
    queryFn: async () =>
      (
        await api.get(
          `/manga/${slug_url}?fields[]=background&fields[]=eng_name&fields[]=otherNames&fields[]=summary&fields[]=releaseDate&fields[]=type_id&fields[]=caution&fields[]=views&fields[]=close_view&fields[]=rate_avg&fields[]=rate&fields[]=genres&fields[]=tags&fields[]=teams&fields[]=user&fields[]=franchise&fields[]=authors&fields[]=publisher&fields[]=userRating&fields[]=moderated&fields[]=metadata&fields[]=metadata.count&fields[]=metadata.close_comments&fields[]=manga_status_id&fields[]=chap_count&fields[]=status_id&fields[]=artists&fields[]=format`
        )
      ).data.data,
  });
};

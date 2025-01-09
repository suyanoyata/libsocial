import { useSimilarTitle } from "@/features/title/api/useSimilarTitle";
import { SimilarPlaceholder } from "@/features/title/components/placeholders/similar-placeholder";

export const PendingSimilars = ({ slug_url }: { slug_url: string }) => {
  const { isPending } = useSimilarTitle(slug_url);

  if (isPending) {
    return Array.from({ length: 10 }).map((_, i) => (
      <SimilarPlaceholder key={i} />
    ));
  }
};

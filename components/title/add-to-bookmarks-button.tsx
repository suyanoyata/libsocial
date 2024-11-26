import { Button } from "@/components/button";
import { Plus } from "lucide-react-native";
import i18n from "@/lib/intl";
import { Link } from "expo-router";
import { Queries } from "@/hooks/queries";
import { Conditional } from "../misc/conditional";

export const AddToBookmarksButton = ({
  title,
  color,
  type,
  siteId,
  slug_url,
}: {
  title: string;
  color?: string;
  type: string;
  siteId: string;
  slug_url: string;
}) => {
  const { data: bookmark, isFetching } = Queries.getBookmark(type, slug_url);

  return (
    <Link
      href={{
        pathname: "/pick-bookmark-option",
        params: {
          title,
          type,
          siteId,
          media_slug: slug_url,
        },
      }}
      asChild
    >
      <Button
        style={{
          backgroundColor: color ?? "gray",
          flex: 1,
        }}
        icon={
          bookmark == null && (
            <Plus
              strokeWidth={3}
              size={18}
              color="white"
              fill={!!bookmark ? "white" : "transparent"}
            />
          )
        }
        isPending={isFetching}
      >
        <Conditional conditions={[bookmark == null]}>
          {i18n.t("content.bookmark.add")}
        </Conditional>
        <Conditional conditions={[!!bookmark?.status]}>
          {i18n.t(`bookmarks.${bookmark?.status}`)}
        </Conditional>
      </Button>
    </Link>
  );
};

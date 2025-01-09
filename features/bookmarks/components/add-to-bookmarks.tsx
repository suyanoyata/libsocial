import { Button } from "@/components/ui/button";
import { Conditional } from "@/components/misc/conditional";

import { Plus } from "lucide-react-native";
import { Link } from "expo-router";
import { memo } from "react";

import i18n from "@/lib/intl";
import { useBookmark } from "@/features/bookmarks/api/useBookmark";

export const AddToBookmarksButton = memo(
  ({
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
    const { data: bookmark, isFetching } = useBookmark(type, slug_url);

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
            bookmark?.id == 0 && (
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
          <Conditional conditions={[bookmark?.id == 0]}>
            {i18n.t("content.bookmark.add")}
          </Conditional>
          <Conditional conditions={[bookmark?.id != 0, !!bookmark]}>
            {i18n.t(`bookmarks.${bookmark?.status}`)}
          </Conditional>
        </Button>
      </Link>
    );
  }
);

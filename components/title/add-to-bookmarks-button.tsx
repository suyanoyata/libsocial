import { api } from "@/lib/axios";
import { Button } from "@/components/button";
import { Alert } from "react-native";
import { Bookmark, Plus } from "lucide-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "@/lib/intl";
import { Link } from "expo-router";
import { Queries } from "@/hooks/queries";

export const AddToBookmarksButton = ({
  title,
  color,
  status,
  type,
  slug_url,
}: {
  title: string;
  color?: string;
  status: number;
  type: string;
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
          <Plus
            strokeWidth={3}
            size={18}
            color="white"
            fill={!!bookmark ? "white" : "transparent"}
          />
        }
        isPending={isFetching}
        // onPress={pushBookmark}
      >
        {i18n.t("content.bookmark.add")}
      </Button>
    </Link>
  );
};

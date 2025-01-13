import { Button } from "@/components/ui/button";

import { LogIn, Plus } from "lucide-react-native";
import { Link } from "expo-router";
import { memo } from "react";

import i18n from "@/lib/intl";

import { useBookmark } from "@/features/bookmarks/api/useBookmark";
import { useCurrentUser } from "@/features/users/api/useCurrentUser";

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
    const { data: bookmark, isFetching, isError } = useBookmark(type, slug_url);
    const { isError: isUserError, data } = useCurrentUser();

    const authorized = !isUserError || (!!data && !!data.id);
    const isBookmarkPresent = !!bookmark && bookmark.id !== 0 && !isError;

    if (!authorized) {
      return (
        <Link
          href={{
            pathname: "/auth",
          }}
          asChild
        >
          <Button
            style={{
              backgroundColor: color ?? "gray",
              flex: 1,
              opacity: 1,
            }}
            icon={
              !authorized && <LogIn strokeWidth={3} size={18} color="white" />
            }
            isPending={isFetching}
          >
            Log In
          </Button>
        </Link>
      );
    }

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
            opacity: 1,
          }}
          icon={
            !isBookmarkPresent &&
            authorized && (
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
          {!isBookmarkPresent && authorized && i18n.t("content.bookmark.add")}
          {isBookmarkPresent && i18n.t(`bookmarks.${bookmark?.status}`)}
        </Button>
      </Link>
    );
  }
);

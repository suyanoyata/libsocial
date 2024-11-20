import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";

import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import RenderHtml from "react-native-render-html";
import { Button } from "@/components/button";

import { api } from "@/lib/axios";
import moment from "moment";
import "moment/locale/ru";
import { Conditional } from "../misc/conditional";

type Comment = {
  id: number;
  comment: string;
  created_at: Date;
  created_at_ts: number;
  parent_comment: number | null;
  user: {
    avatar: {
      url: string;
    };
    id: string;
    username: string;
  };
};

const tagsStyles = {
  p: {
    color: "rgba(255,255,255,0.7)",
    margin: 0,
    marginTop: 2,
    marginBottom: 2,
    fontSize: 14,
    lineHeight: 20,
  },
  span: {
    color: "rgba(255,255,255,0.7)",
    margin: 0,
    marginTop: 6,
    marginBottom: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  blockquote: {
    color: "rgba(255,255,255,0.7)",
    margin: 0,
    marginTop: 2,
    marginBottom: 2,
    fontSize: 14,
    lineHeight: 20,
  },
};

const Parser = ({ comment, width }: { comment: string; width: number }) => {
  let content_array = comment.split("");

  if (content_array.includes("<") || content_array.includes(">")) {
    return (
      <RenderHtml
        contentWidth={width}
        defaultTextProps={{
          style: {
            color: "rgba(255,255,255,0.7)",
          },
        }}
        source={{
          // FIXME: not all comments are getting rendered due to \u symbols or sum??
          html: `<p>${comment.toString()}</p>`,
        }}
        tagsStyles={tagsStyles}
      />
    );
  } else {
    <Text
      style={{
        color: "rgba(255,255,255,0.7)",
        marginTop: 6,
        marginBottom: 6,
        fontSize: 14,
        lineHeight: 20,
      }}
    >
      {comment}
    </Text>;
  }
};

export const Comments = ({
  slug_url,
  selected,
  model,
  post_id,
}: {
  slug_url: string;
  selected: string;
  model: string;
  post_id: number;
}) => {
  // #region data handling
  const {
    data: commentsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [`title-comments`, slug_url, post_id],
    queryFn: async ({ pageParam }) => {
      const res = await api.get(
        `/comments?page=${pageParam}&post_id=${post_id}&post_type=${model}&sort_by=id&sort_type=desc`
      );

      return res.data;
    },

    getNextPageParam: (lastPage) => {
      if (lastPage.meta.has_next_page == false) return undefined;
      return lastPage.meta.page + 1;
    },
    initialPageParam: 1,
    enabled: !!slug_url,
    placeholderData: keepPreviousData,
  });

  // #endregion

  const { width } = useWindowDimensions();
  const [displayButton, setDisplayButton] = useState(false);

  const Reply = ({ comment_id }: { comment_id: number | null }) => {
    const [comment, setComment] = useState<Comment>();

    useEffect(() => {
      if (commentsData) {
        commentsData.pages.forEach((page) => {
          page.data.replies.forEach((reply: Comment) => {
            if (reply.parent_comment === comment_id) {
              setComment(reply);
            }
          });
        });
      }
    }, [comment_id]);

    if (!comment) return;

    return <Comment reply={true} comment={comment} />;
  };

  const Comment = ({
    comment,
    reply = false,
  }: {
    comment: Comment;
    reply?: boolean;
  }) => {
    return (
      <View
        style={{
          marginHorizontal: 8,
          borderColor: "rgba(255,255,255,0.3)",
          borderLeftWidth: reply ? 1 : 0,
          paddingLeft: reply ? 12 : 0,
          marginTop: 12,
        }}
      >
        <View
          style={{
            marginLeft: reply ? 16 : 0,
          }}
        >
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Text
              numberOfLines={2}
              style={{ color: "white", fontSize: 18, fontWeight: "600" }}
            >
              {comment.user.username}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.6)",
                fontWeight: "600",
                marginTop: 2,
              }}
            >
              {moment(comment.created_at).fromNow()}
            </Text>
          </View>
          <Parser width={width} comment={comment.comment} />
        </View>
        <Reply comment_id={comment.id} />
      </View>
    );
  };

  useEffect(() => {
    moment.locale("ru");

    const timeout = setTimeout(() => {
      setDisplayButton(true);
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (selected != "comments") return;
  if (isLoading || !commentsData) return null;

  return (
    <ScrollView>
      {commentsData.pages.map((page) => (
        <FlashList
          scrollEnabled={false}
          estimatedItemSize={200}
          data={page.data.root}
          renderItem={({ item }: { item: Comment }) => (
            <Comment comment={item} />
          )}
        />
      ))}
      <Conditional conditions={[!isLoading, hasNextPage, displayButton]}>
        <Button
          style={{ flex: 1, marginHorizontal: 6, marginVertical: 12 }}
          onPress={() => fetchNextPage()}
        >
          Загрузить ещё
        </Button>
      </Conditional>
    </ScrollView>
  );
};

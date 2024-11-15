// TODO: add support for replies

import { api } from "@/lib/axios";
import { Anime } from "@/types/anime.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FlatList, Text, useWindowDimensions, View } from "react-native";
import RenderHtml from "react-native-render-html";

type CommentsResponse = {
  root: Comment[];
  replies: Comment[];
};

type Comment = {
  id: number;
  comment: string;
  createdAt: Date;
  parent_comment: number | null;
  user: {
    avatar: {
      url: string;
    };
    id: string;
    username: string;
  };
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
  const [page, setPage] = useState<number>(1);

  const { data: commentsData, isLoading } = useQuery<CommentsResponse>({
    queryKey: [`title-comments`, slug_url, page, model],
    queryFn: async () => {
      const res = await api.get(
        `/comments?page=${page}&post_id=${post_id}&post_type=${model}&sort_by=id&sort_type=desc`
      );

      return res.data.data;
    },
    enabled: !!slug_url,
    placeholderData: keepPreviousData,
  });

  const Parser = ({ comment }: { comment: string }) => {
    let content_array = comment.split("");

    if (content_array.includes("<") || content_array.includes(">")) {
      return (
        <RenderHtml
          contentWidth={width}
          source={{
            html: `<p>${comment}</p>`,
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

  const { width } = useWindowDimensions();

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
      marginTop: 6,
      marginBottom: 6,
      fontSize: 14,
      lineHeight: 20,
    },
  };

  const Reply = ({ comment_id }: { comment_id: number | null }) => {
    const [comment, setComment] = useState<Comment>();

    useEffect(() => {
      commentsData!.replies.forEach((reply) => {
        if (reply.parent_comment === comment_id) {
          setComment(reply);
        }
      });
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
          <Text
            numberOfLines={2}
            style={{ color: "white", fontSize: 18, fontWeight: "600" }}
          >
            {comment.user.username}
          </Text>
          {/* <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              marginTop: 6,
              marginBottom: 6,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            {comment.comment}
          </Text> */}
          <Parser comment={comment.comment} />
        </View>
        <Reply comment_id={comment.id} />
      </View>
    );
  };

  if (selected != "Комментарии") return;

  return (
    !isLoading && (
      <FlatList
        onEndReached={() => {
          console.log("hit end");
        }}
        onEndReachedThreshold={1}
        // add pagination, for now setting onEndReached page + 1 makes spamming request
        data={commentsData!.root}
        renderItem={({ item, index }) => <Comment key={index} comment={item} />}
        style={{
          gap: 8,
          marginBottom: 24,
        }}
      />
    )
  );
};

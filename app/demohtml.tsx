import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import RenderHtml, { HTMLSource } from "react-native-render-html";

export default function index() {
  const [content, setContent] = useState<HTMLSource>();

  const { width } = useWindowDimensions();

  useEffect(() => {
    api
      .get(
        "/manga/39562--otonari-no-tenshi-sama-ni-itsu-no-ma-ni-ka-dame-ningen-ni-sareteita-ken-wn/chapter?number=1&volume=1",
      )
      .then((response) => {
        let source = {
          html: response.data.data.content,
        };
        setContent(source);
      });
  }, []);

  const tagsStyles = {
    p: {
      color: "#fff",
      margin: 0,
      marginTop: 6,
      marginBottom: 6,
      lineHeight: 22,
    },
  };

  if (!content) return;

  return (
    <ScrollView>
      <RenderHtml
        contentWidth={width}
        source={content}
        tagsStyles={tagsStyles}
      />
    </ScrollView>
  );
}

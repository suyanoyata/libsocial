import { ModalWrapper } from "@/components/filters/modal-wrapper";
import { Search } from "lucide-react-native";
import { useState } from "react";

import Tab from "@/components/title/tab.component";
import { ScrollView, TextInput, View, Text, Pressable } from "react-native";

import i18n from "@/lib/intl";
import { api, site_id } from "@/lib/axios";

import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/useDebounce";
import { store, TitleColors } from "@/hooks/useStore";
import { Conditional } from "@/components/misc/conditional";
import { Link, useNavigation } from "expo-router";
import Animated, { FadeOut } from "react-native-reanimated";
import { Anime } from "@/types/anime.type";
import { Image } from "expo-image";
import { getTitle, siteUrls } from "@/constants/app.constants";
import { app } from "@/hooks/useSettings";

const quickSearchTabs = [
  {
    label: i18n.t("quick_search.tabs.titles"),
    value: site_id != 5 ? "manga" : "anime",
  },
  {
    label: i18n.t("quick_search.tabs.teams"),
    value: "teams",
  },
  {
    label: i18n.t("quick_search.tabs.characters"),
    value: "character",
  },
];

const quickSearchFields = {
  titles: "fields[]=rate_avg&fields[]=rate&fields[]=releaseDate",
  teams: "",
  character: "",
};

const Input = ({ setInput }: { setInput: (st: string) => void }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 12,
        padding: 10,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: "rgb(70,70,70)",
      }}
    >
      <Search color="rgb(70,70,70)" size={18} strokeWidth={2.8} />
      <TextInput
        autoFocus
        onChangeText={setInput}
        placeholder={i18n.t("search.quick")}
        placeholderTextColor="rgb(70,70,70)"
        style={{
          fontWeight: "500",
          color: "rgb(70,70,70)",
        }}
      />
    </View>
  );
};

const TabSwitcher = ({
  appTheme,
  selectedTab,
  setSelectedTab,
}: {
  appTheme: TitleColors;
  selectedTab: string;
  setSelectedTab: (st: string) => void;
}) => {
  return (
    <View
      style={{
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgb(70,70,70)",
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 12,
        }}
      >
        {quickSearchTabs.map((tab) => (
          <Tab
            key={tab.value}
            noFlex
            accent={appTheme}
            value={tab.value}
            selected={selectedTab}
            setSelected={setSelectedTab}
          >
            {tab.label}
          </Tab>
        ))}
      </ScrollView>
    </View>
  );
};

export default function QuickSearch() {
  const { settings } = app();
  const router: any = useNavigation();

  const [selectedTab, setSelectedTab] = useState(quickSearchTabs[0].value);
  const [input, setInput] = useState("");
  const value = useDebounce(input.trim(), 750);

  const { data, isError } = useQuery<Anime[]>({
    queryKey: ["quick-search", value, selectedTab],
    // prettier-ignore
    queryFn: async () => {
      if (value == "") return null;
      return (await api.get(`/${selectedTab}?${quickSearchFields[selectedTab as keyof typeof quickSearchFields]}&q=${value}`)).data.data
    },
    retry: 1,
  });

  return (
    <ModalWrapper scrollable={false} title={i18n.t("search.quick")}>
      <Input setInput={setInput} />
      <TabSwitcher
        appTheme={settings.appTheme}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <Conditional conditions={[input == "", data == null]}>
        <Animated.View
          exiting={FadeOut}
          style={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80%",
          }}
        >
          <Text style={{ color: "white" }}>
            {i18n.t("quick_search.messages.empty_search.label")}
            <Link style={{ height: 13 }} href="/search" asChild>
              <Pressable
                onPress={() => {
                  router.goBack();
                }}
              >
                <Text style={{ color: settings.appTheme.tabSelector }}>
                  {i18n.t("quick_search.messages.empty_search.link")}
                </Text>
              </Pressable>
            </Link>
          </Text>
        </Animated.View>
      </Conditional>
      <Conditional conditions={[!data, isError]}>
        <Animated.View
          exiting={FadeOut}
          style={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80%",
          }}
        >
          <Text style={{ color: "white" }}>
            {i18n.t("error.loading.network")}
          </Text>
        </Animated.View>
      </Conditional>
      <Conditional conditions={[!!data]}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 220,
            paddingHorizontal: 12,
            gap: 12,
            marginTop: 16,
          }}
        >
          {data?.map((item) => (
            <Pressable
              onPress={() => {
                router.goBack();
                router.navigate("title-details", {
                  type: item.site,
                  slug_url: `${siteUrls[item.site as keyof typeof siteUrls].url}/${item.slug_url}`,
                });
              }}
              style={{
                flexDirection: "row",
                gap: 8,
                backgroundColor: "rgba(250,250,250,0.06)",
                overflow: "hidden",
                borderRadius: 6,
                paddingRight: 8,
              }}
            >
              <Image
                source={{ uri: item.cover.default }}
                style={{ width: 90, height: 120, borderRadius: 6 }}
                contentFit="cover"
              />
              <View style={{ paddingVertical: 4, flex: 1 }}>
                <Text style={{ color: "rgb(171,171,171)", fontWeight: "500" }}>
                  {item?.status?.label}
                </Text>
                <Text style={{ color: "white", flex: 1, marginTop: 8 }}>
                  {getTitle(item)}
                </Text>
                <View style={{ marginTop: "auto" }}>
                  <Text
                    style={{ color: "rgb(171,171,171)", fontWeight: "500" }}
                  >
                    {item?.type?.label} • {item?.releaseDateString}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </Conditional>
    </ModalWrapper>
  );
}

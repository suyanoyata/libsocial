import { TitleColors } from "@/hooks/useStore";
import * as Localization from "expo-localization";

export const siteUrls = {
  "1": {
    route: "manga",
    url: "manga",
    fields:
      "fields[]=background&fields[]=eng_name&fields[]=otherNames&fields[]=summary&fields[]=releaseDate&fields[]=type_id&fields[]=caution&fields[]=views&fields[]=close_view&fields[]=rate_avg&fields[]=rate&fields[]=genres&fields[]=tags&fields[]=teams&fields[]=franchise&fields[]=authors&fields[]=publisher&fields[]=userRating&fields[]=moderated&fields[]=metadata&fields[]=metadata.count&fields[]=metadata.close_comments&fields[]=manga_status_id&fields[]=chap_count&fields[]=status_id&fields[]=artists&fields[]=format",
  },
  "2": {
    route: "manga",
    url: "manga",
    fields:
      "fields[]=background&fields[]=eng_name&fields[]=otherNames&fields[]=summary&fields[]=releaseDate&fields[]=type_id&fields[]=caution&fields[]=views&fields[]=close_view&fields[]=rate_avg&fields[]=rate&fields[]=genres&fields[]=tags&fields[]=teams&fields[]=franchise&fields[]=authors&fields[]=publisher&fields[]=userRating&fields[]=moderated&fields[]=metadata&fields[]=metadata.count&fields[]=metadata.close_comments&fields[]=manga_status_id&fields[]=chap_count&fields[]=status_id&fields[]=artists&fields[]=format",
  },
  "3": {
    route: "novel",
    url: "manga",
    fields:
      "fields[]=background&fields[]=eng_name&fields[]=otherNames&fields[]=summary&fields[]=releaseDate&fields[]=type_id&fields[]=caution&fields[]=views&fields[]=close_view&fields[]=rate_avg&fields[]=rate&fields[]=genres&fields[]=tags&fields[]=teams&fields[]=franchise&fields[]=authors&fields[]=publisher&fields[]=userRating&fields[]=moderated&fields[]=metadata&fields[]=metadata.count&fields[]=metadata.close_comments&fields[]=manga_status_id&fields[]=chap_count&fields[]=status_id&fields[]=artists&fields[]=format",
  },
  "4": {
    route: "manga",
    url: "manga",
    fields:
      "fields[]=background&fields[]=eng_name&fields[]=otherNames&fields[]=summary&fields[]=releaseDate&fields[]=type_id&fields[]=caution&fields[]=views&fields[]=close_view&fields[]=rate_avg&fields[]=rate&fields[]=genres&fields[]=tags&fields[]=teams&fields[]=franchise&fields[]=authors&fields[]=publisher&fields[]=userRating&fields[]=moderated&fields[]=metadata&fields[]=metadata.count&fields[]=metadata.close_comments&fields[]=manga_status_id&fields[]=chap_count&fields[]=status_id&fields[]=artists&fields[]=format",
  },
  "5": {
    route: "anime",
    url: "anime",
    fields:
      "fields[]=background&fields[]=eng_name&fields[]=otherNames&fields[]=summary&fields[]=releaseDate&fields[]=type_id&fields[]=caution&fields[]=views&fields[]=close_view&fields[]=rate_avg&fields[]=rate&fields[]=genres&fields[]=tags&fields[]=teams&fields[]=franchise&fields[]=authors&fields[]=publisher&fields[]=userRating&fields[]=moderated&fields[]=metadata&fields[]=metadata.count&fields[]=metadata.close_comments&fields[]=anime_status_id&fields[]=time&fields[]=episodes&fields[]=episodes_count&fields[]=episodesSchedule&fields[]=shiki_rate",
  },
};

/*
  1 mangalib
  2 . . .
  3 ranobelib
  4 . . .
  5 animelib
*/

export const colors: TitleColors[] = [
  {
    primary: "#ef6c00",
    tabSelector: "#ffab40",
    showMore: "#f29766",
  },
  {
    primary: "black",
    tabSelector: "white",
    showMore: "white",
  },
  {
    primary: "#1665c0",
    tabSelector: "#42a5f5",
    showMore: "#448aff",
  },
  {
    primary: "#b71d1c",
    tabSelector: "#ef5350",
    showMore: "#ef5350",
  },
  {
    primary: "#5e35b1",
    tabSelector: "#9575cd",
    showMore: "#b388ff",
  },
];

export const title_kinds = {
  1: "Манга",
  2: "Манга",
  3: "Новелла",
  4: "Манга",
  5: "Аниме",
};

export const exclude_filters = [
  "этти",
  "юри",
  "яой",
  "гарем",
  "безумие",
  "гендерная интрига",
];

export const presentation_mode = true;

export const useRussianTitle = () => {
  if (!presentation_mode) return true;
  return Localization.getLocales()[0].languageCode === "ru";
};

export const getTitle = (item: {
  name: string;
  rus_name?: string;
  otherNames?: string[];
  eng_name?: string;
}) => {
  if (useRussianTitle()) {
    return item.rus_name ?? item.name;
  } else {
    if (item.eng_name !== "") {
      return item.eng_name ?? item.name;
    }
    if (item.name !== "") {
      return item.name;
    }
  }

  if (!item.otherNames?.[0]) {
    return item.name;
  }

  return item.otherNames?.[0];
};

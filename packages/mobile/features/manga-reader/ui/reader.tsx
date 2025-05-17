import { FadeView } from "@/components/ui/fade-view"

import { ReaderChapterNavigation } from "@/features/manga-reader/components/reader-chapter-navigation"
import { ReaderHeader } from "@/features/manga-reader/components/reader-header"

import { useRoute } from "@react-navigation/native"
import { FlatList, useWindowDimensions, View } from "react-native"

import { useReadingTracker } from "@/store/use-reading-tracker"

import { useEffect, useMemo, useState } from "react"

import { useTitleReadChapter } from "@/store/use-chapters-tracker"
import { useProperties } from "@/store/use-properties"

import { useChapter } from "@/features/manga-reader/api/use-chapter"
import { useTitleInfo } from "@/features/title/api/use-title-info"
import { useChapters } from "@/features/title/api/use-chapters"

import { Text } from "@/components/ui/text"
import _MenuView from "react-native-context-menu-view"

import { preloadNextChapter } from "@/features/manga-reader/lib/preload-chapter"
import { BackButton } from "@/components/ui/back-button"

import { ReaderImage } from "@/features/manga-reader/components/reader-image"

import { useQueryClient } from "@tanstack/react-query"
import { useDeferredRender } from "@/hooks/use-deferred-render"
import { useReaderScrollTo } from "@/features/manga-reader/hooks/use-reader-scroll-to"
import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { cssInterop } from "nativewind"
import { FullscreenError } from "@/components/ui/fullscreen-error"
import { Lottie } from "@/components/ui/lottie"

import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

const ChapterDownloading = () => {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="flex-1 items-center justify-center"
    >
      <BackButton />
      <Lottie source={require("@/assets/emojis/loading-emoji.json")} />
      <Text className="text-muted mt-2">
        Chapter is downloading, hang on...
      </Text>
    </Animated.View>
  )
}

export const MangaReaderUI = () => {
  const MenuView = useMemo(
    () =>
      cssInterop(_MenuView, {
        className: {
          target: "style",
          nativeStyleToProp: {
            // @ts-ignore
            bottom: true,
          },
        },
      }),
    []
  )

  const route = useRoute()

  const { width, height } = useWindowDimensions()
  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const shouldRender = useDeferredRender()

  const { readerDisplayCurrentPage, showReaderScrollbar } = useProperties()

  const { addItem } = useReadingTracker()
  const { add } = useTitleReadChapter()

  const { slug_url, index } = route.params as {
    slug_url: string
    index: string
  }

  const chapterIndex = Number(index)

  useEffect(() => {
    setTimeout(() => {
      add(slug_url, chapterIndex)
    }, 50)
  }, [])

  const { data: title } = useTitleInfo(slug_url, "1")
  const { data: chapters } = useChapters(slug_url)

  const nextChapter = chapters && chapters[chapterIndex + 1]

  const { flatListRef, scroll } = useReaderScrollTo(slug_url, chapterIndex)

  const { data, refetch, isFetching, isError, error } = useChapter(
    slug_url,
    chapters && chapters[chapterIndex]
  )

  useEffect(() => {
    if (!title || !chapters) return

    addItem({
      slug_url,
      title: title.eng_name ?? title.name,
      lastReadChapter: chapterIndex,
      overallChapters: chapters.length,
      cover: {
        default: title.cover.default,
      },
      site: Number(title.site),
      scrollTo: offset,
    })
  }, [slug_url, title, data, offset])

  useEffect(() => {
    if (data) scroll()
  }, [data])

  const keyExtractor = (item: { url: string; ratio: number }) => item.url

  const renderItem = ({ item }: { item: { url: string; ratio: number } }) => (
    <ReaderImage url={item.url} ratio={item.ratio} />
  )

  const client = useQueryClient()

  const shouldDownloadNextChapter = useMemo(() => {
    const threshold = 0.5

    return data && currentPage / data?.pages.length > threshold
  }, [data, currentPage])

  const windowSize = useMemo(() => {
    return data?.pages ? data.pages.length / 4 : 21
  }, [data?.pages])

  useEffect(() => {
    if (shouldDownloadNextChapter) {
      preloadNextChapter(client, slug_url, nextChapter)
    }
  }, [shouldDownloadNextChapter])

  if (isError && error.data && error.data.code != "CONFLICT") {
    return (
      <FullscreenError fadeIn>Chapter is licensed or not found</FullscreenError>
    )
  }

  if (!chapters || !title) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    )
  }

  if (data && data.pages.length == 0) {
    return <ChapterDownloading />
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center">
        <BackButton />
        <ActivityIndicator />
      </View>
    )
  }

  if (!shouldRender) return null

  return (
    <FadeView
      withEnter
      className="flex-1 items-center justify-center bg-primary"
    >
      {readerDisplayCurrentPage && (
        <MenuView
          dropdownMenuMode
          onPress={(event) =>
            flatListRef.current?.scrollToIndex({
              index: event.nativeEvent.index,
              animated: true,
            })
          }
          style={{
            position: "absolute",
            left: 16,
            zIndex: 20,
          }}
          className="bottom-safe"
          actions={data.pages.map((_, index) => ({
            id: index.toString(),
            title: `${index + 1} / ${data.pages.length}`,
          }))}
        >
          <View className="bg-zinc-900/70 p-3 py-1.5 rounded-full">
            <Text className="text-zinc-200 font-semibold">
              {currentPage}/{data.pages.length}
            </Text>
          </View>
        </MenuView>
      )}
      <FlatList
        onRefresh={refetch}
        refreshing={false}
        ref={flatListRef}
        viewabilityConfig={{
          minimumViewTime: 3,
          waitForInteraction: false,
          viewAreaCoveragePercentThreshold: 0.4,
        }}
        onViewableItemsChanged={(event) => {
          if (event.changed[0].index && event.changed[0].isViewable) {
            setCurrentPage(event.changed[0].index)
          }
        }}
        keyExtractor={keyExtractor}
        onMomentumScrollEnd={(event) =>
          setOffset(event.nativeEvent.contentOffset.y)
        }
        maxToRenderPerBatch={windowSize}
        windowSize={windowSize}
        initialNumToRender={5}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        showsVerticalScrollIndicator={showReaderScrollbar}
        ListHeaderComponent={() => (
          <ReaderHeader chapter={data} title={title} />
        )}
        ListFooterComponent={() => (
          <ReaderChapterNavigation
            chapterIndex={chapterIndex}
            chapters={chapters}
          />
        )}
        style={{ width, height }}
        data={data.pages}
        renderItem={renderItem}
      />
    </FadeView>
  )
}

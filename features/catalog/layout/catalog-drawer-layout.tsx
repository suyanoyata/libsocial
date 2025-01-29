// TODO: refactor

import { Drawer } from "react-native-drawer-layout";
import { DrawerProps } from "react-native-drawer-layout/lib/typescript/commonjs/src/types";

import { DrawerContext } from "@/features/catalog/context/catalog-drawer-context";

import CatalogFiltersUI from "@/app/(modals)/catalog-filters-view";

import { useContext, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useFilterStore } from "@/features/catalog/store/use-filter-store";

import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { CatalogAgeRestrictions } from "@/features/catalog/components/catalog-age-restrictions";

type DrawerLayoutProps = Omit<
  DrawerProps,
  "onOpen" | "onClose" | "open" | "renderDrawerContent"
> & {};

export const CatalogDrawerLayout = ({ children, ...props }: DrawerLayoutProps) => {
  const [openNested, setOpenNested] = useState(false);

  const { genres } = useFilterStore();
  const { top } = useSafeAreaInsets();

  const { open, setOpen } = useContext(DrawerContext);

  return (
    <Drawer
      {...props}
      drawerStyle={{
        backgroundColor: "black",
        paddingTop: top,
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      drawerPosition="right"
      renderDrawerContent={() => (
        <Drawer
          style={{ flex: 1, paddingHorizontal: 16 }}
          drawerStyle={{
            width: "100%",
            backgroundColor: "black",
          }}
          onOpen={() => {
            setOpenNested(true);
          }}
          onClose={() => {
            setOpenNested(false);
          }}
          drawerPosition="right"
          renderDrawerContent={() => (
            <View style={{ flex: 1 }}>
              <CatalogFiltersUI />
            </View>
          )}
          open={openNested}
        >
          <Pressable
            onPress={() => setOpenNested(true)}
            className="flex-row items-center justify-between py-3"
          >
            <Text className="text-zinc-200 font-medium">Genres</Text>
            <Text className="text-zinc-400 font-semibold">{genres.length} selected</Text>
          </Pressable>
          <CatalogAgeRestrictions />
        </Drawer>
      )}
    >
      {children}
    </Drawer>
  );
};

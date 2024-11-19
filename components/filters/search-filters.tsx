import { Modal, Text } from "react-native";
import { FiltersConstants } from "@/types/filters";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/button";
import { DynamicFiltersPicker } from "./dynamic-filters-picker";
import { ModalWrapper } from "./modal-wrapper";
import i18n from "@/lib/intl";

export default function SearchFilters() {
  const { data: filters } = useQuery<FiltersConstants>({
    queryKey: ["filters-constants"],
  });

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        withoutTransition
        onPress={() => setOpen(true)}
        asChild
        style={{
          width: "auto",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.06)",
            paddingVertical: 10,
            paddingHorizontal: 16,
            textAlign: "center",
            color: "rgb(70,70,70)",
            fontWeight: "500",
          }}
        >
          {i18n.t("search.filters")}
        </Text>
      </Button>
      {filters && (
        <Modal
          visible={open}
          onDismiss={() => setOpen(false)}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <ModalWrapper
            style={{ gap: 6 }}
            title={i18n.t("search.filters")}
            setOpen={setOpen}
          >
            <DynamicFiltersPicker
              filterKey="genres"
              label={i18n.t("search.genres")}
            />
          </ModalWrapper>
        </Modal>
      )}
    </>
  );
}

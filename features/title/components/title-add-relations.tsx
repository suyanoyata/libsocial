import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";

export const AddRelationsButton = () => {
  return (
    <Button
      onPress={() =>
        router.push({
          pathname: "/relations-add-title",
        })
      }
      variant="ghost"
      size="sm"
      iconLeft={<Plus className="dark:text-white" size={18} />}
    >
      Add relation
    </Button>
  );
};

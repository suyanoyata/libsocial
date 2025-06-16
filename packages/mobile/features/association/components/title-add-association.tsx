import { router } from "expo-router"
import { Button } from "@/components/ui/button"

import { useSession } from "@/lib/auth"

export const AddAssociationButton = ({
  site,
  slug_url,
  type = "relation"
}: {
  site: number
  slug_url: string
  type?: "relation" | "similar"
}) => {
  const { data } = useSession()

  return (
    <Button
      onPress={() => {
        if (!data) {
          return router.push({
            pathname: "/sign-in-prompt-modal"
          })
        }

        if (data.user.isAnonymous) {
          return router.push({
            pathname: "/connect-account-prompt-modal"
          })
        }

        if (type == "similar") {
          return router.push({
            pathname: "/association-add-similar",
            params: {
              slug_url,
              site
            }
          })
        }

        return router.push({
          pathname: "/association-add-relation",
          params: {
            slug_url,
            site
          }
        })
      }}
      variant="ghost"
      size="sm"
      iconLeft="Plus"
    >
      Add {type == "relation" ? "related" : "similar"}
    </Button>
  )
}

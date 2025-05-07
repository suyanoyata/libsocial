import { Button } from "@/components/ui/button"
import { useSession } from "@/features/auth/lib/auth"
import { router } from "expo-router"

export const AddRelationsButton = ({
  slug_url,
  site,
}: {
  slug_url: string
  site: string
}) => {
  const { data } = useSession()

  return (
    <Button
      onPress={() => {
        if (!data) {
          return router.push({
            pathname: "/sign-in-prompt-modal",
          })
        }

        if (!data.user.isAnonymous) {
          return router.push({
            pathname: "/relations-add-title",
            params: {
              slug_url,
              site,
            },
          })
        }

        router.push({
          pathname: "/connect-account-prompt-modal",
        })
      }}
      variant="ghost"
      size="sm"
      iconLeft="Plus"
    >
      Add relation
    </Button>
  )
}

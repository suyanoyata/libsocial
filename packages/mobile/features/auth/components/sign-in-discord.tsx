import { FontAwesomeIcon } from "@/components/icon"
import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { Button } from "@/components/ui/button"
import { getSession, signIn, useSession } from "@/lib/auth"
import { withSuccessImpact } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"

import { toast } from "sonner-native"

export const SignInDiscord = ({
  fun,
  className,
}: {
  fun?: () => void
  className?: string
}) => {
  const { data: session } = useSession()

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-in-discord"],
    mutationFn: async () => {
      const data = await signIn.social({
        provider: "discord",
        callbackURL: "/",
      })

      return data
    },
    async onSuccess() {
      if (fun) {
        fun()
      }

      const { user } = await getSession()

      if (!user.isAnonymous) {
        const title = session?.user.isAnonymous
          ? "You've linked your Discord account"
          : "Signed in with Discord"

        withSuccessImpact(() =>
          toast.success(title, {
            duration: 2000,
          })
        )
      }
    },
  })

  return (
    <Button
      onPress={mutate}
      variant="accent"
      className={className}
      textClassName="line-clamp-1"
      iconLeft={
        !isPending ? (
          <FontAwesomeIcon
            name="discord"
            className="dark:text-violet-900 text-white"
            size={18}
          />
        ) : (
          <ActivityIndicator
            className="dark:text-violet-900 text-white mr-1.5"
            size={18}
          />
        )
      }
    >
      {session?.user.isAnonymous
        ? "Link account with Discord"
        : "Sign In with Discord"}
    </Button>
  )
}

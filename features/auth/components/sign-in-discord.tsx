import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { Button } from "@/components/ui/button"
import { signIn, useSession } from "@/features/auth/lib/auth"
import { useMutation } from "@tanstack/react-query"

import Icon from "react-native-vector-icons/FontAwesome6"
import { toast } from "sonner-native"

type SignInDiscordProps = NonNullable<{
  redirect: boolean
  url: undefined
}>

export const SignInDiscord = ({
  fun,
}: {
  fun?: (props: SignInDiscordProps) => void
}) => {
  const { data: session } = useSession()

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-in-discord"],
    mutationFn: async () => {
      const data = await signIn.social({
        provider: "discord",
        callbackURL: "/",
        fetchOptions: {
          throw: true,
        },
      })

      return data
    },
    onSuccess(data) {
      if (fun) {
        fun(data as SignInDiscordProps)
      }

      console.log(data)

      setTimeout(() => {
        const title = session?.user.isAnonymous
          ? "You've linked your Discord account"
          : "Signed in with Discord"

        toast.success(title, {
          duration: 2000,
        })
      }, 500)
    },
  })

  return (
    <Button
      onPress={mutate}
      variant="accent"
      iconLeft={
        !isPending ? (
          <Icon
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

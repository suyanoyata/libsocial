import { User } from "better-auth"

import FeatherIcon from "react-native-vector-icons/Feather"
import { Button } from "@/components/ui/button"

import { signIn } from "@/features/auth/lib/auth"
import { useMutation } from "@tanstack/react-query"
import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { toast } from "sonner-native"

export const SignInAnonymous = ({
  fun,
  className,
}: {
  fun?: (data: { user: User }) => void
  className?: string
}) => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["anonymous-authorization"],
    mutationFn: async () => {
      const { data } = await signIn.anonymous()

      return data
    },
    onSuccess(data) {
      if (fun) {
        fun(data as { user: User })
      }

      toast.warning("Signed in as Anonymous", {
        description: "Once you sign out all your data will be gone",
        duration: 4000,
      })
    },
  })

  return (
    <Button
      onPress={mutate}
      className={className}
      variant="tonal"
      iconLeft={
        !isPending ? (
          <FeatherIcon
            name="user"
            className="dark:text-violet-300 text-violet-700"
            size={16}
          />
        ) : (
          <ActivityIndicator
            className="dark:text-violet-300 text-violet-700"
            size={18}
          />
        )
      }
    >
      Anonymous
    </Button>
  )
}

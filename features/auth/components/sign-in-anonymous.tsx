import { User } from "better-auth";

import FeatherIcon from "react-native-vector-icons/Feather";
import { Button } from "@/components/ui/button";

import { signIn } from "@/features/auth/lib/auth";

export const SignInAnonymous = ({
  fun,
  className,
}: {
  fun?: (data: { user: User }) => void;
  className?: string;
}) => {
  return (
    <Button
      onPress={async () => {
        const { data } = await signIn.anonymous();

        if (fun) {
          fun(data as { user: User });
        }
      }}
      className={className}
      variant="tonal"
      iconLeft={
        <FeatherIcon name="user" className="dark:text-violet-300 text-violet-700" size={16} />
      }
    >
      Anonymous
    </Button>
  );
};

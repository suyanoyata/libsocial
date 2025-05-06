import { Button } from "@/components/ui/button";
import { authClient, linkSocial, signIn, useSession } from "@/features/auth/lib/auth";

import Icon from "react-native-vector-icons/FontAwesome6";

type SignInDiscordProps = NonNullable<{
  redirect: boolean;
  token: string;
  url: undefined;
  user: {
    id: string;
    email: string;
    name: string;
    image: string | null | undefined;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}>;

export const SignInDiscord = ({ fun }: { fun?: (props: SignInDiscordProps) => void }) => {
  const { data: session } = useSession();

  return (
    <Button
      onPress={async () => {
        const { data } = await signIn.social({
          provider: "discord",
          callbackURL: "/",
        });

        if (fun) {
          fun(data as SignInDiscordProps);
        }
      }}
      variant="accent"
      iconLeft={<Icon name="discord" className="dark:text-violet-900 text-white" size={18} />}
    >
      {session?.user.isAnonymous ? "Link account with Discord" : "Sign In with Discord"}
    </Button>
  );
};

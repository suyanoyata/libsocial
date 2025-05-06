import { icons, LucideProps } from "lucide-react-native";

interface IconProps extends LucideProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon = ({ name, className, size = 18, ...props }: IconProps) => {
  // @ts-ignore
  const LucideIcon = icons[name || "House"];

  return <LucideIcon size={size} className={className} {...props} />;
};

Icon.displayName = "Icon";

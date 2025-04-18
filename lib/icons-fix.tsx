import {
  X,
  LucideIcon,
  Eye,
  EyeOff,
  Search,
  Filter,
  SortDesc,
  SortAsc,
  Bookmark,
  Star,
  Download,
  Trash2,
  Cog,
  ChevronLeft,
} from "lucide-react-native";
import { cssInterop } from "nativewind";

export function interopIcons(icons: LucideIcon[]) {
  icons.map((icon) =>
    cssInterop(icon, {
      className: {
        target: "style",
        nativeStyleToProp: {
          color: true,
          opacity: true,
        },
      },
    })
  );
}

export const iconFix = () =>
  interopIcons([
    X,
    Eye,
    EyeOff,
    Search,
    Filter,
    SortDesc,
    SortAsc,
    Bookmark,
    Star,
    Download,
    Trash2,
    ChevronLeft,
    Cog,
  ]);

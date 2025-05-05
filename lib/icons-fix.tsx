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
  Loader,
  ChevronRight,
  Plus,
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
    Plus,
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
    ChevronRight,
    Cog,
    Loader,
  ]);

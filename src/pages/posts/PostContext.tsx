import { createContext } from "react";

export type PostContextType = {
  reloadFlag: number;
  setReloadFlag: (flag: number) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
};

export const PostContext = createContext<PostContextType>({
  reloadFlag: 0,
  setReloadFlag: () => {},
  isDialogOpen: false,
  setIsDialogOpen: () => {},
});

import { useContext } from "react";
import { ClipContext, IClipContext } from "../contexts/ClipContext";

export function useClip() {
  const context = useContext(ClipContext);
  return context;
}

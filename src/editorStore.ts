import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Buf {
  dirty: boolean;
  contents: string;
  language: string;
  id: string;
  name: string;
}

interface EditorStore {
  bufs: Array<Buf>;
  curBufId: string | undefined;
  setCurBufId: (buf: string) => void;
  setCurBufContents: (contents: string) => void;
  setBufs: (bs: Array<Buf>) => void;
}

const useEditorStore = create<EditorStore>()(immer((set) => ({
  bufs: [],
  setBufs: (bs) => set((state) => {
    state.bufs = bs
  }),
  curBufId: undefined,
  setCurBufId: (buf) => set((state) => {
    if (state.bufs.some((b) => b.id === buf)) {
      state.curBufId = buf
    }
  }),
  setCurBufContents: (contents) => set((state) => {
    if (state.curBufId === undefined) return
    const curBuf = state.bufs.find((b) => b.id === state.curBufId)
    if (curBuf === undefined) return
    curBuf.contents = contents
  }),
})))

export default useEditorStore;

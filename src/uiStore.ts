import { ColorScheme } from '@mantine/core';
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface UIStore {
  colorScheme: ColorScheme;
  toggleColorScheme: (value?: ColorScheme) => void;
}

const useUIStore = create<UIStore>()(immer((set) => ({
  colorScheme: 'light',
  toggleColorScheme: (value?: ColorScheme) => set((state) => {
    if (value !== undefined)
      state.colorScheme = value;
    else
      state.colorScheme = state.colorScheme === 'dark' ? 'light' : 'dark'
  })
})))

export default useUIStore;

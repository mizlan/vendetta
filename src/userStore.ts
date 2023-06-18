import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { UserData } from './schema'
import { z } from 'zod';

type UserData = z.infer<typeof UserData>;

interface UserStore {
  userData: UserData | undefined | 'signed out' | 'fetching';
  setUserData: (d: UserData | 'signed out' | 'fetching') => void;
}

const useUserStore = create<UserStore>()(devtools(immer((set) => ({
  userData: undefined,
  setUserData: (d: UserData | 'signed out' | 'fetching') => set((state) => {
    state.userData = d
  }),
}))))

export default useUserStore;

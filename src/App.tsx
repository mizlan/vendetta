import { ColorSchemeProvider, Loader, LoadingOverlay, MantineProvider, MantineThemeOverride } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { onAuthStateChanged } from './firebase';
import useUserStore from './userStore';
import useUIStore from './uiStore';
import useEditorStore, { Buf } from './editorStore';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getUserData } from './fetch';
import { GetUserDataResponse } from './schema';
import router from './routes';

const theme: MantineThemeOverride = {
  loader: 'dots',
  primaryColor: 'grape',
}

/* TODO: might not need at all
 * ask reactiflux if this is good for
 * local-first, with save-file esque behavior
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})

const App = () => {
  console.log('[debug]: rendering app')
  const [colorScheme, toggleColorScheme] = useUIStore((state) => [state.colorScheme, state.toggleColorScheme]);
  const userData = useUserStore((state) => state.userData)
  const setUserData = useUserStore((state) => state.setUserData)
  const setBufs = useEditorStore((state) => state.setBufs)
  const setCurBufId = useEditorStore((state) => state.setCurBufId)

  useEffect(() => {
    onAuthStateChanged(async (user) => {
      if (user?.uid === undefined) {
        setUserData('signed out')
        return;
      }
      setUserData('fetching')
      const resp = await getUserData(user.uid, true)
      if (!resp.ok) return;
      const data = GetUserDataResponse.parse(resp.data)
      const userData = data.userData
      const programs = data.programs
      const buflist: Array<Buf> = Object.entries(programs).map(([id, { language, code: contents, name }]) => ({
        dirty: false,
        id,
        language,
        contents,
        name,
      }))
      console.log(`[debug]: set userData to ${JSON.stringify(userData)}`)
      setUserData(userData)
      setBufs(buflist)
      setCurBufId(userData.mostRecentProgram)
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
          {
            (userData === undefined)
              ? <LoadingOverlay visible />
              :
              <RouterProvider router={router} fallbackElement={<Loader />} />
          }
        </MantineProvider>
      </ColorSchemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App

import { useMemo } from 'react'
import { Box, Button, Loader, LoadingOverlay, Navbar, createStyles, getStylesRef, rem } from "@mantine/core";
import { signOut } from "./firebase";
import useUIStore from "./uiStore";
import useEditorStore, { Buf } from "./editorStore";
import useUserStore from "./userStore";
import { basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { duotoneLight, nord } from '@uiw/codemirror-themes-all'
import CodeMirror from 'rodemirror'
import ColorSchemeSwitchButton from "./ColorSchemeButton";
import { IconFile, IconLogout } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const useBufferListStyles = createStyles((theme) => ({
  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  },
}));

const useEditorStyles = createStyles((_theme) => ({
  root: {
    display: 'flex',
  }
}))

const BufferList = () => {
  const { classes, cx } = useBufferListStyles();
  const curBufId = useEditorStore((state) => state.curBufId);
  const bufferList = useEditorStore((state) => state.bufs)
  const setUserData = useUserStore((state) => state.setUserData);

  if (curBufId === undefined) {
    return <Loader />
  }

  return (
    <Navbar height='100vh' width={{ sm: '250px' }}>
      <Navbar.Section>
        {bufferList.map((item: Buf) => (
          <Link
            className={cx(classes.link, { [classes.linkActive]: item.id === curBufId })}
            to={`/editor?program=${item.id}`}
            key={item.id}
          >
            <IconFile className={classes.linkIcon} stroke={1.5} />
            <span>{item.name}</span>
          </Link>
        ))
        }
      </Navbar.Section>
      <Navbar.Section className={classes.footer}>
        <a href="#" className={classes.link} onClick={() => {
          setUserData('signed out')
          signOut()
        }}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
    </Navbar>
  )
}

const Editor = () => {
  const editorTheme = useUIStore((state) => state.colorScheme === 'dark' ? nord : duotoneLight)
  const extensions = useMemo(() => [basicSetup, editorTheme, python()], [editorTheme])
  const setCurBufContents = useEditorStore((state) => state.setCurBufContents);
  const { classes } = useEditorStyles();
  const bufs = useEditorStore((state) => state.bufs)
  const userData = useUserStore((state) => state.userData);
  const curBufId = useEditorStore((state) => state.curBufId);
  const setUserData = useUserStore((state) => state.setUserData);
  const signedIn = userData !== undefined && userData !== 'signed out' && userData !== 'fetching'

  if (!signedIn) {
    return <LoadingOverlay visible />
  }

  let initialContent = bufs.find((b) => b.id === curBufId)?.contents

  return (
    <Box className={classes.root}>
      <BufferList />
      <CodeMirror
        extensions={extensions}
        value={initialContent}
        onUpdate={(v) => {
          if (v.docChanged) {
            setCurBufContents(v.state.doc.toString())
          }
        }}
      />
      <ColorSchemeSwitchButton />
      <Button onClick={async () => {
        setUserData('signed out')
        await signOut()
      }}> sign out </Button>
    </Box>
  )
}

export default Editor;

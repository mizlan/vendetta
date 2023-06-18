import SHA256 from 'crypto-js/sha256';
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  rem,
  Loader,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { signInWithEmailAndPassword } from './firebase'
import { useState } from 'react';
import ColorSchemeSwitchButton from './ColorSchemeButton';
import { FirebaseError } from 'firebase/app';
import useUserStore from './userStore';

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: '100vh',
    width: '100vw',
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
  },

  form: {
    borderRight: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
      }`,
    height: '100vh',
    maxWidth: rem(450),
    paddingTop: rem(80),

    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  switch: {
    float: 'right',
    margin: '1rem',
  }
}));

const Auth = () => {
  const { classes } = useStyles();
  const [submitting, setSubmitting] = useState(false);
  const userData = useUserStore((state) => state.userData);
  const signedIn = userData !== undefined && userData !== 'signed out' && userData !== 'fetching' && !submitting

  type FormValues = {
    username: string,
    password: string,
  }

  const form = useForm<FormValues>({
    initialValues: {
      username: '',
      password: '',
    },

    validate: {
      username: (value) => (/\S/.test(value) ? null : 'Invalid username'),
      password: (value) => (/\S/.test(value) ? null : 'Invalid password'),
    },
  });

  const handleError = (err: FirebaseError) => {
    let msg;
    let field = 'username';
    switch (err.code) {
      case 'auth/invalid-email':
        msg = 'Invalid username. Usernames must only have alphanumeric characters plus !@#$%.';
        break;
      case 'auth/email-already-in-use':
        msg = 'Username is taken; please use another one.';
        break;
      case 'auth/user-not-found':
        msg = 'No account found for username.';
        break;
      case 'auth/wrong-password':
        msg = 'Wrong password.';
        field = 'password';
        break;
      case 'auth/network-request-failed':
        msg = 'Network error—check your internet connection.';
        break;
      case 'auth/app-deleted':
      case 'auth/app-not-authorized':
      case 'auth/argument-error':
      case 'auth/invalid-api-key':
      case 'auth/operation-not-allowed':
      case 'auth/requires-recent-login':
      case 'auth/unauthorized-domain':
        msg = `App was not properly configured. Please contact administrator. Error: ${err.code}`;
        break;
      case 'auth/invalid-user-token':
      case 'auth/user-disabled':
      case 'auth/user-token-expired':
      case 'auth/web-storage-unsupported':
        msg = `Issue with user. Please contact administrator. Error: ${err.code}`;
        break;
      default:
        msg = `Failed to sign in: ${err.code}`;
    }
    form.setFieldError(field, msg);
  }

  const onSubmit = async ({ username, password }: FormValues) => {
    setSubmitting(true)
    try {
      await signInWithEmailAndPassword(`${username}@fake.com`, SHA256(password).toString())
    } catch (err: unknown) {
      if (err instanceof FirebaseError)
        handleError(err)
      else
        console.log('not a thingy')
    }
    setSubmitting(false)
  }

  return (
    <div className={classes.wrapper}>
      <ColorSchemeSwitchButton className={classes.switch} />
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome back to Vendetta!
        </Title>

        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
          <TextInput label="Username" size="md" {...form.getInputProps('username')} readOnly={submitting} />
          <PasswordInput label="Password" mt="md" size="md" {...form.getInputProps('password')} readOnly={submitting} />
          <>{JSON.stringify(userData)}</>
          <Button fullWidth type="submit" mt="xl" size="md" disabled={submitting}>
            {submitting ? <Loader size="sm" color="dark.0" /> : <>Login</>}
          </Button>
        </form>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{' '}
          <Anchor<'a'> href="#" weight={700} onClick={(event) => event.preventDefault()}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}

export default Auth

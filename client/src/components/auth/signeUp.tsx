import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { type AuthClient } from '../../routes/auth';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props: { authClient: AuthClient }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [passwordConfirmError, setPasswordConfirmError] = React.useState(false);
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const passwordConfirm = document.getElementById('passwordConfirm') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!passwordConfirm.value || passwordConfirm.value !== password.value) {
      setPasswordConfirmError(true);
      setPasswordConfirmErrorMessage('Passwords do not match.');
      isValid = false;
    } else {
      setPasswordConfirmError(false);
      setPasswordConfirmErrorMessage('');
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    console.log("is valid:", isValid);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("Submiting form");
    // if (nameError || emailError || passwordError) {
    //   event.preventDefault();
    //   return;
    // }
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    });

    await props.authClient.signUp.email({
      email: data.get('email') as string,
      password: data.get('password') as string,
      name: data.get('name') as string,
    }, {
      onRequest: (ctx) => {
        //show loading
        console.log("Signing up", ctx);
      },
      onSuccess: (ctx) => {
        //redirect to the dashboard or sign in page
        console.log("Sign up successful", ctx);
      },
      onError: (ctx) => {
        // display the error message
        alert(ctx.error.message);
      },
    })
      .then((res) => {
        console.log("Sign up successful", res);
        // Optionally redirect or show a success message
      })
      .catch((error) => {
        console.error("Sign up error:", error);
        setEmailError(true);
        setEmailErrorMessage('An error occurred during sign up. Please try again.');
      })
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="name">Full name</FormLabel>
            <TextField
              autoComplete="name"
              name="name"
              required
              fullWidth
              id="name"
              placeholder="Jon Snow"
              error={nameError}
              helperText={nameErrorMessage}
              color={nameError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              required
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              error={emailError}
              helperText={emailErrorMessage}
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Confirm password</FormLabel>
            <TextField
              required
              fullWidth
              name="passwordConfirm"
              placeholder="••••••"
              type="password"
              id="passwordConfirm"
              autoComplete="new-password"
              variant="outlined"
              error={passwordConfirmError}
              helperText={passwordConfirmErrorMessage}
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            Sign up
          </Button>
        </Box>
      </Card>
    </SignUpContainer>
  );
}
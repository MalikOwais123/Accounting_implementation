import { useState } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
// layouts
import Layout from 'src/layouts';
// routes
import { PATH_AUTH } from 'src/routes/paths';
// components
import Page from 'src/components/Page';
// import Page from 'src/components/Page';
// sections
import { NewPasswordForm } from 'src/sections/auth/new-password';
// assets
import { SentIcon } from 'src/assets';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));
// ----------------------------------------------------------------------

NewPassword.getLayout = function getLayout(page) {
  return <Layout variant="logoOnly">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function NewPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <Page title="New Password" sx={{ height: 1 }}>
      <RootStyle>
        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            {!sent ? (
              <>
                <Typography variant="h3" paragraph>
                  Change your password
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                  Please enter new password and then it will be associated with your account.
                </Typography>

                <NewPasswordForm onSent={() => setSent(true)} onGetEmail={(value) => setEmail(value)} />

                <NextLink href={PATH_AUTH.login} passHref>
                  <Button fullWidth size="large" sx={{ mt: 1 }}>
                    Back
                  </Button>
                </NextLink>

              </>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <SentIcon sx={{ mb: 5, mx: 'auto', height: 160 }} />

                <Typography variant="h3" gutterBottom>
                  Request sent successfully
                </Typography>
                <Typography>
                  We have sent a confirmation email to &nbsp;
                  <strong>{email}</strong>
                  <br />
                  Please check your email.
                </Typography>
                <NextLink href={PATH_AUTH.login} passHref>
                  <Button size="large" variant="contained" sx={{ mt: 5 }}>
                    Back
                  </Button>
                </NextLink>
              </Box>
            )}
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}

import { useState } from 'react'
import { isEmpty } from 'lodash'
// next
import NextLink from 'next/link'
// @mui
import { styled } from '@mui/material/styles'
import { Box, Button, Container, Typography } from '@mui/material'
// layouts
import Layout from 'src/layouts'
// routes
import { PATH_AUTH } from 'src/routes/paths'
// components
import Page from 'src/components/Page'
// sections
import { SelectCompanyForm } from 'src/sections/auth/user-companies'
// assets
import { SentIcon } from 'src/assets'
// guards
import AuthGuard from 'src/guards/AuthGuard'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}))
// ----------------------------------------------------------------------

UserComapnies.getLayout = function getLayout(page) {
  return <Layout variant="logoOnly">{page}</Layout>
}

// ----------------------------------------------------------------------

export default function UserComapnies() {
  return (
    <AuthGuard>
      <Page title="Select Company" sx={{ height: 1 }}>
        <RootStyle>
          <Container>
            <Box sx={{ maxWidth: 480, mx: 'auto' }}>
              {/* {!sent ? ( */}
              <>
                <Typography variant="h3" paragraph>
                  Select a Company
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                  Please elect a company you wish to be logged in as
                </Typography>

                <SelectCompanyForm />

                {/* <NewPasswordForm onSent={() => setSent(true)} onGetEmail={(value) => setEmail(value)} /> */}

                <NextLink href={PATH_AUTH.login} passHref>
                  <Button fullWidth size="large" sx={{ mt: 1 }}>
                    Back
                  </Button>
                </NextLink>
              </>
              {/* ) : (
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
            )} */}
            </Box>
          </Container>
        </RootStyle>
      </Page>
    </AuthGuard>
  )
}

import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
// next
import NextLink from 'next/link'
// @mui
import { styled } from '@mui/material/styles'
import { Box, Button, Container, Typography } from '@mui/material'
// layouts
import Layout from 'src/layouts'
// routes
import { PATH_AUTH, PATH_DASHBOARD } from 'src/routes/paths'
// components
import Page from 'src/components/Page'
// sections
import { PaymentForm as StripePaymentForm } from 'src/sections/auth/payment'
// assets
import { SentIcon } from 'src/assets'
// guards
import AuthGuard from 'src/guards/AuthGuard'
import useAuth from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}))
// ----------------------------------------------------------------------

PaymentSubscription.getLayout = function getLayout(page) {
  return <Layout variant="logoOnly">{page}</Layout>
}

// ----------------------------------------------------------------------

export default function PaymentSubscription() {
  const { selectedSubscription } = useAuth()
  const { push } = useRouter()
  useEffect(() => {
    if (!isEmpty(selectedSubscription) && selectedSubscription?.paymentStatus === 'paid') push(PATH_DASHBOARD.root)
  }, [selectedSubscription])

  return (
    // <AuthGuard>
    <Page title="Subscription Payment" sx={{ height: 1 }}>
      <RootStyle>
        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            {/* {!sent ? ( */}
            <>
              <Typography variant="h3" paragraph>
                Subscription Payment
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                Bitch you ain't paid yet ? {selectedSubscription?.companyName}
              </Typography>

              <StripePaymentForm />

              {/* <NextLink href={PATH_AUTH.login} passHref>
                <Button fullWidth size="large" sx={{ mt: 1 }}>
                  Back
                </Button>
              </NextLink> */}
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
    // </AuthGuard>
  )
}

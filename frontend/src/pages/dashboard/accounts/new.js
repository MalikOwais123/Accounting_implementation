// @mui
import { Container } from '@mui/material'
// routes
import { PATH_DASHBOARD } from '../../../routes/paths'
// hooks
import useSettings from '../../../hooks/useSettings'
// layouts
import Layout from '../../../layouts'
// components
import Page from '../../../components/Page'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
// sections
import AccountNewForm from '../../../sections/@dashboard/accounts/AccountNewForm'

// ----------------------------------------------------------------------

UserCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings()

  return (
    <Page title="User: Create a new user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Account', href: PATH_DASHBOARD.accounts.list },
            { name: 'New Account' },
          ]}
        />
        <AccountNewForm />
      </Container>
    </Page>
  )
}

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
import GeneralEntryNewForm from '../../../sections/@dashboard/generalJourals/GeneralEntryNewForm'

// ----------------------------------------------------------------------

UserCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings()

  return (
    <Page title="General: Create a new entry">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new entry"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'General Journals', href: PATH_DASHBOARD.generalJournals.list },
            { name: 'New Entry' },
          ]}
        />
        <GeneralEntryNewForm />
      </Container>
    </Page>
  )
}

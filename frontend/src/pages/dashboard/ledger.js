// @mui
import { Container, Grid, Stack } from '@mui/material'
// hooks
import useSettings from '../../hooks/useSettings'
// layouts
import Layout from '../../layouts'
// components
import Page from '../../components/Page'
import { LedgerTAccounts } from '../../sections/@dashboard/general/ledger'
import { useGetLedgersAccounts } from 'src/query'

// ----------------------------------------------------------------------

BalanceSheet.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function BalanceSheet() {
  const { themeStretch } = useSettings()
  const { data } = useGetLedgersAccounts()

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          {data?.data?.map((element, i) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={4} key={i}>
                <LedgerTAccounts accountContent={element.attributes} />
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Page>
  )
}

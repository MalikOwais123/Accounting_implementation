// @mui
import { Container, Divider, Grid, Stack } from '@mui/material'
// hooks
import useSettings from '../../hooks/useSettings'
// layouts
import Layout from '../../layouts'
// components
import Page from '../../components/Page'
import { LedgerTAccounts } from '../../sections/@dashboard/general/ledger'
import { useGetLedgersAccounts, useGetAdjustedLedgers } from 'src/query'
import EmptyContent from 'src/components/EmptyContent'

// ----------------------------------------------------------------------

AdjustedLedgers.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function AdjustedLedgers() {
  const { themeStretch } = useSettings()
  const { data: generalLedegrs } = useGetLedgersAccounts()
  const { data: adjustedLedgers } = useGetAdjustedLedgers()

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        {adjustedLedgers?.data?.length === 0 && (
        <EmptyContent
          title={`There are no Ledgers`}
          img="/icons/illustration_empty_content.svg"
          sx={{ flexGrow: 1, height: 'auto' }}
        />
        )}
        <Grid container spacing={3}>
          {adjustedLedgers?.data?.map((element, i) => {
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

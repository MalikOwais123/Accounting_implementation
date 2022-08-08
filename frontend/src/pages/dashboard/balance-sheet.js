// @mui
import { useTheme } from '@mui/material/styles'
import { Container, Grid, Stack } from '@mui/material'
// hooks
import useAuth from '../../hooks/useAuth'
import useSettings from '../../hooks/useSettings'
// layouts
import Layout from '../../layouts'
// components
import Page from '../../components/Page'
import { useGetLedgersAccounts } from 'src/query'
import { ACC_NATURE } from 'src/utils/roles'
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app'
import { BalanceSheetHeading, BalanceSheetAccounts } from '../../sections/@dashboard/general/balance_sheet'

// ----------------------------------------------------------------------

BalanceSheet.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function BalanceSheet() {
  const { user } = useAuth()
  const theme = useTheme()
  const { themeStretch } = useSettings()
  const { data } = useGetLedgersAccounts()
  console.log('data', data)

  const totalCalculatedAmount = (debitAmountList, creditAmountList) => {
    let debitTotal = 0
    let creditTotal = 0
    let total = 0
    if (debitAmountList !== undefined) {
      for (let dindex in debitAmountList) {
        debitTotal += debitAmountList[dindex]
      }
    }

    if (creditAmountList !== undefined) {
      for (let cindex in creditAmountList) {
        creditTotal += creditAmountList[cindex]
      }
    }

    if (debitTotal > creditTotal) {
      total = debitTotal - creditTotal
    } else {
      total = creditTotal - debitTotal
    }

    return total
  }

  //~this is a role model almost any other data population will follow this
  const accountsContentManager = (accType) => {
    let filteredData = []
    if (data !== undefined) {
      data?.data?.map((element, i) => {
        if (element.attributes.nature === accType) {
          filteredData.push({
            accountName: element.attributes.title,
            amount: totalCalculatedAmount(element.attributes.debit.amount, element.attributes.credit.amount),
          })
        }
      })

      return filteredData
    }
  }

  const currentAssetContents = accountsContentManager(ACC_NATURE.current_asset)
  const currentLiabiltyContents = accountsContentManager(ACC_NATURE.current_liability)
  const equityContent = accountsContentManager(ACC_NATURE.owner_equity)

//   ~for now we are not considering this accounts
//   const longTermAssetContents = accountsContentManager(ACC_NATURE.longterm_asset)
//   const longTermLiabiltyContents = accountsContentManager(ACC_NATURE.longterm_liability)

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <BalanceSheetHeading displayName={user?.displayName} />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <BalanceSheetAccounts title="Assets" itemsList={currentAssetContents} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={12}>
                            <BalanceSheetAccounts title="Liabilities" itemsList={currentLiabiltyContents} />
              </Grid>
              <Grid item xs={12} md={6} lg={12}>
                            <BalanceSheetAccounts title="Owner's Equity" itemsList={equityContent} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}

// @mui
import { Container, Divider, Grid, Stack, Typography } from '@mui/material'
// hooks
import useSettings from '../../hooks/useSettings'
import useAuth from '../../hooks/useAuth'
// layouts
import Layout from '../../layouts'
// components
import Page from '../../components/Page'
import { LedgerTAccounts } from '../../sections/@dashboard/general/ledger'
import { useGetLedgersAccounts } from 'src/query'
import EmptyContent from 'src/components/EmptyContent'
import {
  BalanceSheetHeading,
  BalanceSheetAccounts,
  BalanceTotalSummary,
} from '../../sections/@dashboard/general/balance_sheet'

// ----------------------------------------------------------------------

IncomeStatement.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------
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

export default function IncomeStatement() {
  const { user } = useAuth()
  const { themeStretch } = useSettings()
  const { data } = useGetLedgersAccounts()

  const computeTotal = (acc) => {
    return acc?.reduce((accumulator, accContent) => {
      accumulator = accumulator + parseInt(accContent.amount)
      return accumulator
    }, 0)
  }

  const _modifiedData = () => {
    const expenseAcc = data?.data
      ?.filter((item) => item.attributes.nature === 'expense')
      .map((acc) => {
        return {
          ...acc,
          accountName: acc?.attributes?.title,
          amount: acc?.attributes?.debit?.amount.reduce((partialSum, a) => partialSum + a, 0),
        }
      })
    const revenueAcc = data?.data
      ?.filter((item) => item.attributes.nature === 'revenue')
      .map((acc) => {
        return {
          ...acc,
          accountName: acc?.attributes?.title,
          amount: acc?.attributes?.credit?.amount.reduce((partialSum, a) => partialSum + a, 0),
        }
      })
    const capitalAcc = data?.data
      ?.filter((item) => item.attributes.nature === 'owner_equity')
      .map((acc) => {
        return {
          ...acc,
          accountName: acc?.attributes?.title,
          amount: totalCalculatedAmount(acc.attributes.debit.amount, acc.attributes.credit.amount),
        }
      })
    const drawingAcc = data?.data
      ?.filter((item) => item.attributes.nature === 'drawing')
      .map((acc) => {
        return {
          ...acc,
          accountName: acc?.attributes?.title,
          amount: totalCalculatedAmount(acc.attributes.debit.amount, acc.attributes.credit.amount),
        }
      })
    const totalExpense = computeTotal(expenseAcc)
    const totalRevenue = computeTotal(revenueAcc)
    return { expenseAcc, revenueAcc, capitalAcc, drawingAcc, totalExpense, totalRevenue }
  }
  console.log('data', data)
  console.log('_modifiedData()', _modifiedData())

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={10}>
            <BalanceSheetHeading heading="Income Statement" subHeading="Over Night Auto" dateInfo="21-2-2000" />
          </Grid>

          <Grid item xs={12} md={8} lg={8}>
            <Typography>Revenues:</Typography>
            {_modifiedData()?.revenueAcc?.map((item) => (
              <Stack width={'50vw'} direction="row" justifyContent="space-between">
                <Typography>{item.accountName}</Typography>
                <Typography>{item.amount}</Typography>
              </Stack>
            ))}
          </Grid>

          <Grid item xs={12} md={8} lg={8}>
            <Typography>Expense:</Typography>
            {_modifiedData()?.expenseAcc?.map((item) => (
              <Stack width={'40vw'} direction="row" justifyContent="space-between">
                <Typography>{item.accountName}</Typography>
                <Typography>{item.amount}</Typography>
              </Stack>
            ))}
          </Grid>

          <Grid item xs={12} md={8} lg={8}>
            <Stack width={'50vw'} direction="row" justifyContent="space-between">
              <Typography>Sub Total:</Typography>
              <Typography>{_modifiedData()?.totalExpense}</Typography>
            </Stack>
          </Grid>
          <Divider />

          <Grid item xs={12} md={8} lg={8}>
            <Stack width={'50vw'} direction="row" justifyContent="space-between">
              <Typography>Net Income</Typography>
              <Typography>{parseInt(_modifiedData()?.totalRevenue - _modifiedData()?.totalExpense)}</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={10}>
            <BalanceSheetHeading heading="Owner's Equity" subHeading="Over Night Auto" dateInfo="21-2-2000" />
          </Grid>

          <Grid item xs={12} md={8} lg={8}>
            {_modifiedData()?.capitalAcc?.map((item) => (
              <Stack width={'50vw'} direction="row" justifyContent="space-between">
                <Typography>{item.accountName}</Typography>
                <Typography>{item.amount}</Typography>
              </Stack>
            ))}
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <Stack width={'50vw'} direction="row" justifyContent="space-between">
              <Typography>Net Income</Typography>
              <Typography>{parseInt(_modifiedData()?.totalRevenue - _modifiedData()?.totalExpense)}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8} lg={8}>
            <Stack width={'50vw'} direction="row" justifyContent="space-between">
              <Typography>Sub total</Typography>
              <Typography>
                {parseInt(
                  _modifiedData()?.totalRevenue -
                    _modifiedData()?.totalExpense +
                    _modifiedData()?.capitalAcc?.[0]?.amount
                )}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <Stack width={'50vw'} direction="row" justifyContent="space-between">
              <Typography>Drawing</Typography>
              <Typography>{_modifiedData()?.drawingAcc?.[0]?.amount}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8} lg={8}>
            <Stack width={'50vw'} direction="row" justifyContent="space-between">
              <Typography>Closing Capital</Typography>
              {/* subtital - drawing */}
              <Typography>
                {parseInt(
                  _modifiedData()?.totalRevenue -
                    _modifiedData()?.totalExpense +
                    _modifiedData()?.capitalAcc?.[0]?.amount
                ) + _modifiedData()?.drawingAcc?.[0]?.amount}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}

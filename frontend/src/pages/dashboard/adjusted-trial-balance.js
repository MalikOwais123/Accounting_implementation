// @mui
import { useTheme } from '@mui/material/styles'
import {
  Card,
  Container,
  Grid,
  CardHeader,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from '@mui/material'
// hooks
import useAuth from '../../hooks/useAuth'
import useSettings from '../../hooks/useSettings'
// layouts
import Layout from '../../layouts'
// components
import Page from '../../components/Page'
import { useGetLedgersAccounts, useGetAdjustedLedgers } from 'src/query'
import { ACC_NATURE } from 'src/utils/roles'
import { TrialBalanceHeading } from '../../sections/@dashboard/general/trial_balance'
import { computeTotal } from 'src/utils/helpers'
import Scrollbar from 'src/components/Scrollbar'
import TrialBalanceRowDetail from 'src/sections/@dashboard/general/trial_balance/TrialBalanceRowDetail'
import LastTotalRow from 'src/sections/@dashboard/general/trial_balance/LastTotalRow'
import { forEach } from 'lodash'

// ----------------------------------------------------------------------

AdjustedTrialBalance.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

const headingData = ['Account', 'Debit', 'Credit']

export default function AdjustedTrialBalance() {
  const { user } = useAuth()
  const theme = useTheme()
  const { themeStretch } = useSettings()
  const { data: { data: generalLedegrs } = {}, isLoading } = useGetLedgersAccounts() || {}
  const { data: { data: adjustedLedgers } = {} } = useGetAdjustedLedgers() || {}

  const getTrilBalAmount = (debitAccs, creditAccs) => {
    const _debitAm = computeTotal(debitAccs)
    const _creditAm = computeTotal(creditAccs)
    if (_debitAm > _creditAm) {
      return {
        nature: 'debit',
        amount: _debitAm - _creditAm,
      }
    } else
      return {
        nature: 'credit',
        amount: _creditAm - _debitAm,
      }
  }

  const totalAccountAmount = (accountType) =>
  _modifiedAdjustedAccounts()
      ?.filter((item) => item.accDetail.nature === accountType)
      .map((el) => el.accDetail.amount)
      .reduce((partialSum, a) => partialSum + a, 0)


  const _modifiedAdjustedAccounts = () => {
    let _array = []

    // loop adjusted ledgers
    // ~_adjLedger --- > _AD_LEG
    // ~_generalLedegr --- > _GEN_LEG

    adjustedLedgers?.forEach((_AD_LEG) => {
      const adjustedAccDetail = getTrilBalAmount(_AD_LEG?.attributes.debit.amount, _AD_LEG?.attributes.credit.amount)
      const isExistInGeneralAcc = generalLedegrs.find(
        (_GEN_LEG) => _GEN_LEG.attributes.title === _AD_LEG?.attributes.title
      )

      if (isExistInGeneralAcc?.id) {
        //* if account exist so compute second account detail
        const generalAccDetail = getTrilBalAmount(
          isExistInGeneralAcc?.attributes.debit.amount,
          _AD_LEG?.attributes.credit.amount
        )
        
        // TODO : IF BOTH HAVE SAME NATURE EITHER DEBIT OR CREDIT THEN HANDLE THIS CASE
        
        // *check for account nature
        if (adjustedAccDetail.nature === 'debit' && generalAccDetail.nature === 'credit') {
          const resultedAccDetail = getTrilBalAmount([adjustedAccDetail.amount], [generalAccDetail.amount])

          _array.push({
              id: _AD_LEG.id,
            title: _AD_LEG.attributes.title,
            nature : _AD_LEG.attributes.nature,
            accDetail: resultedAccDetail,
          })
        } else if (adjustedAccDetail.nature === 'credit' && generalAccDetail.nature === 'debit') {
          const resultedAccDetail = getTrilBalAmount([generalAccDetail.amount], [adjustedAccDetail.amount])

          _array.push({
              id: _AD_LEG.id,
            title: _AD_LEG.attributes.title,
            nature : _AD_LEG.attributes.nature,
            accDetail: resultedAccDetail,
          })
        }
      } else {
        _array.push({
            id: _AD_LEG.id,
          title: _AD_LEG.attributes.title,
          nature : _AD_LEG.attributes.nature,
          accDetail: adjustedAccDetail,
        })
      }
    })

    // filter from general ledgers those account that has already been present in _array
    const _filteredGeneralLedegrs = generalLedegrs?.filter(
      (_GEN_LEG) => !_array.find((item) => item.title === _GEN_LEG.attributes.title)
    )

    // loop general ledgers and adjust the amount
    _filteredGeneralLedegrs?.forEach((el) => {
      _array.push({
          id: el.id,
        title: el.attributes.title,
        nature : el.attributes.nature,
        accDetail: getTrilBalAmount(el?.attributes.debit.amount, el?.attributes.credit.amount),
      })
    })
    
    return _array
  }

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Card>
          <CardHeader title={<TrialBalanceHeading displayName={user?.displayName} />} sx={{ mb: 3 }} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                {/* ROW HEADINGS */}
                {!isLoading && (
                  <TableHead>
                    <TableRow>
                      {headingData?.map((col, ind) => (
                        <TableCell key={ind}>{col}</TableCell>
                      ))}
                      {/* <TableCell /> */}
                    </TableRow>
                  </TableHead>
                )}

                <TableBody hover>
                  {_modifiedAdjustedAccounts()?.map((row) => {
                    return (
                      <TableRow
                        sx={{
                          borderBottom: `1px solid ${theme.palette.grey[200]}`,
                        }}
                        hover
                        key={row.id}
                      >
                        <TrialBalanceRowDetail rowData={row} />
                      </TableRow>
                    )
                  })}
                  <TableRow
                    sx={{
                      borderBottom: `1px solid ${theme.palette.grey[200]}`,
                    }}
                    hover
                  >
                    <LastTotalRow
                      debitAmount={totalAccountAmount('debit')}
                      creditAmount={totalAccountAmount('credit')}
                    />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  )
}

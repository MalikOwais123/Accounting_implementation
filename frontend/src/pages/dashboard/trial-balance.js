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
import { useGetLedgersAccounts } from 'src/query'
import { ACC_NATURE } from 'src/utils/roles'
import { TrialBalanceHeading } from '../../sections/@dashboard/general/trial_balance'
import { computeTotal } from 'src/utils/helpers'
import Scrollbar from 'src/components/Scrollbar'
import TrialBalanceRowDetail from 'src/sections/@dashboard/general/trial_balance/TrialBalanceRowDetail'
import LastTotalRow from 'src/sections/@dashboard/general/trial_balance/LastTotalRow'

// ----------------------------------------------------------------------

TrialBalance.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

const headingData = ['Account', 'Debit', 'Credit']

export default function TrialBalance() {
  const { user } = useAuth()
  const theme = useTheme()
  const { themeStretch } = useSettings()
  const { data, isLoading } = useGetLedgersAccounts()

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

  const _modifiedData = () => {
    if (data) {
      const _temp = data?.data?.map((el) => {
        return {
          ...el.attributes,
          id: el.id,
          accDetail: getTrilBalAmount(el?.attributes?.debit?.amount, el?.attributes?.credit?.amount),
        }
      })
      return _temp
    }
  }

  const totalAccountAmount = (accountType) =>
    _modifiedData()
      ?.filter((item) => item.accDetail.nature === accountType)
      .map((el) => el.accDetail.amount)
      .reduce((partialSum, a) => partialSum + a, 0)

  console.log('Debit', totalAccountAmount('debit'))
  console.log('Credit', totalAccountAmount('credit'))

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
                  {_modifiedData()?.map((row) => {
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

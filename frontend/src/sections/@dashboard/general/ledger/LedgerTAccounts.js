import PropTypes from 'prop-types'
import orderBy from 'lodash/orderBy'
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles'
import { Box, Stack, Card, Avatar, CardHeader, Typography,Divider } from '@mui/material'
// utils
import { fShortenNumber } from '../../../../utils/formatNumber'
// _mock_
import { _appAuthors } from '../../../../_mock'
// components
import Iconify from '../../../../components/Iconify'

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
}))
// ----------------------------------------------------------------------

LedgerTAccounts.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error']),
  title: PropTypes.string,
}

const computeTotal = (arr)=>{

const sum = arr.reduce(add, 0); // with initial value to avoid when the array is empty

function add(accumulator, a) {
  return accumulator + a;
}
return sum
}

export default function LedgerTAccounts({ accountContent, color = 'secondary' }) {
  const theme = useTheme()
  console.log("accountContent",computeTotal(accountContent?.credit?.amount))

  return (
    <Card
      variant="outlined"
      sx={{
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
      }}
    >
      <CardHeader sx={{
        paddingBottom : "10px"
      }} align="center" title={accountContent.title} />
      <Divider/>
      <Stack sx={{p:3}} spacing={3} Stack direction="row" flexWrap="wrap" alignItems="center" justifyContent="space-between">
      <Stack>
        <Typography variant="h6">Debit</Typography>
        {
            accountContent?.debit?.amount.map((item)=>(
                <Typography variant="subtitle2">{item}</Typography>

            ))
        }
      </Stack>
      <Stack>
      <Typography variant="h6">Credit</Typography>
      {
            accountContent?.credit?.amount.map((item)=>(
                <Typography variant="subtitle2">{item}</Typography>

            ))
        }
      </Stack>
      </Stack>

      <Divider/>

      <Stack sx={{p:3}} spacing={3} Stack direction="row" flexWrap="wrap" alignItems="center" justifyContent="space-between">
        {/* Debit Total */}
        <Typography variant="h5">{computeTotal(accountContent?.debit?.amount)}</Typography>
        {/* Credit Total */}
      <Typography variant="h5">{computeTotal(accountContent?.credit?.amount)}</Typography>
      </Stack>
    </Card>
  )
}

// ----------------------------------------------------------------------

AccountItem.propTypes = {
  account: PropTypes.shape({
    amount: PropTypes.number,
    accountName: PropTypes.string,
  }),
  index: PropTypes.number,
}

function AccountItem({ account, index }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Typography variant="subtitle2">{account.accountName}</Typography>
      <Typography variant="subtitle2">{account.amount}</Typography>
    </Stack>
  )
}

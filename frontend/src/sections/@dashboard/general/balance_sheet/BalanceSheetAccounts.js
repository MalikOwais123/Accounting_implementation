import PropTypes from 'prop-types'
import orderBy from 'lodash/orderBy'
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles'
import { Box, Stack, Card, Avatar, CardHeader, Typography } from '@mui/material'
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

BalanceSheetAccounts.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error']),
  title: PropTypes.string,
};


export default function BalanceSheetAccounts({ title = 'Assets', itemsList, color = 'primary' }) {
  const theme = useTheme()

  return (
      <Card
        variant="outlined"
        sx={{
          color: (theme) => theme.palette[color].darker,
          bgcolor: (theme) => theme.palette[color].lighter,
        }}
      >
        <CardHeader title={title} />
        {
          <Stack spacing={3} sx={{ p: 3 }}>
            {itemsList?.length > 0 &&
              itemsList?.map((acc, index) => <AccountItem key={acc.id} account={acc} index={index} />)}
            {itemsList?.length === 0 && <Typography variant="subtitle2">No accounts for {title}</Typography>}
          </Stack>
        }
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

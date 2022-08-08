// @mui
import { TableCell, Typography } from '@mui/material'

const LastTotalRow = ({ debitAmount, creditAmount }) => {
  return (
    <>
      <TableCell>
        <Typography variant="h5" noWrap>
          Total
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="h5" noWrap my={1}>
          {debitAmount}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="h5" noWrap my={1}>
          {creditAmount}
        </Typography>
      </TableCell>
    </>
  )
}

export default LastTotalRow

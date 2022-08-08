import React, { useState, useEffect } from 'react'
// @mui
import { TableCell, Divider,IconButton, MenuItem, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// @utils
import { getStatusByValue, getStatusClr } from 'src/utils/roles'
// @packages
import { useSnackbar } from 'notistack'
import { sentenceCase } from 'change-case'
import Iconify from 'src/components/Iconify'
// @components

const ICON = {
  mr: 2,
  width: 20,
  height: 20,
}

const GeneralListRowDetail = ({ rowData, deleteRisk, isDeleteLoading }) => {
  const theme = useTheme()
  const [showModal, setShowModal] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const onOkHanldler = async () => {
    try {
      const { status } = await deleteRisk(row.id)
      if (status === 200) {
        enqueueSnackbar('Risk deleted successfully', { variant: 'success' })
        setShowModal(false)
      }
    } catch (err) {
      console.log(err)
      enqueueSnackbar(err.message, { variant: 'error' })
    }
  }

  return (
    <>
      <TableCell sx={{width:"180px"}}>{rowData.date}</TableCell>
      <TableCell > 
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2" noWrap my={1}>
            {rowData.debitAccount}
          </Typography>
          <Typography align="center" variant="subtitle2" noWrap my={1}>
            {rowData.creditAccount}
          </Typography>
        </Stack>
          {/* <Typography variant="caption" wrap my={1}>
            any short explanationdfs dfsdfsdfsdfsdf sd fsf dsdfsdfsdfsdfsdfsfs explanationdfsdfsdfsdfsdfsdfsdfsfdsdfsdfsdfsdfsdfsfs
        </Typography> */}
      </TableCell>
      <TableCell>
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2" noWrap my={1}>
            
        {rowData.debitAmount}
          </Typography>
          <Typography variant="subtitle2" noWrap my={1} >
            ........
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2" noWrap my={1}>
          ........
          </Typography>
          <Typography variant="subtitle2" noWrap my={1}>
        {rowData.creditAmount}
          </Typography>
        </Stack>
      </TableCell>
      {/* <TableCell>
        <Label variant={'ghost'} color={getStatusClr(row.status)}>
          {sentenceCase(getStatusByValue(row.status))}
        </Label>
      </TableCell> */}

        {/* //~MULTIPLE ACTIONS POPOVER FOR NOW COMMENTED */}
      {/* <TableCell align="center">
        <MoreMenuButton onDelete={onRowDelete} id={row.id} isSuccess={isDeleteSuccess} isLoading={isDeleteLoading} />
        <Iconify
          onClick={() => setShowModal(true)}
          icon={'eva:trash-2-outline'}
          sx={{ cursor: 'pointer', ...ICON }}
          color={theme.palette.error.main}
        />
      </TableCell> */}

      {/* <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onOk={onOkHanldler}
        isLoading={isDeleteLoading}
      /> */}
    </>
  )
}

export default GeneralListRowDetail

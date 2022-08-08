import React, { useState, useEffect } from 'react'
// @mui
import { TableCell, Divider, IconButton, MenuItem, Stack, Typography } from '@mui/material'
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

const TrialBalanceRowDetail = ({ rowData, deleteRisk, isDeleteLoading }) => {
    console.log("rowData",rowData)
  const theme = useTheme()
  const [showModal, setShowModal] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  return (
    <>
      <TableCell>
          <Typography variant="subtitle2" noWrap >
            {rowData.title}
          </Typography>
      </TableCell>
      <TableCell>
          <Typography variant="subtitle2" noWrap my={1}>
            {rowData?.accDetail?.nature === "debit" ? rowData?.accDetail?.amount : " "}
          </Typography>
      </TableCell>
      <TableCell>
          <Typography variant="subtitle2" noWrap my={1}>
            {rowData?.accDetail?.nature === "credit" ? rowData?.accDetail?.amount : " "}
          </Typography>
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

export default TrialBalanceRowDetail

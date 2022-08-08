import { useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Typography,
  CardHeader,
  Divider,
} from '@mui/material'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import useSettings from 'src/hooks/useSettings'
import { PATH_DASHBOARD } from 'src/routes/paths'
// layouts
import Layout from 'src/layouts'
import { useDeleteAccountByID } from 'src/query'
import NextLink from 'next/link'
import Iconify from 'src/components/Iconify'
import Scrollbar from 'src/components/Scrollbar'
import Label from 'src/components/Label'
import { AccountMoreMenu } from 'src/sections/@dashboard/accounts/list'
import { getStatusClr } from 'src/utils/roles'
import { sentenceCase } from 'change-case'
import { useTheme } from '@mui/material/styles'
import ConfirmModal from 'src/components/dialogs/ConfirmModal'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useGetAllJournalEntries } from 'src/query/GeneralJournal/queries'
import GeneralListRowDetail from 'src/sections/@dashboard/generalJourals/list/GeneralListRowDetail'

const ICON = {
  mr: 2,
  width: 20,
  height: 20,
}

const getTransformData = (d) => {
  if(!d) return null
  else {
    const _data = d.map((el)=>{
      return {
        date : el?.date,
        id : el?.id ,
        debitAccount : el?.debit?.[0].attributes?.title,
        creditAccount : el?.credit?.[0].attributes?.title,
        debitAmount : el?.debit?.amount,
        creditAmount : el?.credit?.amount,
      }
    })
    return _data
  }
}

const List = () => {
  const [showModal, setShowModal] = useState(false)
  const { themeStretch } = useSettings()
  const { enqueueSnackbar } = useSnackbar()
  const { push } = useRouter()
  const theme = useTheme()

  const { data, isLoading } = useGetAllJournalEntries()
  const _modifyData = getTransformData(data)
  console.log("_modifyData",_modifyData)
  const { mutateAsync: deleteAccount, isLoading: isDeleteLoading } = useDeleteAccountByID()
  const headingData = ['Date', 'Account', 'Debit', 'Credit']

  const onOkHanldler = async (id) => {
    try {
      const { status } = await deleteAccount(id)
      console.log('status', status)
      if (status === 200) {
        enqueueSnackbar('Account deleted successfully', { variant: 'success' })
        setShowModal(false)
      }
    } catch (err) {
      console.log(err)
      enqueueSnackbar(err.message, { variant: 'error' })
    }
  }

  return (
    <Page title="General: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="General Journals List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'General Journals', href: PATH_DASHBOARD.generalJournals.list },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.generalJournals.new} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Entry
              </Button>
            </NextLink>
          }
        />

        <Card>
          {/* TITLE OF TABLE */}
          {<CardHeader title="Journals" sx={{ mb: 3 }} />}{' '}
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
                  {_modifyData?.map((row) => {

                    return (
                      <TableRow hover key={row.id} >
                        <GeneralListRowDetail rowData={row}/>
                      </TableRow>
                    )
                  })}
                  {/* <TableRow hover>
                    <GeneralListRowDetail rowData={rowContent} />
                  </TableRow> */}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  )
}

// ----------------------------------------------------------------------

List.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default List
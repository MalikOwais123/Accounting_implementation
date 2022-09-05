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
} from '@mui/material'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import useSettings from 'src/hooks/useSettings'
import { PATH_DASHBOARD } from 'src/routes/paths'
// layouts
import Layout from 'src/layouts'
import { useDeleteAccountByID, useGetAllAccounts } from 'src/query'
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

const ICON = {
  mr: 2,
  width: 20,
  height: 20,
}

const List = () => {
  const [showModal, setShowModal] = useState(false)
  const { themeStretch } = useSettings()
  const { enqueueSnackbar } = useSnackbar()
  const { push } = useRouter()
  const theme = useTheme()

  const { data, isLoading } = useGetAllAccounts()
  const { mutateAsync: deleteAccount, isLoading: isDeleteLoading } = useDeleteAccountByID()
  const headingData = ['Name', 'Nature']

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
    <Page title="Account: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Account', href: PATH_DASHBOARD.accounts.list },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.accounts.new} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Account
              </Button>
            </NextLink>
          }
        />

        <Card>
          {/* TITLE OF TABLE */}
          <CardHeader title='Accounts' sx={{ mb: 3 }} />
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
                      <TableCell />
                    </TableRow>
                  </TableHead>
                )}

                <TableBody>
                  {data?.map((row) => {
                    const { id, title, role, nature, description, avatarUrl, isVerified } = row

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell>
                          <Typography variant="subtitle2" noWrap>
                            {title}
                          </Typography>
                        </TableCell>
                        {/* <TableCell align="left">{description}</TableCell> */}
                        <TableCell size="small" align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={getStatusClr(nature)}
                          >
                            {sentenceCase(nature)}
                          </Label>
                        </TableCell>
                        <TableCell align="right" size="small">
                          {/* //~MULTIPLE ACTIONS POPOVER FOR NOW COMMENTED */}
                          {/* <MoreMenuButton onDelete={onRowDelete} id={row.id} isSuccess={isDeleteSuccess} isLoading={isDeleteLoading} /> */}
                          <Iconify
                            onClick={() => {
                              push(`${PATH_DASHBOARD.accounts.root}/${id}/edit`)
                            }}
                            icon={'ci:edit'}
                            sx={{ cursor: 'pointer', ...ICON }}
                            // color={theme.palette.error.main}
                          />
                          <Iconify
                            onClick={() => setShowModal(true)}
                            icon={'fluent:delete-24-regular'}
                            sx={{ cursor: 'pointer', ...ICON }}
                            color={theme.palette.error.main}
                          />
                        </TableCell>
                        <ConfirmModal
                          show={showModal}
                          onClose={() => setShowModal(false)}
                          onOk={() => onOkHanldler(id)}
                          isLoading={isDeleteLoading}
                        />
                      </TableRow>
                    )
                  })}
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

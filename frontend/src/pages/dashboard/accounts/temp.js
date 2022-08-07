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
} from '@mui/material'
import React from 'react'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import useSettings from 'src/hooks/useSettings'
import { PATH_DASHBOARD } from 'src/routes/paths'
// layouts
import Layout from 'src/layouts'
import { useGetAllAccounts } from 'src/query'
import NextLink from 'next/link'
import Iconify from 'src/components/Iconify'
import Scrollbar from 'src/components/Scrollbar'
import Label from 'src/components/Label'
import { AccountMoreMenu } from 'src/sections/@dashboard/accounts/list'
import { getStatusClr } from 'src/utils/roles'
import { sentenceCase } from 'change-case'
import { useTheme } from '@mui/material/styles'

const Temp = () => {
  const { themeStretch } = useSettings()
  const theme = useTheme()

  const { data, isLoading } = useGetAllAccounts()
  const headingData = ['Name', 'des', 'Nature']
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
                        <TableCell align="left">{description}</TableCell>
                        <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={getStatusClr(nature)}
                          >
                            {sentenceCase(nature)}
                          </Label>
                        </TableCell>
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

Temp.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default Temp

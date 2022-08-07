import { paramCase, capitalCase } from 'change-case'
// next
import { useRouter } from 'next/router'
// @mui
import { Container } from '@mui/material'
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths'
// hooks
import useSettings from '../../../../hooks/useSettings'
// _mock_
import { _userList } from '../../../../_mock'
// layouts
import Layout from '../../../../layouts'
// components
import Page from '../../../../components/Page'
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs'
// sections
import AccountNewForm from '../../../../sections/@dashboard/accounts/AccountNewForm'
import { useQueryClient } from 'react-query'
import { accountsKeys } from 'src/query/Keys/Accounts'
import { getAccountByID } from 'src/query'

// ----------------------------------------------------------------------

UserEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function UserEdit() {
  const { themeStretch } = useSettings()
  const { query } = useRouter()
  const { id } = query

  const { data} = getAccountByID(id)
  const _currentAccount = {...data?.data?.attributes,id : data?.data?.id}

  return (
    <Page title="Account: Edit account">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Account', href: PATH_DASHBOARD.user.list },
            { name: capitalCase(name) },
          ]}
        />

        <AccountNewForm isEdit currentAccount={_currentAccount} />
      </Container>
    </Page>
  )
}

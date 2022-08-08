import { useMutation, useQuery, useQueryClient } from 'react-query'
import { balanceSheetKey } from '../Keys/Accounts'
import {
    getLedgersAccountsAPI,
} from './service'

// ~all
export const useGetLedgersAccounts = () =>
  useQuery(balanceSheetKey.ledgers(), () => getLedgersAccountsAPI(), {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnmount: true,
  })

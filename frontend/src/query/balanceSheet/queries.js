import { useMutation, useQuery, useQueryClient } from 'react-query'
import { balanceSheetKey } from '../Keys/Accounts'
import {
    getLedgersAccountsAPI,
    getAdjustedLedgersAPI
} from './service'

// ~all
export const useGetLedgersAccounts = () =>
  useQuery(balanceSheetKey.ledgers(), () => getLedgersAccountsAPI(), {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnmount: true,
  })


// ~all adjusted legders
export const useGetAdjustedLedgers = () =>
  useQuery(balanceSheetKey.adjustedLedgers(), () => getAdjustedLedgersAPI(), {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnmount: true,
  })

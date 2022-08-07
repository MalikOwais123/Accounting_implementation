import { useMutation, useQuery, useQueryClient } from 'react-query'
import { accountsKeys } from '../Keys/Accounts'
import {
  getAccountsAPI,
  createAccountAPI,
  getAccountByIDAPI,
  editAccountDetailAPI,
  deleteAccountByIDAPI,
} from './service'

// ~all
export const useGetAllAccounts = () =>
  useQuery(accountsKeys.all(), () => getAccountsAPI(), {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnmount: true,
  })

// ~by id
export const getAccountByID = (id) => useQuery(accountsKeys.detail(id), () => getAccountByIDAPI(id))

// ~create
export const useCreateAccount = () => {
  const queryClient = useQueryClient()
  return useMutation(createAccountAPI, {
    onSuccess: () => {
      // refetch the latest data
      queryClient.invalidateQueries(accountsKeys.all())
    },
  })
}

// ~update
export const useEditAccountDetail = (id) => {
  const queryClient = useQueryClient()
  return useMutation(({ ...payload }) => editAccountDetailAPI(id, payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(accountsKeys.all())
    },
  })
}

// ~delete
export const useDeleteAccountByID = () => {
  const queryClient = useQueryClient()
  return useMutation(deleteAccountByIDAPI, {
    onSuccess: () => {
      queryClient.invalidateQueries(accountsKeys.all())
    },
  })
}

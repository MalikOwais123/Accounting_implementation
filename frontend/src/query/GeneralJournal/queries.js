import { useMutation, useQuery, useQueryClient } from 'react-query'
import { generalKeys } from '../Keys/Accounts'
import {
  getAllJournalEntriesAPI,
  createGeneralEntryAPI,
  getAccountByIDAPI,
  editAccountDetailAPI,
  deleteAccountByIDAPI,
  createAdjustmentEntryAPI,
  getAllAdjustedEntiresAPI,
} from './service'

// ~all
export const useGetAllJournalEntries = () =>
  useQuery(generalKeys.all(), () => getAllJournalEntriesAPI(), {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnmount: true,
  })

// ~all adjusted entries
export const useGetAllAdjustedEntires = () =>
  useQuery(generalKeys.adjsutedEntiries(), () => getAllAdjustedEntiresAPI(), {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnmount: true,
  })

// // ~by id
// export const getAccountByID = (id) => useQuery(generalKeys.detail(id), () => getAccountByIDAPI(id))

// ~create general entry
export const useCreateGeneralEntry = () => {
  const queryClient = useQueryClient()
  return useMutation(createGeneralEntryAPI, {
    onSuccess: () => {
      // refetch the latest data
      queryClient.invalidateQueries(generalKeys.all())
    },
  })
}

// ~create adjustmenr entry
export const useCreateAdjustmentEntry = () => {
  const queryClient = useQueryClient()
  return useMutation(createAdjustmentEntryAPI, {
    onSuccess: () => {
      // refetch the latest data
      queryClient.invalidateQueries(generalKeys.all())
    },
  })
}

// // ~update
// export const useEditAccountDetail = (id) => {
//   const queryClient = useQueryClient()
//   return useMutation(({ ...payload }) => editAccountDetailAPI(id, payload), {
//     onSuccess: () => {
//       queryClient.invalidateQueries(generalKeys.all())
//     },
//   })
// }

// // ~delete
// export const useDeleteAccountByID = () => {
//   const queryClient = useQueryClient()
//   return useMutation(deleteAccountByIDAPI, {
//     onSuccess: () => {
//       queryClient.invalidateQueries(generalKeys.all())
//     },
//   })
// }

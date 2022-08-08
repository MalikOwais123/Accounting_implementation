import axios from 'src/utils/axios'
const { get, post, put, delete: del } = axios

const SERVICE_URLS = {
  getAll: () => `/api/general-journals`,
  accountByID: (id) => `/api/accounts/${id}`,
  createEntry: () => `/api/general-journals`,
}

// *ALL
export const getAllJournalEntriesAPI = async () => {
  const { data } = await get(SERVICE_URLS.getAll())

  const _data = data.data.map((d) => {
    return { ...d.attributes, id: d.id }
  })

  return _data
}

// *BY ID
export const getAccountByIDAPI = async (id) => {
  const { data } = await get(SERVICE_URLS.accountByID(id))
  return data
}

// *CREATE
export const createGeneralEntryAPI = async (body) => {
  const { data, status } = await post(SERVICE_URLS.createEntry(), body)
  return { data, status }
}
// *UPDATE
export const editAccountDetailAPI = async (id, body) => {
  const { data, status } = await put(SERVICE_URLS.accountByID(id), body)
  return { data, status }
}
// *DELETE
export const deleteAccountByIDAPI = async (id) => {
  const { data, status } = await del(SERVICE_URLS.accountByID(id))
  return { data, status }
}

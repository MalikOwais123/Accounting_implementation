import axios from 'src/utils/axios'
const { get, post, put, delete: del } = axios

const SERVICE_URLS = {
  getAccounts: () => `/api/accounts`,
  accountByID: (id) => `/api/accounts/${id}`,
  createAccount: () => `/api/accounts`,
}

// *ALL
export const getAccountsAPI = async () => {
  const { data } = await get(SERVICE_URLS.getAccounts())

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
export const createAccountAPI = async (body) => {
  const { data, status } = await post(SERVICE_URLS.createAccount(), body)
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

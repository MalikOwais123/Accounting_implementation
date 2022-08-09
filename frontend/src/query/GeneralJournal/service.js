import axios from 'src/utils/axios'
const { get, post, put, delete: del } = axios

const SERVICE_URLS = {
  getAll: () => `/api/general-journals`,
  accountByID: (id) => `/api/accounts/${id}`,
  createEntry: () => `/api/general-journals`,
  createAdjustmentEntry: () => `/api/adjusted-entries-records`,
  postToLedger: () => `/api/ledger/work`,
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

// *CREATE GENERAL ENTRY
export const createGeneralEntryAPI = async (body) => {
  try {
    const { data, status: createSt } = await post(SERVICE_URLS.createEntry(), body)
    if (createSt === 200) {
      //  ~when entry created then posted to legder by make this following api works
      const { status } = await get(SERVICE_URLS.postToLedger())
      return { data, status }
    }
  } catch (err) {
    return err
  }
}

// *CREATE ADJUSTMENT ENTRY
export const createAdjustmentEntryAPI = async (body) => {
  try {
    const { data, status: createSt } = await post(SERVICE_URLS.createAdjustmentEntry(), body)
      return { data,createSt }
    // if (createSt === 200) {
    //   //  ~when entry created then posted to legder by make this following api works
    //   const { status } = await get(SERVICE_URLS.postToLedger())
    //   return { data, status }
    // }
  } catch (err) {
    return err
  }
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

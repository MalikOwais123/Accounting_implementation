import axios from 'src/utils/axios'
const { get } = axios

const SERVICE_URLS = {
  ledgers: () => `/api/ledgers`,
  adjustedLedgers: () => `/api/adjusted-ledgers`,
}

// *ALL
export const getLedgersAccountsAPI = async () => {
  const { data } = await get(SERVICE_URLS.ledgers())

//   const _data = data.data.map((d) => {
//     return { ...d.attributes, id: d.id }
//   })

  return data
}

// * ALL ADJUSTED
export const getAdjustedLedgersAPI = async () => {
  const { data } = await get(SERVICE_URLS.adjustedLedgers())

//   const _data = data.data.map((d) => {
//     return { ...d.attributes, id: d.id }
//   })

  return data
}

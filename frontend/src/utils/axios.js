import axios from 'axios'

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: process.env.HOST_API_KEY || '' })

axiosInstance.interceptors.request.use(
  (request) => {
    // console.log("interceptors.request", request)
    return request
  },
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
)

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("interceptors.response", response)
    return response
  },
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
)

export default axiosInstance

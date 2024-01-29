// Import the 'axios' library for making HTTP requests.
import { AxiosError } from 'axios'
import axios from './ajax' // Import AxiosResponse and AxiosError types from your 'ajax' module

// Import the 'api' module that presumably contains endpoint URLs.
import api from './api'

interface ApiResponse {
   baseUrl: string
   keyLicense: string
}

async function fetchLicenseKey() {
   try {
      const response = await fetch('/api/baseUrl')
      const data: ApiResponse = await response.json()
      return data.keyLicense
   } catch (error) {
      // console.error('Error fetching API URL', error)
   }
}
async function fetchApiUrl() {
   try {
      const response = await fetch('/api/baseUrl')
      const data: ApiResponse = await response.json()
      return data.baseUrl
   } catch (error) {
      // console.error('Error fetching API URL', error)
   }
}
// Define an asynchronous function called 'login' that takes a 'post' object as an argument.
async function login(post: {
   username: string
   password: string
   twoFactorAuthenticationCode?: string
}) {
   try {
      // Send a POST request to the 'api.login' endpoint using 'axios'.
      const baseURL = await fetchApiUrl()
      const response = await axios.post(`${baseURL}${api.login}`, post)
      // const response = await fetch('/api/apiUrl')
      //       const data: ApiResponse = await response.json()
      // Successful response, return the data.
      return response as {
         url: string
      }
   } catch (error) {
      // Explicitly cast the 'error' object to the 'AxiosError' type to access its properties.
      const axiosError = error as AxiosError
      if (axiosError.response) {
         // Handle errors from the response.
         const data: {
            message: string
         } = axiosError.response.data as { message: string }
         if (data && data.message) {
            throw new Error(`${data && data.message}`)
         } else {
            throw new Error(
               `Login failed with status ${axiosError.response.status}`
            )
         }
      } else {
         // Handle network errors, timeouts, or other exceptions.
         throw new Error(`Login failed: ${axiosError.message}`)
      }
   }
}
async function getQuickReport(post: any) {
   const res: any = await axios.post(api.quickReport, post)
   return res.data
}
// Export the 'login' function so it can be used in other parts of the application.
export { fetchLicenseKey, login, getQuickReport }

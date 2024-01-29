// Import the 'axios' library for making HTTP requests and 'AxiosResponse' type.
import axios, { AxiosResponse } from 'axios'

// Import 'getCookie' and 'setCookie' functions from 'cookies-next' for managing cookies.
import { getCookie, setCookie } from 'cookies-next'


// Define the base URL for your API.
const BASE_URL = ''

// Create an instance of 'axios' with the base URL and default headers.
const mainAxios = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
})

// Add response interceptors to the 'mainAxios' instance.
mainAxios.interceptors.response.use(
   // This function handles successful responses.
   (res: AxiosResponse) => res,

   // This function handles errors or unsuccessful responses.
   async (error) => {
      if (error.response) {
         // Extract the HTTP status code from the response.
         const { status } = error.response

         // Check if the status code indicates an unauthorized request.
         if (status === 401 || status === 0) {
            // Get the access token from cookies.
            const accessToken = getCookie('access_token') as string

            // If an access token exists, clear it and reload the window to log the user out.
            if (accessToken) {
               setCookie('access_token', '')
               window.location.reload()
            }
         }
      }

      // Reject the promise with the error to propagate it to the caller.
      return Promise.reject(error)
   }
)

// Define a function 'post' for making POST requests.
async function post<T>(url: string, data: {}): Promise<T> {
   // Get the access token from cookies, or use an empty string if it doesn't exist.
   const TOKEN = (getCookie('access_token') as string) || ''

   // Define the 'headers' function within the 'post' function to set request headers.
   const headers = (token: string) => ({
      'Content-Type': 'application/json',
      bearer: token,
   })

   try {
      // Make a POST request using 'mainAxios' with the provided URL, data, and headers.
      const response: AxiosResponse<T> = await mainAxios.post(url, data, {
         headers: headers(TOKEN),
      })

      // Return the response data from the successful request.
      return response.data
   } catch (error) {
      // Reject the promise with the error to propagate it to the caller.
      return Promise.reject(error)
   }
}

// Create an 'ajax' object with a 'post' method and export it.
const ajax = {
   post,
}

// Export the 'ajax' object as the default export of this module.
export default ajax

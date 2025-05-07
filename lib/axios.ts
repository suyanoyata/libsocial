import { logger } from "@/lib/logger"
import { useProperties } from "@/store/use-properties"
import axios from "axios"

export const site_id = 1

export const api = axios.create({
  baseURL: "http://192.168.50.44:3000/api",
  withCredentials: true,
  headers: {
    "Site-Id": useProperties.getState().siteId,
    "Content-Type": "application/json",
    // Referer: "https://mangalib.me/",
    // Origin: "https://mangalib.me",
    // "User-Agent":
    //   "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  },
  timeout: 5000,
  timeoutErrorMessage: "Timed out",
})

api.interceptors.request.use(
  (request) => {
    logger.request(
      `${request.method?.toUpperCase()} ${request.baseURL}${request.url}`,
    )
    return request
  },
  (error) => {
    console.log(`Request rejected ${error}`)
  },
)
api.interceptors.response.use(
  (response) => {
    return response
  },
  function (error) {
    if (error.response) {
      logger.error(
        `${error.response.status} ${JSON.stringify(error.response.data)}`,
      )
    } else {
      logger.error(`Request rejected ${error}`)
    }
    return Promise.reject(error)
  },
)

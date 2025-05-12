import { useProperties } from "@/store/use-properties"
import axios from "axios"

export const site_id = 1

export const api = axios.create({
  baseURL: "http://192.168.50.48:3000/api",
  withCredentials: true,
  headers: {
    "Site-Id": useProperties.getState().siteId,
    "Content-Type": "application/json",
  },
  timeout: 5000,
  timeoutErrorMessage: "Timed out",
})

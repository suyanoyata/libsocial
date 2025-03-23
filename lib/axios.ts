// import { Storage, storage } from "@/features/shared/lib/storage";
import { logger } from "@/lib/logger";
import { useProperties } from "@/store/use-properties";
import axios from "axios";

// export const token = storage.getString(Storage.token) || "";
export const site_id = 1;

export const api = axios.create({
  // baseURL: "https://api2.mangalib.me/api",
  baseURL: "http://192.168.50.44:3000/api",
  headers: {
    Referer: "https://mangalib.me/",
    Origin: "https://mangalib.me",
    "Site-Id": useProperties.getState().siteId,
    // "Site-Id": "1",
    // Authorization: token,
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  },
  timeout: 5000,
  timeoutErrorMessage: "Timed out",
});

api.interceptors.request.use(
  (request) => {
    logger.request(`${request.method?.toUpperCase()} ${request.baseURL}${request.url}`);
    return request;
  },
  (error) => {
    console.log(`Request rejected ${error}`);
  }
);
api.interceptors.response.use((response) => {
  if (response.status.toString().startsWith("4")) {
    logger.response(JSON.stringify(response.data.data));
  }
  return response;
});

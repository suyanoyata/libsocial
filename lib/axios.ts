import axios from "axios";

export const token = "";
export const site_id = 1;

export const api = axios.create({
  baseURL: "https://api.mangalib.me/api",
  headers: {
    "Site-Id": site_id,
    Authorization: token,
    "Content-Type": "application/json",
  },
  timeout: 5000,
  timeoutErrorMessage: "Timed out",
});

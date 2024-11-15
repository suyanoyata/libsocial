import axios from "axios";

export const token = "";
export const site_id = 5;

export const api = axios.create({
  baseURL: "http://api.lib.social/api",
  headers: {
    "Site-Id": site_id,
    Authorization: token,
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  },
  timeout: 5000,
  timeoutErrorMessage: "Timed out",
});

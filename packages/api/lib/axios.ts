// import { Logger } from "lib/logger";
import axios from "axios";

const site_id = 5;
const token = process.env.API_TOKEN;

// const NetworkLogger = new Logger("Axios");

export const api = axios.create({
  // withCredentials: true,
  baseURL: "https://api.cdnlibs.org/api",
  headers: {
    // "Site-Id": site_id,
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    Authorization: token,
  },
});

// api.interceptors.request.use(
//   (request) => {
//     NetworkLogger.log(`${request.method?.toUpperCase()} ${request.baseURL}${request.url}`);
//     return request;
//   },
//   (error) => {
//     console.log(`Request rejected ${error}`);
//   }
// );

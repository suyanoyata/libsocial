import axios from "axios";
import { logger } from "./logger";

export const token =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOGNmOWEwZWZmMWYyYmJiZjQyYmQ1ZWI2Yjg5YWYzZGM1MTI1YWYxNDRiMzE0OTdjODg4Mjk2MDliNjVhMDNlZDc3YzE3ZGE3YTkwOTcwMzQiLCJpYXQiOjE3MzExOTUyOTYuMTY1Mzk0LCJuYmYiOjE3MzExOTUyOTYuMTY1Mzk1LCJleHAiOjE3MzM3ODcyOTYuMTYxNjk0LCJzdWIiOiI2ODIyOTYiLCJzY29wZXMiOltdfQ.f_AUQkLrBbNVHR_CXtdGZPgcnQnZY1bVhfbi8j7KGWBMfAovpQjns1XzD2LWMIY1XkEWva3YEVN1gx2ng_GeCSh6ps6avUyGhw12kiyBjE7upSF5XgyIYUPi3CNkt_OpOB4shT5knJzBpsXXJrFuTVaIm0XLRsYwKP_ZKrnmTbiG1s67CCRHJvdGSQSx9Q3moBfA2mQ04trFciKhUl2YQpi8soCfFNOzooCfd-Y24VIaGFDfnwKKDxQTAD9cOMerfuY-IEn0tuN5XUPop0YZh_9dqb-EvlpWNE0YzWUGB8TWjCpB4s7tJb7d-v4pt83tnBJstsfTtOtWV4gZzoe3CI6DtoKunszlGyjJabRMpB65lHZdMlv9JSTTxqxx8G4WEsEhpSTawkWYunNoWKnJK5-irzqhgiGXSLgxQ8KKeRbcJ2z4paUoyuxlHSOL6DlzwMHbexlb8RpZ2n1n-pCm9RnBhzAMexKTvvb3iBaeBSivOaqeP6QwQxWjw708Mtesd9uzkCACUUgxvn_PFzksmTXWSDlwbFBVj3xmb6AdptN_BFBqawid-ZgASqlOJoXfNYPT4eAxVA7qQzFt3qhkSOz1gy8eqM0fjRfx5QmOQw_tOvZyGdblga2NTcF-A_r6f4ovYLQy_heOlK6_d5ggnIlrtcM52d4txJixrCMSsys";
export const site_id = 1;

export const api = axios.create({
  baseURL: "https://api.mangalib.me/api",
  headers: {
    "Site-Id": site_id,
    Authorization: token,
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  },
  timeout: 5000,
  timeoutErrorMessage: "Timed out",
});

export function initLoggers() {
  api.interceptors.request.use(
    (request) => {
      logger.request(
        `${request.method?.toUpperCase()} ${request.baseURL}${request.url}`
      );
      return request;
    },
    (error) => {
      console.log(`Request rejected ${error}`);
    }
  );
  // api.interceptors.response.use((response) => {
  //   logger.response(JSON.stringify(response.data.data));

  //   return response;
  // });
}

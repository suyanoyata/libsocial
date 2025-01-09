import { logger } from "@/lib/logger";
import axios from "axios";

export const token =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNzU3NzU4ZjZiNTAzY2JjOTkwZjgyNWJhMzRkOWEzYWMxYzQ0ZjgxYzAwMmIxNzc5MWQyZjQ4OTYyMzM0Njc2OGUyN2Y3ZmE5MDI2ZjZlZWUiLCJpYXQiOjE3MzYzNjc5MzkuMDcwMTg0LCJuYmYiOjE3MzYzNjc5MzkuMDcwMTg2LCJleHAiOjE3MzkwNDYzMzkuMDY2NDc0LCJzdWIiOiI2ODIyOTYiLCJzY29wZXMiOltdfQ.W1UhCQRJ0pnjG_yTY4W6ORyVLiOFYmBjn9pcLndhM93KFmgjxweXT7WALquwD5FULmIjQkf70t03H4jXq26EU9ZF_QDFoUOQK-Bl227KZBvxBed7hcXwOpOWV-soIrO8iOcRAXKA4VNMCGFd826A3c-ly3DJO0WYgy0368RvGdixcOfH2tkxrdUdF-PUcm9kqetlnqLOpusGs1hWkl8MDOP-8jlqgsrVUnaYVlCiFvhyL1yZoOuH5N3Qd9Lsn5UMtIuAbFOpvi-73JqKqwVRz_PGFUD7ZswU21KuX4SNPxx0AjPJ3S46WFjBlRPgOe5gtcO23D4iE8hM2aanPaqQgKR_4L3Vibr7AC_WN4lz0kT_G56G7R4HjpHqZvE0gKCXZ5JIXGLHCg1lMMRyc2lK9YqPdEcolRFnKOdNZIOKZ5VUZnulkrNuMVQBSRQslzSXxgfD2emCY1Ly1Y6L4kIfSKj2zA4aEMnBtJQZvQgQg0T_SI8Z95pj-z6COeTpkoDj69kTBYydP532seukbRO5jR9Q0gFfvA_Mz0QQQ_ryrWQhSJQup18cn0b4KbVRgbpfPyiTJG7x3psQYCtkcOLPLDvRZlMaeclN9ohxavFWx-rda0cKFhb0c8zIWS8B9hfUJzu1eooZ3eDMsU5m01xyLkL0JXlegAI9vM8PZPbD6Bg";
export const site_id = 5;

export const api = axios.create({
  baseURL: "https://api2.mangalib.me/api",
  headers: {
    Referer: "https://anilib.me/",
    Origin: "https://anilib.me",
    Dnt: "1",
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
  api.interceptors.response.use((response) => {
    if (response.status.toString().startsWith("4")) {
      logger.response(JSON.stringify(response.data.data));
    }
    return response;
  });
}

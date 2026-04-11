import axios from "axios";
import { useAppStore } from "../../stores";
import { BASE_URL } from "../../config/Config";
import { useToast } from "../context/ToastContext";

export const useFetchData = () => {
  const { showToast } = useToast();

  const fetchData = async (apiname, method = "get", body = null) => {
    const dbData = useAppStore.getState().dbData;
    let API_URL = dbData?.apilink || BASE_URL;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(dbData?.sKey && { Skey: dbData.sKey }),
      ...(dbData?.token && { Authorization: "bearer " + dbData.token }),
    };
    const url = API_URL + apiname;
    const config = { headers, timeout: 20000 };
    try {
      const response = await (method === "get"
        ? axios.get(url, config)
        : axios.post(url, body, config));
      switch (response.status) {
        case 200:
          return response.data;
        case 201:
          return response.data;
        case 400:
          showToast({ message: "Bad Request", type: "error" });
          break;
        case 401:
          showToast({ message: "Unauthorized", type: "error" });
          break;
        default:
          showToast({ message: "An error occurred", type: "error" });
          break;
      }
    } catch (err) {
      const error = err && typeof err === "object" ? err : {};
      const status = error.response?.status;
      const responseData = error.response?.data;
      const serverMessage =
        (typeof responseData === "string" && responseData) ||
        responseData?.message ||
        responseData?.error ||
        responseData?.title ||
        null;
      const msg = serverMessage || error.message || "Network request failed";
      const code = error.code;
      if (status != null) {
        switch (status) {
          case 400:
            showToast({ message: msg, type: "error" });
            break;
          case 401:
            showToast({ message: msg, type: "error" });
            break;
          default:
            showToast({ message: msg, type: "error" });
            break;
        }
      } else {
        try {
          if (code === "ERR_NETWORK" || msg === "Network Error") {
            showToast({
              message:
                "Cannot reach server. Use the same Wi‑Fi as your computer, or open the server URL in this device’s browser to test.",
              type: "error",
              duration: 5000,
            });
          } else if (code === "ECONNABORTED") {
            showToast({
              message: "Request timed out. Server may be slow or unreachable.",
              type: "error",
            });
          } else {
            showToast({ message: String(msg), type: "error" });
          }
        } catch (toastErr) {
          showToast({ message: String(toastErr), type: "error" });
        }
      }
    }
    return null;
  };

  return { fetchData };
};

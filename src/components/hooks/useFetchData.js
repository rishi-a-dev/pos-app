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
      ...(dbData?.skey && { Skey: dbData.skey }),
      ...(dbData?.token && { Authorization: "bearer " + dbData.token }),
    };

    try {
      const response = await (method === "get"
        ? axios.get(API_URL + apiname, { headers })
        : axios.post(API_URL + apiname, body, { headers }));
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
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
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
      } else {
        showToast({ message: "An error occurred", type: "error" });
      }
    }
    return null;
  };

  return { fetchData };
};

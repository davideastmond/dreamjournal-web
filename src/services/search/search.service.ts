import axios from "axios";
import { API_URL, AUTH_HEADER } from "../../environment";
export const doSearch = async ({ data }: { data: string }) => {
  const token = sessionStorage.getItem("token");

  try {
    const req = await axios({
      method: "GET",
      url: `${API_URL}/api/search/?data=${data}`,
      withCredentials: true,
      headers: {
        ...AUTH_HEADER,
        "X-JWT-Token": token!,
      },
    });
    console.log(req.data);
    return req.data;
  } catch (exception: any) {
    throw new Error(exception.message);
  }
};

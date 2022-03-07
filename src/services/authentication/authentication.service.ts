import axios from "axios"
import { API_URL, AUTH_HEADER } from "../../environment"
import { TLoginResponseData } from "../services.types"
import { TRegistrationRequestDetails } from "./authentication.types"
export const registerUser = async(data: TRegistrationRequestDetails) => {
  try {
    await axios({
      url: `${API_URL}/api/auth/register`,
      method: "POST",
      withCredentials: true,
      headers: AUTH_HEADER,
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.plainTextPassword,
        email: data.email
      }
    })
    const loginRequestTokenData = await logInUser({ email: data.email, password: data.plainTextPassword })
    writeTokenDataToSessionStorage(loginRequestTokenData)
    data.onSuccess()
  } catch (exception: any) {
    data.onError(`${exception.response.data.error}`)
  }
}

export const logInUser = async({ email, password}: {email: string, password: string }): Promise<TLoginResponseData> => {
  const req = await axios({
    url: `${API_URL}/api/auth/login`,
    method: "POST",
    withCredentials: true,
    headers: AUTH_HEADER,
    data: {
      email,
      password
    }
  })
  if (req.status === 200) {
    return req.data
  } else {
    throw new Error(req.statusText)
  }
}

function writeTokenDataToSessionStorage(data: TLoginResponseData) {
  sessionStorage.setItem("token", data.token )
  sessionStorage.setItem("issued", JSON.stringify(data.issued))
  sessionStorage.setItem("expires", JSON.stringify(data.expires))
}

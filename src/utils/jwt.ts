import jwtDecode from "jwt-decode";
import { verify, sign } from "jsonwebtoken";
import axios from "./axios";

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  // Decode the JWT
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  // Get the current time in seconds
  const currentTime = Math.floor(Date.now() / 1000);

  return decoded.exp > currentTime;
};


const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

export { verify, sign, isValidToken, setSession };

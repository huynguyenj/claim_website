import { ApiResponse } from "../consts/ApiResponse";
import { UserInfo } from "../model/UserData";
import apiService from "./ApiService";

const authService = {
      getInfo :() => apiService.get<ApiResponse<UserInfo>>('/auth').then((res) => res),
}

export default authService
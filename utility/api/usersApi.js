import { Constants } from "@/utility/constants";
import axios from "axios";

export const usersAPIs = {
    createUser: async (userInfo) => {
        const data = await axios({
            url: Constants.Api.users.users,
            method: "POST",
            // headers: {
            //     authorization: 'Bearer' + ' ' + token,
            // },
            data: userInfo
        })
        return data.data;
    },
    loginUser: async (userInfo) => {
        const data = await axios({
            url: Constants.Api.users.users + `?email=${userInfo?.email}&password=${userInfo?.password}`,
            method: "GET",
            data: userInfo
        })
        return data.data;
    },
    updateUser: async (userInfo, userId) => {
        const data = await axios({
            url: Constants.Api.users.users + '/' + userId,
            method: "PUT",
            data: userInfo
        })
        return data.data;
    },
    deleteUser: async (userId) => {
        const data = await axios({
            url: Constants.Api.users.users + '/' + userId,
            method: "DELETE",
        })
        return data.data;
    },
}

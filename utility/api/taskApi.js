import { Constants } from "@/utility/constants";
import axios from "axios";

export const tasksAPIs = {
    getAllTask: async () => {
        const data = await axios({
            url: Constants.Api.tasks.tasks,
            method: "GET",
            // headers: {
            //     authorization: 'Bearer' + ' ' + token,
            // },
        })
        return data.data;
    },
    getTaskById: async (taskId) => {
        const data = await axios({
            url: Constants.Api.tasks.tasks + '/' + taskId,
            method: "GET",
        })
        return data.data;
    },
    createTask: async (taskInfo) => {
        const data = await axios({
            url: Constants.Api.tasks.tasks,
            method: "POST",
            data: taskInfo
        })
        return data.data;
    },
    updateTask: async (taskInfo, taskId) => {
        const data = await axios({
            url: Constants.Api.tasks.tasks + '/' + taskId,
            method: "PUT",
            data: taskInfo
        })
        return data.data;
    },
    deleteTask: async (taskId) => {
        const data = await axios({
            url: Constants.Api.tasks.tasks + '/' + taskId,
            method: "DELETE",
        })
        return data.data;
    },

}

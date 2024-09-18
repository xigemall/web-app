import axios from "axios";
import type {AxiosInstance} from 'axios'

const request: AxiosInstance = axios.create();

request.interceptors.response.use((response)=>{
    return response.data;
},error => {
    return Promise.reject(error);
})

export default request;
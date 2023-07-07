
import axios from "axios";
// export const API_URL = 'http://localhost:1332'
export const API_URL = 'http://dulyas.fun/3205-back'


const api = axios.create({
    baseURL: API_URL
})




export default api
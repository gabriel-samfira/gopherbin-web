import axios from 'axios';

const baseURL = process.env.REACT_APP_GOPHERBIN_API || "/";

const instance = axios.create({
    baseURL: baseURL
});

export default instance;
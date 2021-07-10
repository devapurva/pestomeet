import axios from "axios";
import store from "../../store/store";
import { appConstOnError } from "../../store/appStore/appStore.action";
// import {logoutStart} from '../../store/auth/auth.action';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

const instanceCreator = ($axios) => ({
    saveHeader({ key, value }) {
        $axios.defaults.headers.common[key] = value;
    },
    deleteHeader(key) {
        delete $axios.defaults.headers.common[key];
    },
    get(url, params) {
        return $axios.get(url, { params });
    },
    post(resource, data) {
        return $axios.post(resource, data);
    },
    put(resource, data) {
        return $axios.put(resource, data);
    },
    delete(resource) {
        return $axios.delete(resource);
    },
    deleteWithBody(resource, data) {
        return $axios.delete(resource, { data: data });
    },
    customRequest(config) {
        return $axios(config);
    },
    successHandler(response) {
        return response;
    },
    errorHandler(error) {
        const { response } = error;
        const {
            data: { status },
        } = response;
        // if (status.code === 401 && status.message === 'Token Expired'){
        //   store.dispatch(logoutStart());
        // }
        store.dispatch(
            appConstOnError({ type: "error", message: status.message })
        );
        // if (status.code >= 400 && status.code < 500) {
        //   store.dispatch(appConstOnError({type: 'error', message: status.message}));
        // } else {
        //   store.dispatch(appConstOnError({type: 'error', message: 'Something went wrong'}));
        // }
        return Promise.reject(response);
    },
    interceptorRef: null,
    mountResponseInterceptor() {
        this.interceptorRef = $axios.interceptors.response.use(
            this.successHandler,
            this.errorHandler
        );
    },
    ejectResponseInterceptor() {
        $axios.interceptors.response.eject(this.interceptorRef);
    },
});

// eslint-disable-next-line import/exports-last
export const HTTPClient = instanceCreator(axiosInstance);
HTTPClient.mountResponseInterceptor();

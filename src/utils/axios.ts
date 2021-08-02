import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});

const instanceCreator = ($axios: any) => ({
  saveHeader({ key, value }: { key: string; value: string }) {
    $axios.defaults.headers.common[key] = value;
  },
  deleteHeader(key: string) {
    delete $axios.defaults.headers.common[key];
  },
  get(url: string, params?: any) {
    return $axios.get(url, { params });
  },
  post(resource: string, data: any) {
    return $axios.post(resource, data);
  },
  put(resource: string, data: any) {
    return $axios.put(resource, data);
  },
  patch(resource: string, data: any) {
    return $axios.patch(resource, data);
  },
  delete(resource: string) {
    return $axios.delete(resource);
  },
  deleteWithBody(resource: string, data: any) {
    return $axios.delete(resource, { data: data });
  },
  customRequest(config: any) {
    return $axios(config);
  },
  successHandler(response: any) {
    return response;
  },
  errorHandler(error: any) {
    const { response } = error;
    // const {
    //   data: { status }
    // } = response;
    // if (status.code === 401 && status.message === 'Token Expired'){
    //   store.dispatch(logoutStart());
    // }
    // store.dispatch(
    //     appConstOnError({ type: "error", message: status.message })
    // );
    // if (status.code >= 400 && status.code < 500) {
    //   store.dispatch(appConstOnError({type: 'error', message: status.message}));
    // } else {
    //   store.dispatch(appConstOnError({type: 'error', message: 'Something went wrong'}));
    // }
    return Promise.reject(response);
  },
  interceptorRef: null,
  mountResponseInterceptor() {
    this.interceptorRef = $axios.interceptors.response.use(this.successHandler, this.errorHandler);
  },
  ejectResponseInterceptor() {
    $axios.interceptors.response.eject(this.interceptorRef);
  }
});

export const HTTPClient = instanceCreator(axiosInstance);
HTTPClient.mountResponseInterceptor();

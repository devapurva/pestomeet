import jwtDecode from 'jwt-decode';
import { verify, sign } from 'jsonwebtoken';
//
import { HTTPClient } from './axios';

// ----------------------------------------------------------------------

const isValidToken = (accessToken: string | null) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

//  const handleTokenExpired = (exp) => {
//   let expiredTimer;

//   window.clearTimeout(expiredTimer);
//   const currentTime = Date.now();
//   const timeLeft = exp * 1000 - currentTime;
//   expiredTimer = window.setTimeout(() => {
//     // You can do what ever you want here, like show a notification
//   }, timeLeft);
// };

const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    HTTPClient.saveHeader({
      key: 'Authorization',
      value: `Bearer ${accessToken}`
    });
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    HTTPClient.deleteHeader('Authorization');
  }
};

export { isValidToken, setSession, verify, sign };

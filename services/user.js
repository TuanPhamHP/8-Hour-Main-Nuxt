// const localToken = localStorage.getItem("auth._token.local");
import Axios from 'axios';
import { setCookie } from '@/helpers/customizeCookie.js';
import store from '@/store';
const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL;
const roleRepo = (axios) => {
  return {
    async redirectToSSO() {
      const currentCookies = document.cookie;
      const cookiesArray = currentCookies.split(';').map((o) => {
        const ar = o.split('=');
        return {
          key: ar[0],
          val: ar[1]
        };
      });
      const f = cookiesArray.filter((o) => {
        return o.key === 'token' || o.key === ' token';
      });

      if (
        cookiesArray.some((o) => {
          return o.key === 'token' || o.key === ' token';
        })
      ) {
        if (
          f.every((o) => {
            return o.val === 'removed';
          })
        ) {
          console.log(f);
          document.cookie = 'token=removed';
          const currentUrl = window.location.origin;
          if (process.env.VUE_APP_ENV !== 'DEV') {
            window.location.href =
              process.env.VUE_APP_LOGOUT_URL + `?continue=${currentUrl}`;
          } else {
            console.log(
              `Không có token được lưu tại cookie, môi trường hiện tại là DEV`
            );
            console.log(
              `Với môi trường Product redirect tới: ${process.env.VUE_APP_LOGOUT_URL}?continue=${currentUrl}`
            );
          }
          return;
        }

        const token = cookiesArray.filter((o) => {
          return (
            (o.key === 'token' || o.key === ' token') && o.val !== 'removed'
          );
        })[0];
        localStorage.setItem('auth._token.local', token.val);
        setCookie('token', token.val);
        const res = await this.getUserInfo(token.val);
        console.log(token);
        if (res && res.data && res.data.data.user) {
          const localToken = localStorage.getItem('auth._token.local');
          const authSet = {
            isAuth: true,
            user: res.data.data,
            token: `Bearer ${localToken}`
          };
          store.commit('SET_USER_LOGGEDIN', authSet);
          window.location.reload();
        } else {
          const currentUrl = window.location.origin;
          if (process.env.VUE_APP_ENV !== 'DEV') {
            window.location.href =
              process.env.VUE_APP_LOGOUT_URL + `?continue=${currentUrl}`;
          } else {
            console.log(`Có token được lưu nhưng không thể sử dụng`);
            console.log(
              `Với môi trường Product redirect tới: ${process.env.VUE_APP_LOGOUT_URL}?continue=${currentUrl}`
            );
          }
        }
      } else {
        const currentUrl = window.location.origin;
        if (process.env.VUE_APP_ENV !== 'DEV') {
          window.location.href =
            process.env.VUE_APP_LOGOUT_URL + `?continue=${currentUrl}`;
        } else {
          console.log(
            `Không có token được lưu tại cookie, môi trường hiện tại là DEV`
          );
          console.log(
            `Với môi trường Product redirect tới: ${process.env.VUE_APP_LOGOUT_URL}?continue=${currentUrl}`
          );
        }
      }
    },
    loginUser(payload) {
      return axios
        .post(`${VUE_APP_BASE_URL}/api/auth/login`, payload, {
          headers: {
            Authorization: ''
          }
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    getUserInfo(_token = '') {
      if (_token) {
        Axios.defaults.headers = { Authorization: `Bearer ${_token}` };
      }
      return _token
        ? axios
            .get(`${VUE_APP_BASE_URL}/api/me`, {
              headers: {
                Authorization: `Bearer ${_token}`
              }
            })
            .then((res) => {
              return res;
            })
            .catch((err) => {
              return err.response;
            })
        : axios
            .get(`${VUE_APP_BASE_URL}/api/me`)
            .then((res) => {
              return res;
            })
            .catch((err) => {
              return err.response;
            });
    },

    qrCreate(payload = {}) {
      return axios
        .post(`${VUE_APP_BASE_URL}/api/auth/login/qr/export`, payload)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },
    create(payload = {}) {
      return axios
        .post(`${VUE_APP_BASE_URL}/api/roles?include=permissions`, payload)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },

    delete(_id) {
      return axios({
        method: 'DELETE',
        url: `${VUE_APP_BASE_URL}/api/roles/${_id}`
      })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    },

    update(payload, id) {
      return axios
        .put(`${VUE_APP_BASE_URL}/api/roles/${id}?include=permissions`, payload)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
    }
  };
};
export default roleRepo;

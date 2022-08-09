<template>
  <v-row class="login-app">
    <v-col cols="6" sm="6" md="6" lg="6" xl="6" class="login-left-side">
      <img
        src="@/assets/images/login_bg.svg"
        alt="login-background"
        loading="lazy"
      />
    </v-col>
    <v-col cols="6" sm="6" md="6" lg="6" xl="6" class="login-right-side">
      <!-- <v-btn color="primary" @click="onChangeTheme"> random prim color </v-btn> -->
      <!-- <img
        src="@/assets/images/login-logo.jpg"
        alt="logo-login"
        loading="lazy"
      /> -->
      <div class="white login-w-wr box-shadow--mod">
        <img
          :src="logoURL"
          alt="logo-login"
          class="login-logo-svg"
          loading="lazy"
          height="46px"
        />
        <v-tabs-items v-model="tab" class="white w-100">
          <v-tab-item :value="`tab-login`">
            <div class="tab-login__wr">
              <v-text-field
                v-model="form.email"
                autofocus
                autocomplete="off"
                label="Tên đăng nhập"
                color="primary"
                outlined
                dense
                @keypress.enter="focusPassword"
                class="v-text-field_n_details login-input mb-2"
              ></v-text-field>
              <v-text-field
                v-model="form.password"
                id="formPassword"
                autocomplete="off"
                label="Mật khẩu"
                color="primary"
                type="password"
                outlined
                dense
                class="v-text-field_n_details login-input mb-2"
                @keypress.enter="handleLogin"
              ></v-text-field>

              <v-btn
                depressed
                color="primary"
                class="w-100 text-capitalize btn-login v-btn_n_ls"
                :loading="loadingLogin"
                @click="handleLogin"
              >
                Đăng nhập
              </v-btn>
              <span class="cr-switch neutral_color_sub2--text">Hoặc</span>
              <v-btn
                depressed
                outlined
                color="primary"
                class="w-100 text-capitalize btn-login v-btn_n_ls"
                :disabled="loadingLogin"
                @click="tab = 'tab-qr'"
              >
                Đăng nhập bằng QR code
              </v-btn>
              <p
                v-if="loadingPermissionCheck"
                class="primary_lighter--text font-weight-medium my-3 text-center my-5"
              >
                Đang kiểm tra quyền của tài khoản. Vui lòng đợi trong giây lát
                ...
              </p>
            </div>
          </v-tab-item>
          <v-tab-item :value="`tab-qr`">
            <div class="w-100 d-flex align-center justify-center">
              <QrcodeVue
                v-if="qrCode"
                :value="qrCode"
                :size="getQrSize()"
                level="H"
              ></QrcodeVue>
              <p
                v-if="!qrCode"
                class="primary_lighter--text font-weight-medium my-3 text-center my-5"
              >
                {{ qrCodeMsg }}
              </p>
            </div>
            <p
              class="neutral_color_sub2--text font-weight-medium my-3 mb-5 text-center"
              style="font-size: 12px"
            >
              Vui lòng quét mã QR bằng ứng dụng trên điện thoại để đăng nhập.
            </p>
            <span class="cr-switch neutral_color_sub2--text">Hoặc</span>
            <v-btn
              depressed
              outlined
              color="primary"
              class="w-100 text-capitalize btn-login v-btn_n_ls"
              @click="tab = 'tab-login'"
            >
              Đăng nhập
            </v-btn>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import { mapGetters } from 'vuex';
import api from '@/services';
import { getCookie, setCookie, deleteCookie } from '@/helpers/customizeCookie';
export default {
  sockets: {
    connect() {
      console.log('Login component socket connected');
    }
  },
  components: {
    QrcodeVue
  },
  mounted() {
    this.checkCookie();
    this.initQr();
    this.getGroupChat();
    if (this.userFromAuth && this.userFromAuth.id) {
      this.$router.push('/');
    }
    if (
      process.env.VUE_APP_ENVIRONMENT &&
      process.env.VUE_APP_ENVIRONMENT === 'DEV'
    ) {
      this.form = {
        email: 'sonleu@gmail.com',
        password: '123456'
      };
    }
  },
  computed: {
    ...mapGetters({
      userFromAuth: 'userFromAuth'
    }),
    logoURL() {
      return process.env.VUE_APP_LOGIN_LOGO;
    }
  },
  watch: {
    userFromAuth: {
      deep: true,
      handler() {
        if (this.userFromAuth && this.userFromAuth.id) {
          this.$router.push('/');
        }
      }
    }
  },

  created() {},
  data() {
    return {
      qrCode: '',
      tab: 'tab-login',
      isDev: process.env.VUE_APP_ENVIRONMENT === 'DEV',
      LOGOUT_URL: process.env.VUE_APP_LOGOUT_URL,
      loadingLogin: false,
      loadingPermissionCheck: false,
      errorLoginResponse: '',
      form: {
        email: '',
        password: ''
      },
      qrCodeMsg: 'Đang khởi tạo QR code. Vui lòng đợi trong giây lát ...'
    };
  },
  methods: {
    focusPassword() {
      try {
        document.querySelector('#formPassword').focus();
      } catch (error) {
        console.log(error);
      }
    },
    onChangeTheme() {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      this.$vuetify.theme.themes.light.primary = `#${randomColor}`;
    },
    loginFormValidate() {
      return new Promise((resolve) => {
        if (!this.form.email || !String(this.form.email).trim()) {
          this.$store.commit(
            'toast/getError',
            'Đăng nhập thất bại. Không được để trống tên đăng nhập'
          );
          resolve(false);
          return;
        }
        if (!this.form.password || !String(this.form.password).trim()) {
          this.$store.commit(
            'toast/getError',
            'Đăng nhập thất bại. Không được để trống mật khẩu'
          );
          resolve(false);
          return;
        }
        resolve(true);
      });
    },
    async getGroupChat() {
      // const res = await api.chat.getListGroupChat()
      // console.log(res)
    },
    async handleLogin() {
      const valid = await this.loginFormValidate();
      if (!valid) {
        return;
      }
      this.errorLoginResponse = '';
      this.loadingLogin = true;
      this.loadingPermissionCheck = true;
      const body = {
        ...this.form
      };
      const res = await api.user.loginUser(body);
      this.loadingLogin = false;
      if (!res) {
        this.$store.commit(
          'toast/getError',
          'Đăng nhập thất bại. Liên hệ IT để được hỗ trợ. Code 01'
        );
      }
      try {
        if (res.status && res.status > 199 && res.status < 400) {
          this.$store.commit('SET_USER_LOGGEDIN', res.data.data.user);
          setCookie(
            'auth.user.permission',
            res.data.data.application_access_permissions
          );
          setCookie('token', res.data.data.token);
          this.$router.push('/');
        } else {
          deleteCookie('auth.user.permission');
          deleteCookie('auth._token.local');
          deleteCookie('token');
          const msg =
            'Đăng nhập thất bại: ' +
            (res.data.message || String(res)) +
            ' Code 02';
          this.$store.commit('toast/getError', msg);
        }
      } catch (error) {
        console.log(error);
        const msg = 'Đăng nhập thất bại: ' + String(error) + ' Code 03';
        this.$store.commit('toast/getError', msg);
      }
    },
    async checkCookie() {
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
      console.log(
        f,
        f.some((o) => {
          return o.val === 'removed';
        })
      );
      if (
        cookiesArray.some((o) => {
          return o.key === 'token' || o.key === ' token';
        }) &&
        f.some((o) => {
          return o.val === 'removed';
        })
      ) {
        document.cookie =
          'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        const currentUrl = window.location.origin;
        if (!this.isDev) {
          window.location = this.LOGOUT_URL + `?continue=${currentUrl}`;
        }
        return;
      }
      if (
        cookiesArray.some((o) => {
          return o.key === 'token' || o.key === ' token';
        })
      ) {
        const token = cookiesArray.filter((o) => {
          return o.key === 'token' || o.key === ' token';
        })[0];
        setCookie('token', token.val);

        const res = await api.user.getUserInfo(token.val);

        if (!res) {
          localStorage.removeItem('auth._token.local');
          deleteCookie('auth._token.local');
          deleteCookie('token');
          return;
        }
        try {
          if (res.status && res.status > 199 && res.status < 400) {
            const localCToken = getCookie('token');
            const authSet = {
              isAuth: true,
              user: res.data.data.user,
              token: `${localCToken}`
            };
            this.$store.commit('SET_USER_LOGGEDIN', authSet);
          } else {
            const msg =
              'Đăng nhập thất bại: ' +
              (res.data.message || String(res) || ' Try again');
            this.$store.commit('toast/getError', msg);
            localStorage.removeItem('auth._token.local');
            deleteCookie('auth._token.local');
            deleteCookie('token');
            return;
          }
        } catch (error) {
          const msg = 'Đăng nhập thất bại: ' + String(error);
          this.$store.commit('toast/getError', msg);
        }
      } else {
        const currentUrl = window.location.origin;
        if (!this.isDev) {
          window.location = this.LOGOUT_URL + `?continue=${currentUrl}`;
        }
      }
    },
    async initQr() {
      // const _this = this
      const res = await api.user.qrCreate();
      if (!res) {
        this.qrCodeMsg = 'Khởi tạo QR code thất bại. Vui lòng thử lại.';
        this.$store.commit(
          'toast/getError',
          'Khởi tạo QR code thất bại. Lỗi đường truyền, vui lòng thử lại.'
        );
        return;
      }
      try {
        if (res.status > 199 && res.status < 399) {
          this.qrCode = JSON.stringify(res.data.data);
          // console.log(this.socket, 'this socket');
          this.$socket.emit('subscribe', {
            channel: res.data.data.channel
          });
          this.sockets.subscribe('QrLoginEvent', (_channel, data) => {
            console.log('qr code thành công', data);
          });
          // channel.on('QrLoginEvent', async function (_channel, data) {
          //   console.log('qr code thành công', data);
          //   await _this.$auth.setUserToken(data.token);
          //   await _this.$auth.setUser(data.user);
          //   _this.tryLog();
          //   channel.emit('unsubscribe', {
          //     channel: res.data.data.channel
          //   });
          // });
          // channel.on('qrloginevent', async function (_channel, data) {
          //   console.log('qr code thành công', data);
          //   await _this.$auth.setUserToken(data.token);
          //   await _this.$auth.setUser(data.user);
          //   localStorage.setItem('remember_me', true);
          //   _this.tryLog();
          //   channel.emit('unsubscribe', {
          //     channel: res.data.data.channel
          //   });
          // });
          return;
        }
        const msg =
          'Khởi tạo QR code thất bại. ' +
          (res.data.message || String(res) || 'Vui lòng thử lại');
        this.$store.commit('toast/getError', msg);
        this.qrCodeMsg = 'Khởi tạo QR code thất bại. Vui lòng thử lại.';
      } catch (error) {
        this.$store.commit(
          'toast/getError',
          'Khởi tạo QR code thất bại. Lỗi xử lí dữ liệu, vui lòng thử lại.'
        );
      }
    },
    getQrSize() {
      if (window.innerHeight >= 1240) {
        return 280;
      } else {
        return 210;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login-left-side {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    z-index: 2;
  }
}
.login-right-side {
  height: 100vh;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  .logo-txt {
    font-size: 24px !important;
  }
  .login-tab-controls {
    max-width: 300px;
    margin-top: 12px;
    max-height: 70px;
  }
  .v-tab {
    font-weight: 700;
    font-size: 18px;
    text-transform: none;
    letter-spacing: 0 !important;
    line-height: 2.5;
  }
  .tab-login__wr {
    padding: 12px 0;
    width: 100%;
    .login-input {
      height: 60px !important;
    }
  }
  .btn-login {
    width: 100%;
    display: block;
    height: 44px !important;
    font-size: 16px;
  }
}
.login-w-wr {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  padding: 32px 64px;
  border-radius: 8px;
  width: 450px;
}
.login-logo-svg {
  margin-bottom: 48px;
}
.cr-switch {
  display: block;
  margin: 16px 0px;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}
</style>
<style lang="scss">
.v-text-field_n_details {
  .v-text-field__details {
    display: none;
  }
}
.v-text-field_n_minheight {
  .v-input__slot {
    min-height: 32px !important;
  }
}
.v-btn_n_ls {
  .v-btn__content {
    letter-spacing: 0;
  }
}
.login-input {
  .v-input__slot {
    height: 48px !important;
  }
}
</style>

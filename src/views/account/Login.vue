<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="Account Login">
          <a-alert
            v-if="isLoginError"
            type="error"
            showIcon
            style="margin-bottom: 24px;"
            message="Username or password is not valid."
          />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              @change="removeLoginErr"
              placeholder="Please enter your username."
              v-decorator="[
                'username',
                {rules: [{ required: true, message: 'Please enter your username' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              @change="removeLoginErr"
              size="large"
              placeholder="Please enter your password."
              v-decorator="[
                'password',
                {rules: [{ required: true, message: 'Please enter your password.' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <router-link class="register" :to="{ name: 'register' }">Register</router-link>
        <a @click="redirectFindBack" class="forge-password" style="float: right;">Forget Password?</a>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >Login</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import qs from 'querystring'
import { mapActions, mapGetters } from 'vuex'
import { timeFix, initBaseURL } from '@/config/defaultSettings'
import api from '@/api/index'

export default {
  components: {},
  data() {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0
      }
    }
  },
  created() {},
  methods: {
    ...mapActions(['Login', 'Logout']),
    ...mapGetters(['nickname']),
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick(key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this
      state.loginBtn = true
      const validateFieldsKey = ['username', 'password']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          console.log('Login Form: ', values)
          const loginParams = {
            client_id: 'clinico-omics',
            client_secret: '97a7d2e8-94f4-48a7-aa90-c8ed206b89df',
            scope: 'openid',
            grant_type: 'password',
            ...values
          }

          Login(qs.stringify(loginParams))
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    removeLoginErr() {
      this.isLoginError = false
    },
    redirectFindBack() {
      window.location.href = initBaseURL() + api.ForgePassword
    },
    loginSuccess(res) {
      console.log(res)
      this.$router.push({ path: '/dashboard' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: this.nickname,
          description: `${timeFix()}，Welcome Back.`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed(err) {
      console.log('Login Error: ', err)
      this.isLoginError = true
      this.$notification.error({
        message: '错误',
        description: '请求出现错误，请稍后再试',
        duration: 4
      })
      this.Logout()
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }
  .forge-password {
    font-size: 14px;
  }
  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;
    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: #1890ff;
      }
    }
    .register {
      float: right;
    }
  }
}
</style>
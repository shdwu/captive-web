<template>
  <div class="login">
    <!-- 头部 -->
    <div class="header">
      <div class="header_info">
        <div class="logo"
             :style="logo"></div>
        <a class="help_doc" :href="manual" target="_blank">
          <img :src="light"/>
          <span>用户手册</span>
        </a>
      </div>
    </div>
    <!-- 登陆表单 -->
    <div class="info"
         :style="{backgroundImage: 'url(' + infoUrl + ')' }">

      <!-- 表单 -->
      <el-form :model="loginForm"
               :rules="rules"
               ref="loginForm"
               label-width="70px"
               label-position="left"
               class="info_dw">
        <div class="zhdl">账号登录</div>
        <el-form-item label="用户名"
                      prop="userCode">
          <el-input type="name"
                    v-model="loginForm.userCode"></el-input>
        </el-form-item>
        <el-form-item label="密 码"
                      prop="password">
          <el-input type="password"
                    v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item label="验证码"
                      prop="verifyCode">
          <el-input type="verifyCode"
                    class="mms"
                    v-model="loginForm.verifyCode"
                    @keyup.enter.native="submitForm('loginForm')"></el-input> <img class="fls"
               ref="loginForms"
               src="/api/auth/getCode">
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('loginForm')">登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 底部 -->
    <div class="footer">
      <div class="footer_info">
        <div class="footer_info_top">
          <span>Copyright 2019-2019 中远海运特战险用户服务平台</span>
          <span>All rights reserved.Version v2.0.2</span>
        </div>
        <div class="footer_xhx"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api'
import infoUrl from '@/assets/login.png'
import light from '@/assets/light.png'
import manual from '@/assets/manual.pdf'
export default {
  data () {
    return {
      infoUrl,
      light,
      manual,
      loginForm: {
        // 用户名
        userCode: '',
        // 密码
        password: '',
        verifyCode: ''
      },
      // 表单验证规则
      rules: {
        // name 就是要校验的数据
        userCode: [
          // required 表示必填项
          // message 表示验证失败时要展示的错误信息
          // trigger 表示触发表单验证的时机
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // min 和 max 配合类设置长度
          {
            min: 4,
            max: 12,
            message: '用户名长度为4到12个字符',
            trigger: 'blur'
          }
        ],
        password: [
          // required 表示必填项
          // message 表示验证失败时要展示的错误信息
          // trigger 表示触发表单验证的时机
          { required: true, message: '请输入密码', trigger: 'blur' },
          // min 和 max 配合类设置长度
          { min: 6, max: 18, message: '密码长度为6到18个字符', trigger: 'blur' }
        ],
        verifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      logo: {
        backgroundImage: 'url(' + require('../assets/logo.png') + ')'
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate()
      let ret = login(this.loginForm).then(res => {
        if (res.status === 200) {
          sessionStorage.setItem('token', res.headers.authorization)
          localStorage.setItem('nametype', res.data.companyType)
          localStorage.setItem('companyName', res.data.companyName)
          if (res.data.companyType === 'BROKER') {
            this.$router.push({ name: 'batch' })
          } else {
            this.$router.push({ name: 'home' })
          }
        }
      }).catch(reason => {
        this.$refs.loginForms.src = '/api/auth/getCode?' + Math.random()
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.login {
  height: 100%;
}
.header {
  height: 105px;
  background-color: #fff;
}
.header_info {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
}
.logo {
  width: 451px;
  height: 70px;
  float: left;
  margin-top: 6px;
}
.info {
  height: 710px;
  /* background-image: url(infoUrl); */
  background-size: 100% 100%;
  position: relative;
}
.zhdl {
  height: 48px;
  line-height: 48px;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 50px;
  color: #364455;
  font-size: 20px;
  letter-spacing: 5px;
}
.info_dw {
  width: 400px;
  height: 345px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 0px 20px;
  position: absolute;
  top: 200px;
  right: 359px;
}
.footer {
  height: 152px;
  background-color: #ececec;
}
.footer_info {
  width: 790px;
  height: 100%;
  margin: 0 auto;
}
.el-form-item__label {
  color: #666;
}
.footer_info_top {
  padding-top: 20px;
  text-align: center;
}
.footer_info_top span {
  color: #6f6f6f;
  padding-left: 21px;
  font-size: 14px;
}
.footer_xhx {
  width: 100%;
  margin-top: 22px;
  border-top: 1px solid #c3c3c3;
}
.list {
  margin: 20px 0 0 69px;
  width: 101px;
  height: 34px;
  float: left;
}
.lists {
  margin: 20px 0 0 69px;
  width: 110px;
  height: 34px;
  float: left;
}
.left {
  float: left;
}
p {
  padding: 0;
  margin: 0;
  font-size: 12px;
  color: #6f6f6f;
}
.dlan {
  width: 100%;
  height: 31px;
  background-color: #394454;
  border: none;
  color: #fff;
  font-size: 16px;
  letter-spacing: 5px;
}
.mms {
  width: 100px;
}
.fls {
  float: right;
  margin-right: 15px;
}
.help_doc {
  position: absolute;
  width: 200px;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  right: 30px;
  top: 20px;
  cursor: pointer;
  text-decoration: none;
}
.help_doc img {
  max-width: 30px;
  margin-bottom: 7px;
}
.hlep_doc span {
  line-height: 100%;
  display: block;
}

</style>

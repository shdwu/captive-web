<template>
  <div class="info">
    <div class="info_left">
      <div class="info_left_top">中远海运</div>
      <p class="pst">欢迎来到特战险服务平台</p>
      <p v-if="false" class="pstou">上午好！</p>
    </div>
    <div class="info_right">
      <div class="info_right_title">
        用户您好！
      </div>
      <div class="info_list">
        <span class="info_list_left">绑定邮箱</span>
        <span class="info_list_centen">建议您绑定邮箱，可以使账号更安全</span>
        <el-button class="el_btn"
                   type="primary"
                   @click="dialogFormVisiblet = true">绑定邮箱</el-button>
      </div>
      <div class="info_list">
        <span class="info_list_left">修改密码 </span>
        <span class="info_list_centen">密码要求至少包含字母，符号或数字重的两项且长度超过
          8位，建议您经常修改密码，以保证帐号更加安全。</span>
        <el-button class="el_btn"
                   type="primary"
                   @click="dialogFormVisibles = true">修改密码</el-button>
      </div>
    </div>
    <div class="info_buttom">
      <el-menu default-active="1">
        <el-menu-item index="1">
          <i class="el-icon-user"></i>
          <span slot="title">账号安全</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 绑定手机号的模态框-->
    <el-dialog title="绑定手机号"
               :visible.sync="dialogFormVisible"
               width="40%">
      <el-form :model="form">
        <el-form-item label="手机号"
                      :label-width="formLabelWidth">
          <el-input v-model="form.name"
                    autocomplete="off"
                    class="inputs"></el-input>
        </el-form-item>
        <el-form-item label="验证码"
                      :label-width="formLabelWidth">
          <el-input v-model="form.region"
                    autocomplete="off"
                    class="inpu_yzm"></el-input>
          <el-button type="success">发送验证码</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 绑定邮箱的模态框 -->
    <el-dialog title="绑定邮箱"
               :visible.sync="dialogFormVisiblet"
               width="40%">
      <el-form :model="formEmail"
               ref="dynamicValidateForm">
        <el-form-item label="邮箱"
                      prop="email"
                      :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]"
                      :label-width="formLabelWidth">
          <el-input v-model="formEmail.email"
                    class="inputs"></el-input>
        </el-form-item>

        <el-form-item label="验证码"
                      :label-width="formLabelWidth">
          <el-input v-model="formEmail.validCode"
                    class="inpu_yzm"></el-input>
          <el-button :type="butSyysf===false?'success':'info'"
                     :disabled="disableds"
                     ref="btnYs"
                     @click="sendVerification">{{emailYzm}}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisiblet = false">取 消</el-button>
        <el-button type="primary"
                   @click="upDateEmil('dynamicValidateForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码的模态框 -->
    <el-dialog title="修改密码"
               :visible.sync="dialogFormVisibles"
               width="40%">
      <el-form :model="modifyForm"
               :rules="rules"
               ref="upDataPassword">
        <el-form-item label="旧密码"
                      prop="originPassword"
                      :label-width="formLabelWidth">
          <el-input v-model="modifyForm.originPassword"
                    type="password"
                    class="inputs"></el-input>
        </el-form-item>
        <el-form-item label="新密码"
                      prop="newPassword"
                      :label-width="formLabelWidth">
          <el-input v-model="modifyForm.newPassword"
                    type="password"
                    class="inputs"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="newPasswords"
                      :label-width="formLabelWidth">
          <el-input v-model="modifyForm.newPasswords"
                    type="password"
                    class="inputs"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="updatedList('upDataPassword')">取 消</el-button>
        <el-button type="primary"
                   @click="updatePassword('upDataPassword')">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
export default {
  data () {
    // 修改密码校验
    var password = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.modifyForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      dialogFormVisiblet: false,
      dialogFormVisibles: false,
      emailYzm: '发送验证码',
      butSyysf: false,
      disableds: false,

      form: {
        name: '',
        region: '',
        newRegion: ''
      },
      // 邮箱数据
      formEmail: {
        email: '',
        validCode: ''
      },
      // 修改密码数据
      modifyForm: {
        originPassword: '',
        newPassword: '',
        newPasswords: ''
      },
      rules: {
        originPassword: [{
          validator: password, trigger: 'blur'
        }],
        newPassword: [
          { validator: validatePass, trigger: 'blur' }
        ],
        newPasswords: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    async  updatePassword (formName) {
      await this.$refs[formName].validate()
      await delete this.modifyForm.newPasswords
      const res = await this.$http.post('/auth/updatePassword', this.modifyForm)
      console.log(res)
      if (res.status === 200) {
        this.dialogFormVisibles = false
        localStorage.setItem('token', res.headers.authorization)
        this.$refs[formName].resetFields()
        this.$message({
          type: 'success',
          message: '修改密码完成'
        })
      }
    },
    updatedList (formName) {
      this.dialogFormVisibles = false
      this.$refs[formName].resetFields()
    },
    // 发送邮箱验证码
    async sendVerification () {
      let objEmail = {
        email: ''
      }
      objEmail.email = this.formEmail.email
      const res = await this.$http.post('/auth/setMail', objEmail)
      this.butSyysf = true
      this.disableds = true
      if (res.status === 200) {
        var index = 60
        var timeIdm = setInterval(() => {
          index--
          this.emailYzm = index + '后再次发送验证码'
          if (index === 0) {
            clearInterval(timeIdm)
            this.butSyysf = false
            this.disableds = false
            this.emailYzm = '发送验证码'
          }
        }, 1000)
      }
      console.log(res)
    },
    async upDateEmil (formName) {
      let info = await this.$http.post('/auth/setMail', this.formEmail)
      if (info.status === 200) {
        this.dialogFormVisiblet = false
        this.$refs[formName].resetFields()
        this.formEmail.validCode = ''
        this.$message({
          type: 'success',
          message: '已绑定邮箱'
        })
      }
    }
  }
}
</script>
<style scoped>
.info {
  height: 660px;
  padding-top: 20px;
  width: 1200px;
  margin: 0 auto;
}
.info_left {
  width: 260px;
  height: 180px;
  background: rgba(255, 255, 255, 1);
  margin-right: 10px;
  float: left;
}
.info_right {
  width: 930px;
  height: 358px;
  background: rgba(255, 255, 255, 1);
  float: right;
  box-sizing: border-box;
  padding: 30px 45px 0 50px;
}
.info_buttom {
  width: 260px;
  height: 55px;
  background: rgba(255, 255, 255, 1);
  float: left;
  margin-top: 10px;
  /* border-left: 2px solid #3f6dc5; */
}
.info_left_top {
  width: 60px;
  height: 60px;
  background: rgba(247, 247, 247, 1);
  border-radius: 2px;
  border: 2px solid #c9daf9;
  padding: 10px 10px 10px 11px;
  box-sizing: border-box;
  font-size: 14px;
  color: #3f6dc5;
  margin: 31px 104px 0px 102px;
  letter-spacing: 3px;
  border-radius: 2px;
}
p {
  margin: 0;
  padding: 0;
}
.pst {
  width: 163px;
  height: 15px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 30px;
  font-family: MicrosoftYaHei;
  margin: 8px auto;
}
.pstou {
  width: 56px;
  height: 14px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 30px;
  margin: 0 auto;
  font-family: MicrosoftYaHei;
}
.info_leftx {
  width: 3px;
  height: 24px;
  background: rgba(63, 109, 197, 1);
  float: left;
  margin-left: -22px;
}
.info_right_title {
  width: 100%;
  height: 51px;
  border-bottom: 1px solid #f4f4f4;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.info_list {
  width: 100%;
  height: 41px;
  line-height: 41px;
  margin-top: 30px;
}
.info_list_left {
  font-size: 14px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  float: left;
  margin-left: 75px;
}
.info_list_centen_1 {
  width: 400px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  float: left;
  margin-left: 47px;
}
.info_list_centen {
  width: 400px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  float: left;
  margin-left: 60px;
}
.el_btn {
  float: right;
}
.inputs {
  width: 300px;
}
.inpu_yzm {
  width: 100px;
}
</style>

<template>
  <div class="login">
    <div class="header_title">
      <div class="header_title_info">
        <p class="hollw">您好,欢迎来到特战险平台!</p>
        <a href="javascript:;"
           class="logout"
           @click="logout">退出</a>
        <span class="name">{{companyName}}</span>
        <!-- <div class="news el-icon-chat-dot-round">消息 <span class="news_kh">( 0 )</span></div> -->
      </div>
    </div>
    <!-- 头部 -->
    <div class="header">
      <div class="header_info">
        <div class="logo"></div>
        <el-menu :default-active="activePath"
                 class="el-menu-demo"
                 mode="horizontal"
                 :router="true">

          <el-menu-item index="/application">首页</el-menu-item>
          <el-menu-item index="/batch">申报批次</el-menu-item>
          <el-menu-item index="/personal">账号安全</el-menu-item>
        </el-menu>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="pormis_info">
      <el-main class="infos">
        <!-- 子路由出口： -->
          <router-view />
      </el-main>
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
    <div class="el-backtop" style="right: 10px; bottom: 180px" @click="backTop">
      <i class="el-icon-caret-top"></i>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nameType: '',
      companyName: ''
    }
  },
  computed: {
    // 获取需要高亮的哈希值
    activePath () {
      const { path } = this.$route
      const pathArr = path.split('/')
      return pathArr.length === 3 ? '/' + pathArr[1] : path
    }
  },
  methods: {
    // 退出功能
    async logout () {
      try {
        await this.$confirm('您是否确定退出?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        // 退出登录逻辑：
        this.$router.push('/login')
        sessionStorage.removeItem('token')
        localStorage.removeItem('nametype')
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      }
    },
    backTop() {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
  },
  created () {
    this.companyName = localStorage.getItem('companyName')
  }
}
</script>

<style scoped>
.login {
  height: 100%;
}
.header_title {
  height: 29px;
  background-color: #f5f5f6;
}
.hollw {
  float: left;
}
.header_title_info {
  width: 1200px;
  height: 100%;
  line-height: 29px;
  margin: 0 auto;
}
.news {
  float: right;
  height: 100%;
  font-size: 12px;
  margin: 10px 15px 0 0;
  cursor: pointer;
}
.news_kh {
  color: #e71919;
}
.logout {
  float: right;
  color: #333;
  text-decoration: none;
  font-size: 12px;
  cursor: pointer;
}
.el-menu-demo {
  position: absolute;
  right: 0px;
  top: 23px;
}
.header {
  height: 105px;
  background-color: #fff;
}
.header_info {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  position: relative;
}
.logo {
  width: 451px;
  height: 70px;
  background: url(../../assets/logo.png);
  position: absolute;
  left: 0;
  top: 18px;
}
.pormis_info {
  height: 100%;
  background-color: #f5f5f6;
}
.infos {
  padding: 0;
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
.name {
  float: right;
  margin-right: 30px;
  font-size: 14px;
}
</style>

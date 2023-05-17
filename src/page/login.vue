<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <!-- 中间的登录框 -->
      <!-- 这里为什么使用 Sestion 而不是 div 呢.  -->
      <section class="form_contianer" v-show="showLogin">
        <!-- manage_tip 使用了绝对定位进行布局, 所以实际上, 下面的表格会占据所有的 form_contianer 的空间 -->
        <div class="manage_tip">
          <p>elm后台管理系统</p>
        </div>

        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="密码"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('loginForm')"
              class="submit_btn"
              >登录</el-button
            >
          </el-form-item>
        </el-form>

        <p class="tip">温馨提示：</p>
        <p class="tip">未登录过的新用户，自动注册</p>
        <p class="tip">注册过的用户可凭账号密码登录</p>
      </section>
    </transition>
  </div>
</template>

<script>
import { login, getAdminInfo } from "@/api/getData";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      //   配置校验的规则, 在各个 el-form-item 里面, 使用 prop 属性进行绑定.
      rules: {
        username: [
          // message 里面的内容, 会在
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      showLogin: false,
    };
  },
  mounted() {
    this.showLogin = true;
    if (!this.adminInfo.id) {
      this.getAdminData();
    }
  },
  computed: {
    // adminInfo 是一个计算属性, 是通过 Vuex 里面的 mapState 获取到的.
    ...mapState(["adminInfo"]),
  },
  methods: {
    // getAdminData 是一个方法, 是通过 Vuex 里面的 mapActions 获取到的.
    ...mapActions(["getAdminData"]),

    submitForm(formName) {
	  // 这里, 如果把闭包前面的 async 去掉, 直接就会编译报错. 因为在里面使用了 await 了. 
	  // 作为 validate 的编写者, 可以通过判断这个闭包的返回值类型, 来判断这是一个同步函数, 还是一个异步函数. 
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await login({
            user_name: this.loginForm.username,
            password: this.loginForm.password,
          });
          if (res.status == 1) {
            this.$message({
              type: "success",
              message: "登录成功",
            });
            this.$router.push("manage");
          } else {
            this.$message({
              type: "error",
              message: res.message,
            });
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请输入正确的用户名密码",
            offset: 100,
          });
          return false;
        }
      });
    },
  },
  watch: {
    adminInfo: function (newValue) {
      if (newValue.id) {
        this.$message({
          type: "success",
          message: "检测到您之前登录过，将自动登录",
        });
        this.$router.push("manage");
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "../style/mixin"; // 导入 mixin 文件

.login_page {
  background-color: #324057; // 设置登录页面的背景颜色
}

.manage_tip {
  position: absolute; // 设置 manage tip 元素的位置为绝对
  width: 100%; // 设置 manage tip 元素的宽度为 100%
  top: -100px; // 设置 manage tip 元素的顶部位置为 -100px
  left: 0; // 设置 manage tip 元素的左侧位置为 0
  border: 3px solid #129d00; // 设置 manage tip 元素的边框为实心绿色线条
  p {
    font-size: 34px; // 设置 manage tip 元素内段落元素的字体大小为 34px
    color: #fff; // 设置 manage tip 元素内段落元素的颜色为白色
  }
}

.form_contianer {
  // 可以看到, 其实在 CSS 里面, 也是可以通过各种属性的设置, 来完成布局的.
  // wh, 和 ctp 的使用, 完成了居中显示的目的.
  .wh(320px, 210px);
  .ctp(320px, 210px);

  // padding 的使用, 完全了之前在 iOS 里面,  还需要专门考虑内容空白的问题.
  padding: 25px; // 设置表单容器元素的填充为 25px
  border-radius: 5px; // 设置表单容器元素的边框半径为 5px
  text-align: center; // 居中表单容器元素内的文本
  background-color: #941010; // 设置表单容器元素的背景颜色为深红色
  border: 3px solid #129d00; // 设置表单容器元素的边框为实心绿色线条
  .submit_btn {
    width: 100%; // 设置表单容器元素内提交按钮的宽度为 100%
    font-size: 16px; // 设置表单容器元素内提交按钮的字体大小为 16px
  }
}

.tip {
  font-size: 12px; // 设置提示元素的字体大小为12px
  color: red; // 设置提示元素的颜色为红色
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s; // 在进入或离开活动状态时，对所有属性添加持续一秒钟的过渡效果
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(
    0,
    -50px,
    0
  ); // 在进入或离开活动状态时沿 y 轴移动元素 -50 像素
  opacity: 0; // 在进入或离开活动状态时使元素透明
}
</style>

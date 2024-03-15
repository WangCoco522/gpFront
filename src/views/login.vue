<template>
  <div class="background-image-container"></div>
    <div style="position: absolute; left:50%; top:50%;transform: translate(-50%, -50%);
     background: rgba(255, 255, 255, 0.5);  width: 480px; height: 500px;
     border: 3px solid #CFD3DC; border-radius: 10px;">

     <h2 class="title">上海市北燃气管道监控管理系统</h2>
     <h2 class="loginPage">用户登录</h2>
      <a-form
    :model="formState"
    name="normal_login"
    class="login-form"
    style="margin:50px 30px 30px 30px;"
  >

    <!-- label用于设置字段的标签，常与其内部的输入字段的 name 属性相匹配
    required: true: 这意味着此字段是必填的。message: '请输入用户名！': 如果规则验证失败（例如，用户没有填写这个字段），则会显示这条消息 -->
    <a-form-item
      label="用户名"
      name="username"
      :rules="[{ required: true, message: '请输入用户名！' }]"
    >
      <a-input v-model="formState.username">
        <template #prefix>
          <!-- <UserOutlined class="site-form-item-icon" /> -->
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      label="密&nbsp&nbsp&nbsp&nbsp码"
      name="password"
      :rules="[{ required: true, message: '请输入密码！' }]"
    >
      <a-input-password v-model="formState.password"  @input="formState.password = $event.target.value">
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <!-- 验证码字段 -->
    <a-form-item label="验证码" name="captcha" :rules="[{ required: true, message: '请输入验证码！' }]">
        <a-input v-model="formState.captcha" placeholder="验证码" style="width: 200px;">
          <template #suffix>
            <img :src="captchaImgSrc" @click="reloadCaptcha" style="cursor: pointer;" alt="验证码" />
          </template>
        </a-input>
    </a-form-item>

    <a-form-item>
      <a-form-item name="remember" no-style>
        <a-checkbox v-model="rememberMe">记住密码</a-checkbox>
      </a-form-item>
      <a class="login-form-forgot" href="">忘记密码</a>
    </a-form-item>

    <a-form-item>
      <a-button :disabled="disabled" type="primary" html-type="submit" 
      class="login-form-button" @click="handleSubmit2">
        登录
      </a-button>
      或者
      <a href="#" @click.prevent="register">立即注册</a>
    </a-form-item>
  </a-form> 

    </div>
    <div>
      <myFooter></myFooter>
    </div>
  
</template>

<script>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { UserConstant } from '@/common/constant';

export default {
  setup() {
    const router = useRouter();

    //转换到注册页面
    const register = () => {
      router.push('/register');
    };

    const logining = ref(false);

    const formState = reactive({
      username: 'admin',
      password: '',
      captcha: '', // 添加验证码属性
    });

    const rules = reactive({
      username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    });

    const checked = ref(true);

    const rememberMe = ref(false);

    // 添加验证码图片路径
    const captchaImgSrc = ref('/path/to/captcha/image'); // 这里应替换为实际获取验证码图片的API路径

    // 刷新验证码图片的方法
    const reloadCaptcha = async () => {
      // 这里应添加获取新验证码图片的逻辑
      // 例如，你可以调用后端API刷新验证码，并更新 `captchaImgSrc` 的值
      this.captchaImgSrc.value = '/new/path/to/captcha/image?' + new Date().getTime();
    };

    async function handleSubmit2(ev) {

      logining.value = true;

      // 验证用户名和密码是否为空
    if (!formState.username || !formState.password|| !formState.captcha) {
      alert('用户名、密码和验证码不能为空');
      logining.value = false;
      return; // 立即退出函数
    }


      try {

        const form = new FormData();
        form.append('username', formState.username);
        form.append('password', formState.password);
        form.append('captcha', formState.captcha);

        const response = await axios.post(window.g.url + '/user/login', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Username: formState.username,
          },
        });

        if (response.data.code === 0) {

          // localStorage.setItem(UserConstant.TOKEN, response.headers['authorization']);
          // localStorage.setItem(UserConstant.USERNAME, formState.username);
          // // TODO: Add a way to display the success message
          // router.push('/home/sensorData');

          if (rememberMe.value) {
              localStorage.setItem('username', formState.username);
              localStorage.setItem('password', formState.password);
          }
          localStorage.setItem(UserConstant.TOKEN, response.headers['authorization']);
          router.push('/home/sensorData');
        } else {
          if (response.data.code === 100003) {
            alert('密码错误'); // Use a more user-friendly notification system if available
          } else {
            alert(response.data.msg);
          }
        }

      } catch (err) {
        alert('登录请求失败，请重试'); 
      } finally {
        logining.value = false;
      }
    }

    const checkRememberedLogin = () => {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        if (savedUsername && savedPassword) {
            formState.username = savedUsername;
            formState.password = savedPassword;
            rememberMe.value = true;
        }
    };

    checkRememberedLogin();

    return {
      formState,
      logining,
      rules,
      checked,
      register,
      handleSubmit2,
      rememberMe,
      checkRememberedLogin,
      captchaImgSrc,
      reloadCaptcha
    };
  }
};

</script>

<style scoped>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
  
} 

.title {
  margin: 50px auto 40px auto;
  text-align: center;
  color: #505458;
  color: #000000;
  font-family: '微软雅黑';
  font-size: 30px;
}

.loginPage {
  /* margin: 50px auto 40px auto; */
  text-align: center;
  color: #505458;
  color: #000000;
  font-family: '微软雅黑';
  font-size: 25px;
}



.login-form-forgot{
  margin-left:200px;
}

.background-image-container {
  background-image: url('src/assets/images/login.jpg');
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* 设置背景图片在内容下面 */
}

.content {
  position: relative;
  z-index: 1; /* 确保内容显示在背景图片之上 */
  /* 其他样式 */
}


</style>


<template>
  <div>
    <div style="position: absolute; left:50%; top:50%;transform: translate(-50%, -50%);
     background: #88c4ff;  width: 450px; height: 350px;
     border: 3px solid #CFD3DC; border-radius: 10px;">

     <h3 class="title">市北燃气管道监控管理系统</h3>
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

    <a-form-item>
      <a-form-item name="remember" no-style>
        <a-checkbox >记住密码</a-checkbox>
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
    });

    const rules = reactive({
      username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    });

    const checked = ref(true);

    async function handleSubmit2(ev) {

      logining.value = true;

      // 验证用户名和密码是否为空
    if (!formState.username || !formState.password) {
      alert('用户名或密码不能为空');
      logining.value = false;
      return; // 立即退出函数
    }


      try {

        const form = new FormData();
        form.append('username', formState.username);
        form.append('password', formState.password);

        const response = await axios.post(window.g.url + '/user/login', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Username: formState.username,
          },
        });

        if (response.data.code === 0) {

          localStorage.setItem(UserConstant.TOKEN, response.headers['authorization']);
          localStorage.setItem(UserConstant.USERNAME, formState.username);
          // TODO: Add a way to display the success message
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

    return {
      formState,
      logining,
      rules,
      checked,
      register,
      handleSubmit2
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
    font-size: 20px;
  }

  .login-form-forgot{
    margin-left:200px;
  }

</style>


<template>
  <div>
    <div style="position: absolute; left:50%; top:50%;transform: translate(-50%, -50%);
     background: #88c4ff;  width: 450px; height: 400px;
     border: 3px solid #CFD3DC; border-radius: 10px;">

     <h3 class="title">用户注册</h3>

      <a-form
    name="normal_register"
    class="register-form"
    style="margin:50px 45px 30px 30px;"
  >
    <a-form-item
      label="用&nbsp&nbsp户&nbsp&nbsp名"
      name="username"
      :rules="[{ required: true, message: '请输入用户名！' }]"
    >
      <a-input  v-model="username"  @input="event => (username = event.target.value)">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      label="密&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp码"
      name="password"
      :rules="[{ required: true, message: '请输入密码！' }]"
    >
      <a-input-password v-model="password" @input="event => (password = event.target.value)">
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item
      label="确认密码"
      name="rePassword"
      :rules="[{ required: true, message: '请再次输入密码！'}]"
    >
      <a-input-password v-model="repassword" @input="event => (repassword = event.target.value)">
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" 
      class="register-form-button" @click="doRegister">
        注册
      </a-button>
      或者
      <a href="#" @click.prevent="login">返回登录</a>
    </a-form-item>
  </a-form> 

    </div>
    <div>
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script>
import { ref,reactive,watch,onActivated } from 'vue'; //ref 创建一个响应式引用，reactive 创建响应式对象，onActivated 是一个生命周期钩子
import axios from 'axios';  //流行的 HTTP 客户端库，用于与服务器进行交互
import {useRouter} from 'vue-router';
import { message } from 'ant-design-vue';


const axiosInstance = axios.create();

export default {
  name: 'Register',
  setup() {

    const router = useRouter();

    const registering = ref(false);

    const username = ref('');
    const password = ref('');
    const repassword = ref('');
    const manufacturerId = ref('');

    // 定义注册表单的验证规则
    const registerRule = reactive({
      username: [
        {
          required: true,
          message: '请输入账号',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        },
        {
          pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          message: '密码格式错误，正确的格式是：至少包含一个字母、一个数字、一个特殊字符 (@、$、!、%、*、#、? 或 &)，且长度至少为8个字符。',
          trigger: 'blur',
        },
        {
          required: true,
          message: '请再次输入密码',
          trigger: 'blur',
        }
      ],
    });
    const manufacturerList = ref([]);

    watch(username, newVal => {
      console.log('Username changed:', newVal);
    });

    watch(password, newVal => {
      console.log('Password changed:', newVal);
    });

    watch(repassword, newVal => {
      console.log('rePassword changed:', newVal);
    });


    const doRegister = () => {
      
      if (!username.value || !password.value || !repassword.value) {
        message.warning('请填写完整注册信息！');
        console.log("Username:", username.value);
        console.log("Password:", password.value);
        return false;
      }

       if (password.value !== repassword.value) {
        message.error('两次输入的密码不匹配！');
        return false;
      }

      const form = new FormData();
      form.append('username', username.value);
      form.append('password', password.value);
      registering.value = true;


      axiosInstance.post(window.g.url + '/user/register', form).then((response) => {
        if (response.data.code === 0) {
          message.success('注册成功，请联系管理员启用账号！');
          login();
        }
      });
      registering.value = false;
  };

    //导航到登录页面
    const login = () => {
      router.push('/login');
    };

    onActivated(() => {
      axiosInstance.get(window.g.url + '/manufacturer/list').then((response) => {
        manufacturerList.value = response.data.data;
      });
    });

    return {
      registering,
      username,
      password,
      repassword,
      manufacturerId,
      registerRule,
      manufacturerList,
      doRegister,
      login
    };
  }
};

</script>

<style scoped>
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
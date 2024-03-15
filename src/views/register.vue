<template>
  <div class="background-image-container"></div>
    <div style="position: absolute; left:50%; top:50%;transform: translate(-50%, -50%);
     background: rgba(255, 255, 255, 0.4);  width: 480px; height: 450px;
     border: 3px solid #CFD3DC; border-radius: 10px;">

     <h2 class="title">上海市北燃气管道监控管理系统</h2>
     <h2 class="registerPage">用户注册</h2>

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


    const doRegister = async() => {
      
      if (!username.value || !password.value || !repassword.value) {

        //确保所有字段都填写
        message.warning('请填写完整注册信息！');
        return;
      }

        //确保密码匹配
       if (password.value !== repassword.value) {
        message.error('两次输入的密码不一致！');
        return;
      }

      const form = new FormData();
      form.append('username', username.value);
      form.append('password', password.value);
    
      try {
          registering.value = true;
          const response = await axiosInstance.post(window.g.url + '/user/register', form);
          
          if (response.data.code === 0) {
            message.success('注册成功，请联系管理员启用您的账号！');
            login();
          } else {
            // 处理其他响应
            message.error(response.data.message || '注册失败！');
          }
        } catch (error) {
          // console.error('注册失败:', error);
          // message.error('注册请求失败！');
          // console.error('注册失败:', error);
          if (error.response) {
            // 服务器响应了错误信息
            message.error(error.response.data.message || '注册请求失败！');
          } else {
            // 网络或其他错误
            message.error('注册请求失败！');
          }
        } finally {
          registering.value = false;
        }
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
  font-size: 30px;
}

.registerPage {
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
  background-image: url('src/assets/images/register.jpg');
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
<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <template #prepend>
              <el-button icon="el-icon-user"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter="submitForm()"
          >
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "axios";
// import CryptoJs from "crypto-js"; //引用AES源码js

export default {
  setup() {
    const router = useRouter();
    const param = reactive({
      username: "niexin",
      password: "lpj32",
    });

    const rules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    };
    const login = ref(null);
    const submitForm = () => {
      login.value.validate((valid) => {
        if (valid) {
          // ElMessage.success("登录成功");
          // localStorage.setItem("ms_username", param.username);
          // router.push("/");
          let params = {
            user: param,
          };
          // testEncryp();
          axios
            .post("/api/users/login", params)
            .then((res) => {
              if (res.status == 200) {
                ElMessage.success("登录成功");
                localStorage.setItem("ms_username", param.username);
                localStorage.setItem("token", res.data.token);
                router.push("/");
              } else {
                ElMessage.error(res);
              }
            })
            .catch((err) => {
              const msgList = err.response.data.errors;
              msgList.forEach((item) => {
                ElMessage.error(item.msg);
              });
            });
        } else {
          ElMessage.error("登录成功");
          return false;
        }
      });
    };

    // const key = CryptoJs.enc.Utf8.parse("88889999personal"); // 十六位十六进制数作为密钥
    // const iv = CryptoJs.enc.Utf8.parse("personal88889999"); // 十六位十六进制数作为密钥偏移量

    // //加密
    // const testEncryp = () => {
    //   var res = encrypt(param.password);
    //   param.password = res;
    //   var pas = decrypt(res);
    //   console.log(pas);
    // };

    // const encrypt = (word) => {
    //   let srcs = CryptoJs.enc.Utf8.parse(word);
    //   let encrypted = CryptoJs.AES.encrypt(srcs, key, {
    //     iv: iv,
    //     mode: CryptoJs.mode.CBC,
    //     padding: CryptoJs.pad.Pkcs7,
    //   });
    //   return encrypted.ciphertext.toString().toUpperCase();
    // };

    // // 解密
    // const decrypt = (word) => {
    //   let encryptedHexStr = CryptoJs.enc.Hex.parse(word);
    //   let srcs = CryptoJs.enc.Base64.stringify(encryptedHexStr);
    //   let decrypt = CryptoJs.AES.decrypt(srcs, key, {
    //     iv: iv,
    //     mode: CryptoJs.mode.CBC,
    //     padding: CryptoJs.pad.Pkcs7,
    //   });
    //   let decryptedStr = decrypt.toString(CryptoJs.enc.Utf8);
    //   return decryptedStr.toString();
    // };

    const store = useStore();
    store.commit("clearTags");

    return {
      param,
      rules,
      login,
      submitForm,
    };
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  /* background-image: url(../assets/img/login-bg.jpg); */
  background-image: url(../assets/img/san.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
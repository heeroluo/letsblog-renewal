<template>
  <div class="p-login">
    <form
      class="p-login__form"
      @submit.prevent="login"
    >
      <div class="p-login__form__row">
        <input
          v-model.trim="formData.username"
          type="text"
          class="p-login__form__textbox"
          placeholder="请输入用户名"
          maxlength="20"
        />
      </div>
      <div class="p-login__form__row">
        <input
          v-model.trim="formData.password"
          type="password"
          class="p-login__form__textbox"
          placeholder="请输入密码"
        />
      </div>
      <div class="p-login__form__row p-login__form__row-captcha">
        <input
          ref="captchaRef"
          v-model.trim="formData.captcha"
          type="text"
          class="p-login__form__textbox"
          placeholder="请输入验证码"
          maxlength="4"
        />
        <img
          :src="captchaSrc"
          alt="点击更换验证码"
          class="p-login__form__captcha"
          @click="refreshCaptcha"
        />
      </div>
      <div class="p-login__form__row">
        <input
          class="p-login__form__button"
          type="submit"
          value="登录"
          :disabled="!formData.username || !formData.password || !formData.captcha"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import type { FormError } from '#shared/types/error';

useSeoMeta({
  title: '登录',
});

const captchaRef = useTemplateRef('captchaRef');

const captchaSrc = ref('');
const formData = reactive({
  username: '',
  password: '',
  captcha: '',
});

function refreshCaptcha() {
  captchaSrc.value = '/api/captcha?t=' + Date.now();
}

refreshCaptcha();

async function login() {
  const { error } = await useFetch('/api/user/login', {
    method: 'POST',
    body: formData,
  });
  if (error.value) {
    const formError = error.value.data.data as FormError;
    if (formError?.field === 'captcha') {
      refreshCaptcha();
      formData.captcha = '';
      captchaRef.value?.focus();
    } else {
      alert(error.value.data.message);
    }
  } else {
    alert('登录成功');
  }
}
</script>

<style lang="scss">
body,
html {
  background: #242628;
  height: 100%;
}

.p-login {
  position: fixed;
  width: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #ececec;
}

.p-login__form__row {
  margin: 20px 0;
}

.p-login__form__row-captcha {
  display: flex;
  column-gap: 20px;
}

.p-login__form__captcha,
.p-login__form__textbox,
.p-login__form__button {
  height: 40px;
}

.p-login__form__textbox,
.p-login__form__button {
  width: 100%;
  border-radius: 20px;
}

.p-login__form__textbox {
  padding: 0 15px;
  border: 1px solid #4b4b4b;
  background: #383838;
  color: #ececec;
  font-size: inherit;
  transition-duration: 0.4s;

  &:focus {
    border-color: #76aa09;
  }
}

.p-login__form__captcha {
  border-radius: 8px;
  cursor: pointer;
}

.p-login__form__button {
  cursor: pointer;
  background: #76aa09;
  color: #f0f0f0;
  transition-duration: 0.4s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: #80bd01;
    color: #fff;
  }
}
</style>

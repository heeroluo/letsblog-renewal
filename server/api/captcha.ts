import svgCaptcha from 'svg-captcha';

export default defineEventHandler(async (event) => {
  const captcha = svgCaptcha.create({
    size: 4, // 验证码长度
    ignoreChars: '0o1i', // 忽略容易混淆的字符
    noise: 4, // 干扰线数量
    color: true, // 彩色文字
    background: '#efefef', // 背景色
  });

  await setUserSession(event, {
    captcha: {
      text: captcha.text,
      createdAt: Date.now(),
    },
  });

  setResponseHeaders(event, {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  return captcha.data;
});

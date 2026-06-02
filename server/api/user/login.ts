import { ErrorCode } from '#shared/utils/app-error';
import type { FormError } from '#shared/types/error';
import { login } from '#server/services/user';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password, captcha } = body;

  const usernameStr = String(username);
  const passwordStr = String(password);
  const captchaStr = String(captcha);

  const session = await getUserSession(event);
  const savedCaptcha = session.captcha as {
    text: string
    createdAt: number
  };

  if (
    !captchaStr
    || !savedCaptcha
    || savedCaptcha.createdAt + 5 * 60 * 1000 < Date.now()
    || savedCaptcha.text.toLowerCase() !== captchaStr.toLowerCase()
  ) {
    throw createError<FormError>({
      statusCode: ErrorCode.BadRequest,
      message: '验证码错误',
      data: {
        code: 'INVALID_CAPTCHA',
        field: 'captcha',
      },
    });
  }

  let ip = getRequestIP(event, { xForwardedFor: true });
  if (ip) {
    const ipArray = ip.split(',');
    const firstIp = ipArray[0];
    if (firstIp) {
      ip = firstIp.trim();
    }
  }

  await login(usernameStr, passwordStr, ip || '');

  return {
    message: '登录成功',
  };
});

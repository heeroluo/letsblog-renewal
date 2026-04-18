/**
 * 是否为合法的 Email 地址。
 * @param val 待验证的值。
 * @returns 验证结果。
 */
export function isEmail(val: unknown) {
  const str = String(val);
  if (/^[\w-]+(?:\.[\w-]+)*@[\w-]+(?:\.[\w-]+)*\.[a-zA-Z]{2,}$/.test(str)) {
    const temp = str.replace('@', '.').split('.');
    for (let i = temp.length - 2; i >= 0; i--) {
      const str = temp[i];
      if (!str || /^[-_]/.test(str) || /[_-]$/.test(str)) {
        return false;
      }
    }
  } else {
    return false;
  }
  return true;
}

/**
 * 是否为合法的用户名。
 * @param val 待验证的值。
 * @returns 验证结果。
 */
export function isUsername(val: unknown) {
  return /^\w{2,20}$/.test(String(val));
}

// 是否合法的昵称
export function isNickname(val: unknown) {
  const str = String(val);
  return str.length >= 2 && str.length <= 20;
}

// 是否合法的自动编号
export function isAutoId(val: unknown) {
  const num = Number(val);
  return !isNaN(num) && num > 0;
}

// 是否合法的英文标题
export function isEnTitle(val: unknown) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(val));
}

// 是否合法的 QQ 号
export function isQQ(val: unknown) {
  return /^[1-9]\d{4,}$/.test(String(val));
}

// 是否合法的权重
export function isWeight(val: unknown) {
  const num = Number(val);
  return num >= 0 && num <= 255;
}

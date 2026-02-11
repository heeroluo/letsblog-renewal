/*!
 * LetsBlog
 * Validation functions
 * Released under MIT license
 */

// 是否Email
export function isEmail(val: string) {
	if (/^[\w-]+(?:\.[\w-]+)*@[\w-]+(?:\.[\w-]+)*\.[a-zA-Z]{2,}$/.test(val)) {
		const temp = val.replace('@', '.').split('.');
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
};

// 是否用户名
export function isUsername(val: string) {
  return /^\w{2,20}$/.test(val);
}

// 是否昵称
export function isNickname(val: string) {
  return val.length >= 2 && val.length <= 20;
}

// 是否自动编号
export function isAutoId(val: number) {
	return !isNaN(val) && val > 0;
}

// 是否英文标题
export function isEnTitle(val: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val);
}

// 是否QQ号
export function isQQ(val: string) {
  return /^[1-9]\d{4,}$/.test(val);
}

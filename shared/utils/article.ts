// 行分隔符和段落分隔符（JSON序列化时，这两个字符不会被编码，容易导致异常，需要清理）
const reDangerousChars = new RegExp(
  '[' + String.fromCharCode(8232) + String.fromCharCode(8233) + ']', 'g',
);

export function cleanContent(content: string) {
  // 移除容易导致异常的字符、末尾的空段落
  return content.replace(reDangerousChars, '')
    .replace(/(?:\s*<p>(?:&nbsp;|\s)*<\/p>\s*)+$/, '');
}

// 摘要分隔符
const reSummarySep = /<div\s+style=(["'])page-break-after:\s*always;?\1>.*?<\/div>/i;

// 截取文章摘要（分页符前的部分）
export function getSummary(content: string) {
  const match = reSummarySep.exec(content);
  if (!match) {
    return content;
  }
  return match.input.slice(0, match.index);
}

// 清理文章内容中截取摘要的分隔符
export function getDisplayedContent(content: string) {
  return content.replace(reSummarySep, '');
}

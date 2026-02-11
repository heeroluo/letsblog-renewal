import { isAutoId } from '@/utils/validator';
import { ExtendedError } from '@/utils/extended-error';
import { read as readArticleRecord } from '@/dal/models/article';


// 行分隔符和段落分隔符（JSON序列化时，这两个字符不会被编码，容易导致异常，清空之）
const reSeparator = new RegExp(
	'[' + String.fromCharCode(8232) + String.fromCharCode(8233) + ']', 'g'
);

// 读取单条文章数据
export async function read(articleid: number) {
	if (!isAutoId(articleid)) {
		throw new ExtendedError({
      message: '无效的文章编号',
      code: 400
    });
	}

  const article = await readArticleRecord(articleid);
  if (article) {
    // 移除容易导致异常的字符
    article.content = article.content.replace(reSeparator, '');
  }

  return article;
}

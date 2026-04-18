import { ErrorCode } from '#shared/utils/app-error';
import { isAutoId } from './base';

/**
 * 验证编号字段。如果验证不通过，则抛出异常。
 * @param val 字段值。
 * @param errMsg 异常信息。
 */
export function validateIdAndThrow(val: number, errMsg: string) {
  if (!isAutoId(val)) {
    throw createError({
      message: errMsg,
      statusCode: ErrorCode.BadRequest,
    });
  }
}

/**
 * 执行验证。如果验证不通过，则抛出异常。
 * @param fn 验证函数。
 * @param code 错误码。
 */
export function validateAndThrow(fn: () => string | undefined, code: ErrorCode): void;
export function validateAndThrow(fn: () => Promise<string | undefined>, code: ErrorCode): Promise<void>;
export function validateAndThrow(
  fn: (() => string | undefined) | (() => Promise<string | undefined>),
  statusCode: ErrorCode,
) {
  const result = fn();
  if (!result) {
    return;
  }

  if (typeof result === 'string') {
    throw createError({
      message: result,
      statusCode,
    });
  } else if (typeof result.then === 'function') {
    return result.then((errMsg) => {
      if (errMsg) {
        throw createError({
          message: errMsg,
          statusCode,
        });
      }
    });
  }
}

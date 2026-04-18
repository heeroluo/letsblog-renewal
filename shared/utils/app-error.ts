/**
 * 创建应用错误的参数。
 */
export interface AppErrorOptions {
  /**
   * 错误信息。
   */
  message: string
  /**
   * 错误码。
   */
  code?: ErrorCode
}

/**
 * 错误码。
 */
export enum ErrorCode {
  /**
   * 请求错误。
   */
  BadRequest = 400,
  /**
   * 缺乏身份凭证。
   */
  Unauthorized = 401,
  /**
   * 禁止操作。
   */
  Forbidden = 403,
  /**
   * 内容未找到。
   */
  NotFound = 404,
  /**
   * 资源冲突。
   */
  Conflict = 409,
  /**
   * 内部错误。
   */
  Internal = 500,
}

/**
 * 应用错误类。
 */
export class AppError extends Error {
  /**
   * 错误码。
   */
  public readonly code?: ErrorCode;

  /**
   * 构造函数。
   * @param opts 初始化参数。
   */
  constructor(opts: AppErrorOptions) {
    super(opts.message);
    this.code = opts.code;
    Object.freeze(this);
  }
}

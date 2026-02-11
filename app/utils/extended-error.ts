export interface IExtendedErrorOptions {
  message: string
  code?: number
}

/**
 * 请求错误类。
 */
export class ExtendedError extends Error {
  /**
   * 错误码。
   */
  public readonly code?: number;

  /**
   * 构造函数。
   * @param opts 初始化参数。
   */
  constructor(opts: IExtendedErrorOptions) {
    super(opts.message);
    this.code = opts.code;
    Object.freeze(this);
  }
}

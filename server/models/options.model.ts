/**
 * 站点设置模型定义。
 */

import type { InferAttributes } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { initOptions } from './core';

/**
 * 站点设置的所有属性。
 */
export type OptionsAttrs = InferAttributes<Options>;

/**
 * 站点设置模型。
 */
export class Options extends Model<OptionsAttrs> {
  /**
   * 站点名称。
   */
  declare siteName: string;
  /**
   * 站点 URL。
   */
  declare siteURL: string;
  /**
   * SEO 关键字。
   */
  declare keywords: string;
  /**
   * SEO 描述。
   */
  declare description: string;
  /**
   * 是否开启站点，0 为关闭，1 为开启。
   */
  declare isOpen: number;
  /**
   * 站点关闭时显示的提示文本。
   */
  declare tipsText: string;
  /**
   * 站点统计代码。
   */
  declare statCode: string;
}

Options.init({
  siteName: {
    type: DataTypes.STRING,
    field: 'sitename',
  },
  siteURL: {
    type: DataTypes.STRING,
    field: 'siteurl',
  },
  keywords: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  isOpen: {
    type: DataTypes.TINYINT,
    field: 'isopen',
  },
  tipsText: {
    type: DataTypes.STRING,
    field: 'tipstext',
  },
  statCode: {
    type: DataTypes.STRING,
    field: 'statcode',
  },
}, {
  ...initOptions,
  tableName: 'options',
});

// options表没有主键
Options.removeAttribute('id');

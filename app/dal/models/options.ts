/**
 * 站点设置的数据访问层。
 */

import type { InferAttributes } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../core';


/**
 * 站点设置模型。
 */
export class Options extends Model<InferAttributes<Options>> {
  /**
   * 站点名称。
   */
  declare sitename: string;
  /**
   * 站点 URL。
   */
  declare siteurl: string;
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
  declare isopen: number;
  /**
   * 站点关闭时显示的提示文本。
   */
  declare tipstext: string;
  /**
   * 站点统计代码。
   */
  declare statcode: string;
}

Options.init({
  sitename: { type: DataTypes.STRING },
  siteurl: { type: DataTypes.STRING },
  keywords: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  isopen: { type: DataTypes.TINYINT },
  tipstext: { type: DataTypes.STRING },
  statcode: { type: DataTypes.STRING }
}, {
  sequelize,
  tableName: 'options',
  timestamps: false,
  freezeTableName: true
});

// options表没有主键
Options.removeAttribute('id');

/**
 * 站点设置的属性。
 */
export type OptionsAttrs = InferAttributes<Options>;


/**
 * 读取唯一的站点设置记录。
 * @returns 站点设置记录。
 */
export async function read() {
  const result = await Options.findOne();
  return result ? result.toJSON() : result;
};

/**
 * 更新站点设置。
 * @param data 要更新的字段和数据。
 * @returns 更新的记录数。
 */
export async function update(data: OptionsAttrs) {
  return (await Options.update(data, {
    where: {}
  }))[0];
};

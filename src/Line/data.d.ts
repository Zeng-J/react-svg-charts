import {
  CommonChartDataListItem,
  CommonConfigType,
  CommonRectangularConstantType,
  ValueType,
} from '../data';

/** 每一个坐标点的path标签的d属性、y坐标点 */
interface LineCategoryType extends ValueType {
  d: string;
  yPosition: number;
}

/** 处理后的折线图数据 */
export type LineChartDataListItem = CommonChartDataListItem<CategoryType>;

export type LineConfigType = CommonConfigType;

/** 折线图的所有计算后的常量参数 */
export type LineConstantType = CommonRectangularConstantType;

/** 生成折线图数据所需要的参数 */
export type LineGenerateDataConfigType = Pick<
  LineConstantType,
  | 'horizontalAxisWidth'
  | 'yMaxValue'
  | 'verticalAxisHeight'
  | 'yLabelWidth'
  | 'coordinateLeftTopY'
>;

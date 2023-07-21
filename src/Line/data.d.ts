import { CommonChartDataListItem, CommonConfigType, ValueType } from '../data';

/** 每一个坐标点的path标签的d属性、y坐标点 */
interface LineCategoryType extends ValueType {
  d: string;
  yPosition: number;
}

/** 处理后的折线图数据 */
export type LineChartDataListItem = CommonChartDataListItem<CategoryType>;

export type LineConfigType = CommonConfigType;

// todo 抽离
/** 折线图的所有计算后的常量参数 */
export interface LineConstantType extends Required<LineConfigType> {
  /** 横向坐标系宽度（除了label占用宽度） */
  horizontalAxisWidth: number;
  /** 纵向坐标系的高度（除了label占用高度） */
  verticalAxisHeight: number;
  /** y轴刻度之间的间距 */
  yGap: number;
  /** 坐标系左上角的x坐标 */
  coordinateLeftTopX: number;
  /** 坐标系左上角的y坐标 */
  coordinateLeftTopY: number;
}

/** 生成折线图数据所需要的参数 */
export type LineGenerateDataConfigType = Pick<
  LineConstantType,
  | 'horizontalAxisWidth'
  | 'yMaxValue'
  | 'verticalAxisHeight'
  | 'yLabelWidth'
  | 'coordinateLeftTopY'
>;

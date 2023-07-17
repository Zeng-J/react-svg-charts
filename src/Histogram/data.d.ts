import { CommonChartDataListItem, CommonConfigType, ValueType } from '../data';

interface CategoryType extends ValueType {
  yPosition: number;
  xPosition: number;
  height: number;
}

export interface ChartDataListItem
  extends CommonChartDataListItem<CategoryType> {
  gridWidth: number;
}

export interface ConfigType extends CommonConfigType {
  /** 柱形条宽度，一般不需要手动传入，会自动计算 */
  barWidth: number;
  /** 同一组的柱形条间距（多组柱形图才会用到这个） */
  barGap: number;
}

export interface ConstantType extends ConfigType {
  /** 横向坐标系宽度（除了label占用宽度） */
  horizontalAxisWidth: number;
  /** 纵向坐标系的高度（除了label占用高度） */
  verticalAxisHeight: number;
  /** y轴刻度之间的间距 */
  yGap: number;
}

export type GenerateDataConfigType = Pick<
  ConstantType,
  | 'horizontalAxisWidth'
  | 'yMaxValue'
  | 'verticalAxisHeight'
  | 'yLabelWidth'
  | 'barGap'
  | 'barWidth'
>;

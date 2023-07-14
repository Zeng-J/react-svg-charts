import { ValueType, CommonChartDataListItem, CommonConfigType } from '../data';

interface CategoryType extends ValueType {
  yPosition: number;
  xPosition: number;
  height: number;
}

export interface ChartDataListItem extends CommonChartDataListItem<CategoryType> {
  gridWidth: number;
}

export interface ConfigType extends CommonConfigType {
  barWidth: number; // 柱形条宽度
  barGap: number; // 柱形条间距
}

export type ConfigTypeProps = Partial<ConfigType> & Pick<ConfigType, 'width' | 'height'>;

export interface ConstantType extends ConfigType {
  yInitialPoint: number; // y坐标的起始点
  horizontalAxisWidth: number; // 横向坐标系宽度
  verticalAxisHeight: number; // 纵向坐标系的宽度
  yGap: number; // y轴刻度之间的间距
}

export type GenerateDataConfigType = Pick<
  ConstantType,
  | 'horizontalAxisWidth'
  | 'yMaxValue'
  | 'verticalAxisHeight'
  | 'yInitialPoint'
  | 'yLabelWidth'
  | 'barGap'
  | 'barWidth'
>;

import {
  CommonRectangularConstantType,
  CommonRectChartDataListItem,
  CommonRectConfigType,
  ValueType,
} from '../data';

interface HistogramCategoryType extends ValueType {
  yPosition: number;
  xPosition: number;
  height: number;
}

export interface HistogramChartDataListItem
  extends CommonRectChartDataListItem<HistogramCategoryType> {
  /** 柱形hover时的背景色宽度 */
  barBackgroundWidth: number;
}

export interface HistogramExclusiveConfigType {
  /** 柱形条宽度，一般不需要手动传入，会自动计算 */
  barWidth?: number;
  /** 同一组的柱形条间距（多组柱形图才会用到这个） */
  barGap: number;
}

export type HistogramConfigType = CommonRectConfigType &
  HistogramExclusiveConfigType;

export type HistogramConstantType = CommonRectangularConstantType &
  Required<HistogramExclusiveConfigType>;

export type HistogramGenerateDataConfigType = Pick<
  HistogramConstantType,
  | 'horizontalAxisWidth'
  | 'yMaxValue'
  | 'verticalAxisHeight'
  | 'yLabelWidth'
  | 'barGap'
  | 'barWidth'
  | 'coordinateLeftTopY'
>;

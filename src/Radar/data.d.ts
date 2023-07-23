import {
  CommonPolarChartDataListItem,
  CommonPolarConfigType,
  CommonPolarConstantType,
  ValueType,
} from '../data';

interface RadarCategoryType extends ValueType {
  xPosition: number;
  yPosition: number;
  angle: number;
}

/** 处理后的雷达图数据 */
export type RadarChartDataListItem =
  CommonPolarChartDataListItem<RadarCategoryType>;

export type RadarConfigType = CommonPolarConfigType;

/** 雷达图的所有计算后的常量参数 */
export type RadarConstantType = CommonPolarConstantType;

/** 生成雷达图数据所需要的参数 */
export type RadarGenerateDataConfigType = Pick<
  RadarConstantType,
  'radius' | 'centerX' | 'centerY' | 'yMaxValue' | 'padding'
>;

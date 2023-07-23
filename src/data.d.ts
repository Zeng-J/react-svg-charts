export interface ValueType {
  name: string | number;
  value: number;
}

/** 约定传入图表的数据结构 */
// 例如单折线图，[{ labe: '2021', value: { name: '参与人数', value: 10 } }, { labe: '2022', value: { name: '参与人数', value: 24 } }]
// 例如多折线图，[{ labe: '2021', value: [{ name: '参与人数', value: 10 }, { name: '完成人数', value: 3 }]}]
export type DataListItem = {
  label: string | number;
  value: ValueType | ValueType[];
} & Record<string, any>;

/** 图表通用配置 */
export interface CommonConfigType {
  width: number;
  height: number;
  /** label字体大小 */
  labelFontSize: number;
  /** y轴最大值 */
  yMaxValue: number;
  /** y轴显示多少条刻度线 */
  yTickCount: number;
  /** 自动取图表容器的宽高 */
  autoFit: boolean;
  colors: string[];
}

export interface CommonChartDataListItem<T extends ValueType = ValueType> {
  /** x轴的label */
  label: string | number;
  /** 存储y坐标点等数据 */
  category: T[];
}

/** 直角坐标系通用图表配置 */
export interface CommonRectConfigType extends CommonConfigType {
  /** y轴label宽度 */
  yLabelWidth: number;
  /** y轴label的右边距 */
  yLabelPaddingRight: number;
  /** x轴label的上边距 */
  xLabelPaddingTop: number;
}

/** 内部处理后的直角坐标系图表数据类型 */
export interface CommonRectChartDataListItem<T extends ValueType = ValueType>
  extends CommonChartDataListItem<T> {
  /** x轴的每条数据的坐标点 */
  tickPosition: number;
}

/** 直角坐标系通用处理后的配置 */
export interface CommonRectangularConstantType extends CommonRectConfigType {
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

/** 内部处理后的极坐标系图表数据类型 */
export interface CommonPolarChartDataListItem<T extends ValueType = ValueType>
  extends CommonChartDataListItem<T> {
  /** x轴的刻度点 */
  tickXPosition: number;
  /** y轴的刻度点 */
  tickYPosition: number;
  /** x轴的刻度文本 */
  tickLabelXPosition: number;
  /** y轴的刻度文本 */
  tickLabelYPosition: number;
  angle: number;
}

/** 极坐标系通用图表配置 */
export interface CommonPolarConfigType extends CommonConfigType {
  /** 图表内边距 坐标轴文本会占用 */
  padding: number;
  /** y轴线显示成多边形还是圆形 */
  yAxisType: 'circle' | 'polygon';
}

/** 极坐标系通用处理后的配置 */
export interface CommonPolarConstantType extends CommonPolarConfigType {
  /** 半径 */
  radius: number;
  centerX: number;
  centerY: number;
  /** y轴的刻度值 */
  yTicks: number[];
  angleUnit: number;
}

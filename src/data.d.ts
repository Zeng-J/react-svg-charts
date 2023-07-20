export interface ValueType {
  name: string | number;
  value: number;
}

// 约定传入图表的数据结构
// 例如单折线图，[{ labe: '2021', value: { name: '参与人数', value: 10 } }, { labe: '2022', value: { name: '参与人数', value: 24 } }]
// 例如多折线图，[{ labe: '2021', value: [{ name: '参与人数', value: 10 }, { name: '完成人数', value: 3 }]}]
export type DataListItem = {
  label: string | number;
  value: ValueType | ValueType[];
} & Record<string, any>;

// 通用图表配置
export type CommonConfigType = {
  width: number;
  height: number;
  /** label字体大小 */
  labelFontSize: number;
  /** y轴label宽度 */
  yLabelWidth: number;
  /** y轴label的右边距 */
  yLabelPaddingRight: number;
  /** x轴label的上边距 */
  xLabelPaddingTop: number;
  /** y轴最大值 */
  yMaxValue: number;
  /** y轴显示多少条刻度线 */
  yCount: number;
  /** 自动取图表容器的宽高 */
  autoFit: boolean;
  colors: string[];
};

// 内部处理后的图表数据类型
export interface CommonChartDataListItem<T extends ValueType = ValueType> {
  /** x轴的每条数据的坐标点 */
  tickPosition: number;
  /** x轴的label */
  label: string | number;
  /** 存储y坐标点等数据 */
  category: T[];
}

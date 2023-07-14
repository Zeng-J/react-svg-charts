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
  labelFontSize: number; // label字体大小
  labelLineHeight: number; // label的line-height
  yLabelWidth: number; // y轴label宽度
  yLabelPaddingRight: number; // y轴label的右边距
  xLabelHeight: number; // x轴label高度
  yMaxValue: number; // y轴最大值
  yCount: number; // y轴显示多少条刻度线
};

// 内部处理后的图表数据类型
export interface CommonChartDataListItem<T extends ValueType = ValueType> {
  tickPosition: number; // x轴的每条数据的坐标点
  label: string | number; // x轴的label
  category: T[]; // 存储y坐标点等数据
}

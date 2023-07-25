import { CommonPolarConfigType } from 'rs-charts/data';

// 目前最多显示7个类别，需要可以补充颜色
// 可以考虑色板库https://www.npmjs.com/package/d3-scale-chromatic，包大小100k+
export const COLORS = [
  '#a6cee3',
  '#b2df8a',
  '#fb9a99',
  '#fdbf6f',
  '#cab2d6',
  '#ffff99',
  '#b15928',
];

export const COMMON_DEFAULT_CONFIG = {
  labelFontSize: 12,
  yMaxValue: 100,
  yTickCount: 5,
  autoFit: true,
  colors: COLORS,
};

// 直角坐标系图表的默认配置
export const DEFAULT_CONFIG_OF_RECT = {
  ...COMMON_DEFAULT_CONFIG,
  yLabelWidth: 36,
  yLabelPaddingRight: 8,
  xLabelPaddingTop: 8,
};

// 极坐标系图表的默认配置
export const DEFAULT_CONFIG_OF_POLAR: Omit<
  CommonPolarConfigType,
  'width' | 'height'
> = {
  ...COMMON_DEFAULT_CONFIG,
  padding: 36,
  yAxisType: 'circle',
};

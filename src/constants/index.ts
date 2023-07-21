// 目前最多显示12个类别，需要可以补充颜色
// 可以考虑色板库https://www.npmjs.com/package/d3-scale-chromatic，包大小100k+
export const COLORS = [
  '#a6cee3',
  '#1f78b4',
  '#b2df8a',
  '#33a02c',
  '#fb9a99',
  '#e31a1c',
  '#fdbf6f',
  '#ff7f00',
  '#cab2d6',
  '#6a3d9a',
  '#ffff99',
  '#b15928',
];

// 直角坐标系图表的默认配置
export const DEFAULT_CONFIG_OF_RECT = {
  labelFontSize: 12,
  yLabelWidth: 36,
  yLabelPaddingRight: 8,
  xLabelPaddingTop: 8,
  yMaxValue: 100,
  yCount: 5,
  barGap: 4,
  autoFit: true,
  colors: COLORS,
};

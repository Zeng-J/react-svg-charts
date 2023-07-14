import type { ValueType, DataListItem } from '../data';

import type {
  CategoryType,
  ChartDataListItem,
  GenerateDataConfigType,
  ConfigTypeProps,
  ConstantType,
} from './data';

const defaultConfig = {
  labelFontSize: 12,
  labelLineHeight: 16,
  yLabelWidth: 36,
  yLabelPaddingRight: 14,
  xLabelHeight: 24,
  yMaxValue: 100,
  yCount: 5,
  barWidth: 12,
  barGap: 8,
};

export function generateConfig(options: ConfigTypeProps): ConstantType {
  const config = {
    ...defaultConfig,
    ...options,
  };
  const yInitialPoint = config.labelLineHeight / 2;
  const verticalAxisHeight = config.height - config.xLabelHeight - yInitialPoint;

  return {
    ...config,
    yInitialPoint,
    horizontalAxisWidth: config.width - config.yLabelWidth,
    verticalAxisHeight,
    yGap: verticalAxisHeight / config.yCount,
  };
}

export function generateData(
  list: DataListItem[],
  {
    horizontalAxisWidth,
    yMaxValue,
    verticalAxisHeight,
    yInitialPoint,
    yLabelWidth,
    barGap,
    barWidth,
  }: GenerateDataConfigType,
): ChartDataListItem[] {
  const dList: ChartDataListItem[] = [];
  const len = list.length;
  // 平分横向坐标宽度
  const averageWidth = horizontalAxisWidth / list.length;

  // const genCategory = (v: ValueType, xTick: number, len: number, order: number): CategoryType => {

  // }

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < len; i++) {
    const item = list[i];
    let category: CategoryType[] = [];

    // x坐标刻度点
    const tickPosition = averageWidth * (i + 0.5) + yLabelWidth;

    let valueArr: ValueType[];

    // 多柱形图图
    if (Array.isArray(item.value)) {
      valueArr = item.value;
    } else if (Object.prototype.toString.call(item.value) === '[object Object]') {
      // 单柱形图
      valueArr = [item.value];
    } else {
      throw new Error('value必须为对象或者数组');
    }

    // 网格宽度
    const gridWidth = valueArr.length * (barGap + barWidth) + barGap;
    // 绘制每个x点的柱形的起始点
    const barInitialX = tickPosition - gridWidth / 2 + barGap;

    category = valueArr.map((v, index) => {
      // 计算柱形高度
      const height = (v.value / yMaxValue) * verticalAxisHeight;
      // xPosition、yPosition是柱形左上角的坐标点
      const xPosition = barInitialX + index * (barGap + barWidth);
      const yPosition = verticalAxisHeight + yInitialPoint - height;

      return {
        ...v,
        xPosition,
        yPosition,
        height,
      };
    });

    dList.push({
      tickPosition,
      gridWidth,
      category,
      label: item.label,
    });
  }
  return dList;
}

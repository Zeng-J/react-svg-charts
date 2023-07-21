import type { DataListItem, ValueType } from '../data';

import type {
  LineCategoryType,
  LineChartDataListItem,
  LineConfigType,
  LineConstantType,
  LineGenerateDataConfigType,
} from './data';

export function generateConfig(config: LineConfigType): LineConstantType {
  // todo 抽离
  const coordinateLeftTopX = config.yLabelWidth;
  const coordinateLeftTopY = config.labelFontSize / 2;
  const verticalAxisHeight =
    config.height -
    coordinateLeftTopY -
    config.labelFontSize -
    config.xLabelPaddingTop;
  const horizontalAxisWidth = config.width - coordinateLeftTopX;

  return {
    ...config,
    coordinateLeftTopX,
    coordinateLeftTopY,
    horizontalAxisWidth,
    verticalAxisHeight,
    yGap: verticalAxisHeight / config.yCount,
  };
}

export function generateChartData(
  list: DataListItem[],
  {
    horizontalAxisWidth,
    yMaxValue,
    verticalAxisHeight,
    coordinateLeftTopY,
    yLabelWidth,
  }: LineGenerateDataConfigType,
): LineChartDataListItem[] {
  const chartData: LineChartDataListItem[] = [];
  const len = list.length;
  // 平分横向坐标宽度
  const averageWidth = horizontalAxisWidth / list.length;

  const genCategory = (
    v: ValueType,
    x: number,
    index: number,
  ): LineCategoryType => {
    // 计算y坐标点
    const yPosition =
      (1 - v.value / yMaxValue) * verticalAxisHeight + coordinateLeftTopY;

    return {
      ...v,
      yPosition,
      d: `${index === 0 ? 'M' : 'L'} ${x} ${yPosition}`,
    };
  };

  for (let i = 0; i < len; i++) {
    const item = list[i];
    let category: LineCategoryType[] = [];

    // x坐标刻度点
    const tickPosition = averageWidth * (i + 0.5) + yLabelWidth;

    // 多条折线图
    if (Array.isArray(item.value)) {
      category = item.value.map((c) => genCategory(c, tickPosition, i));
    } else if (
      Object.prototype.toString.call(item.value) === '[object Object]'
    ) {
      // 一条折线图
      category = [genCategory(item.value, tickPosition, i)];
    } else {
      throw new Error('value必须为对象或者数组');
    }

    chartData.push({
      tickPosition,
      category,
      label: item.label,
    });
  }
  return chartData;
}

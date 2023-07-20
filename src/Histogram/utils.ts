import type { DataListItem, ValueType } from 'react-svg-charts/data';

import type {
  HistogramCategoryType,
  HistogramChartDataListItem,
  HistogramConfigType,
  HistogramConstantType,
  HistogramGenerateDataConfigType,
} from './data';

interface DataTotalType {
  /** 数据条数，也表示x轴的坐标数 */
  dataTotal: number;
  /** 每个坐标点对应的多少组 */
  groupTotal: number;
}

function calcBarWidth({
  dataTotal,
  groupTotal,
  barGap,
  horizontalAxisWidth,
}: DataTotalType & { barGap: number; horizontalAxisWidth: number }) {
  // 每个坐标可用宽度，再除以2 是因为每个坐标之间要有空隙
  const tickWidth = horizontalAxisWidth / dataTotal / 2;
  // 每一个柱形的宽度, barGap 是指每个柱形间隙宽度
  const barWidth = (tickWidth - (groupTotal - 1) * barGap) / groupTotal;
  // 宽度太大了也不好看
  return Math.min(barWidth, 200);
}

export function generateConfig(
  config: HistogramConfigType,
  extra: DataTotalType,
): HistogramConstantType {
  const verticalAxisHeight =
    config.height - config.labelFontSize - config.xLabelPaddingTop;
  const horizontalAxisWidth = config.width - config.yLabelWidth;

  const barWidth =
    config.barWidth ??
    calcBarWidth({
      ...extra,
      horizontalAxisWidth,
      barGap: config.barGap,
    });

  return {
    ...config,
    barWidth,
    horizontalAxisWidth,
    verticalAxisHeight,
    yGap: (verticalAxisHeight - config.labelFontSize / 2) / config.yCount,
  };
}

export function generateChartData(
  list: DataListItem[],
  {
    horizontalAxisWidth,
    yMaxValue,
    verticalAxisHeight,
    yLabelWidth,
    barGap,
    barWidth,
  }: HistogramGenerateDataConfigType,
): HistogramChartDataListItem[] {
  const charData: HistogramChartDataListItem[] = [];
  const len = list.length;
  // 平分横向坐标宽度
  const averageWidth = horizontalAxisWidth / list.length;

  for (let i = 0; i < len; i++) {
    const item = list[i];
    let category: HistogramCategoryType[] = [];

    // x坐标刻度点
    const tickPosition = averageWidth * (i + 0.5) + yLabelWidth;

    let valueArr: ValueType[];

    // 多柱形图图
    if (Array.isArray(item.value)) {
      valueArr = item.value;
    } else if (
      Object.prototype.toString.call(item.value) === '[object Object]'
    ) {
      // 单柱形图
      valueArr = [item.value];
    } else {
      throw new Error('value必须为对象或者数组');
    }

    // 同一组中，第一个柱形起始点 到 最后柱形终止点的宽度
    const barGroupWidth = valueArr.length * (barGap + barWidth) - barGap;
    // hover时柱形的背景色宽度
    const barBackgroundWidth = Math.min(
      averageWidth,
      barGroupWidth + Math.floor(barGroupWidth / 2),
    );
    // 绘制同一组第一个柱形的起始点
    const barInitialX = tickPosition - barGroupWidth / 2;

    category = valueArr.map((v, index) => {
      // 计算柱形高度
      const barHeight = (v.value / yMaxValue) * verticalAxisHeight;
      // xPosition、yPosition是柱形左上角的坐标点
      const xPosition = barInitialX + index * (barGap + barWidth);
      const yPosition = verticalAxisHeight - barHeight;

      return {
        ...v,
        xPosition,
        yPosition,
        height: barHeight,
      };
    });

    charData.push({
      tickPosition,
      barBackgroundWidth,
      category,
      label: item.label,
    });
  }
  return charData;
}

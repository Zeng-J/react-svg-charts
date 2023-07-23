import type { DataListItem } from '../data';

import type {
  RadarCategoryType,
  RadarChartDataListItem,
  RadarConfigType,
  RadarConstantType,
  RadarGenerateDataConfigType,
} from './data';

import { calcSvgCoordinateByPolar } from '../utils/polar';

interface GenerateRadarExtraConfig {
  xTickcCount: number;
}

export function generateConfig(
  config: RadarConfigType,
  { xTickcCount }: GenerateRadarExtraConfig,
): RadarConstantType {
  const { width, height, yMaxValue, yTickCount, padding } = config;
  // 由于雷达图是正方形，所以找最小的宽/高做为正方形边长
  const minSquareWiddth = Math.min(width, height);
  // 圆形半径
  const radius = (minSquareWiddth - 2 * padding) / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  // 刻度线单位值
  const yUnit = yMaxValue / (yTickCount - 1);
  const yTicks = Array.from({ length: yTickCount }).map((_, i) => yUnit * i);
  // 平分x轴角度
  const angleUnit = (Math.PI * 2) / xTickcCount;

  return {
    ...config,
    radius,
    yTicks,
    centerX,
    centerY,
    angleUnit,
  };
}

export function generateChartData(
  list: DataListItem[],
  { centerX, centerY, yMaxValue, radius, padding }: RadarGenerateDataConfigType,
): RadarChartDataListItem[] {
  const chartData: RadarChartDataListItem[] = [];
  const len = list.length;
  // 平分角度
  const angleUnit = (Math.PI * 2) / len;

  for (let i = 0; i < len; i++) {
    const item = list[i];
    let category: RadarCategoryType[] = [];

    const angle = angleUnit * i;

    // 多组
    if (Array.isArray(item.value)) {
      category = item.value.map((group) => ({
        ...group,
        ...calcSvgCoordinateByPolar(
          (group.value / yMaxValue) * radius,
          angle,
          centerX,
          centerY,
        ),
      }));
    } else if (
      Object.prototype.toString.call(item.value) === '[object Object]'
    ) {
      // 一组
      category = [
        {
          ...item.value,
          ...calcSvgCoordinateByPolar(
            (item.value.value / yMaxValue) * radius,
            angle,
            centerX,
            centerY,
          ),
        },
      ];
    } else {
      throw new Error('value必须为对象或者数组');
    }

    const { xPosition: tickXPosition, yPosition: tickYPosition } =
      calcSvgCoordinateByPolar(radius, angle, centerX, centerY);
    const { xPosition: tickLabelXPosition, yPosition: tickLabelYPosition } =
      calcSvgCoordinateByPolar(radius + padding / 2, angle, centerX, centerY);

    chartData.push({
      tickXPosition,
      tickYPosition,
      tickLabelXPosition,
      tickLabelYPosition,
      angle,
      category,
      label: item.label,
    });
  }
  return chartData;
}

import { MouseEvent } from 'react';
import { CommonConfigType, CommonRectangularConstantType } from '../data';

// 针对直角坐标系 判断鼠标在哪个区域内 返回0|1|...
export const whereIsAreaOfRectangular = (
  x: number,
  offestX: number,
  averageWidth: number,
): number => Math.floor((x - offestX) / averageWidth);

// 判断鼠标是否在直角坐标系内
export const isWithinOrNotOfRectangular = (
  e: MouseEvent,
  {
    coordinateLeftTopX,
    coordinateLeftTopY,
    verticalAxisHeight,
  }: {
    coordinateLeftTopX: number;
    coordinateLeftTopY: number;
    verticalAxisHeight: number;
  },
) => {
  const rect = e.currentTarget?.getBoundingClientRect();
  const { clientX, clientY } = e;
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  return {
    x,
    y,
    isWithin:
      x > coordinateLeftTopX &&
      y > coordinateLeftTopY &&
      y < coordinateLeftTopY + verticalAxisHeight,
    clientX,
    clientY,
  };
};

// 生成直角坐标系通用的配置
export function generateConfigOfRectangular<
  T extends CommonConfigType = CommonConfigType,
>(config: T): T & CommonRectangularConstantType {
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

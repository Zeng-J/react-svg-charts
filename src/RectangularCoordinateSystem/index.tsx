import React, { useMemo } from 'react';
import {
  CommonRectangularConstantType,
  CommonRectChartDataListItem,
} from '../data';

interface RectangularCoordinateSystemProps<T, K> {
  config: T;
  chartData: K[];
}

export default function RectangularCoordinateSystem<
  T extends CommonRectangularConstantType = CommonRectangularConstantType,
  K extends CommonRectChartDataListItem = CommonRectChartDataListItem,
>({ config, chartData }: RectangularCoordinateSystemProps<T, K>) {
  const {
    yGap,
    yMaxValue,
    yTickCount,
    yLabelWidth,
    yLabelPaddingRight,
    labelFontSize,
    coordinateLeftTopY,
    width,
    height,
    verticalAxisHeight,
  } = config;

  // y轴坐标系
  const yCoordinateAxisNode = useMemo(() => {
    // 刻度线单位值
    const yUnit = yMaxValue / yTickCount;
    // y轴刻度线
    const yLineList = Array.from({ length: yTickCount + 1 }).map(
      (_, i) => yMaxValue - yUnit * i,
    );
    return (
      <g>
        {yLineList.map((val, index) => {
          const yAxis = index * yGap + coordinateLeftTopY;
          return (
            <g key={val}>
              <text
                x={yLabelWidth - yLabelPaddingRight}
                y={yAxis}
                fill="#828B94"
                fontSize={labelFontSize}
                dominantBaseline="central"
                style={{ textAnchor: 'end' }}
              >
                {val}
              </text>
              <line
                x1={yLabelWidth}
                y1={yAxis}
                x2={width}
                y2={yAxis}
                stroke="#E1E8F7"
                strokeWidth="1"
                // x轴线为实线，其他为虚线
                strokeDasharray={index !== yTickCount ? '4, 4' : undefined}
              />
            </g>
          );
        })}
      </g>
    );
  }, [
    coordinateLeftTopY,
    labelFontSize,
    width,
    yTickCount,
    yGap,
    yLabelPaddingRight,
    yLabelWidth,
    yMaxValue,
  ]);

  // x轴坐标系
  const xCoordinateAxisNode = useMemo(() => {
    return (
      <g>
        {chartData.map((item) => (
          <g key={item.tickPosition}>
            <line
              x1={item.tickPosition}
              x2={item.tickPosition}
              y1={verticalAxisHeight + coordinateLeftTopY}
              y2={verticalAxisHeight + coordinateLeftTopY + 6}
              stroke="#E1E8F7"
              strokeWidth="1"
            />
            <text
              x={item.tickPosition}
              y={height}
              dominantBaseline="auto"
              fontSize={labelFontSize}
              fill="#828b94"
              style={{ textAnchor: 'middle' }}
            >
              {item.label}
            </text>
          </g>
        ))}
      </g>
    );
  }, [
    chartData,
    coordinateLeftTopY,
    height,
    labelFontSize,
    verticalAxisHeight,
  ]);
  return (
    <>
      {yCoordinateAxisNode}
      {xCoordinateAxisNode}
    </>
  );
}

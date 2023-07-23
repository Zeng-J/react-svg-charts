import React, { CSSProperties, useMemo } from 'react';
import { CommonPolarChartDataListItem, CommonPolarConstantType } from '../data';

import { generatePolarCoordinate } from 'react-svg-charts/utils/polar';

interface PolarCoordinateSystemProps<T, K> {
  config: T;
  chartData: K[];
}

export default function PolarCoordinateSystem<
  T extends CommonPolarConstantType = CommonPolarConstantType,
  K extends CommonPolarChartDataListItem = CommonPolarChartDataListItem,
>({ config, chartData }: PolarCoordinateSystemProps<T, K>) {
  const { yMaxValue, labelFontSize, yTicks, radius, centerX, centerY } = config;

  const xtickCount = chartData.length;

  // x轴坐标系
  const xCoordinateAxisNode = useMemo(() => {
    return (
      <g>
        {chartData.map((item) => {
          let textAnchor: CSSProperties['textAnchor'] = 'end';
          if (item.angle === 0 || item.angle === Math.PI) {
            textAnchor = 'middle';
          } else if (item.angle < Math.PI) {
            textAnchor = 'start';
          }
          return (
            <g key={item.angle}>
              {/* x轴刻度线 */}
              <line
                x1={centerX}
                x2={item.tickXPosition}
                y1={centerY}
                y2={item.tickYPosition}
                stroke="#E1E8F7"
                strokeWidth="1"
              />
              {/* x轴文本 */}
              <text
                x={item.tickLabelXPosition}
                y={item.tickLabelYPosition}
                fill="#4D535C"
                fontSize={labelFontSize}
                dominantBaseline="central"
                style={{ textAnchor }}
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </g>
    );
  }, [centerX, centerY, chartData, labelFontSize]);

  // y轴坐标系
  const yCoordinateAxisNode = useMemo(() => {
    return (
      <g>
        {yTicks.map((yValue, index) => {
          const y = (yValue / yMaxValue) * radius;
          return (
            <g key={y}>
              {/* 多边形描边 */}
              {index > 0 && (
                <polygon
                  points={generatePolarCoordinate(
                    Array.from({ length: xtickCount }).fill(y) as number[],
                    centerX,
                    centerY,
                  )
                    .map(
                      ({ xPosition, yPosition }) =>
                        `${xPosition} ${yPosition} `,
                    )
                    .join('')}
                  stroke="#E1E8F7"
                  fill="transparent"
                  strokeWidth="1"
                />
              )}
              {/* y轴文本 */}
              <text
                x={centerX - 6}
                y={centerY - y}
                fill="#4D535C"
                fontSize={12}
                dominantBaseline="central"
                style={{ textAnchor: 'end' }}
              >
                {yValue}
              </text>
            </g>
          );
        })}
      </g>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerX, centerY, radius, yMaxValue, JSON.stringify(yTicks)]);

  return (
    <>
      {xCoordinateAxisNode}
      {yCoordinateAxisNode}
    </>
  );
}

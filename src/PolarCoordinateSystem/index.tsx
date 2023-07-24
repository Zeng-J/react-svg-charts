import React, { CSSProperties, useMemo } from 'react';
import { CommonPolarChartDataListItem, CommonPolarConstantType } from '../data';
import { generatePolarCoordinate } from '../utils/polar';

interface PolarCoordinateSystemProps<T, K> {
  config: T;
  chartData: K[];
}

export default function PolarCoordinateSystem<
  T extends CommonPolarConstantType = CommonPolarConstantType,
  K extends CommonPolarChartDataListItem = CommonPolarChartDataListItem,
>({ config, chartData }: PolarCoordinateSystemProps<T, K>) {
  const {
    yMaxValue,
    labelFontSize,
    yTicks,
    radius,
    centerX,
    centerY,
    yAxisType,
  } = config;

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
          // 当前刻度的半径
          const curTickRaius = (yValue / yMaxValue) * radius;
          return (
            <g key={curTickRaius}>
              {/* 多边形描边 */}
              {index > 0 &&
                (yAxisType === 'polygon' ? (
                  <polygon
                    points={generatePolarCoordinate(
                      Array.from({ length: xtickCount }).fill(
                        curTickRaius,
                      ) as number[],
                      centerX,
                      centerY,
                    )
                      .map(
                        ({ xPosition, yPosition }) =>
                          `${xPosition} ${yPosition} `,
                      )
                      .join('')}
                    stroke="#E1E8F7"
                    fill="none"
                    strokeWidth="1"
                  />
                ) : (
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={curTickRaius}
                    fill="none"
                    stroke="#E1E8F7"
                    strokeWidth="1"
                  />
                ))}
              {/* y轴文本 */}
              <text
                x={centerX - 6}
                y={centerY - curTickRaius}
                fill="#4D535C"
                fontSize={labelFontSize}
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
  }, [
    centerX,
    centerY,
    radius,
    yMaxValue,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(yTicks),
    yAxisType,
    labelFontSize,
  ]);

  return (
    <>
      {xCoordinateAxisNode}
      {yCoordinateAxisNode}
    </>
  );
}

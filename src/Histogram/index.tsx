import React, { memo, useMemo, useRef, useCallback, MouseEvent } from 'react';
import useThrottle from 'react-svg-charts/hooks/useThrottle';
import useSquareChartTooltips from 'react-svg-charts/hooks/useSquareChartTooltips';

import { generateConfig, generateData } from './utils';
import { COLORS } from '../constants';
import { whereIsArea } from '../utils';

import type { ConfigTypeProps } from './data';
import type { DataListItem } from '../data';

let idCounter = 0;
const bgPrefix = 'histogram_gridBg_';

interface HistogramChartProps {
  data: DataListItem[];
  config: ConfigTypeProps;
}

function Histogram({ data, config }: HistogramChartProps) {
  const {
    horizontalAxisWidth,
    yMaxValue,
    verticalAxisHeight,
    yInitialPoint,
    yLabelWidth,
    barGap,
    barWidth,
    width,
    height,
    yCount,
    yGap,
    labelFontSize,
    labelLineHeight,
    yLabelPaddingRight,
    xLabelHeight,
  } = generateConfig(config);

  const dataList = useMemo(
    () =>
      generateData(data, {
        horizontalAxisWidth,
        yMaxValue,
        verticalAxisHeight,
        yInitialPoint,
        yLabelWidth,
        barGap,
        barWidth,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(data),
      horizontalAxisWidth,
      yMaxValue,
      verticalAxisHeight,
      yInitialPoint,
      yLabelWidth,
      barGap,
      barWidth,
    ],
  );

  const id = useMemo(() => {
    idCounter += 1;
    return idCounter;
  }, []);

  // 判断鼠标是否在坐标系内
  const isWithinOrNot = (e: MouseEvent) => {
    const rect = e.currentTarget?.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return {
      x,
      y,
      isWithin: x > yLabelWidth && y > yInitialPoint && y < height - xLabelHeight,
    };
  };

  // 提示窗
  const containerRef = useRef<HTMLDivElement>(null);
  const { handleHiddenTooltips, handleShowTooltips } = useSquareChartTooltips({
    data: dataList,
    horizontalAxisWidth,
    offestX: yLabelWidth,
    containerRef,
  });
  const handleWrapMouseMove = (e: MouseEvent) => {
    const { x, y, isWithin } = isWithinOrNot(e);
    // 判断鼠标位置是否在图表内
    if (isWithin) {
      handleShowTooltips.run(x, y);
    } else {
      handleHiddenTooltips();
    }
  };

  // hover显示网格背景色
  const gridRef = useRef<SVGGElement>(null);
  const gridRender = useCallback(
    (x: number, wid: number) => {
      if (gridRef.current) {
        if (gridRef.current.firstChild) {
          gridRef.current.children[0].setAttribute('x', String(x - wid / 2));
        } else {
          gridRef.current.innerHTML = `
          <rect
            x="${x - wid / 2}"
            y="${yInitialPoint}"
            height="${verticalAxisHeight}"
            width="${wid}"
            fill="url(#${bgPrefix}${id})"
          />
        `;
        }
        gridRef.current?.setAttribute('style', 'visibility: visible;');
      }
    },
    [id, verticalAxisHeight, yInitialPoint],
  );
  const handleHiddenAccessory = useCallback(() => {
    gridRef.current?.setAttribute('style', 'visibility: hidden;');
  }, []);

  const handleShowAccessory = useThrottle(
    (x: number) => {
      const index = whereIsArea(x, yLabelWidth, horizontalAxisWidth / data.length);
      const currentItem = dataList[index];
      if (currentItem) {
        // 网格背景色绘制
        gridRender(currentItem.tickPosition, currentItem.gridWidth);
      } else {
        handleHiddenAccessory();
      }
    },
    { wait: 50, trailing: false },
  );
  const handleMouseMove = (e: MouseEvent) => {
    const { x, isWithin } = isWithinOrNot(e);
    if (isWithin) {
      handleShowAccessory.run(x);
    } else {
      handleHiddenAccessory();
    }
  };

  // 坐标系
  const coordinateSystemNode = useMemo(() => {
    const yUnit = yMaxValue / yCount;
    const yLineList = Array.from({ length: yCount + 1 }).map((_, i) => yMaxValue - yUnit * i);

    const xCoordinateAxisRender = (y: number) => (
      /* x坐标轴 */
      <g id="xCoordinateAxis">
        <line x1={yLabelWidth} y1={y} x2={width} y2={y} stroke="#E1E8F7" strokeWidth="1" />
        {dataList.map((item) => (
          <g key={item.tickPosition}>
            <line
              x1={item.tickPosition}
              x2={item.tickPosition}
              y1={y}
              y2={y + 2}
              stroke="#E1E8F7"
              strokeWidth="1"
            />
            <text
              x={item.tickPosition}
              y={height - xLabelHeight / 2}
              dominantBaseline="central"
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
    return (
      <g id="coordinateSystem">
        {yLineList.map((val, index) => {
          const yAxis = index * yGap + labelLineHeight / 2;
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
              {index === yCount ? (
                xCoordinateAxisRender(yAxis)
              ) : (
                <line
                  x1={yLabelWidth}
                  y1={yAxis}
                  x2={width}
                  y2={yAxis}
                  stroke="#E1E8F7"
                  strokeWidth="1"
                  strokeDasharray="4, 4"
                />
              )}
            </g>
          );
        })}
      </g>
    );
  }, [
    dataList,
    height,
    labelFontSize,
    labelLineHeight,
    width,
    xLabelHeight,
    yCount,
    yGap,
    yLabelPaddingRight,
    yLabelWidth,
    yMaxValue,
  ]);

  const barNode = useMemo(() => {
    if (dataList.length <= 0) {
      return null;
    }
    return (
      <g>
        {dataList.map((item) => (
          <g key={item.label}>
            {item.category.map((sub, subIndex) => (
              <rect
                key={`${item.label}_${sub.name}`}
                rx="2"
                x={sub.xPosition}
                y={sub.yPosition}
                height={sub.height}
                width={barWidth}
                fill={COLORS[subIndex]}
              />
            ))}
          </g>
        ))}
      </g>
    );
  }, [dataList, barWidth]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', lineHeight: 0, width, height }}
      onMouseLeave={handleHiddenTooltips}
      onMouseMove={handleWrapMouseMove}
    >
      <svg
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleHiddenAccessory}
      >
        <defs>
          <linearGradient id={`${bgPrefix}${id}`} gradientTransform="rotate(90)">
            <stop offset="0%" style={{ stopColor: 'rgba(238, 242, 255, 0)' }} />
            <stop offset="100%" style={{ stopColor: 'rgb(238, 242, 255)' }} />
          </linearGradient>
        </defs>
        {/* 坐标系 */}
        {coordinateSystemNode}
        <g ref={gridRef} />
        {barNode}
      </svg>
    </div>
  );
}

export default memo(Histogram);

import React, {
  MouseEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import useSquareChartTooltips from 'react-svg-charts/hooks/useSquareChartTooltips';
import useThrottle from 'react-svg-charts/hooks/useThrottle';

import { COLORS } from 'react-svg-charts/constants';
import type { DataListItem } from '../data';
import { whereIsArea } from '../utils';
import type { HistogramConfigType } from './data';
import { generateConfig, generateData } from './utils';

let idCounter = 0;
const RECT_BG_PREFIX = 'rsc-histogram_gridBg_';

export interface HistogramChartProps {
  data: DataListItem[];
  config?: Partial<HistogramConfigType>;
  width: number;
  height: number;
  containerRef: RefObject<HTMLDivElement>;
}

export default function HistogramChart({
  data,
  config = {},
  width,
  height,
  containerRef,
}: HistogramChartProps) {
  const {
    horizontalAxisWidth,
    yMaxValue,
    verticalAxisHeight,
    yLabelWidth,
    barGap,
    barWidth,
    yCount,
    yGap,
    labelFontSize,
    yLabelPaddingRight,
  } = generateConfig(
    {
      ...config,
      width,
      height,
    },
    {
      dataTotal: data.length,
      groupTotal: Array.isArray(data[0]?.value) ? data[0]?.value.length : 1,
    },
  );

  const dataList = useMemo(
    () =>
      generateData(data, {
        horizontalAxisWidth,
        yMaxValue,
        verticalAxisHeight,
        yLabelWidth,
        barGap,
        barWidth,
      }),
    [
      JSON.stringify(data),
      horizontalAxisWidth,
      yMaxValue,
      verticalAxisHeight,
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
      isWithin: x > yLabelWidth && y > 0 && y < verticalAxisHeight,
    };
  };

  // 提示窗
  const { handleHiddenTooltips, handleShowTooltips } = useSquareChartTooltips({
    data: dataList,
    horizontalAxisWidth,
    offestX: yLabelWidth,
    containerRef,
  });

  // hover显示网格背景色
  const gridRef = useRef<SVGGElement>(null);
  const gridRender = useCallback(
    (x: number, wid: number) => {
      if (gridRef.current) {
        if (gridRef.current.firstChild) {
          gridRef.current.children[0].setAttribute('x', String(x - wid / 2));
          gridRef.current.children[0].setAttribute('width', String(wid));
        } else {
          gridRef.current.innerHTML = `
          <rect
            x="${x - wid / 2}"
            y="0"
            height="${verticalAxisHeight}"
            width="${wid}"
            fill="url(#${RECT_BG_PREFIX}${id})"
          />
        `;
        }
        gridRef.current?.setAttribute('style', 'visibility: visible;');
      }
    },
    [id, verticalAxisHeight],
  );
  const handleHiddenAccessory = useCallback(() => {
    gridRef.current?.setAttribute('style', 'visibility: hidden;');
  }, []);

  const handleShowAccessory = useThrottle(
    (x: number) => {
      const index = whereIsArea(
        x,
        yLabelWidth,
        horizontalAxisWidth / data.length,
      );
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
    const { x, y, isWithin } = isWithinOrNot(e);
    if (isWithin) {
      handleShowAccessory.run(x);
      handleShowTooltips.run(x, y);
    } else {
      handleHiddenAccessory();
      handleHiddenTooltips();
    }
  };
  const handleMouseLeave = () => {
    handleHiddenAccessory();
    handleHiddenTooltips();
  };

  // 坐标系
  const coordinateSystemNode = useMemo(() => {
    const yUnit = yMaxValue / yCount;
    const yLineList = Array.from({ length: yCount + 1 }).map(
      (_, i) => yMaxValue - yUnit * i,
    );

    const xCoordinateAxisRender = (y: number) => (
      /* x坐标轴 */
      <g id={`x-coordinate-axis-${id}`}>
        <line
          x1={yLabelWidth}
          y1={y}
          x2={width}
          y2={y}
          stroke="#E1E8F7"
          strokeWidth="1"
        />
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
    return (
      <g id={`coordinateSystem-${id}`}>
        {yLineList.map((val, index) => {
          const yAxis = index * yGap + labelFontSize / 2;
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
    width,
    yCount,
    yGap,
    yLabelPaddingRight,
    yLabelWidth,
    yMaxValue,
  ]);

  // 柱形
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
    <svg
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <linearGradient
          id={`${RECT_BG_PREFIX}${id}`}
          gradientTransform="rotate(90)"
        >
          <stop offset="0%" style={{ stopColor: 'rgba(238, 242, 255, 0)' }} />
          <stop offset="100%" style={{ stopColor: 'rgb(238, 242, 255)' }} />
        </linearGradient>
      </defs>
      {/* 坐标系 */}
      {coordinateSystemNode}
      <g ref={gridRef} />
      {barNode}
    </svg>
  );
}

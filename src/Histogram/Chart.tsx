import React, {
  MouseEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import useSquareChartTooltips from 'react-svg-charts/hooks/useSquareChartTooltips';

import useThrottle from 'react-svg-charts/hooks/useThrottle';
import type { DataListItem } from '../data';
import { whereIsArea } from '../utils';
import type { HistogramConfigType } from './data';
import { generateChartData, generateConfig } from './utils';

let idCounter = 0;
const RECT_BG_PREFIX = 'rsc-histogram_gridBg_';

export interface HistogramChartProps {
  data: DataListItem[];
  config: HistogramConfigType;
  containerRef: RefObject<HTMLDivElement>;
}

export default function HistogramChart({
  data,
  config,
  containerRef,
}: HistogramChartProps) {
  const {
    width,
    height,
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
    colors,
    coordinateLeftTopY,
  } = generateConfig(config, {
    dataTotal: data.length,
    groupTotal: Array.isArray(data[0]?.value) ? data[0]?.value.length : 1,
  });

  const chatData = useMemo(
    () =>
      generateChartData(data, {
        horizontalAxisWidth,
        yMaxValue,
        verticalAxisHeight,
        yLabelWidth,
        barGap,
        barWidth,
        coordinateLeftTopY,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(data),
      horizontalAxisWidth,
      yMaxValue,
      verticalAxisHeight,
      yLabelWidth,
      barGap,
      barWidth,
      coordinateLeftTopY,
    ],
  );

  const id = useMemo(() => {
    idCounter += 1;
    return idCounter;
  }, []);

  // 判断鼠标是否在坐标系内
  const isWithinOrNot = (e: MouseEvent) => {
    const rect = e.currentTarget?.getBoundingClientRect();
    const { clientX, clientY } = e;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return {
      x,
      y,
      isWithin:
        x > yLabelWidth &&
        y > coordinateLeftTopY &&
        y < coordinateLeftTopY + verticalAxisHeight,
      clientX,
      clientY,
    };
  };

  // 提示窗
  const { handleHiddenTooltips, handleShowTooltips } = useSquareChartTooltips({
    data: chatData,
    horizontalAxisWidth,
    offestX: yLabelWidth,
    containerRef,
    colors,
  });

  // hover显示柱形背景色
  const barBgRef = useRef<SVGGElement>(null);
  const barBgRender = useCallback(
    (x: number, wid: number) => {
      if (barBgRef.current) {
        if (barBgRef.current.firstChild) {
          barBgRef.current.children[0].setAttribute('x', String(x - wid / 2));
          barBgRef.current.children[0].setAttribute('width', String(wid));
        } else {
          barBgRef.current.innerHTML = `
          <rect
            x="${x - wid / 2}"
            y="${coordinateLeftTopY}"
            height="${verticalAxisHeight}"
            width="${wid}"
            fill="url(#${RECT_BG_PREFIX}${id})"
          />
        `;
        }
        barBgRef.current?.setAttribute('style', 'visibility: visible;');
      }
    },
    [id, verticalAxisHeight, coordinateLeftTopY],
  );
  const handleHiddenAccessory = useCallback(() => {
    barBgRef.current?.setAttribute('style', 'visibility: hidden;');
  }, []);

  const handleShowAccessory = (x: number) => {
    const index = whereIsArea(
      x,
      yLabelWidth,
      horizontalAxisWidth / data.length,
    );
    const currentItem = chatData[index];
    if (currentItem) {
      // 柱形背景色绘制
      barBgRender(currentItem.tickPosition, currentItem.barBackgroundWidth);
    } else {
      handleHiddenAccessory();
    }
  };

  const handleMouseMove = useThrottle(
    (e: MouseEvent) => {
      const { x, clientX, clientY, isWithin } = isWithinOrNot(e);
      if (isWithin) {
        handleShowAccessory(x);
        handleShowTooltips(x, clientX, clientY);
      } else {
        handleHiddenAccessory();
        handleHiddenTooltips();
      }
    },
    { wait: 50, trailing: false },
  );
  const handleMouseLeave = () => {
    handleHiddenAccessory();
    handleHiddenTooltips();
  };

  // y轴坐标系
  const yCoordinateAxisNode = useMemo(() => {
    // 刻度线单位值
    const yUnit = yMaxValue / yCount;
    // y轴刻度线
    const yLineList = Array.from({ length: yCount + 1 }).map(
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
                strokeDasharray={index !== yCount ? '4, 4' : undefined}
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
    yCount,
    yGap,
    yLabelPaddingRight,
    yLabelWidth,
    yMaxValue,
  ]);

  // 柱形
  const barNode = useMemo(() => {
    if (chatData.length <= 0) {
      return null;
    }
    return (
      <g>
        {chatData.map((item) => (
          <g key={item.label}>
            {item.category.map((sub, subIndex) => (
              <rect
                key={`${item.label}_${sub.name}`}
                rx="2"
                x={sub.xPosition}
                y={sub.yPosition}
                height={sub.height}
                width={barWidth}
                fill={colors[subIndex]}
              />
            ))}
          </g>
        ))}
      </g>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData, barWidth]);

  // x轴坐标系
  const xCoordinateAxisNode = useMemo(() => {
    return (
      <g>
        {chatData.map((item) => (
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
  }, [chatData, coordinateLeftTopY, height, labelFontSize, verticalAxisHeight]);

  return (
    <svg
      width={width}
      height={height}
      onMouseMove={handleMouseMove.run}
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
      {yCoordinateAxisNode}
      {xCoordinateAxisNode}
      <g ref={barBgRef} />
      {barNode}
    </svg>
  );
}

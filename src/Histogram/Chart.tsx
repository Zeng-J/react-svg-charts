import React, {
  MouseEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import useChartTooltips from 'rs-charts/hooks/useChartTooltips';

import useThrottle from 'rs-charts/hooks/useThrottle';
import RectangularCoordinateSystem from 'rs-charts/RectangularCoordinateSystem';
import {
  isWithinOrNotOfRectangular,
  whereIsAreaOfRectangular,
} from 'rs-charts/utils/rect';
import type { DataListItem } from '../data';
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
  config: externalConfig,
  containerRef,
}: HistogramChartProps) {
  const config = generateConfig(externalConfig, {
    dataTotal: data.length,
    groupTotal: Array.isArray(data[0]?.value) ? data[0]?.value.length : 1,
  });

  const {
    width,
    height,
    horizontalAxisWidth,
    yMaxValue,
    verticalAxisHeight,
    yLabelWidth,
    barGap,
    barWidth,
    colors,
    coordinateLeftTopX,
    coordinateLeftTopY,
  } = config;

  const chartData = useMemo(
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

  // 提示窗
  const { handleHiddenTooltips, handleShowTooltips } = useChartTooltips({
    data: chartData,
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

  const handleShowAccessory = (index: number) => {
    const currentItem = chartData[index];
    if (currentItem) {
      // 柱形背景色绘制
      barBgRender(currentItem.tickPosition, currentItem.barBackgroundWidth);
    } else {
      handleHiddenAccessory();
    }
  };

  const handleMouseMove = useThrottle(
    (e: MouseEvent) => {
      const { x, clientX, clientY, isWithin } = isWithinOrNotOfRectangular(e, {
        coordinateLeftTopX,
        coordinateLeftTopY,
        verticalAxisHeight,
      });
      if (isWithin) {
        const index = whereIsAreaOfRectangular(
          x,
          yLabelWidth,
          horizontalAxisWidth / data.length,
        );
        handleShowAccessory(index);
        handleShowTooltips(index, clientX, clientY);
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

  // 柱形
  const barNode = useMemo(() => {
    if (chartData.length <= 0) {
      return null;
    }
    return (
      <g>
        {chartData.map((item) => (
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
  }, [chartData, barWidth]);

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
      <RectangularCoordinateSystem config={config} chartData={chartData} />
      <g ref={barBgRef} />
      {barNode}
    </svg>
  );
}

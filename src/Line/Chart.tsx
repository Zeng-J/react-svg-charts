import React, {
  MouseEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import useThrottle from 'react-svg-charts/hooks/useThrottle';
import RectangularCoordinateSystem from 'react-svg-charts/RectangularCoordinateSystem';
import {
  isWithinOrNotOfRectangular,
  whereIsAreaOfRectangular,
} from 'react-svg-charts/utils/rect';
import type { DataListItem } from '../data';
import useSquareChartTooltips from '../hooks/useSquareChartTooltips';
import type { LineChartDataListItem, LineConfigType } from './data';

import { generateChartData, generateConfig } from './utils';

interface LineChartProps {
  data: DataListItem[];
  config: LineConfigType;
  containerRef: RefObject<HTMLDivElement>;
}

function LineChart({
  data,
  config: externalConfig,
  containerRef,
}: LineChartProps) {
  const config = generateConfig(externalConfig);
  const {
    width,
    height,
    horizontalAxisWidth,
    yMaxValue,
    verticalAxisHeight,
    yLabelWidth,
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
      coordinateLeftTopY,
    ],
  );

  // 提示窗
  const { handleHiddenTooltips, handleShowTooltips } = useSquareChartTooltips({
    data: chartData,
    horizontalAxisWidth,
    offestX: coordinateLeftTopX,
    containerRef,
    colors,
  });

  const crosshairsRef = useRef<SVGGElement>(null);
  const dotRef = useRef<SVGGElement>(null);

  const crosshairsRender = useCallback(
    (x: number) => {
      if (crosshairsRef.current) {
        const d = `M ${x} ${coordinateLeftTopY} L ${x} ${
          coordinateLeftTopY + verticalAxisHeight
        }`;
        if (crosshairsRef.current.firstChild) {
          crosshairsRef.current.children[0].setAttribute('d', d);
        } else {
          crosshairsRef.current.innerHTML = `
          <path
            d="${d}"
            stroke="#DAE2F5"
            fill="none"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        `;
        }
        crosshairsRef.current?.setAttribute('style', 'visibility: visible;');
      }
    },
    [verticalAxisHeight, coordinateLeftTopY],
  );

  const dotRender = useCallback((item: LineChartDataListItem) => {
    if (dotRef.current) {
      if (dotRef.current.children.length > 0) {
        Array.prototype.map.call(dotRef.current.children, (g, index) => {
          g.children[0]?.setAttribute('cx', item.tickPosition);
          g.children[0]?.setAttribute('cy', item.category[index].yPosition);
          g.children[1]?.setAttribute('cx', item.tickPosition);
          g.children[1]?.setAttribute('cy', item.category[index].yPosition);
        });
      } else {
        dotRef.current.innerHTML = item.category
          .map(
            // 第一个circle为点的边框，第二个为圆心
            (c, i) => `
              <g>
                <circle r="6" cx="${item.tickPosition}" cy="${c.yPosition}" fill="#fff" />
                <circle r="4" cx="${item.tickPosition}" cy="${c.yPosition}" fill="${colors[i]}" />
              </g>
             `,
          )
          .join('');
      }
      dotRef.current?.setAttribute('style', 'visibility: visible;');
    }
  }, []);

  const handleHiddenAccessory = useCallback(() => {
    [dotRef.current, crosshairsRef.current].forEach((dom) =>
      dom?.setAttribute('style', 'visibility: hidden;'),
    );
  }, []);

  const handleShowAccessory = (x: number) => {
    const index = whereIsAreaOfRectangular(
      x,
      coordinateLeftTopX,
      horizontalAxisWidth / chartData.length,
    );
    const currentItem = chartData[index];
    if (currentItem) {
      // 辅助线绘制
      crosshairsRender(currentItem.tickPosition);
      // 辅助点绘制
      dotRender(currentItem);
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

  const pathLineNode = useMemo(() => {
    if (chartData.length <= 0) {
      return null;
    }
    const { category } = chartData[0];
    return (
      <g>
        {category.map((c, index: number) => (
          <path
            key={`${index}_${c.name}`}
            d={chartData.map((item) => item.category[index].d).join('')}
            stroke={colors[index]}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>
    );
  }, [chartData]);

  return (
    <svg
      width={width}
      height={height}
      onMouseMove={handleMouseMove.run}
      onMouseLeave={handleMouseLeave}
    >
      {/* 坐标系 */}
      <RectangularCoordinateSystem config={config} chartData={chartData} />
      {/* 辅助线 */}
      <g ref={crosshairsRef} />
      {pathLineNode}
      {/* 辅助点 */}
      <g ref={dotRef} />
    </svg>
  );
}

export default LineChart;

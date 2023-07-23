import React, {
  MouseEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import useChartTooltips from 'react-svg-charts/hooks/useChartTooltips';
import useThrottle from 'react-svg-charts/hooks/useThrottle';
import PolarCoordinateSystem from 'react-svg-charts/PolarCoordinateSystem';
import {
  isWithinOrNotOfPolar,
  whereIsAreaOfPolar,
} from 'react-svg-charts/utils/polar';
import type { DataListItem } from '../data';
import type { RadarChartDataListItem, RadarConfigType } from './data';

import { generateChartData, generateConfig } from './utils';

interface RadarChartProps {
  data: DataListItem[];
  config: RadarConfigType;
  containerRef: RefObject<HTMLDivElement>;
}

function RadarChart({
  data,
  config: externalConfig,
  containerRef,
}: RadarChartProps) {
  const config = generateConfig(externalConfig, { xTickcCount: data.length });
  const {
    width,
    height,
    padding,
    yMaxValue,
    colors,
    centerX,
    centerY,
    radius,
    angleUnit,
  } = config;

  const chartData = useMemo(
    () =>
      generateChartData(data, {
        centerX,
        centerY,
        yMaxValue,
        radius,
        padding,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(data),
      yMaxValue,
    ],
  );

  const crosshairsRef = useRef<SVGGElement>(null);
  const dotRef = useRef<SVGGElement>(null);

  const crosshairsRender = useCallback(
    (x: number, y: number) => {
      if (crosshairsRef.current) {
        const d = `M ${centerX} ${centerY} ${x} ${y}`;
        if (crosshairsRef.current.firstChild) {
          crosshairsRef.current.children[0].setAttribute('d', d);
        } else {
          crosshairsRef.current.innerHTML = `
          <path
            d="${d}"
            stroke="#B0BFE1"
            stroke-width="1"
            stroke-dasharray="4, 4"
          />
        `;
        }
        crosshairsRef.current?.setAttribute('style', 'visibility: visible;');
      }
    },
    [centerX, centerY],
  );

  const dotRender = useCallback((item: RadarChartDataListItem) => {
    if (dotRef.current) {
      if (dotRef.current.children.length > 0) {
        Array.prototype.map.call(dotRef.current.children, (g, index) => {
          const categoryItem = item.category[index];
          g.children[0]?.setAttribute('cx', categoryItem.xPosition);
          g.children[0]?.setAttribute('cy', categoryItem.yPosition);
          g.children[1]?.setAttribute('cx', categoryItem.xPosition);
          g.children[1]?.setAttribute('cy', categoryItem.yPosition);
        });
      } else {
        dotRef.current.innerHTML = item.category
          .map(
            // 第一个circle为点的边框，第二个为圆心
            (sub, i) => `
              <g>
                <circle r="6" cx="${sub.xPosition}" cy="${sub.yPosition}" fill="#fff" />
                <circle r="4" cx="${sub.xPosition}" cy="${sub.yPosition}" fill="${colors[i]}" />
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

  const handleShowAccessory = (index: number, x: number, y: number) => {
    const currentItem = chartData[index];
    if (currentItem) {
      // 辅助线绘制
      crosshairsRender(x, y);
      // 辅助点绘制
      dotRender(currentItem);
    } else {
      handleHiddenAccessory();
    }
  };

  const { handleHiddenTooltips, handleShowTooltips } = useChartTooltips({
    data: chartData,
    containerRef,
    colors,
  });

  const handleMouseMove = useThrottle(
    (e: MouseEvent) => {
      const { x, y, clientX, clientY, isWithin } = isWithinOrNotOfPolar(e, {
        centerX,
        centerY,
        radius,
      });
      if (isWithin) {
        // 判断鼠标位置鼠标位于哪个x轴刻度区域内
        const index = whereIsAreaOfPolar(x, y, centerX, centerY, angleUnit);
        handleShowAccessory(index, x, y);
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

  const polygonNode = useMemo(() => {
    if (chartData.length <= 0) {
      return null;
    }
    const { category } = chartData[0];
    return (
      <g>
        {category.map((item, index: number) => (
          <polygon
            key={item.name}
            points={chartData
              .map(
                (item) =>
                  `${item.category[index].xPosition} ${item.category[index].yPosition} `,
              )
              .join('')}
            stroke={colors[index]}
            fill={colors[index]}
            fillOpacity="0.2"
            strokeWidth="1"
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
      <PolarCoordinateSystem config={config} chartData={chartData} />
      {polygonNode}
      {/* 辅助线 */}
      <g ref={crosshairsRef} />
      {/* 辅助点 */}
      <g ref={dotRef} />
    </svg>
  );
}

export default RadarChart;

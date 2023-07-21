import React, {
  MouseEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import useThrottle from 'react-svg-charts/hooks/useThrottle';
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

function LineChart({ data, config, containerRef }: LineChartProps) {
  const {
    width,
    height,
    horizontalAxisWidth,
    yMaxValue,
    verticalAxisHeight,
    yLabelWidth,
    yCount,
    yGap,
    labelFontSize,
    yLabelPaddingRight,
    colors,
    coordinateLeftTopX,
    coordinateLeftTopY,
  } = generateConfig(config);

  const chatData = useMemo(
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
    data: chatData,
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
      horizontalAxisWidth / chatData.length,
    );
    const currentItem = chatData[index];
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

  // todo 抽离
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

  const pathLineNode = useMemo(() => {
    if (chatData.length <= 0) {
      return null;
    }
    const { category } = chatData[0];
    return (
      <g>
        {category.map((c, index: number) => (
          <path
            key={`${index}_${c.name}`}
            d={chatData.map((item) => item.category[index].d).join('')}
            stroke={colors[index]}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>
    );
  }, [chatData]);

  return (
    <svg
      width={width}
      height={height}
      onMouseMove={handleMouseMove.run}
      onMouseLeave={handleMouseLeave}
    >
      {/* 坐标系 */}
      {yCoordinateAxisNode}
      {xCoordinateAxisNode}
      {/* 辅助线 */}
      <g ref={crosshairsRef} />
      {pathLineNode}
      {/* 辅助点 */}
      <g ref={dotRef} />
    </svg>
  );
}

export default LineChart;

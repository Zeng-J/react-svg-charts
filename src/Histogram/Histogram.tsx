import React, { useEffect, useRef, useState } from 'react';
import { bind } from 'size-sensor';
import { getContainerSize } from '../utils';
import type { HistogramChartProps } from './Chart';
import HistogramChart from './Chart';

export type HistogramProps = Pick<HistogramChartProps, 'data' | 'config'>;

function Histogram({ data, config = {} }: HistogramProps) {
  const { width: externalWidth, height: externalHeight, autoFit } = config;
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ width, height }, setContainerSize] = useState<{
    width?: number;
    height?: number;
  }>(
    autoFit
      ? {
          width: externalWidth,
          height: externalHeight,
        }
      : {
          width: typeof externalWidth === 'number' ? externalWidth : 640,
          height: typeof externalHeight === 'number' ? externalHeight : 480,
        },
  );

  useEffect(() => {
    // 自适应容器框高
    if (autoFit) {
      return bind(containerRef.current, (element) => {
        if (!element) {
          return;
        }
        const size = getContainerSize(element);
        setContainerSize({
          ...size,
          // 如果用户还有设置高度，以用户的为准。宽度自适应即可
          height:
            typeof externalHeight === 'number' ? externalHeight : size.height,
        });
      });
    }
  }, [autoFit, externalHeight]);

  const svgRender = () => {
    if (!width || !height) {
      return false;
    }
    return (
      <HistogramChart
        data={data}
        config={config}
        containerRef={containerRef}
        width={width}
        height={height}
      />
    );
  };

  return (
    <div ref={containerRef} className="rsc-container">
      {svgRender()}
    </div>
  );
}

export default Histogram;

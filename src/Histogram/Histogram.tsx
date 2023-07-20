import React, { useEffect, useRef, useState } from 'react';
import { COLORS } from 'react-svg-charts/constants';
import { bind } from 'size-sensor';
import type { DataListItem } from '../data';
import { getContainerSize } from '../utils';
import HistogramChart from './Chart';
import type { HistogramConfigType } from './data';

export type HistogramProps = {
  data: DataListItem[];
  config?: Partial<HistogramConfigType>;
};

const DEFAULT_CONFIG = {
  labelFontSize: 12,
  yLabelWidth: 36,
  yLabelPaddingRight: 8,
  xLabelPaddingTop: 8,
  yMaxValue: 100,
  yCount: 5,
  barGap: 4,
  autoFit: true,
  colors: COLORS,
};

function Histogram({ data, config = {} }: HistogramProps) {
  const { width: externalWidth, height: externalHeight, autoFit } = config;
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ width, height }, setContainerSize] = useState<{
    width: number;
    height: number;
  }>(
    autoFit
      ? {
          width: externalWidth ?? 0,
          height: externalHeight ?? 0,
        }
      : {
          width: externalWidth ?? 640,
          height: externalHeight ?? 480,
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
        config={{
          ...DEFAULT_CONFIG,
          ...config,
          width,
          height,
        }}
        containerRef={containerRef}
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

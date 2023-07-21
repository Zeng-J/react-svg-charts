import React from 'react';
import AutoFitContainer from 'react-svg-charts/AutoFitContainer';
import { DEFAULT_CONFIG_OF_RECT } from 'react-svg-charts/constants';
import type { DataListItem } from '../data';
import HistogramChart from './Chart';
import type { HistogramConfigType } from './data';

export type HistogramProps = {
  data: DataListItem[];
  config?: Partial<HistogramConfigType>;
};

function Histogram({ data, config = {} }: HistogramProps) {
  return (
    <AutoFitContainer config={config}>
      {({ width, height }, containerRef) => (
        <HistogramChart
          data={data}
          config={{
            ...DEFAULT_CONFIG_OF_RECT,
            ...config,
            width,
            height,
          }}
          containerRef={containerRef}
        />
      )}
    </AutoFitContainer>
  );
}

export default Histogram;

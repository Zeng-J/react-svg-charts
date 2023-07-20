import React from 'react';
import AutoFitContainer from 'react-svg-charts/AutoFitContainer';
import { COLORS } from 'react-svg-charts/constants';
import type { DataListItem } from '../data';
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
  return (
    <AutoFitContainer config={config}>
      {({ width, height }, containerRef) => (
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
      )}
    </AutoFitContainer>
  );
}

export default Histogram;

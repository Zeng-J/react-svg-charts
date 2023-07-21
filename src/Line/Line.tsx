import React from 'react';
import AutoFitContainer from 'react-svg-charts/AutoFitContainer';
import { COLORS } from 'react-svg-charts/constants';
import type { DataListItem } from '../data';
import LineChart from './Chart';
import type { LineConfigType } from './data';

export type LineProps = {
  data: DataListItem[];
  config?: Partial<LineConfigType>;
};

// todo 抽离
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

function Line({ data, config = {} }: LineProps) {
  return (
    <AutoFitContainer config={config}>
      {({ width, height }, containerRef) => (
        <LineChart
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

export default Line;

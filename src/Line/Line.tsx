import React from 'react';
import AutoFitContainer from 'rs-charts/AutoFitContainer';
import { DEFAULT_CONFIG_OF_RECT } from 'rs-charts/constants';
import type { DataListItem } from '../data';
import LineChart from './Chart';
import type { LineConfigType } from './data';

export type LineProps = {
  data: DataListItem[];
  config?: Partial<LineConfigType>;
};

function Line({ data, config = {} }: LineProps) {
  return (
    <AutoFitContainer config={config}>
      {({ width, height }, containerRef) => (
        <LineChart
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

export default Line;

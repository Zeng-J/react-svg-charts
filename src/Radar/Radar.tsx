import React from 'react';
import AutoFitContainer from 'rs-charts/AutoFitContainer';
import { DEFAULT_CONFIG_OF_POLAR } from 'rs-charts/constants';
import type { DataListItem } from '../data';
import RadarChart from './Chart';
import type { RadarConfigType } from './data';

export type RadarProps = {
  data: DataListItem[];
  config?: Partial<RadarConfigType>;
};

function Radar({ data, config = {} }: RadarProps) {
  return (
    <AutoFitContainer config={config}>
      {({ width, height }, containerRef) => (
        <RadarChart
          data={data}
          config={{
            ...DEFAULT_CONFIG_OF_POLAR,
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

export default Radar;

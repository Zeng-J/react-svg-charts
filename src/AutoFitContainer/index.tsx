import React, { RefObject, useEffect, useRef, useState } from 'react';
import { bind } from 'size-sensor';
import { getContainerSize } from '../utils';

export type RenderChildren = (
  config: {
    width: number;
    height: number;
  },
  containerRef: RefObject<HTMLDivElement>,
) => React.ReactNode;

export type AutoFitContainerProps = {
  config?: {
    width?: number;
    height?: number;
    autoFit?: boolean;
  } & Record<string, any>;
  children: RenderChildren;
};

function AutoFitContainer(props: AutoFitContainerProps) {
  const { config = {}, children } = props;
  const {
    width: externalWidth,
    height: externalHeight,
    autoFit = true,
  } = config;
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
    return children?.({ width, height }, containerRef);
  };

  return (
    <div ref={containerRef} className="rsc-container">
      {svgRender()}
    </div>
  );
}

export default AutoFitContainer;
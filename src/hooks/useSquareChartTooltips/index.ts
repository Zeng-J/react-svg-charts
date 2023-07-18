import { RefObject, useCallback, useRef } from 'react';
import { COLORS } from 'react-svg-charts/constants';
import useThrottle from 'react-svg-charts/hooks/useThrottle';
import { whereIsArea } from 'react-svg-charts/utils';

import type { CommonChartDataListItem } from 'react-svg-charts/data';

interface UseSquareChartTooltipsProps<T> {
  containerRef: RefObject<HTMLElement>;
  offestX: number;
  horizontalAxisWidth: number;
  data: T[];
}

const TOOLTIPS_CLASS_PREFIX = 'rsc-tooltips';

// 方形图表的提示弹窗hooks
export default function useSquareChartTooltips<
  T extends CommonChartDataListItem = CommonChartDataListItem,
>({
  data,
  containerRef,
  offestX,
  horizontalAxisWidth,
}: UseSquareChartTooltipsProps<T>) {
  const tooltipsRef = useRef<HTMLDivElement>();
  const handleHiddenTooltips = useCallback(() => {
    if (tooltipsRef.current) {
      tooltipsRef.current.style.visibility = 'hidden';
    }
  }, []);

  // 50ms的节流，可以让浮窗移动更丝滑
  const handleShowTooltips = useThrottle(
    (x: number, y: number) => {
      if (!containerRef.current) {
        return;
      }

      // 判断鼠标位置是否在图表内
      const index = whereIsArea(x, offestX, horizontalAxisWidth / data.length);

      // 挂载提示窗
      if (!tooltipsRef.current) {
        tooltipsRef.current = document.createElement('div');
        tooltipsRef.current.setAttribute('class', TOOLTIPS_CLASS_PREFIX);
        containerRef.current.appendChild(tooltipsRef.current);
      }

      // 显示tooltips
      const currentItem = data[index];
      if (currentItem) {
        const { dataset } = tooltipsRef.current;
        if (dataset.lastIndex !== String(index)) {
          dataset.lastIndex = String(index);

          tooltipsRef.current.innerHTML = `
                <div class="${TOOLTIPS_CLASS_PREFIX}-title">${
            currentItem.label
          }</div>
                  <ul class="${TOOLTIPS_CLASS_PREFIX}-list">
                    ${currentItem.category
                      .map(
                        (c, i) => `
                      <li class="${TOOLTIPS_CLASS_PREFIX}-list-item" style="color: ${COLORS[i]};">
                        <span class="${TOOLTIPS_CLASS_PREFIX}-label">${c.name}：</span>
                        <span class="${TOOLTIPS_CLASS_PREFIX}-val">${c.value}</span>
                      </li>
                    `,
                      )
                      .join('')}
                  </ul>
                `;
        }

        const { scrollWidth } = containerRef.current;
        const { offsetHeight: tooltipsHeight, offsetWidth: tooltipsWidth } =
          tooltipsRef.current;

        // 浮窗定位（浮窗位置限制不会超出容器范围）
        tooltipsRef.current.setAttribute(
          'style',
          `top: ${Math.max(0, y - tooltipsHeight - 20)}px; left: ${Math.min(
            scrollWidth - tooltipsWidth,
            Math.max(0, x - tooltipsWidth / 2),
          )}px; visibility: visible;`,
        );
      } else {
        handleHiddenTooltips();
      }
    },
    { wait: 50, trailing: false },
  );

  return {
    handleShowTooltips,
    handleHiddenTooltips,
  };
}

import { RefObject, useCallback, useRef } from 'react';

import type { CommonChartDataListItem } from 'rs-charts/data';

interface UseChartTooltipsProps<T> {
  containerRef: RefObject<HTMLElement>;
  data: T[];
  colors: string[];
}

const TOOLTIPS_CLASS_PREFIX = 'rsc-tooltips';

// 图表的提示弹窗hooks
export default function useChartTooltips<
  T extends CommonChartDataListItem = CommonChartDataListItem,
>({ data, containerRef, colors }: UseChartTooltipsProps<T>) {
  const tooltipsRef = useRef<HTMLDivElement>();
  const handleHiddenTooltips = useCallback(() => {
    if (tooltipsRef.current) {
      tooltipsRef.current.style.visibility = 'hidden';
    }
  }, []);

  const handleShowTooltips = (
    index: number,
    clientX: number,
    clientY: number,
  ) => {
    if (!containerRef.current) {
      return;
    }

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
        <div class="${TOOLTIPS_CLASS_PREFIX}-title">${currentItem.label}</div>
        <ul class="${TOOLTIPS_CLASS_PREFIX}-list">
          ${currentItem.category
            .map(
              (c, i) => `
              <li class="${TOOLTIPS_CLASS_PREFIX}-list-item" style="color: ${colors[i]};">
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
      const { left: containerLeft, top: containerTop } =
        containerRef.current.getBoundingClientRect();
      const { offsetHeight: tooltipsHeight, offsetWidth: tooltipsWidth } =
        tooltipsRef.current;
      // 浮窗定位（浮窗位置限制不会超出容器范围）
      tooltipsRef.current.setAttribute(
        'style',
        `top: ${Math.max(
          0,
          clientY - containerTop - tooltipsHeight - 20,
        )}px; left: ${Math.min(
          scrollWidth - tooltipsWidth,
          Math.max(0, clientX - containerLeft - tooltipsWidth / 2),
        )}px; visibility: visible;`,
      );
    } else {
      handleHiddenTooltips();
    }
  };

  return {
    handleShowTooltips,
    handleHiddenTooltips,
  };
}

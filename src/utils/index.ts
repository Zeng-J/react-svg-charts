type Size = {
  width: number;
  height: number;
};

const parseInt10 = (d: string) => (d ? parseInt(d) : 0);

export function getContainerSize(container: HTMLElement): Size {
  const style = getComputedStyle(container);

  const wrapperWidth = container.clientWidth || parseInt10(style.width);
  const wrapperHeight = container.clientHeight || parseInt10(style.height);

  const widthPadding =
    parseInt10(style.paddingLeft) + parseInt10(style.paddingRight);
  const heightPadding =
    parseInt10(style.paddingTop) + parseInt10(style.paddingBottom);

  return {
    width: wrapperWidth - widthPadding,
    height: wrapperHeight - heightPadding,
  };
}

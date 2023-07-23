import { MouseEvent } from 'react';

/** 根据极坐标的坐标计算在svg中的坐标 */
export const calcSvgCoordinateByPolar = (
  radius: number,
  angle: number,
  centerX: number,
  centerY: number,
) => ({
  xPosition: centerX + radius * Math.sin(angle),
  yPosition: centerY - radius * Math.cos(angle),
  angle,
});

/** 根据传入的yArr，生成一个极坐标系的坐标点对应的svg中坐标 */
export const generatePolarCoordinate = (
  yArr: number[],
  centerX: number,
  centerY: number,
) => {
  // x坐标轴总共的刻度数
  const count = yArr.length;
  // 平分角度
  const angleUnit = (Math.PI * 2) / count;
  return yArr.map((y, i) =>
    calcSvgCoordinateByPolar(y, angleUnit * i, centerX, centerY),
  );
};

// 判断鼠标是否在极坐标系内（排除内边距）
export const isWithinOrNotOfPolar = (
  e: MouseEvent,
  {
    centerX,
    centerY,
    radius,
  }: {
    centerX: number;
    centerY: number;
    radius: number;
  },
) => {
  const rect = e.currentTarget?.getBoundingClientRect();
  const { clientX, clientY } = e;
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  // 根据两个坐标点的距离，判断鼠标移动是否在图表范围内
  const curRadius = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

  return {
    x,
    y,
    clientX,
    clientY,
    isWithin: curRadius <= radius,
  };
};

export const calcAngleByCoordinate = (x: number, y: number): number => {
  // 原Math.atan2用法为Math.atan2(y, x)。表示原点到坐标点的线段与 x 轴正方向之间的平面角度，逆时针。
  // 我们的需求是要以 y 轴正方向作为起始，顺时针。所以把x当y轴，y当x轴进行反转，即Math.atan2(x, y)。
  let angle = Math.atan2(x, y);
  if (angle < 0) {
    angle += Math.PI * 2;
  }
  return angle;
};

// 判断当前鼠标位置位于哪个刻度区域内
export const whereIsAreaOfPolar = (
  svgX: number,
  svgY: number,
  centerX: number,
  centerY: number,
  angleUnit: number,
): number => {
  // 假设我们现在以圆心作为原点，模拟一个直角坐标系，求出鼠标位置的坐标点
  const x = svgX - centerX;
  const y = centerY - svgY;
  // 求出鼠标位置与 y 正向轴的角度（顺时针）
  const initAngle = calcAngleByCoordinate(x, y);
  // 再将角度逆时针旋转 angleUnit / 2，因为第一个刻度的区域为[-angleUnit / 2, angleUnit / 2]
  const angle = (initAngle + angleUnit / 2) % (Math.PI * 2);
  let findIndex = 0;
  while (true) {
    if (
      angle >= findIndex * angleUnit &&
      angle <= (findIndex + 1) * angleUnit
    ) {
      break;
    }
    // 这个一般不会发生，防止一下，避免卡死
    if (findIndex * angleUnit > Math.PI * 2) {
      break;
    }
    findIndex += 1;
  }
  return findIndex;
};

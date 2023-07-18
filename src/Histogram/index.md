# 直方图-Histogram

## 代码演示

### 基础用法

```jsx
import { Histogram } from 'react-svg-charts';

export default () => (
  <Histogram
    data={[
      { label: '2021', value: { name: '参与人数', value: 10 } },
      { label: '2022', value: { name: '参与人数', value: 20 } },
    ]}
    config={{
      width: 400,
      height: 400,
    }}
  />
);
```

### 多组直方图

```jsx
import { Histogram } from 'react-svg-charts';

export default () => {
  return (
    <>
      <Histogram
        data={[
          {
            label: '2021',
            value: [
              { name: '参与人数', value: 10 },
              { name: '未参与人数', value: 10 },
            ],
          },
          {
            label: '2022',
            value: [
              { name: '参与人数', value: 24 },
              { name: '未参与人数', value: 24 },
            ],
          },
          {
            label: '2023',
            value: [
              { name: '参与人数', value: 16 },
              { name: '未参与人数', value: 16 },
            ],
          },
          {
            label: '2024',
            value: [
              { name: '参与人数', value: 32 },
              { name: '未参与人数', value: 32 },
            ],
          },
          {
            label: '2025',
            value: [
              { name: '参与人数', value: 18 },
              { name: '未参与人数', value: 18 },
            ],
          },
          {
            label: '2026',
            value: [
              { name: '参与人数', value: 29 },
              { name: '未参与人数', value: 29 },
            ],
          },
          {
            label: '2027',
            value: [
              { name: '参与人数', value: 22 },
              { name: '未参与人数', value: 22 },
            ],
          },
          {
            label: '2028',
            value: [
              { name: '参与人数', value: 11 },
              { name: '未参与人数', value: 11 },
            ],
          },
          {
            label: '2029',
            value: [
              { name: '参与人数', value: 20 },
              { name: '未参与人数', value: 20 },
            ],
          },
          {
            label: '2030',
            value: [
              { name: '参与人数', value: 28 },
              { name: '未参与人数', value: 28 },
            ],
          },
          {
            label: '2031',
            value: [
              { name: '参与人数', value: 15 },
              { name: '未参与人数', value: 15 },
            ],
          },
          {
            label: '2032',
            value: [
              { name: '参与人数', value: 19 },
              { name: '未参与人数', value: 19 },
            ],
          },
          {
            label: '2033',
            value: [
              { name: '参与人数', value: 31 },
              { name: '未参与人数', value: 31 },
            ],
          },
          {
            label: '2034',
            value: [
              { name: '参与人数', value: 25 },
              { name: '未参与人数', value: 25 },
            ],
          },
          {
            label: '2035',
            value: [
              { name: '参与人数', value: 27 },
              { name: '未参与人数', value: 27 },
            ],
          },
          {
            label: '2036',
            value: [
              { name: '参与人数', value: 12 },
              { name: '未参与人数', value: 12 },
            ],
          },
          {
            label: '2037',
            value: [
              { name: '参与人数', value: 21 },
              { name: '未参与人数', value: 21 },
            ],
          },
          {
            label: '2038',
            value: [
              { name: '参与人数', value: 30 },
              { name: '未参与人数', value: 30 },
            ],
          },
          {
            label: '2039',
            value: [
              { name: '参与人数', value: 17 },
              { name: '未参与人数', value: 17 },
            ],
          },
        ]}
        config={{
          autoFit: true,
          height: 300,
        }}
      />
    </>
  );
};
```

## API

### Histogram

| 参数   | 说明   | 类型            | 默认值 |
| ------ | ------ | --------------- | ------ |
| data   | 数据   | DataListItem[]  | []     |
| config | 配置项 | HistogramConfig | {}     |

### DataListItem

| 参数  | 说明                                     | 类型                     | 默认值 |
| ----- | ---------------------------------------- | ------------------------ | ------ |
| label | 标签                                     | string                   |        |
| value | y 轴数据，如果是多组。请传入 ValueType[] | ValueType \| ValueType[] |        |

### ValueType

| 参数  | 说明     | 类型             | 默认值 |
| ----- | -------- | ---------------- | ------ |
| name  | 名称     | string \| number |        |
| value | y 坐标值 | number           |        |

### HistogramConfig

| 参数               | 说明                                           | 类型    | 默认值 |
| ------------------ | ---------------------------------------------- | ------- | ------ |
| autoFit            | 是否自动适应容器大小                           | boolean | false  |
| height             | 高度                                           | number  | 640    |
| width              | 宽度                                           | number  | 480    |
| labelFontSize      | 标签字体大小                                   | number  | 12     |
| yLabelWidth        | y 轴 label 宽度                                | number  | 36     |
| yLabelPaddingRight | y 轴 label 的右边距                            | number  | 8      |
| xLabelPaddingTop   | x 轴 label 的上边距                            | number  | 8      |
| yMaxValue          | y 轴最大值                                     | number  | 100    |
| yCount             | y 轴显示多少条刻度线                           | number  | 5      |
| barWidth           | y 柱形条宽度，一般不需要手动传入，会自动计算   | number  |        |
| barGap             | y 同一组的柱形条间距（多组柱形图才会用到这个） | number  | 4      |

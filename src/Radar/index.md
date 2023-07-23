# 雷达图

## 代码演示

### 基础用法

```jsx
import { Radar } from 'react-svg-charts';

export default () => (
  <Radar
    data={[
      { label: '数据结构', value: { name: '正确率', value: 40 } },
      { label: '算法', value: { name: '正确率', value: 20 } },
      { label: '计算机基础', value: { name: '正确率', value: 90 } },
      { label: 'C++程序设计', value: { name: '正确率', value: 26 } },
    ]}
    config={{
      autoFit: false,
      width: 480,
      height: 320,
    }}
  />
);
```

### 多组雷达图

```jsx
import { Radar } from 'react-svg-charts';

export default () => {
  return (
    <div style={{ height: 300 }}>
      <Radar
        data={[
          {
            label: '数据结构',
            value: [
              { name: '我的正确率', value: 70 },
              { name: '平均正确率', value: 43 },
            ],
          },
          {
            label: '算法',
            value: [
              { name: '我的正确率', value: 67 },
              { name: '平均正确率', value: 43 },
            ],
          },
          {
            label: '计算机基础',
            value: [
              { name: '我的正确率', value: 95 },
              { name: '平均正确率', value: 55 },
            ],
          },
          {
            label: 'C++程序设计',
            value: [
              { name: '我的正确率', value: 94 },
              { name: '平均正确率', value: 85 },
            ],
          },
          {
            label: '数学',
            value: [
              { name: '我的正确率', value: 38 },
              { name: '平均正确率', value: 26 },
            ],
          },
        ]}
        config={{
          autoFit: true,
        }}
      />
    </div>
  );
};
```

## API

### Radar

| 参数   | 说明   | 类型            | 默认值 |
| ------ | ------ | --------------- | ------ |
| data   | 数据   | DataListItem[]  | []     |
| config | 配置项 | RadarConfigType | {}     |

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

### RadarConfigType

| 参数               | 说明                                                     | 类型     | 默认值         |
| ------------------ | -------------------------------------------------------- | -------- | -------------- |
| autoFit            | 是否自动适应容器大小（为 ture 时，width 和 height 失效） | boolean  | true           |
| height             | 高度                                                     | number   | 640            |
| width              | 宽度                                                     | number   | 480            |
| labelFontSize      | 标签字体大小                                             | number   | 12             |
| yLabelWidth        | y 轴 label 宽度                                          | number   | 36             |
| yLabelPaddingRight | y 轴 label 的右边距                                      | number   | 8              |
| xLabelPaddingTop   | x 轴 label 的上边距                                      | number   | 8              |
| yMaxValue          | y 轴最大值                                               | number   | 100            |
| yTickCount         | y 轴显示多少条刻度线                                     | number   | 5              |
| colors             | 柱形颜色                                                 | string[] | [#a6cee3, ...] |

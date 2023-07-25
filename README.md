# rs-charts

基于 react 的 svg 图表组件库

## 图表

![demo](https://zeng-j.github.io/react-svg-charts/demo.png)

## 快速上手

### 安装

```bash
yarn add rs-charts
```

### 第一个例子

```jsx
import { Histogram } from 'rs-charts';

export default () => (
  <Histogram
    data={[
      { label: '2021', value: { name: '参与人数', value: 40 } },
      { label: '2022', value: { name: '参与人数', value: 20 } },
    ]}
    config={{
      autoFit: false,
      width: 400,
      height: 400,
    }}
  />
);
```

## LICENSE

MIT

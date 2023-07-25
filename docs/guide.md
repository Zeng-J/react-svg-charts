---
title: 开始
nav:
  title: 开始
  order: -1
---

## 介绍

该图表组件库基于 react，使用 svg 技术实现，可以开箱即用。

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

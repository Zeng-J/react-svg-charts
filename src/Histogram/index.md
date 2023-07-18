# 直方图-Histogram

## 基础用法

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

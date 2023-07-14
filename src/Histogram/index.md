# 直方图-Histogram

This is an example component.

```jsx
import { Histogram } from 'react-svg-charts';

export default () => (
  <Histogram
    data={[
      { label: '2021', value: { name: '参与人数', value: 10 } },
      { label: '2022', value: { name: '参与人数', value: 24 } },
    ]}
    config={{
      width: 800,
      height: 400,
    }}
  />
)
```

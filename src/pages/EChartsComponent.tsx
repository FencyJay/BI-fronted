import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const EChartsComponent: React.FC = () => {
  //useRef<HTMLDivElement>表示 chartRef 将引用一个 HTML 的 div 元素，有助于自动补全
  //(null)：这是 useRef 的初始值，表示在组件初始挂载时，chartRef.current 的值为 null
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current!);

    // 模拟数据
    const categories = ['A', 'B', 'C', 'D', 'E'];
    const data = [120, 200, 150, 80, 70];

    const option = {
      title: {
        text: '模拟数据 ECharts 示例',
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: categories,
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        name: '销量',
        type: 'bar',
        data: data,
      }],
    };

    chartInstance.setOption(option);

    // 窗口 resize 时重新绘制
    window.addEventListener('resize', () => chartInstance.resize());

    return () => {
      chartInstance.dispose();
      window.removeEventListener('resize', () => chartInstance.resize());
    };
  }, []);

  //ref 属性用于获取对 DOM 元素或组件实例的直接引用，这行代码将 chartRef 传递给 div 元素的 ref 属性，chartRef 指向该 div 元素
  return <div ref={chartRef} style={{ width: '100%', height: '700px' }} />;
};

export default EChartsComponent;

import React, {useEffect, useState} from 'react';
import {listMyChartByPageUsingPost} from "@/services/lun/chartController";
import {Avatar, Card, List, message, Result} from "antd";
import ReactECharts from "echarts-for-react";
import {useModel} from "@@/exports";
import Search from "antd/es/input/Search";


/**
 * 我的图表
 * @constructor
 */

const MyChart: React.FC = () => {
  const initialStateParams = {
    current:1,
    pageSize: 6,
    sortField: 'updateTime',
    sortOrder: 'descend',

  };
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({
    ...initialStateParams,
  });
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>();
  const [current, setCurrent] = useState<number>();
  const [loading, setLoading] = useState(true)
  const { initialState } = useModel('@@initialState');
  const{currentUser} = initialState;

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      console.log(res);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        setCurrent(res.data.current ?? 1);
        //隐藏图表标题
        if(res.data.records ){
          res.data.records.forEach(data=>{
            if(data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart);
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          })
        }
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败' + e.message);
    }
    setLoading(false)
  };

  useEffect(() => {
    loadData();

    // 每5秒刷新一次数据
    const intervalId = setInterval(() => {
      loadData();
    }, 5000);

    // 清理定时器
    return () => clearInterval(intervalId);
  }, [searchParams]);

  return (
    <div className="my-chart-page">
      <Search
        placeholder="输入您的图表名称"
        onSearch={(value) => {
          setSearchParams({ ...initialStateParams, name: value });
        }}
        enterButton
        loading={loading}
      />
      <div className={'margin-16'}></div>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        loading={loading}
        pagination={{
          current: current,
          total: total,
          pageSize: searchParams.pageSize,
          onChange: (page) => {
            setSearchParams({ ...searchParams, current: page });
          },
        }}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.title}>
            <Card sytle={{ width: '100%' }}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型:' + item.chartType : undefined}
              />

              <>
                {
                  item.status === 'succeed' && <>
                    <div className="margin-16"></div>
                    {'分析目标：' + item.goal}
                    <div className="margin-16"></div>
                    <ReactECharts option={item.genChart ? JSON.parse(item.genChart) : '{}'}/>
                  </>
                }
                {
                  item.status === 'wait' &&
                  <Result
                    status="warning"
                    title="待生成"
                    subTitle={item.executeMessage ?? '当前图表生成队列繁忙，请耐心等待'}
                  />
                }

                {
                  item.status === 'running' &&
                  <Result
                    status="info"
                    title="图表生成中"
                    subTitle={item.executeMessage}
                  />
                }
                {
                  item.status === 'failed' &&
                  <Result
                    status="error"
                    title="图表生成失败"
                    subTitle={item.executeMessage}
                  />
                }
              </>

            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChart;

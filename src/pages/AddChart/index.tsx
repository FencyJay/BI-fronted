import React, { useState } from 'react';
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from 'antd';
import {UploadOutlined} from "@ant-design/icons";
import ReactECharts from 'echarts-for-react';
import {genChartByAiUsingPost} from "@/services/lun/chartController";




const AddChart: React.FC = () => {
  const { TextArea } = Input;
  const [chart, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {

    if (submitting){
      return;
    }
    setSubmitting(true)
    setChart(undefined)
    setOption(undefined)
    const params = {
      ...values,
      file : undefined
    }
    try {
      const res = await genChartByAiUsingPost(params,{},values.file.file.originFileObj);
      if(!res.data){
        message.error("分析失败");
      }else{
        message.success("分析成功");
        const chartOptions = JSON.parse(res.data.genChart ?? "")
        if (chartOptions) {
          setOption(chartOptions)
          setChart(res.data)
        }
      }
    }catch (e:any){
      message.error("分析失败" + e.message);
    }
    setSubmitting(false)
  };


  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
        <Card title="智能分析" >
            <Form
              name="validate_other"
              onFinish={onFinish}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              labelAlign={"left"}
            >
              <Form.Item name="goal" label="分析目标" rules={[{required: true, message: '请输入分析目标！'}]}>
                <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况"></TextArea>
              </Form.Item>

              <Form.Item name="name" label="图表名称">
                <Input placeholder="请输入图表名称"></Input>
              </Form.Item>

              <Form.Item
                name="chartType"
                label="图表类型"
              >
                <Select placeholder="选择图表类型" options={[
                  {value: '折线图', label: '折线图'},
                  {value: '柱状图', label: '柱状图'},
                  {value: '堆叠图', label: '堆叠图'},
                  {value: '饼图', label: '饼图'},
                  {value: '雷达图', label: '雷达图'},
                ]}/>
              </Form.Item>

              <Form.Item
                name="file"
                label="原始数据"
              >
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined/>}>上传 Excel 文件</Button>
                </Upload>
              </Form.Item>


              <Form.Item wrapperCol={{span: 12, offset: 4}}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
        </Card>
        </Col>
        <Col span={12}>
        <Card title="分析结论">
            <div>
              <Spin spinning={submitting}></Spin>
              {
                submitting ? " " : (chart?.genResult ?? "请在左侧进行提交")
              }
            </div>
        </Card>
          <Divider/>
          <Card title="可视化图表">
            <div>
              <Spin spinning={submitting}></Spin>
              {
                option ? <ReactECharts option={option} /> : submitting ? "" : "请先提交分析"
              }
            </div>
        </Card>
        </Col>
      </Row>

    </div>
  );
};
export default AddChart;

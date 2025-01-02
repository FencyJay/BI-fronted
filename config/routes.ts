export default [
  { path: '/user', name:"用户",layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  { path: '/add_chart',name:"智能分析", icon: 'BarChartOutlined', component: './AddChart' },
  { path: '/add_chart_async',name:"智能分析(异步)", icon: 'BarChartOutlined', component: './AddChartAsync' },
  { path: '/my_chart',name:"我的图表", icon: 'PieChart', component: './MyChart' },
  {
    path: '/admin',
    name:"管理页面",
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin',redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name:"管理页面2",component: './Admin' },
    ],
  },
  { path: '/', redirect: '/add_chart' },
  { path: '*', layout: false, component: './404' },
];

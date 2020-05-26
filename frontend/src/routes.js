import Dashboard from './Dashboard.js';

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'pe-7s-graph',
    component: Dashboard,
    layout: '/admin',
  },
];

export default dashboardRoutes;
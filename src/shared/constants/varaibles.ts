import {
  BarChartOutlined,
  ScheduleOutlined,
  SettingFilled,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { navigationUrls } from '@/shared/constants/navigationUrls';

export const navItems = [
  {
    title: 'Dashboard',
    icon: BarChartOutlined,
    path: navigationUrls.dashboard,
  },
  { title: 'Schedule', icon: ScheduleOutlined, path: navigationUrls.schedule },
  { title: 'Students', icon: UserOutlined, path: navigationUrls.students },
  { title: 'Groups', icon: TeamOutlined, path: navigationUrls.groups },
  { title: 'Settings', icon: SettingFilled, path: navigationUrls.settings },
];

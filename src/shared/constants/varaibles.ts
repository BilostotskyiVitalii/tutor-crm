import {
  BarChartOutlined,
  HomeOutlined,
  ScheduleOutlined,
  SettingFilled,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { navigationUrls } from '@/shared/constants/navigationUrls';

export const langLevels = [
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1' },
  { value: 'C2', label: 'C2' },
];

export const navItems = [
  { title: 'Dashboard', icon: HomeOutlined, path: navigationUrls.dashboard },
  { title: 'Schedule', icon: ScheduleOutlined, path: navigationUrls.schedule },
  { title: 'Students', icon: UserOutlined, path: navigationUrls.students },
  { title: 'Groups', icon: TeamOutlined, path: navigationUrls.groups },
  {
    title: 'Analytics',
    icon: BarChartOutlined,
    path: navigationUrls.analytics,
  },
  { title: 'Settings', icon: SettingFilled, path: navigationUrls.settings },
];

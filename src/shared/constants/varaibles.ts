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
    titleKey: 'nav.dashboard',
    icon: BarChartOutlined,
    path: navigationUrls.dashboard,
  },
  {
    titleKey: 'nav.schedule',
    icon: ScheduleOutlined,
    path: navigationUrls.schedule,
  },
  {
    titleKey: 'nav.students',
    icon: UserOutlined,
    path: navigationUrls.students,
  },
  {
    titleKey: 'nav.groups',
    icon: TeamOutlined,
    path: navigationUrls.groups,
  },
  {
    titleKey: 'nav.settings',
    icon: SettingFilled,
    path: navigationUrls.settings,
  },
];

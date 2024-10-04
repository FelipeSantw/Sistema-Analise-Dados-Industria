import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [  
  {
    title: true,
    name: 'Home'
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Sobre Nós',
    url: '/aboutus',
    iconComponent: { name: 'cil-star' }
  }
];

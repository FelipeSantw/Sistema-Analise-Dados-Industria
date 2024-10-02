import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Pages'
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
      }
  },
  {
    name: 'Perfil de usuário',
    url: '/perfilUsuario',
    icon: 'nav-icon-bullet'
  },
];

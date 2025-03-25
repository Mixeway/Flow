import {INavData} from "@coreui/angular";

export function getNavItems(): INavData[] {
  const userRole = localStorage.getItem('userRole');

  const allNavItems: INavData[] = [
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
      name: 'Threat Intelligence',
      url: '/threat-intel',
      iconComponent: { name: 'cil-eyedropper' },
      badge: {
        color: 'primary',
        text: 'BETA'
      }
    },
    {
      name: 'Statistics',
      url: '/stats',
      iconComponent: { name: 'cil-bar-chart' },
      badge: {
        color: 'success',
        text: 'NEW'
      }
    },
    {
      title: true,
      name: 'Details'
    },
    {
      name: 'Vulnerabilities',
      url: '/details/vulnerabilities',
      iconComponent: { name: 'cil-bug' }
    },
    {
      name: 'Components',
      url: '/details/components',
      iconComponent: { name: 'cil-library' }
    },
    {
      title: true,
      name: 'Links',
      class: 'mt-auto'
    },
    {
      name: 'Docs',
      url: 'https://mixeway.io',
      iconComponent: { name: 'cil-description' },
      attributes: { target: '_blank' }
    },
    {
      title: true,
      name: 'Management'
    },
    {
      name: 'Team Management',
      url: '/manage-teams',
      iconComponent: { name: 'cil-address-book' }
    },
    {
      name: 'Users',
      url: '/admin/users',
      iconComponent: { name: 'cil-people' }
    },
    {
      name: 'Settings',
      url: '/admin/settings',
      iconComponent: { name: 'cil-settings' }
    },
  ];

  // Filter based on role
  if (userRole === 'ADMIN') {
    return allNavItems; // Admin sees everything
  } else if (userRole === 'TEAM_MANAGER') {

    return allNavItems.filter(item => item.name !== 'Users' && item.name !== 'Settings');
  } else if (userRole === 'USER') {

    return allNavItems.filter(item => ['Dashboard', 'Cloud', 'Threat Intelligence', 'Statistics', 'Vulnerabilities', 'Components', 'Docs'].includes(item.name ?? ''));
  }

  return []; // Default empty array if no role matches or role is undefined
}

// Export the filtered navItems
export const navItems: INavData[] = getNavItems();

import {INavData} from "@coreui/angular";

/**
 * Sidebar structure follows the grouping used by comparable security platforms:
 * one overview entry, then the surfaces you work in (findings), then read-only
 * insights, then administration, with documentation pinned to the bottom.
 *
 * Sections are composed per role so a heading is never left without items under it.
 */
export function getNavItems(): INavData[] {
  const userRole = localStorage.getItem('userRole');

  const overview: INavData[] = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      iconComponent: { name: 'cil-speedometer' }
    },
  ];

  const findings: INavData[] = [
    {
      title: true,
      name: 'Findings'
    },
    {
      name: 'Vulnerabilities',
      url: '/details/vulnerabilities',
      iconComponent: { name: 'cil-bug' }
    },
    {
      name: 'Components',
      url: '/details/components',
      iconComponent: { name: 'cil-puzzle' }
    },
  ];

  const insights: INavData[] = [
    {
      title: true,
      name: 'Insights'
    },
    {
      name: 'Statistics',
      url: '/stats',
      iconComponent: { name: 'cil-chart-line' }
    },
    {
      name: 'Threat Intelligence',
      url: '/threat-intel',
      iconComponent: { name: 'cil-shield-alt' },
      // Kept because it states maturity. Purely promotional badges were removed:
      // a permanent "NEW" stops carrying information.
      badge: {
        color: 'secondary',
        text: 'BETA'
      }
    },
  ];

  const administration: INavData[] = [
    {
      title: true,
      name: 'Administration'
    },
    {
      name: 'Team Management',
      url: '/manage-teams',
      iconComponent: { name: 'cil-people' }
    },
  ];

  const adminOnly: INavData[] = [
    {
      name: 'Users',
      url: '/admin/users',
      iconComponent: { name: 'cil-user' }
    },
    {
      name: 'Settings',
      url: '/admin/settings',
      iconComponent: { name: 'cil-settings' }
    },
  ];

  // Pinned to the bottom so utility links never sit among the work surfaces.
  const docs: INavData[] = [
    {
      name: 'Docs',
      url: 'https://mixeway.io',
      iconComponent: { name: 'cil-description' },
      class: 'mt-auto',
      attributes: { target: '_blank' }
    },
  ];

  if (userRole === 'ADMIN') {
    return [...overview, ...findings, ...insights, ...administration, ...adminOnly, ...docs];
  }
  if (userRole === 'TEAM_MANAGER') {
    return [...overview, ...findings, ...insights, ...administration, ...docs];
  }
  if (userRole === 'USER') {
    return [...overview, ...findings, ...insights, ...docs];
  }

  return [];
}

// Export the filtered navItems
export const navItems: INavData[] = getNavItems();

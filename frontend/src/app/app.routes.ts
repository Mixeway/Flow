import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'threat-intel',
        loadChildren: () => import('./views/threat-intel/routes').then((m) => m.routes)
      },
      {
        path: 'stats',
        loadChildren: () => import('./views/security-dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'show-repo/:id',
        loadChildren: () => import('./views/show-repo/routes').then((m) => m.routes)
      },
      {
        path: 'show-cloud-subscription/:id',
        loadChildren: () => import('./views/show-cloud-subscription/routes').then((m) => m.routes)
      },
      {
        path: 'show-team/:id',
        loadChildren: () => import('./views/show-team/routes').then((m) => m.routes)
      },
      {
        path: 'admin/settings',
        loadChildren: () => import('./views/admin-settings/routes').then((m) => m.routes)
      },
      {
        path: 'admin/users',
        loadChildren: () => import('./views/admin-users/routes').then((m) => m.routes)
      },
      {
        path: 'manage-teams',
        loadChildren: () => import('./views/manage-teams/routes').then((m) => m.routes)
      },
      {
        path: 'details/vulnerabilities',
        loadChildren: () => import('./views/vulnerabilities/routes').then((m) => m.routes)
      },
      {
        path: 'details/components',
        loadChildren: () => import('./views/components/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'change',
    loadComponent: () => import('./views/pages/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    data: {
      title: 'Set Password'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];

export const projectNavigationGroups = [
  {
    id: 'project',
    label: null,
    items: [
      { id: 'onboarding', title: 'Onboarding', icon: 'rocket' },
      { id: 'analytics', title: 'Analytics', icon: 'bar-chart-3' },
      { id: 'integrations', title: 'Integrations', icon: 'plug' },
      { id: 'graph', title: 'Graph', icon: 'git-branch' },
      { id: 'settings', title: 'Project Settings', icon: 'settings' },
    ],
  },
  {
    id: 'assist',
    label: 'Assist',
    items: [
      { id: 'chat', title: 'Chat', icon: 'message-square' },
    ],
  },
];

export const organizationNavigationGroups = [
  {
    id: 'organization-general',
    label: null,
    items: [
      { id: 'organization-home', title: 'Home', icon: 'layout-dashboard' },
      { id: 'organization-organizations', title: 'Organizations', icon: 'briefcase' },
      { id: 'organization-billing', title: 'Billing', icon: 'credit-card' },
    ],
  },
  {
    id: 'organization-management',
    label: 'Management',
    items: [
      { id: 'organization-stats', title: 'Stats', icon: 'bar-chart-3' },
      { id: 'organization-access', title: 'Access Management', icon: 'users' },
      { id: 'organization-settings', title: 'Settings', icon: 'settings' },
    ],
  },
];

export const analyticsViews = [
  { id: 'servers', label: 'Servers' },
  { id: 'financial', label: 'Financial' },
  { id: 'sales', label: 'Sales' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'web', label: 'Web' },
];

export function getNavigationGroups(scope) {
  return scope === 'organization'
    ? organizationNavigationGroups
    : projectNavigationGroups;
}

export function findSectionById(scope, sectionId) {
  return getNavigationGroups(scope)
    .flatMap((group) => group.items)
    .find((item) => item.id === sectionId);
}

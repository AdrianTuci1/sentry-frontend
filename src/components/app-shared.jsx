export const projectNavigationGroups = [
  {
    id: 'project',
    label: 'Project',
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
    id: 'organization',
    label: 'Organization',
    items: [
      { id: 'organization-home', title: 'Home', icon: 'layout-dashboard' },
      { id: 'organization-projects', title: 'Projects', icon: 'briefcase' },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    items: [
      { id: 'organization-members', title: 'Members', icon: 'users' },
      { id: 'organization-billing', title: 'Billing', icon: 'credit-card' },
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

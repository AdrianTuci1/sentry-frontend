import {
  LayoutDashboardIcon,
  ServerIcon,
  DollarSignIcon,
  TrendingUpIcon,
  GlobeIcon,
  GitBranchIcon,
  PlugIcon,
  MessageSquareIcon,
} from "lucide-react";

export const navGroups = [
  {
    label: "Analytics",
    items: [
      {
        title: "Servers",
        path: "#/analytics/servers",
        icon: <ServerIcon size={18} />,
        view: "servers",
      },
      {
        title: "Financial",
        path: "#/analytics/financial",
        icon: <DollarSignIcon size={18} />,
        view: "financial",
      },
      {
        title: "Marketing",
        path: "#/analytics/marketing",
        icon: <TrendingUpIcon size={18} />,
        view: "marketing",
      },
      {
        title: "Web",
        path: "#/analytics/web",
        icon: <GlobeIcon size={18} />,
        view: "web",
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        title: "Nodes / Findings",
        path: "#/nodes",
        icon: <GitBranchIcon size={18} />,
        section: "nodes",
      },
    ],
  },
  {
    label: "Connect",
    items: [
      {
        title: "Integrations",
        path: "#/integrations",
        icon: <PlugIcon size={18} />,
        section: "integrations",
      },
      {
        title: "Chat",
        path: "#/chat",
        icon: <MessageSquareIcon size={18} />,
        section: "chat",
      },
    ],
  },
];

export const navLinks = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item]
    )
  ),
];

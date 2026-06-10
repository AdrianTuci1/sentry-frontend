import {
  BarChart3,
  GitBranch,
  Plug,
  MessageSquare,
} from "lucide-react";

export const navItems = [
  {
    id: "analytics",
    title: "Analytics",
    icon: <BarChart3 size={18} />,
  },
  {
    id: "nodes",
    title: "Nodes / Findings",
    icon: <GitBranch size={18} />,
  },
  {
    id: "integrations",
    title: "Integrations",
    icon: <Plug size={18} />,
  },
  {
    id: "chat",
    title: "Chat",
    icon: <MessageSquare size={18} />,
  },
];

export const analyticsViews = [
  { id: "servers", label: "Servers" },
  { id: "financial", label: "Financial" },
  { id: "marketing", label: "Marketing" },
  { id: "web", label: "Web" },
];

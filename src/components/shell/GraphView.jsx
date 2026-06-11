import { useState } from "react";
import { analyticsViews } from "@/components/app-shared";
import FeatureMindMap from "@/components/mindmap/DetachedMindMap";

// --- Tab-Specific Custom MindMap Data ---
const tabMindMapData = {
  servers: {
    connector: [
      { id: "srv-db-1", name: "PostgreSQL Production DB", type: "db" },
      { id: "srv-stripe-1", name: "Stripe Billing Events", type: "stripe" },
      { id: "srv-ga4-1", name: "Google Analytics Event stream", type: "ga4" }
    ],
    adjustedData: [
      {
        id: "cat-db-users",
        origin_id: "srv-db-1",
        name: "Core Users",
        title: "Core Users",
        columns: [
          { id: "col-db-u1", name: "user_id", type: "string", status: "ok" },
          { id: "col-db-u2", name: "email", type: "string", status: "ok" },
          { id: "col-db-u3", name: "created_at", type: "timestamp", status: "ok" }
        ]
      },
      {
        id: "cat-stripe-payments",
        origin_id: "srv-stripe-1",
        name: "Payments Webhook",
        title: "Payments Webhook",
        columns: [
          { id: "col-str-p1", name: "payment_id", type: "string", status: "ok" },
          { id: "col-str-p2", name: "amount_usd", type: "float", status: "warning" },
          { id: "col-str-p3", name: "status", type: "string", status: "ok" }
        ]
      },
      {
        id: "cat-ga4-events",
        origin_id: "srv-ga4-1",
        name: "Web Sessions Stream",
        title: "Web Sessions Stream",
        columns: [
          { id: "col-ga-s1", name: "session_id", type: "string", status: "ok" },
          { id: "col-ga-s2", name: "bounce_rate", type: "float", status: "error" }
        ]
      }
    ],
    group: [
      { id: "grp-srv-analytics", title: "User Analytics", name: "User Analytics", activationMode: "automatic" },
      { id: "grp-srv-rev", title: "Revenue Tracking", name: "Revenue Tracking", activationMode: "manual" }
    ],
    insight: [
      {
        id: "ins-srv-1",
        title: "Active Users",
        name: "Active Users",
        group_id: "grp-srv-analytics",
        adjusted_data_columns: ["user_id", "email"],
        lineage: { source_keys: ["cat-db-users"] }
      },
      {
        id: "ins-srv-2",
        title: "Session Duration",
        name: "Session Duration",
        group_id: "grp-srv-analytics",
        adjusted_data_columns: ["session_id"],
        lineage: { source_keys: ["cat-ga4-events"] }
      },
      {
        id: "ins-srv-3",
        title: "MRR Growth",
        name: "MRR Growth",
        group_id: "grp-srv-rev",
        adjusted_data_columns: ["amount_usd", "status"],
        lineage: { source_keys: ["cat-stripe-payments"] }
      }
    ]
  },
  financial: {
    connector: [
      { id: "fin-stripe", name: "Stripe Billing API", type: "stripe" },
      { id: "fin-bank", name: "Silicon Valley Bank ACH", type: "db" },
      { id: "fin-quickbooks", name: "QuickBooks Ledger", type: "api" }
    ],
    adjustedData: [
      {
        id: "cat-fin-recurring",
        origin_id: "fin-stripe",
        name: "Subscription Revenue",
        title: "Subscription Revenue",
        columns: [
          { id: "col-f-mrr", name: "mrr_usd", type: "float", status: "ok" },
          { id: "col-f-churn", name: "churn_rate", type: "float", status: "warning" },
          { id: "col-f-subscribers", name: "active_subscribers", type: "integer", status: "ok" }
        ]
      },
      {
        id: "cat-fin-ledger",
        origin_id: "fin-quickbooks",
        name: "Tax Liability & Ledger",
        title: "Tax Liability & Ledger",
        columns: [
          { id: "col-f-tax", name: "tax_liability", type: "float", status: "ok" },
          { id: "col-f-invoice", name: "invoice_count", type: "integer", status: "ok" }
        ]
      },
      {
        id: "cat-fin-treasury",
        origin_id: "fin-bank",
        name: "Corporate Budget runway",
        title: "Corporate Budget runway",
        columns: [
          { id: "col-f-allowance", name: "budget_allowance", type: "float", status: "ok" },
          { id: "col-f-spent", name: "spent_today", type: "float", status: "warning" },
          { id: "col-f-reserved", name: "reserved_funds", type: "float", status: "ok" }
        ]
      }
    ],
    group: [
      { id: "grp-fin-rev", title: "Revenue Analytics", name: "Revenue Analytics", activationMode: "automatic" },
      { id: "grp-fin-treasury", title: "Treasury & Taxes", name: "Treasury & Taxes", activationMode: "manual" }
    ],
    insight: [
      {
        id: "ins-fin-mrr",
        title: "MRR Overview",
        name: "MRR Overview",
        group_id: "grp-fin-rev",
        adjusted_data_columns: ["mrr_usd", "churn_rate"],
        lineage: { source_keys: ["cat-fin-recurring"] }
      },
      {
        id: "ins-fin-aov",
        title: "AOV Tracking",
        name: "AOV Tracking",
        group_id: "grp-fin-rev",
        adjusted_data_columns: ["mrr_usd", "active_subscribers"],
        lineage: { source_keys: ["cat-fin-recurring"] }
      },
      {
        id: "ins-fin-tax",
        title: "Estimated Tax Liability",
        name: "Estimated Tax Liability",
        group_id: "grp-fin-treasury",
        adjusted_data_columns: ["tax_liability", "invoice_count"],
        lineage: { source_keys: ["cat-fin-ledger"] }
      }
    ]
  },
  sales: {
    connector: [
      { id: "sal-salesforce", name: "Salesforce Sales Cloud", type: "crm" },
      { id: "sal-shopify", name: "Shopify Storefront API", type: "shopify" },
      { id: "sal-hubspot", name: "HubSpot CRM", type: "api" }
    ],
    adjustedData: [
      {
        id: "cat-sal-deals",
        origin_id: "sal-salesforce",
        name: "Deals & Pipelines",
        title: "Deals & Pipelines",
        columns: [
          { id: "col-s-deal", name: "deal_id", type: "string", status: "ok" },
          { id: "col-s-stage", name: "pipeline_stage", type: "string", status: "ok" },
          { id: "col-s-value", name: "deal_value_usd", type: "float", status: "ok" }
        ]
      },
      {
        id: "cat-sal-orders",
        origin_id: "sal-shopify",
        name: "E-Commerce Transactions",
        title: "E-Commerce Transactions",
        columns: [
          { id: "col-s-order", name: "order_id", type: "string", status: "ok" },
          { id: "col-s-qty", name: "quantity", type: "integer", status: "warning" },
          { id: "col-s-total", name: "total_price_usd", type: "float", status: "ok" }
        ]
      }
    ],
    group: [
      { id: "grp-sal-pipeline", title: "Sales Funnel Performance", name: "Sales Funnel Performance", activationMode: "automatic" },
      { id: "grp-sal-operations", title: "Order Fulfillment", name: "Order Fulfillment", activationMode: "manual" }
    ],
    insight: [
      {
        id: "ins-sal-conv",
        title: "Conversion Rate",
        name: "Conversion Rate",
        group_id: "grp-sal-pipeline",
        adjusted_data_columns: ["deal_id", "pipeline_stage"],
        lineage: { source_keys: ["cat-sal-deals"] }
      },
      {
        id: "ins-sal-leads",
        title: "Lead Sources",
        name: "Lead Sources",
        group_id: "grp-sal-pipeline",
        adjusted_data_columns: ["deal_id", "deal_value_usd"],
        lineage: { source_keys: ["cat-sal-deals"] }
      },
      {
        id: "ins-sal-unfulfilled",
        title: "Unfulfilled Orders",
        name: "Unfulfilled Orders",
        group_id: "grp-sal-operations",
        adjusted_data_columns: ["order_id", "quantity"],
        lineage: { source_keys: ["cat-sal-orders"] }
      }
    ]
  },
  marketing: {
    connector: [
      { id: "mkt-google", name: "Google Ads Campaigns", type: "api" },
      { id: "mkt-facebook", name: "Meta Business Ads Manager", type: "api" },
      { id: "mkt-tiktok", name: "TikTok Ads Stream", type: "api" }
    ],
    adjustedData: [
      {
        id: "cat-mkt-campaigns",
        origin_id: "mkt-google",
        name: "Google Ad Reach",
        title: "Google Ad Reach",
        columns: [
          { id: "col-m-camp", name: "campaign_id", type: "string", status: "ok" },
          { id: "col-m-impressions", name: "impressions", type: "integer", status: "ok" },
          { id: "col-m-spend", name: "spend_usd", type: "float", status: "warning" }
        ]
      },
      {
        id: "cat-mkt-social",
        origin_id: "mkt-facebook",
        name: "Meta Campaign Performance",
        title: "Meta Campaign Performance",
        columns: [
          { id: "col-m-clicks", name: "clicks", type: "integer", status: "ok" },
          { id: "col-m-conversions", name: "conversions", type: "integer", status: "ok" }
        ]
      }
    ],
    group: [
      { id: "grp-mkt-campaign", title: "Campaign ROI Snapshot", name: "Campaign ROI Snapshot", activationMode: "automatic" },
      { id: "grp-mkt-audience", title: "Audience Engagements", name: "Audience Engagements", activationMode: "manual" }
    ],
    insight: [
      {
        id: "ins-mkt-roi",
        title: "Campaign ROI Overview",
        name: "Campaign ROI Overview",
        group_id: "grp-mkt-campaign",
        adjusted_data_columns: ["campaign_id", "spend_usd"],
        lineage: { source_keys: ["cat-mkt-campaigns"] }
      },
      {
        id: "ins-mkt-reach",
        title: "Total Impressions Reach",
        name: "Total Impressions Reach",
        group_id: "grp-mkt-audience",
        adjusted_data_columns: ["impressions"],
        lineage: { source_keys: ["cat-mkt-campaigns"] }
      },
      {
        id: "ins-mkt-engagement",
        title: "Average Engagement Clicks",
        name: "Average Engagement Clicks",
        group_id: "grp-mkt-audience",
        adjusted_data_columns: ["clicks", "conversions"],
        lineage: { source_keys: ["cat-mkt-social"] }
      }
    ]
  },
  web: {
    connector: [
      { id: "web-lighthouse", name: "Lighthouse Performance Audit", type: "stream" },
      { id: "web-search-console", name: "Google Search Console", type: "api" },
      { id: "web-vercel", name: "Vercel Deployments log", type: "stream" }
    ],
    adjustedData: [
      {
        id: "cat-web-vitals",
        origin_id: "web-lighthouse",
        name: "Core Web Vitals Metric",
        title: "Core Web Vitals Metric",
        columns: [
          { id: "col-w-lcp", name: "lcp_seconds", type: "float", status: "ok" },
          { id: "col-w-cls", name: "cls_value", type: "float", status: "ok" },
          { id: "col-w-inp", name: "inp_milliseconds", type: "float", status: "warning" }
        ]
      },
      {
        id: "cat-web-latency",
        origin_id: "web-vercel",
        name: "Server Latency Logs",
        title: "Server Latency Logs",
        columns: [
          { id: "col-w-p50", name: "p50_ms", type: "float", status: "ok" },
          { id: "col-w-p95", name: "p95_ms", type: "float", status: "ok" },
          { id: "col-w-p99", name: "p99_ms", type: "float", status: "error" }
        ]
      }
    ],
    group: [
      { id: "grp-web-vitals", title: "Core Web Vitals", name: "Core Web Vitals", activationMode: "automatic" },
      { id: "grp-web-latency", title: "Performance Diagnostics", name: "Performance Diagnostics", activationMode: "manual" }
    ],
    insight: [
      {
        id: "ins-web-vitals-ins",
        title: "Lighthouse Performance Summary",
        name: "Lighthouse Performance Summary",
        group_id: "grp-web-vitals",
        adjusted_data_columns: ["lcp_seconds", "cls_value"],
        lineage: { source_keys: ["cat-web-vitals"] }
      },
      {
        id: "ins-web-latencies",
        title: "Latency Percentiles",
        name: "Latency Percentiles",
        group_id: "grp-web-latency",
        adjusted_data_columns: ["p50_ms", "p95_ms", "p99_ms"],
        lineage: { source_keys: ["cat-web-latency"] }
      }
    ]
  }
};

export function GraphView() {
  const [activeTab, setActiveTab] = useState("servers");

  return (
    <div className="flex-1 w-full min-h-0 relative flex flex-col">
      {/* Topology Header matching exactly the Analytics menu tabs */}
      <div className="dashboard-layout-header flat-header" style={{ padding: "8px 16px 12px 16px", borderBottom: "1px solid #1C1D1F" }}>
        <div className="dashboard-menu-tabs">
          {analyticsViews.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`dashboard-menu-tab-btn ${isSelected ? "active" : "inactive"}`}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main MindMap display container with full viewport bleed */}
      <div className="flex-1 w-full min-h-0 relative flex flex-col">
        <FeatureMindMap customData={tabMindMapData[activeTab]} key={activeTab} />
      </div>
    </div>
  );
}

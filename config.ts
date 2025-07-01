import themes from "daisyui/src/theming/themes";
import { ConfigProps } from "./types/config";

const config = {
  // REQUIRED
  appName: "AgenticVoice.net",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "AI voice agents for medical and legal professionals. Never miss another call with our 24/7 virtual receptionist.",
  // REQUIRED (no https://, not trailing slash at the end, just the naked domain)
  domainName: "agenticvoice.net",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // Pay Per Use tier
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Niyy5AxyNprDp7iZIqEyD2h_payperuse"
            : "price_payperuse",
        name: "Pay Per Use",
        description: "No commitment, perfect for trial users",
        price: 0,
        priceNote: "$2.50/minute",
        features: [
          { name: "No monthly commitment" },
          { name: "Pay only for what you use" },
          { name: "Premium rate at $2.50/minute" },
          { name: "Basic features access" },
          { name: "Email support" },
          { name: "Ideal for testing and low-volume needs" },
        ],
        isPayPerUse: true,
      },
      {
        // Starter tier
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Niyy5AxyNprDp7iZIqEyD2h_starter"
            : "price_starter",
        name: "Starter",
        description: "For small medical practices & solo law practitioners",
        price: 899,
        priceAnchor: 1250,
        features: [
          { name: "500 minutes included ($1.80/min value)" },
          { name: "1 AI voice agent" },
          { name: "Basic automation & call routing" },
          { name: "Standard integrations" },
          { name: "Setup & training included" },
          { name: "Email support" },
          { name: "Perfect for 50-150 calls/day" },
        ],
      },
      {
        // Professional tier - Most Popular
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw_professional"
            : "price_professional",
        isFeatured: true,
        name: "Professional",
        description: "Optimal for medium medical practices & small law firms",
        price: 1599,
        priceAnchor: 2150,
        features: [
          { name: "1,200 minutes included ($1.33/min value)" },
          { name: "2 AI voice agents" },
          { name: "Full HIPAA/legal compliance" },
          { name: "Priority support" },
          { name: "Advanced call analytics" },
          { name: "Custom voice training" },
          { name: "Multiple system integrations" },
          { name: "Ideal for 150-400 calls/day" },
        ],
      },
      {
        // Business tier
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw_business"
            : "price_business",
        name: "Business",
        description: "For large practices & multi-location firms",
        price: 2899,
        priceAnchor: 3750,
        features: [
          { name: "3,000 minutes included ($0.97/min value)" },
          { name: "5 AI voice agents" },
          { name: "Custom integrations" },
          { name: "Advanced analytics & reporting" },
          { name: "Dedicated support team" },
          { name: "Staff training included" },
          { name: "Multi-location support" },
          { name: "Perfect for high-volume practices" },
        ],
      },
      {
        // Enterprise tier
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw_enterprise"
            : "price_enterprise",
        name: "Enterprise",
        description: "For hospital systems & large law firms",
        price: 6999,
        priceAnchor: 9999,
        features: [
          { name: "10,000 minutes included ($0.70/min value)" },
          { name: "Unlimited AI voice agents" },
          { name: "White-label options available" },
          { name: "SLA guarantees" },
          { name: "Custom development" },
          { name: "Dedicated account manager" },
          { name: "24/7 phone support" },
          { name: "Custom pricing for overages" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `AgenticVoice.net <noreply@agenticvoice.net>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Support at AgenticVoice.net <support@agenticvoice.net>`,
    // Email shown to customer if they need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "support@agenticvoice.net",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you use any theme other than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "light",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes["light"]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users to after a successful login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  env: process.env.NEXT_PUBLIC_NODE_ENV,
  api_url:
    process.env.NODE_ENV == "development"
      ? process.env.NEXT_PUBLIC_DEV_API_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_API_URL,
  dev_api_url: process.env.NEXT_PUBLIC_DEV_API_URL,
  production_api_url: process.env.NEXT_PUBLIC_PRODUCTION_API_URL,
};

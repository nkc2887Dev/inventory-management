const config = {
  MONGO: {
    URL: process.env.MONGO_URL || "mongodb://127.0.01:27017/inventory-management"
  },
  PORT: process.env.PORT || "9876",
};

export default config;

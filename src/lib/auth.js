  /** @format */

  import { betterAuth } from "better-auth";
  import { MongoClient } from "mongodb";
  import { mongodbAdapter } from "better-auth/adapters/mongodb";

  const client = new MongoClient(process.env.MONGODB_URI);
  const db = client.db(process.env.DB_NAME);

  export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "buyer",
        },
        isblocked: {
          type: "boolean",
          required: false,
          defaultValue: false,
        },
      },
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "your-google-client-id",
        clientSecret:
          process.env.GOOGLE_CLIENT_SECRET || "your-google-client-secret",
      },
    },
  });

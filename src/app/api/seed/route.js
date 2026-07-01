/** @format */

import { auth } from "@/lib/auth";
import { hashPassword } from "@better-auth/utils/password";

let cachedClient = null;
let cachedDb = null;

async function getDb() {
  if (cachedDb) return cachedDb;
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  cachedDb = client.db(process.env.DB_NAME || "nai_sell_db");
  return cachedDb;
}

export async function POST(request) {
  try {
    const { email, password, name, role } = await request.json();

    const db = await getDb();
    const usersCollection = db.collection("user");
    const accountsCollection = db.collection("account");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      const existingCredentialAccount = await accountsCollection.findOne({
        providerId: "credential",
        userId: existingUser._id,
      });

      if (!existingCredentialAccount) {
        const passwordHash = await hashPassword(password);
        await accountsCollection.insertOne({
          accountId: existingUser._id.toString(),
          providerId: "credential",
          userId: existingUser._id,
          password: passwordHash,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      if (role) {
        await usersCollection.updateOne({ email }, { $set: { role } });
      }

      return Response.json({
        message: "User already exists",
        userId: existingUser._id.toString(),
        credentialAccountCreated: !existingCredentialAccount,
      });
    }

    // Create user through Better-Auth
    const result = await auth.api.signUpEmail({
      body: { email, password, name, role: role || "buyer" },
    });

    // Update role if specified
    if (role && result.user) {
      await usersCollection.updateOne({ email }, { $set: { role } });
    }

    return Response.json({ message: "User created", user: result.user });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

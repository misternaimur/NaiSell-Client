import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

async function getDb() {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  cachedDb = client.db(process.env.DB_NAME || "NaiSellDB");
  return cachedDb;
}

export async function POST(request) {
  try {
    const { email, name, image } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const db = await getDb();
    const usersCollection = db.collection("user");

    // Check if user exists
    let user = await usersCollection.findOne({ email });

    if (!user) {
      // Create new user via Better-Auth
      const result = await auth.api.signUpEmail({
        body: {
          email,
          password: Math.random().toString(36).slice(-12) + "A1!",
          name: name || email.split("@")[0],
        },
      });

      // Update with image and role
      if (result.user) {
        // The Better-Auth user id might be stored differently
        const userId = result.user.id;
        await usersCollection.updateOne(
          { _id: userId },
          { $set: { image: image || "", role: "buyer" } }
        );

        // Also update by email as fallback
        await usersCollection.updateOne(
          { email },
          { $set: { image: image || "", role: "buyer" } }
        );

        user = { id: userId, email, name, image, role: "buyer" };
      }
    }

    if (!user) {
      return Response.json({ error: "Failed to create or find user" }, { status: 500 });
    }

    // Ensure user.id is set
    if (!user.id) {
      user.id = user._id?.toString();
    }

    // Generate a session token using MongoDB ObjectId for uniqueness
    const { ObjectId } = await import("mongodb");
    const sessionId = new ObjectId().toString();
    const userId = user.id || user._id?.toString();

    // Store session in Better-Auth's session collection
    const sessionsCollection = db.collection("session");
    await sessionsCollection.insertOne({
      id: sessionId,
      sessionToken: sessionId,
      userId: userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    });

    return Response.json({
      success: true,
      user: {
        id: userId,
        email: user.email || email,
        name: user.name || name,
        role: user.role || "buyer",
      },
      sessionToken: sessionId,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
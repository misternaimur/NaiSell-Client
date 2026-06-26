import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

export async function POST(request) {
  try {
    const { email, name, image } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.DB_NAME);

    // Check if user exists
    let user = await db.collection("user").findOne({ email });

    if (!user) {
      // Create new user via Better-Auth
      const result = await auth.api.signUpEmail({
        body: {
          email,
          password: Math.random().toString(36).slice(-12) + "A1!", // Random password
          name: name || email.split("@")[0],
        },
      });

      // Update with image and role
      if (result.user) {
        await db.collection("user").updateOne(
          { id: result.user.id },
          { $set: { image: image || "", role: "buyer" } }
        );
        user = { id: result.user.id, email, name, image, role: "buyer" };
      }
    }

    // Create a session token for the user
    const sessionToken = Math.random().toString(36).slice(2) + Date.now().toString(36);

    // Store session in Better-Auth's session collection
    await db.collection("session").insertOne({
      id: sessionToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    });

    await client.close();

    return Response.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      sessionToken,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

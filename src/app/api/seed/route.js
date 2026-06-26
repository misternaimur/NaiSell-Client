import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

export async function POST(request) {
  try {
    const { email, password, name, role } = await request.json();

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.DB_NAME);

    // Check if user already exists
    const existingUser = await db.collection("user").findOne({ email });
    if (existingUser) {
      await client.close();
      return Response.json({ message: "User already exists", userId: existingUser.id });
    }

    // Create user through Better-Auth
    const result = await auth.api.signUpEmail({
      body: { email, password, name },
    });

    // Update role if specified
    if (role && result.user) {
      await db.collection("user").updateOne(
        { id: result.user.id },
        { $set: { role } }
      );
    }

    await client.close();
    return Response.json({ message: "User created", user: result.user });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

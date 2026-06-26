import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

// A deterministic "password" derived from the user's email so we can sign them
// back in via Better-Auth's email+password flow (which sets the proper session cookie)
function deriveGooglePassword(email) {
  // Simple deterministic password — never exposed to users
  return `G@${Buffer.from(email).toString("base64").slice(0, 16)}#Nx9`;
}

export async function POST(request) {
  try {
    const { email, name, image } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
    const db = mongoClient.db(process.env.DB_NAME);

    // Check if user already exists
    const existingUser = await db.collection("user").findOne({ email });

    const password = deriveGooglePassword(email);

    if (!existingUser) {
      // Create new user via Better-Auth with a deterministic password
      const result = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: name || email.split("@")[0],
          role: "buyer",
        },
      });

      // Update with image from Google
      if (result?.user) {
        await db.collection("user").updateOne(
          { email },
          { $set: { image: image || "", role: "buyer" } }
        );
      }
    } else {
      // Update image if changed
      if (image && existingUser.image !== image) {
        await db.collection("user").updateOne(
          { email },
          { $set: { image } }
        );
      }
    }

    await mongoClient.close();

    // Return the deterministic password so the client can sign in via Better-Auth
    // to get a proper session cookie
    return Response.json({
      success: true,
      password,
      role: existingUser?.role || "buyer",
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

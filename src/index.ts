import { hashPassword, verifyPassword } from "./api/hash";
import { getUserIdFromSession, sendVerificationEmail } from "./api/helper";
import { getProducts } from "./api/productService";
import { SignJWT, jwtVerify } from 'jose';
// cloudflare worker: index.ts

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  FRONTEND_URL: string;
}

interface GoogleTokenInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
  aud: string;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response | undefined> {
    // console.log(">>> WORKER_ENTRY_CHECK:");
    const url = new URL(request.url);

    // 1. Handle API routes (Always works local & prod)
    // if (url.pathname.startsWith('/api/')) {
    //   return new Response(JSON.stringify({ message: "tlp-site API Active" }), {
    //     headers: { "Content-Type": "application/json" }
    //   });
    // }

    // Define your API endpoint

    if (url.pathname === '/api/cart/sync-confirm' && request.method === "POST") {
      try {
        // console.log("Hello error check");
        // 1. 🔑 EXTRACT USER ID FROM THE AUTHENTICATION CONTEXT
        // (This is an example using a helper function to decode your session JWT/Cookie)
        const userId = await getUserIdFromSession(request, env);

        if (!userId) {
          return new Response("Unauthorized: No valid session found", { status: 401 });
        }

        // 2. Parse the item list payload from the body
        // const { cartItems } = await request.json() as IncomingSyncPayload;
        const { cartItems } = await request.json() as any;

        const transactionStatements = [];

        // 3. Wipe out ONLY this extracted user's rows on the server
        transactionStatements.push(
          env.DB.prepare(`DELETE FROM cart_items WHERE user_id = ?;`).bind(userId)
        );

        // 4. Batch rebuild the cart rows for this user
        if (cartItems && cartItems.length > 0) {
          cartItems.forEach((item: any) => {
            transactionStatements.push(
              env.DB.prepare(`
              INSERT INTO cart_items (user_id, product_id, quantity)
              VALUES (?, ?, ?);
            `).bind(userId, item.productId, item.quantity)
            );
          });
        }

        // 5. 🎯 THE SAFETY GUARD: Fetch ONLY this specific user's new rows.
        // This completely avoids returning heavy database payloads or leaking other rows.
        transactionStatements.push(
          env.DB.prepare(`
          SELECT user_id, product_id, quantity, updated_at, created_at 
          FROM cart_items 
          WHERE user_id = ?;
        `).bind(userId)
        );

        // 6. Execute transaction atomically
        const batchResults = await env.DB.batch(transactionStatements);
        const liveConfirmedCart = batchResults[batchResults.length - 1].results;

        return new Response(JSON.stringify({
          success: true,
          cart: liveConfirmedCart // Lightweight, user-specific data array payload
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }


    // Fetch all tables for local indexedDB
    if (url.pathname === '/api/sync-catalog' && request.method === "GET") {
      try {
        console.log("Initiating batch read transaction for database catalog sync...");

        // 2. Prepare all 5 SELECT queries simultaneously
        // This leverages the exact database table architechture matching
        const [categoriesResult, brandsResult, tagsResult, productsResult, cartItemsResult, productTagsResult] = await env.DB.batch([
          env.DB.prepare("SELECT id, name, slug FROM categories"),
          env.DB.prepare("SELECT id, name, slug FROM brands"),
          env.DB.prepare("SELECT id, name, slug, color_code FROM tags"),
          env.DB.prepare("SELECT id, name, price, rating, image_url, discount_label, stock_count, description, category_id, brand_id, created_at FROM products"),
          env.DB.prepare("SELECT user_id, product_id, quantity, updated_at, created_at FROM cart_items"),
          env.DB.prepare("SELECT product_id, tag_id FROM product_tags"),
        ]);

        // 3. Assemble the dataset into the exact single JSON payload object for the frontend expects
        const syncPayload = {
          categories: categoriesResult.results,
          brands: brandsResult.results,
          tags: tagsResult.results,
          products: productsResult.results,
          cart_items: cartItemsResult.results,
          product_tags: productTagsResult.results
        };
        // console.log(syncPayload);
        // 4. Return the consolidated payload back with clear application
        return new Response(JSON.stringify(syncPayload), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Safe CORS handle if your frondend rns on a separate prot/device
            "Cache-Control": "public, max-age=10" // Optional short-duration edge chace header
          }
        });
      } catch (error: any) {
        console.error(" D1 Sync Transaction Exception:", error);

        return new Response(
          JSON.stringify({
            error: "Failed to generate catalog backup payload snapshot",
            details: error.message
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        )
      }
    }

    // 1. Check if the pathname starts with /api/products
    // Inside your Cloudflare Worker index.ts
    if (url.pathname === "/api/categories") {
      try {
        console.log(url);
        const { results } = await env.DB.prepare("SELECT * FROM categories").all();
        return new Response(JSON.stringify(results), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    // --- 2. Products Route (Paginated & Filtered) ---
    if (url.pathname === "/api/products") {
      try {
        const productsData = await getProducts(env.DB, {
          categorySlug: url.searchParams.get("category"),
          brandSlugs: url.searchParams.get("brands"), // New
          tagSlugs: url.searchParams.get("tags"),     // New
          limit: parseInt(url.searchParams.get("limit") || "12"),
          page: parseInt(url.searchParams.get("page") || "1"),
          bulkCategories: url.searchParams.get("bulk")?.toLowerCase() === "true",
        });

        return new Response(JSON.stringify(productsData), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    // --- Brands Check ---
    if (url.pathname === "/api/brands") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM brands ORDER BY name ASC").all();
        return new Response(JSON.stringify(results), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    // --- Tags Check ---
    if (url.pathname === "/api/tags") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM tags ORDER BY name ASC").all();
        return new Response(JSON.stringify(results), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/login') {
      const { email, password }: any = await request.json();

      console.log("Error check");
      console.log(email);
      try {
        // 1. Fetch the user's credentials
        const user: any = await env.DB.prepare("SELECT * FROM users WHERE email = ?")
          .bind(email)
          .first();
        console.log(user);
        // 2. Scenario: User doesn't exist OR has no password (Google-only)
        const corsHeaders = {
          "Access-Control-Allow-Origin": "http://localhost:5173", // Your Frontend URL
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        };
        if (!user || !user.password_hash) {
          return new Response(JSON.stringify({
            error: "Invalid credentials or account uses Google Login"
          }), {
            status: 401,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          });
        }

        // 3. Verify the password using the stored salt
        // You must pass the salt from the DB back into your hashing function
        const isMatch = await verifyPassword(password, user.password_hash, user.salt);

        if (!isMatch) {
          return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        // 4. Success! Generate the Session JWT
        const secret = new TextEncoder().encode(env.JWT_SECRET);
        const token = await new SignJWT({
          id: user.id,
          email: user.email,
          role: user.role
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('24h')
          .sign(secret);

        return new Response(JSON.stringify({
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.username,
            display_name: user.display_name,
            picture: user.picture,
            role: user.role,
            created_at: user.created_at,
            last_login: user.last_login,
          }
        }), { status: 200 });

      } catch (err) {
        console.error("Login Error:", err);
        return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
      }
    }

    // 1. Only handle the Auth route

    if (request.method === 'POST' && url.pathname === '/api/auth/google') {
      try {
        const body: any = await request.json();

        if (!body || typeof body.token !== 'string') {
          return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400 });
        }

        const token = body.token;

        // 2. Verify with Google
        // console.log("ERROR CHECK");
        const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const googleData: GoogleTokenInfo = await googleResponse.json();
        // console.log("Audience from Google:", googleData.aud);
        // console.log("Client ID from Env:", env.GOOGLE_CLIENT_ID); // CLIENT_ID MUST BE DEFINED in the var block in the jsonc
        if (!googleResponse.ok || googleData.aud !== env.GOOGLE_CLIENT_ID) {
          return new Response(JSON.stringify({ error: 'Invalid Google Token' }), { status: 401 });
        }
        // console.log(googleData);
        // 3. Extract user info
        const { sub: google_id, email, name, picture } = googleData;

        // 4. Database Upsert (SQLite syntax for D1)
        // We check if they exist, if not, insert. Then we select the user.
        // console.log("ERROR CHECK1");
        // Inside your /api/auth/google logic
        await env.DB.prepare(`
        INSERT INTO users (email, google_id, display_name, picture)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
          google_id = COALESCE(users.google_id, excluded.google_id),
          display_name = excluded.display_name,
          picture = excluded.picture,
          last_login = CURRENT_TIMESTAMP
        `).bind(email, google_id, name, picture).run();
        // console.log("ERROR CHECK2");

        const user = await env.DB.prepare("SELECT * FROM users WHERE google_id = ?")
          .bind(google_id)
          .first();
        console.log(user);
        if (!user) {
          return new Response(JSON.stringify({ error: 'User not found after creation' }), { status: 500 });
        }
        // 5. Issue YOUR Session JWT
        // console.log(secret);
        const secret = new TextEncoder().encode(env.JWT_SECRET);
        const sessionToken = await new SignJWT({
          id: user.id,
          role: user.role,
          email: user.email
        })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('7d')
          .sign(secret);
        return new Response(JSON.stringify({
          success: true,
          token: sessionToken,
          user: { name: user.name, picture: user.picture }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
      }
    }

    if (request.method === 'POST' && url.pathname === '/api/auth/register') {
      try {
        const { email, password, username, display_name }: any = await request.json();
        const { hash, salt } = await hashPassword(password); // Ensure your hashPassword returns the salt too
        // 1. Check existing state
        const existingUser = await env.DB.prepare("SELECT display_name, password_hash, google_id FROM users WHERE email = ?")
          .bind(email)
          .first();


        // SCENARIO C: Full Account already exists
        if (existingUser && existingUser.password_hash) {
          return new Response(JSON.stringify({ error: "Email already in use. Please login." }), { status: 400 });
        }

        try {
          // Use the name from the DB if it's a Google user, otherwise use the name from the request
          const displayName = existingUser?.display_name || display_name;

          const tokenId = crypto.randomUUID(); // The unique "Version Key"

          // email is the key for overiting
          await env.DB.prepare("INSERT OR REPLACE INTO pending_registrations  (email, username, display_name, password_hash, salt, token_id) VALUES (?1, ?2, ?3, ?4, ?5, ?6)").bind(email, username, displayName, hash, salt, tokenId).run();

          await sendVerificationEmail(email, hash, salt, displayName, username, env, tokenId);
          // console.log("ERROR CHECK");

          const message = existingUser
            ? "A link has been sent to add a password to your account."
            : "Verification email sent! Please check your inbox to complete registration.";

          return new Response(JSON.stringify({ message }), { status: 200 });

        } catch (error) {
          return new Response(JSON.stringify({ error: "Failed to send email." }), { status: 500 });
        }
        // SCENARIO A: Brand New User
        // Depending on your preference, you can either create them immediately 
        // or send a verification email here too.
        // await sendVerificationEmail(email, hash, salt, name, env); // Helper function to implement
        // console.log(env.FRONTEND_URL);
        // await env.DB.prepare(`
        // INSERT INTO users (email, password_hash, salt, name)
        // VALUES (?, ?, ?, ?)
        // `).bind(email, hash, salt, name).run();

        // Issue JWT and return success
        return new Response(JSON.stringify({ success: true, message: "Registration successful" }));

      } catch (err) {
        return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
      }
    }
    // console.log("Pathname is:", "'" + url.pathname + "'");
    // *** you need to open another terminal and run npx wrangler dev to run the server, remember to change the uri sent via email to the correct port, and adjust the wrangler
    // jsonc to point to directory ./public to bypass having to re-build everytime
    if (request.method === 'GET' && url.pathname === '/api/auth/verify') {
      const token = url.searchParams.get('token');
      if (!token) {
        return new Response(JSON.stringify({ error: "Missing token" }), { status: 400 });
      }

      try {
        // 1. Verify the JWT
        const secret = new TextEncoder().encode(env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        // 2. Extract the data we packed earlier
        const { email, password_hash, salt, display_name, username, type, token_id } = payload as any;

        // console.log("ERROR CHECK 3");
        if (type !== 'account_linking') {
          return new Response(JSON.stringify({ error: "Invalid token type" }), { status: 400 });
        }

        const pending = await env.DB.prepare(
          "SELECT token_id, password_hash, salt, username, display_name FROM pending_registrations WHERE email = ?"
        ).bind(email).first();

        // 3. THE CRITICAL CHECK
        if (!pending || pending.token_id !== token_id) {
          return new Response(JSON.stringify({
            error: "This link is no longer valid. Please request a new one."
          }), { status: 400 });
        }

        // 3. Finalize the Database Update
        // We use COALESCE for the name to keep the old name if the new one is missing
        await env.DB.prepare(`
        INSERT INTO users (email, username, display_name, password_hash, salt)
        VALUES (?1, ?2, ?3, ?4, ?5)
        ON CONFLICT(email) DO UPDATE SET
          username = excluded.username,
          display_name = COALESCE(?3, users.display_name),
          password_hash = excluded.password_hash,
          salt = excluded.salt
        `).bind(email, username, display_name, password_hash, salt).run();

        // 4. Redirect to your frontend login or success page
        // Using a redirect is better than returning JSON because the user 
        // clicked this from their email inbox.
        return Response.redirect(`${env.FRONTEND_URL}/login?verified=true`, 302);

      } catch (err) {
        console.error("Verification Error:", err);
        return new Response(JSON.stringify({ error: "Link expired or invalid" }), { status: 401 });
      }
    }

    // Default: Fallback if no routes match
    // 2. The "Smart Fallthrough"
    // If we have ASSETS (Production), use it.
    // If NOT (Local Dev), return nothing so Vite can handle the UI.
    // Returning nothing here lets the Vite dev server take over locally
    return await env.ASSETS.fetch(request);
  }
}

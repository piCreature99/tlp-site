export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response | undefined> {
    const url = new URL(request.url);

    // 1. Handle API routes (Always works local & prod)
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ message: "HRM API Active" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. The "Smart Fallthrough"
    // If we have ASSETS (Production), use it.
    // If NOT (Local Dev), return nothing so Vite can handle the UI.
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    // Returning nothing here lets the Vite dev server take over locally
    return;
  },
};
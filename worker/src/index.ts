import { verifyFirebaseIdToken } from "./auth";

export interface Env {
  CORS_ORIGIN?: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_SERVICE_ACCOUNT_KEY?: string; // Cloudflare secret
  OPENAI_API_KEY?: string; // Cloudflare secret
}

function handleCors(request: Request, env: Env): Headers {
  const headers = new Headers();
  const allowedOrigin = env.CORS_ORIGIN || "*";
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Workspace-Id");
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

function jsonResponse(data: unknown, status = 200, corsHeaders: Headers): Response {
  corsHeaders.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
}

function errorResponse(message: string, status = 400, corsHeaders: Headers): Response {
  return jsonResponse({ error: message, success: false }, status, corsHeaders);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const corsHeaders = handleCors(request, env);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      // 1. Health check endpoint
      if (url.pathname === "/api/health" || url.pathname === "/health") {
        return jsonResponse(
          {
            status: "healthy",
            service: "chatflow-worker-api",
            timestamp: new Date().toISOString(),
          },
          200,
          corsHeaders,
        );
      }

      // 2. Token verification diagnostic endpoint
      if (url.pathname === "/api/auth/verify" && request.method === "POST") {
        const authHeader = request.headers.get("Authorization");
        const { user, error } = await verifyFirebaseIdToken(
          authHeader,
          env.FIREBASE_PROJECT_ID,
        );

        if (error || !user) {
          return errorResponse(error || "Unauthorized", 401, corsHeaders);
        }

        return jsonResponse({ success: true, user }, 200, corsHeaders);
      }

      // Default 404
      return errorResponse("Endpoint not found", 404, corsHeaders);
    } catch (err: any) {
      return errorResponse(err.message || "Internal Server Error", 500, corsHeaders);
    }
  },
};

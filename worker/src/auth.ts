import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

const GOOGLE_JWKS_URL = new URL(
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
);
const remoteJWKS = createRemoteJWKSet(GOOGLE_JWKS_URL);

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  emailVerified?: boolean;
}

export async function verifyFirebaseIdToken(
  authHeader: string | null,
  projectId: string,
): Promise<{ user: AuthenticatedUser | null; error: string | null }> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, error: "Missing or malformed Authorization header" };
  }

  const token = authHeader.replace(/^Bearer\s+/, "").trim();

  try {
    const { payload } = await jwtVerify(token, remoteJWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    const uid = payload.sub;
    if (!uid) {
      return { user: null, error: "Token payload missing subject (UID)" };
    }

    return {
      user: {
        uid,
        email: payload.email as string | undefined,
        emailVerified: payload.email_verified as boolean | undefined,
      },
      error: null,
    };
  } catch (err: any) {
    return { user: null, error: `Invalid Firebase token: ${err.message}` };
  }
}

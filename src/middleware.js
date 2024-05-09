import { logInfo } from "./middleware/logInfo";

export async function middleware(request) {
  try {
    logInfo(request);
  } catch (e) {
    console.log("MIDDLEWARE", e);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon/favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon/favicon.ico).*)",
  ],
};
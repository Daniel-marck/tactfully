import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

// Refresh the session only for the protected application area. API routes
// authenticate independently, so running getUser() in proxy for every API
// call would duplicate the network verification.
export const config = {
  matcher: ["/dashboard/:path*"],
}

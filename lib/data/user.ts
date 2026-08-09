// Once Supabase Auth is connected, getCurrentUser() will read the session
// (via supabase.auth.getUser()) and join against the `profiles` table. It
// returns null today to match that future "not logged in" case, with
// USER_PROFILE as the standing mock fallback for pages built before auth
// exists — callers should already handle both.

import { USER_PROFILE } from '@/lib/constants'
import type { UserProfile } from '@/lib/types'

export async function getCurrentUser(): Promise<UserProfile> {
  // TODO(supabase): replace with a real session + profile lookup.
  return USER_PROFILE
}

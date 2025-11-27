import type { UserProfile } from "./index";

export interface AppOutletContext {
  userId: string | null;
  profile: UserProfile | null;
}

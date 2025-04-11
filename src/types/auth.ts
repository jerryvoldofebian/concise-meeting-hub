
import { User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "@/types";

export interface AuthState {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
  error: Error | null;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<void>;
}

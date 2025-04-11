
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { AuthContextType, AuthState } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

const initialState: AuthState = {
  user: null,
  supabaseUser: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const { toast } = useToast();

  const getUser = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (!session) {
        setState(prev => ({ ...prev, user: null, supabaseUser: null, isLoading: false }));
        return;
      }
      
      const supabaseUser = session.user;
      
      // Fetch the user profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      if (!profile) {
        console.error('No profile found for user');
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      // Ensure the role is one of the accepted types
      const userRole = profile.role as string;
      const validRole: 'admin' | 'user' | 'guest' = 
        userRole === 'admin' ? 'admin' :
        userRole === 'guest' ? 'guest' : 'user'; // Default to 'user' if not matching
      
      const user: User = {
        id: profile.id,
        email: supabaseUser.email || '',
        firstName: profile.first_name,
        lastName: profile.last_name,
        avatar: profile.avatar,
        role: validRole,
        createdAt: profile.created_at,
      };
      
      setState({ user, supabaseUser, isLoading: false, error: null });
    } catch (error) {
      console.error('Error fetching user:', error);
      setState(prev => ({ ...prev, error: error as Error, isLoading: false }));
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account",
      });
      
      // Don't set the user yet, wait for email confirmation or auto sign-in based on your Supabase settings
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Sign up failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      setState(prev => ({ ...prev, error: error as Error, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      
      // Refresh user data after sign in
      await getUser();
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Sign in failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      setState(prev => ({ ...prev, error: error as Error, isLoading: false }));
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Signed out successfully",
      });
      
      setState({ ...initialState, isLoading: false });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      setState(prev => ({ ...prev, error: error as Error, isLoading: false }));
    }
  };

  useEffect(() => {
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut, getUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

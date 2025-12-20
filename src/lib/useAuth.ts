'use client';

import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabase';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: Error | null;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
        error: null,
    });

    const supabase = getSupabaseClient();

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                setAuthState({
                    user: session?.user ?? null,
                    session,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                setAuthState({
                    user: null,
                    session: null,
                    loading: false,
                    error: error as Error,
                });
            }
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: string, session: Session | null) => {
                setAuthState({
                    user: session?.user ?? null,
                    session,
                    loading: false,
                    error: null,
                });
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Sign in with Google
    const signInWithGoogle = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) throw error;
    }, [supabase]);

    // Sign in with Email/Password
    const signInWithEmail = useCallback(async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    }, [supabase]);

    // Sign up with Email/Password
    const signUpWithEmail = useCallback(async (email: string, password: string, name?: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });
        if (error) throw error;
        return data;
    }, [supabase]);

    // Sign out
    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }, [supabase]);

    return {
        user: authState.user,
        session: authState.session,
        loading: authState.loading,
        error: authState.error,
        isAuthenticated: !!authState.user,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
    };
}

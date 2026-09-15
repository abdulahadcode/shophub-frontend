import { supabase } from "./supabase";

// Sign Up
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

// Login
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Logout
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Current User get karna
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Auth state change sunna (login/logout detect karne ke liye)
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });

} 
export function isAdmin(user) {
  return user?.app_metadata?.role === "admin";
}
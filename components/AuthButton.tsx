"use client";
import { useAuth } from "@/hooks/useAuth";

export default function AuthButton() {
  const { user, signInWithGoogle, signOut } = useAuth();

  if (user) {
    return (
      <div>
        <span>{user.email}</span>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

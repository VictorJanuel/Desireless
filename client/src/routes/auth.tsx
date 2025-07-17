import SignUp from "../components/auth/signeUp";
import { createFileRoute } from "@tanstack/react-router";
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
  basePath: "/api/auth",
  debug: true, // Enable debugging
  routes: {
    signUp: {
      email: "/sign-up/email"
    }
  }
});
export type AuthClient = typeof authClient;

export const Auth = () => {
  return (
    <div>
      <SignUp authClient={authClient} />
    </div>
  );
}

export const Route = createFileRoute("/auth")({
  component: Auth,
});
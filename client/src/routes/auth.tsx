import SignUp from "../components/auth/signeUp";
import { createFileRoute } from "@tanstack/react-router";
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient();
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
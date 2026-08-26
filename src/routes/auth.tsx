import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { BrandMark } from "@/components/site/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Store Admin Sign In | AnKura by Orgnature" },
      {
        name: "description",
        content: "Secure sign-in for the AnKura by Orgnature store owner to manage products and settings.",
      },
      { property: "og:title", content: "Store Admin Sign In | AnKura by Orgnature" },
      {
        property: "og:description",
        content: "Secure sign-in for the AnKura by Orgnature store owner.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || password.length < 6) {
      toast.error("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. Signing you in…");
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      // First account to sign in becomes the store admin.
      await supabase.rpc("claim_admin");
      toast.success("Signed in");
      navigate({ to: "/admin" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <BrandMark />
        </div>
        <div className="surface-card mt-8 p-7">
          <h1 className="font-display text-2xl">Store admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Only the store owner needs to sign in here. Customers never need an account.
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1.5 h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1.5 h-11"
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              disabled={busy}
              className="h-12 w-full rounded-full text-xs font-semibold tracking-wider uppercase"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create admin account"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-xs text-muted-foreground underline"
          >
            {mode === "signin"
              ? "First time? Create the store owner account"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

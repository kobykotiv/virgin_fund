"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserAuthFormProps {
  mode?: "login" | "register";
}

export function UserAuthForm({ mode = "login" }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (mode === "login") {
        await signIn("credentials", { ...data, callbackUrl: "/" });
      } else {
        // Handle registration logic
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4">
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          disabled={isLoading}
        />
        <Input
          {...register("password")}
          type="password"
          placeholder="Password"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {mode === "login" ? "Sign In" : "Sign Up"}
        </Button>
      </div>
    </form>
  );
}

export default UserAuthForm;

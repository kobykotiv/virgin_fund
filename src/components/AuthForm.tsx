import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import { Button } from "./ui/button";
import { triggerConfetti } from '@/lib/confetti';

interface AuthFormProps {
  type: "login" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [captchaError, setCaptchaError] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (type === "signup") {
      loadCaptchaEnginge(6);
    }
  }, [type]);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setAuthError("");

      if (type === "signup") {
        if (!validateCaptcha(userCaptcha)) {
          setCaptchaError("Invalid captcha");
          return;
        }

        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (error) {
          if (error.message === "User already registered") {
            setAuthError(
              "An account with this email already exists. Please sign in instead.",
            );
          } else {
            setAuthError(error.message);
          }
          return;
        }

        if (signUpData.user) {
          navigate("/dashboard", { replace: true });
        }
      } else {
        const { data: signInData, error } =
          await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });

        if (error) {
          setAuthError("Invalid email or password");
          return;
        }

        if (signInData.user) {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="glass-button flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          {type === "login"
            ? "Sign in to your account"
            : "Create a new account"}
        </h2>
        {type === "login" && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:text-primary/80"
            >
              create a new account
            </Link>
          </p>
        )}
        {type === "signup" && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card bg-card text-card-foreground py-8 px-4 sm:px-10">
          {authError && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{authError}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="glass-input w-full text-foreground placeholder:text-muted-foreground border-border focus:border-primary focus:ring-primary"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete={
                    type === "login" ? "current-password" : "new-password"
                  }
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 10 characters",
                    },
                  })}
                  className="glass-input w-full text-foreground placeholder:text-muted-foreground border-border focus:border-primary focus:ring-primary"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.password.message as string}
                  </p>
                )}
              </div>
            </div>

            {type === "signup" && (
              <div>
                <label
                  htmlFor="captcha"
                  className="block text-sm font-medium text-foreground"
                >
                  Verify Captcha
                </label>
                <div className="mt-1">
                  <LoadCanvasTemplate />
                  <input
                    id="captcha"
                    type="text"
                    value={userCaptcha}
                    onChange={(e) => {
                      setUserCaptcha(e.target.value);
                      setCaptchaError("");
                    }}
                    className="mt-2 glass-input w-full text-foreground placeholder:text-muted-foreground border-border focus:border-primary focus:ring-primary"
                    placeholder="Enter captcha"
                  />
                  {captchaError && (
                    <p className="mt-2 text-sm text-destructive">{captchaError}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                ) : type === "login" ? (
                  <LogIn className="w-5 h-5 mr-2" />
                ) : (
                  <UserPlus className="w-5 h-5 mr-2" />
                )}
                {type === "login" ? "Sign in" : "Sign up"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  DollarSign,
  Shield,
  AlertCircle,
} from "lucide-react";

interface ProfileFormData {
  full_name: string;
  bio: string;
  avatar_url: string;
  investment_experience: "beginner" | "intermediate" | "advanced";
  risk_tolerance: "conservative" | "moderate" | "aggressive";
  preferred_currency: string;
  notification_preferences: {
    email: boolean;
    push: boolean;
  };
}

export function Settings() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const { error } = await supabase.from("profiles").upsert({
        user_id: session?.user?.id,
        ...data,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  React.useEffect(() => {
    if (profile) {
      Object.entries(profile).forEach(([key, value]) => {
        if (
          typeof value === "string" ||
          (typeof value === "object" && value !== null)
        ) {
          setValue(key as keyof ProfileFormData, value as any);
        }
      });
    }
  }, [profile, setValue]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center">
          <SettingsIcon className="w-6 h-6 text-gray-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        </div>

        <form
          onSubmit={handleSubmit((data) => updateProfile.mutate(data))}
          className="p-6 space-y-6"
        >
          {/* Profile Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-500" />
              Profile Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                {...register("full_name", {
                  required: "Full name is required",
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                {...register("bio")}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Avatar URL
              </label>
              <input
                type="url"
                {...register("avatar_url")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Investment Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
              Investment Preferences
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Investment Experience
              </label>
              <select
                {...register("investment_experience")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Risk Tolerance
              </label>
              <select
                {...register("risk_tolerance")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Currency
              </label>
              <select
                {...register("preferred_currency")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Bell className="w-5 h-5 mr-2 text-gray-500" />
              Notification Preferences
            </h3>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("notification_preferences.email")}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Email Notifications
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("notification_preferences.push")}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Push Notifications
                </label>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Shield className="w-5 h-5 mr-2 text-gray-500" />
              Security
            </h3>

            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                Email: {session?.user?.email}
              </p>
              <button
                type="button"
                onClick={() => {
                  /* Add password change logic */
                }}
                className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Change Password
              </button>
            </div>
          </div>

          {updateProfile.isError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error updating profile
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {updateProfile.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

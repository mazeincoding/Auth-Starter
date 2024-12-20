"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user-store";
import { UserIcon } from "lucide-react";
import { SettingCard } from "@/components/setting-card";
import { FormField } from "@/components/form-field";
import {
  profileSchema,
  type ProfileSchema,
} from "@/utils/validation/auth-validation";
import { z } from "zod";
import { toast } from "sonner";

type FormErrors = Partial<Record<keyof ProfileSchema, string>>;

export default function Account() {
  const { user, isLoading, updateUser } = useUserStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      profileSchema.parse(formData);
      setErrors({});
      await updateUser(formData);
      toast.success("Profile updated", {
        description: "Your profile has been updated successfully.",
        duration: 3000,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormErrors] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast.error("Error", {
          description: "Failed to update profile. Please try again.",
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="space-y-12">
      <SettingCard
        icon={UserIcon}
        title="Basic information"
        description="Manage your basic information."
        footer={
          <Button type="submit" form="account-form" disabled={isLoading}>
            Save
          </Button>
        }
      >
        <form
          id="account-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <FormField
            id="name"
            label="Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            error={errors.name}
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            error={errors.email}
          />
        </form>
      </SettingCard>
    </div>
  );
}

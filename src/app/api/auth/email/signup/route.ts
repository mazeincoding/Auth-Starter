import { createClient } from "@/utils/supabase/server";
import { validateFormData } from "@/utils/validation/auth-validation";
import { NextResponse } from "next/server";
import { authRateLimit } from "@/utils/rate-limit";
import { AUTH_CONFIG } from "@/config/auth";

export async function POST(request: Request) {
  try {
    if (authRateLimit && AUTH_CONFIG.api_rate_limit.enabled) {
      const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await authRateLimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    const body = await request.json();
    const validation = validateFormData(body);

    if (validation.error || !validation.data) {
      return NextResponse.json(
        { error: validation.error || "Invalid input" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error: authError } = await supabase.auth.signUp(
      validation.data
    );

    // Check for existing user
    if (data?.user?.identities?.length === 0) {
      return NextResponse.json(
        {
          error:
            "This email is already registered. Please try logging in instead.",
        },
        { status: 400 }
      );
    }

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Sends the "you've been invited to a TaskHive workspace" email via Resend.
// Invoked by WorkspacesContext.inviteToWorkspace after the workspace_invites
// row is written - the invite itself is the source of truth (it's what
// auto-joins the invitee when they sign up), this is just the notification.
//
// Requires a RESEND_API_KEY secret on the Edge Function:
//   supabase secrets set RESEND_API_KEY=re_xxxxxxxx
//
// Deploy with:
//   supabase functions deploy send-invite-email

import { createClient } from "@supabase/supabase-js";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("INVITE_FROM_EMAIL") ?? "noreply@taskhive.cc";
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://taskhive.cc";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    // Verifies the caller has a real Supabase session (not just anyone who
    // knows the function URL) before spending an email send on their behalf.
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const { email, workspaceName } = await req.json();
    if (!email || !workspaceName) {
      return new Response(JSON.stringify({ error: "email and workspaceName are required" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const inviterLabel = user.email ?? "A teammate";

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `TaskHive <${FROM_EMAIL}>`,
        to: [email],
        subject: `${inviterLabel} invited you to ${workspaceName} on TaskHive`,
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #020617;">
            <p style="font-size: 20px; font-weight: 600; margin: 0 0 24px;">TaskHive</p>
            <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 12px;">You're invited to ${workspaceName}</h2>
            <p style="font-size: 15px; color: #6a7282; line-height: 1.5; margin: 0 0 28px;">
              ${inviterLabel} has invited you to join their workspace on TaskHive. Sign up or log in with this email address (${email}) to join automatically.
            </p>
            <a href="${SITE_URL}/login" style="display: inline-block; background: #826af6; color: #ffffff; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 100px;">
              Join ${workspaceName}
            </a>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      return new Response(JSON.stringify({ error: `Resend error: ${errText}` }), {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});

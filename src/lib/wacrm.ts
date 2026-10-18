/**
 * Client helper to trigger WACRM WhatsApp welcome message.
 * 
 * In production (Vercel): Calls secure server-side route /api/send-wacrm-welcome.
 * In local development: Calls /api/send-wacrm-welcome with automatic local fallback to http://localhost:3000/api/v1/messages.
 */

export interface SendWacrmWelcomeParams {
  to: string;
  name?: string;
  email?: string;
  userId?: string;
}

export const sendWacrmWelcome = async ({
  to,
  name,
  email,
  userId
}: SendWacrmWelcomeParams): Promise<{ success: boolean; message?: string }> => {
  if (!to || !to.trim()) {
    return { success: false, message: "No phone number provided" };
  }

  // Format phone to E.164: remove all non-digits, format with country code
  const cleanDigits = String(to).replace(/\D/g, "");
  if (cleanDigits.length < 7 || cleanDigits.length > 15) {
    return { success: false, message: "Invalid phone number length" };
  }

  const formattedTo = String(to).trim().startsWith("+")
    ? `+${cleanDigits}`
    : (cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`);

  const recipientName = (name && String(name).trim()) || (email ? String(email).split("@")[0] : "Partner");

  // 1. Primary: Serverless route (/api/send-wacrm-welcome)
  try {
    const response = await fetch("/api/send-wacrm-welcome", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: formattedTo,
        name: recipientName,
        email: email?.trim(),
        userId
      })
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      if (data?.success) {
        console.log("[WACRM] Welcome message sent successfully via server route:", data);
        return { success: true, message: data?.message };
      }
    }
  } catch (serverErr: any) {
    console.warn("[WACRM] Server route dispatch attempt notice:", serverErr?.message);
  }

  // 2. Direct fallback for local development if /api is not routed by the local dev server
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    try {
      console.log("[WACRM] Attempting direct local dispatch to WACRM on port 3000...");
      const localResponse = await fetch("http://localhost:3000/api/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer wacrm_live_3uQ6r8421AN4ATyTGxwlixLSz824N3P8_STxQbwRHKM",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({
          to: formattedTo,
          type: "text",
          text: `Welcome to OPSIYS, ${recipientName}! 🚀\n\nThank you for creating your account. We are excited to partner with you. Our engineering team is here to support your AI & digital transformation journey.\n\nYou can reply to this message anytime for support or project inquiries.`,
          name: recipientName
        })
      });

      if (localResponse.ok) {
        const localData = await localResponse.json().catch(() => null);
        console.log("[WACRM] Welcome message sent directly to local WACRM:", localData);
        return { success: true, message: "Sent via local WACRM" };
      } else {
        const errText = await localResponse.text().catch(() => "");
        console.warn("[WACRM] Direct local WACRM response notice:", localResponse.status, errText);
      }
    } catch (localErr: any) {
      console.warn("[WACRM] Direct local WACRM fallback notice:", localErr?.message);
    }
  }

  return { success: false, message: "Dispatch processed" };
};

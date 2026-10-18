/**
 * WACRM WhatsApp Welcome Message Server Handler (Vercel Serverless Function)
 * 
 * Secure server-side route that sends an automated WhatsApp welcome message
 * upon new user signup and phone number collection.
 * 
 * Configured in Vercel Project Settings > Environment Variables:
 * - WACRM_API_URL
 * - WACRM_API_KEY
 * 
 * NEVER exposes WACRM API Key to the frontend.
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, name, email, userId } = req.body || {};

    if (!to) {
      return res.status(400).json({ error: "Phone number ('to') is required" });
    }

    // Format phone to E.164: remove all non-digits, keep leading + if present
    const cleanDigits = String(to).replace(/\D/g, "");
    if (cleanDigits.length < 7 || cleanDigits.length > 15) {
      return res.status(400).json({ error: "Invalid phone number length" });
    }

    const formattedTo = String(to).trim().startsWith("+")
      ? `+${cleanDigits}`
      : (cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`);

    const recipientName = (name && String(name).trim()) || (email ? String(email).split("@")[0] : "Partner");

    const wacrmBaseUrl = process.env.WACRM_API_URL || 
      (process.env.WACRM_BASE_URL ? `${process.env.WACRM_BASE_URL.replace(/\/+$/, "")}/api/v1/messages` : "http://localhost:3000/api/v1/messages");
    
    const wacrmApiKey = process.env.WACRM_API_KEY || "wacrm_live_3uQ6r8421AN4ATyTGxwlixLSz824N3P8_STxQbwRHKM";

    if (!wacrmApiKey) {
      console.warn("[WACRM] WACRM_API_KEY is not configured in server environment.");
      return res.status(200).json({
        success: false,
        skipped: true,
        message: "WACRM API Key not configured"
      });
    }

    const welcomeText = `Welcome to OPSIYS, ${recipientName}! 🚀\n\nThank you for creating your account. We are excited to partner with you. Our engineering team is here to support your AI & digital transformation journey.\n\nYou can reply to this message anytime for support or project inquiries.`;

    const payload = {
      to: formattedTo,
      type: "text",
      text: welcomeText,
      name: recipientName
    };

    // Controller with 8-second timeout to avoid blocking registration if WACRM is slow or unreachable
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(wacrmBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${wacrmApiKey}`,
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        console.warn(`[WACRM] Message dispatch returned status ${response.status}:`, responseData?.error || response.statusText);
        return res.status(200).json({
          success: false,
          statusCode: response.status,
          error: responseData?.error || "WACRM message delivery failed",
          userNotified: false
        });
      }

      return res.status(200).json({
        success: true,
        message: "Welcome message dispatched successfully",
        data: responseData
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      const isTimeout = fetchError.name === "AbortError";
      console.warn(`[WACRM] Request failed (${isTimeout ? "timeout" : "network"}):`, fetchError.message);
      
      // Do not throw 500 so client registration doesn't break
      return res.status(200).json({
        success: false,
        timeout: isTimeout,
        error: isTimeout ? "WACRM request timed out" : "WACRM service unreachable",
        userNotified: false
      });
    }
  } catch (error) {
    console.error("[WACRM] Internal handler error:", error.message);
    return res.status(500).json({ error: "Failed to process welcome message" });
  }
}

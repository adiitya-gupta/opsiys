/**
 * WACRM WhatsApp Welcome Message Netlify Serverless Function
 * 
 * Secure server-side route that sends an automated WhatsApp welcome message
 * upon new user signup and phone number collection.
 * 
 * Configured via Netlify Environment Variables:
 * - WACRM_API_URL or WACRM_BASE_URL
 * - WACRM_API_KEY
 */

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { to, name, email, userId } = JSON.parse(event.body || "{}");

    if (!to) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Phone number ('to') is required" })
      };
    }

    const cleanDigits = String(to).replace(/\D/g, "");
    if (cleanDigits.length < 7 || cleanDigits.length > 15) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid phone number length" })
      };
    }

    const formattedTo = String(to).trim().startsWith("+")
      ? `+${cleanDigits}`
      : (cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`);

    const recipientName = (name && String(name).trim()) || (email ? String(email).split("@")[0] : "Partner");

    const wacrmBaseUrl = process.env.WACRM_API_URL || 
      (process.env.WACRM_BASE_URL ? `${process.env.WACRM_BASE_URL.replace(/\/+$/, "")}/api/v1/messages` : "http://localhost:3000/api/v1/messages");
    
    const wacrmApiKey = process.env.WACRM_API_KEY || "wacrm_live_3uQ6r8421AN4ATyTGxwlixLSz824N3P8_STxQbwRHKM";

    if (!wacrmApiKey) {
      console.warn("[WACRM] WACRM_API_KEY is not configured in Netlify environment.");
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          skipped: true,
          message: "WACRM API Key not configured"
        })
      };
    }

    const welcomeText = `Welcome to OPSIYS, ${recipientName}! 🚀\n\nThank you for creating your account. We are excited to partner with you. Our engineering team is here to support your AI & digital transformation journey.\n\nYou can reply to this message anytime for support or project inquiries.`;

    const payload = {
      to: formattedTo,
      type: "text",
      text: welcomeText,
      name: recipientName
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(wacrmBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${wacrmApiKey}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        console.warn(`[WACRM] Message dispatch returned status ${response.status}:`, responseData?.error || response.statusText);
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            success: false,
            statusCode: response.status,
            error: responseData?.error || "WACRM message delivery failed",
            userNotified: false
          })
        };
      }

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: true,
          message: "Welcome message dispatched successfully",
          data: responseData
        })
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      const isTimeout = fetchError.name === "AbortError";
      console.warn(`[WACRM] Request failed (${isTimeout ? "timeout" : "network"}):`, fetchError.message);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: false,
          timeout: isTimeout,
          error: isTimeout ? "WACRM request timed out" : "WACRM service unreachable",
          userNotified: false
        })
      };
    }
  } catch (error) {
    console.error("[WACRM] Internal handler error:", error.message);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to process welcome message" })
    };
  }
};

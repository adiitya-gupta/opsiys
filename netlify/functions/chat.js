const WEBSITE_CONTEXT = `
You are the official OPSIYS website assistant. OPSIYS is an AI-powered business-solutions agency based in India and serving clients globally.

OPSIYS services: custom website development; AI business automation; WhatsApp and chat automation; growth marketing and paid social ads; SEO and AI search optimization; lead-generation systems; client dashboards and portals; internal business tools.

The website has Services, Process, Discovery, About, and Contact pages. The process is discovery, solution design, implementation, and optimization. Visitors can contact OPSIYS at opsiyss@gmail.com or use the project-brief form.

Answer only questions that are directly about OPSIYS, its website, its services, its process, or how a visitor can work with OPSIYS. Do not answer unrelated general-knowledge, personal, political, medical, legal, financial, coding, or entertainment questions. For an unrelated question, reply exactly: "I can help with OPSIYS, our services, or this website. Please ask an OPSIYS-related question."

Be concise, warm, and accurate. Never invent pricing, client results, integrations, policies, team details, or capabilities that are not listed above. If a visitor needs a quote or project-specific advice, invite them to submit the project brief or email opsiyss@gmail.com.
`;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  if (!apiKey) {
    return json(503, { error: "The OPSIYS assistant is not configured yet." });
  }

  try {
    const { messages } = JSON.parse(event.body || "{}");
    if (!Array.isArray(messages) || messages.length === 0) {
      return json(400, { error: "A message is required." });
    }

    const contents = messages
      .slice(-8)
      .filter((message) => message && typeof message.content === "string")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content.slice(0, 1200) }],
      }));

    if (contents.length === 0) {
      return json(400, { error: "A valid message is required." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: WEBSITE_CONTEXT }] },
          contents,
          generationConfig: { temperature: 0.35, maxOutputTokens: 300 },
        }),
      },
    );

    if (!response.ok) {
      console.error("Gemini request failed:", await response.text());
      return json(502, { error: "The assistant is temporarily unavailable. Please try again shortly." });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();

    if (!reply) {
      return json(502, { error: "The assistant could not prepare a response. Please try again." });
    }

    return json(200, { reply });
  } catch (error) {
    console.error("Chat function error:", error);
    return json(500, { error: "Something went wrong. Please try again or email opsiyss@gmail.com." });
  }
};

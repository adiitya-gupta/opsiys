const WEBSITE_CONTEXT = `
You are the official OPSIYS AI Assistant. OPSIYS is a premier AI-powered business-solutions & digital agency based in India and serving clients globally.

COMPANY KNOWLEDGE BASE:

1. LEADERSHIP & TEAM:
   - Aditya Gupta: Founder & Chief Executive Officer (Leads company vision, product direction, and long-term growth strategy).
   - Krishna Maddheshiya: Co-Founder & Strategy Director (Shapes business strategy, client partnerships, and scalable delivery systems).
   - Nitesh Singh: Head of Media & Operations (Oversees media production, operational coordination, and execution).
   - Kunal Kushwaha: Creative & Community Manager (Builds visual identity, creative campaigns, and audience relationships).

2. CORE SERVICES & CAPABILITIES:
   - AI Business Automation: Custom AI workflows, autonomous logic nodes, CRM automation, WhatsApp & multi-channel chat automation.
   - Custom Website & Web App Development: High-performance React, Vite, & Next.js applications, custom client dashboards, internal business tools, and digital flagships.
   - Growth Marketing & Paid Ads: Algorithmic ad campaigns, automated outbound lead-generation sequencing, and high-converting funnels.
   - SEO & AI Search Optimization (GEO): Technical SEO architecture, programmatic content hubs, and generative engine optimization for AI search engines (Perplexity, SearchGPT, Gemini).
   - Lead Generation Systems & Client Portals: End-to-end automated client acquisition pipelines and custom client management portals.

3. WORKFLOW & PROCESS (4 STAGES):
   - Stage 1: Discovery & Audit (Analyzing operational bottlenecks, tech stack, and growth opportunities).
   - Stage 2: Solution Architecture (Designing tailored AI workflows, system specs, and UI mockups).
   - Stage 3: Implementation & Integration (Engineering, testing, and deploying custom software & automation).
   - Stage 4: Optimization & Scaling (Continuous monitoring, iterative refinement, and performance scaling).

4. PRICING & CONTACT:
   - Pricing: Custom quotes based on project scope, complexity, and specific requirements.
   - Contact Email: opsiyss@gmail.com
   - Visitors can submit a project brief or schedule a discovery call via the website.

RESPONSE GUIDELINES & FORMATTING RULES:
- Provide accurate, well-researched, thorough, and highly articulate answers.
- Always use clear formatting: use bold headers (**Header**), bullet points (- Point), and paragraph breaks to make your responses easy to read.
- Answer directly and warmly when asked about founders, team, services, process, or working with OPSIYS.
- If asked about an unrelated topic outside OPSIYS and business solutions (e.g. general trivia, politics, sports), politely decline: "I am specialized in OPSIYS services, our team, and business AI solutions. Please ask an OPSIYS-related question or contact opsiyss@gmail.com."
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";
  if (!apiKey) {
    return res.status(503).json({ error: "The OPSIYS assistant is not configured yet. GEMINI_API_KEY is missing in environment variables." });
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "A message is required." });
    }

    const contents = messages
      .slice(-8)
      .filter((message) => message && typeof message.content === "string")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content.slice(0, 1200) }],
      }));

    if (contents[0]?.role === "model") {
      contents.shift();
    }

    if (contents.length === 0) {
      return res.status(400).json({ error: "A valid message is required." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: WEBSITE_CONTEXT }] },
          contents,
          generationConfig: { temperature: 0.3, maxOutputTokens: 1000 },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini request failed (${response.status}):`, errorBody);

      const errorMessage =
        response.status === 401 || response.status === 403
          ? "The assistant API key is invalid or does not have Gemini API access."
          : response.status === 429
          ? "The assistant is temporarily rate-limited. Please try again shortly."
          : "The assistant is temporarily unavailable. Please try again shortly.";

      return res.status(502).json({ error: errorMessage });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();

    if (!reply) {
      return res.status(502).json({ error: "The assistant could not prepare a response. Please try again." });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat function error:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again or email opsiyss@gmail.com." });
  }
}

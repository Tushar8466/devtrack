import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const token = process.env.HF_TOKEN;

    if (!token) {
      console.error("HF_TOKEN is missing in environment variables.");
      return NextResponse.json({ 
        error: "AI_Uplink_Offline", 
        message: "Neural gateway token (HF_TOKEN) is not configured in the nexus core." 
      }, { status: 500 });
    }

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:groq",
        messages: [
          {
            role: "system",
            content: "You are DevTrack AI, a tactical intelligence core for monitoring global open-source nodes. You decode authorship signatures, provide strategic advice on GitHub contributions, and guide users through the DevTrack reconnaissance network. Your tone is technically advanced, professional, and tactical (cyberpunk aesthetic). Use terms like 'node', 'uplink', 'intercept', 'DNA', 'vector', and 'nexus'. You are helpful but brief when necessary."
          },
          ...messages
        ],
        stream: false, // Default to non-streaming for simplicity in this implementation
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Hugging Face API error:", errorData);
      return NextResponse.json({ 
        error: "Neural_Drift_Detected", 
        message: "The AI core returned an invalid signal. Connection integrity compromised." 
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ 
      error: "System_Fault", 
      message: "Internal core failure during intercept sequence." 
    }, { status: 500 });
  }
}

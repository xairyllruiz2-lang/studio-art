const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const STYLE = {
  character: "2D anime character design sheet, full body, clean lineart, plain light background, ",
  background: "2D anime background art, no people, painterly, atmospheric, ",
  storyboard: "2D anime storyboard panel, cinematic composition, "
};

const BASE = "Philippine folklore inspired, LUNARAG Studios style, ";

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (request.method !== "POST")
      return new Response("Studio art is online.", { headers: CORS });
    try {
      const { agent, task } = await request.json();
      if (!task) throw new Error("Empty prompt");
      const prompt = (STYLE[agent] || "") + BASE + String(task).slice(0, 900);
      const out = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
        prompt,
        steps: 6
      });
      return Response.json({ image: out.image }, { headers: CORS });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 400, headers: CORS });
    }
  }
};

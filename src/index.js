import HTML from "./index.html";
const app = {
	async chat(request, env) {
		const formData = await request.formData();
		const prompt = formData.get("prompt");
		const imageFile = formData.get("image");

		const ai = new Ai(env.AI);
		const inputs = {
			prompt: prompt,
			max_tokens: 2000,
		};
		const modelId = '@cf/llava-hf/llava-1.5-7b-hf';
		inputs.prompt = `
		USER: ${prompt}  
		ASSISTANT:`
		const imageArrayBuffer = await imageFile.arrayBuffer();
		inputs.image = [...new Uint8Array(imageArrayBuffer)];
		const response = await env.AI.run(modelId, inputs);
		return new Response(response.description)
	},
	html() {
		return new Response(HTML, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
	}
}

export default {
	async fetch(request, env) {
		if (request.method === 'POST' && new URL(request.url).pathname === '/chat') {
			return app.chat(request, env);
		} else if (request.method === 'GET' && new URL(request.url).pathname === '/') {
			return app.html();
		} else {
			return new Response('Not Found', { status: 404 });
		}
	}
}
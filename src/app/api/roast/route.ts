import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializamos el cliente de Google Gemini
// Asegúrate de tener GEMINI_API_KEY en tu .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { repoUrl, mode } = await req.json();

        // 1. Validación básica
        if (!repoUrl || !repoUrl.includes("github.com")) {
            return NextResponse.json({ error: 'URL inválida. Debe ser de GitHub.' }, { status: 400 });
        }

        try {
            // 2. Extraer usuario y repo de la URL
            const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (!match) throw new Error("Formato de URL incorrecto");
            const [_, owner, repo] = match;

            // 3. Obtener datos de GitHub (Repo info + Commits)
            const headers = process.env.GITHUB_TOKEN
                ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
                : {};

            const [repoData, commitData] = await Promise.all([
                fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }).then(r => r.json()),
                fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=12`, { headers }).then(r => r.json())
            ]);

            if (repoData.message === 'Not Found') {
                throw new Error("Repositorio no encontrado o es privado (y no tienes token).");
            }

            // Preparar los mensajes de commit para el prompt
            const commitMessages = Array.isArray(commitData)
                ? commitData.map((c: any) => `- "${c.commit.message}" (${c.commit.author.name})`).join('\n')
                : "No se pudieron leer los commits.";

            // 4. Configurar Gemini 1.5 Flash
            // Usamos 'gemini-1.5-flash-001' que es la versión estable
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash-lite-001",
                generationConfig: { responseMimeType: "application/json" }
            });

            const prompt = `
        Eres un Ingeniero de Software Senior extremadamente cínico, sarcástico y "quemado" (burnout).
        Tu tarea es hacer un "Roast" (crítica humillante pero graciosa) de un repositorio de código.
        
        MODO SELECCIONADO: ${mode === 'nuclear' ? 'NUCLEAR (Destrucción total, muy cruel)' : 'SPICY (Sarcasmo divertido)'}.
        
        DATOS DEL REPOSITORIO:
        - Nombre: ${repoData.name}
        - Descripción: ${repoData.description || "Sin descripción (vaya vagancia)"}
        - Lenguaje Principal: ${repoData.language}
        - Estrellas: ${repoData.stargazers_count}
        - Últimos Commits:
        ${commitMessages}

        INSTRUCCIONES DE SALIDA:
        Responde ÚNICAMENTE con un objeto JSON válido siguiendo esta estructura exacta:
        {
          "score": number (un número del 1 al 10, sé duro),
          "roast_title": "string (título corto, insultante y gracioso)",
          "summary": "string (un párrafo de análisis ácido sobre el código y la salud mental del autor)",
          "red_flags": ["string", "string", "string"], (3 puntos negativos específicos basados en los commits o lenguaje),
          "best_dev_joke": "string (un chiste one-liner relacionado con la tecnología usada)"
        }
      `;

            // 5. Generar la respuesta
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parsear el JSON (Gemini en modo JSON suele ser limpio, pero por seguridad)
            const roast = JSON.parse(text);

            return NextResponse.json(roast);

        } catch (apiError: any) {
            console.error("⚠️ Error interno:", apiError);
            return NextResponse.json({
                error: 'Error procesando el roast.',
                details: apiError.message
            }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
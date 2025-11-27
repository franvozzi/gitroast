"use client";

import { useState, useEffect } from "react";
import { Flame, Github, AlertTriangle, Terminal, Zap, Share2, Copy, Skull } from "lucide-react";

interface RoastData {
  score: number;
  roast_title: string;
  summary: string;
  red_flags: string[];
  best_dev_joke: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"spicy" | "nuclear">("spicy"); // Nuevo estado
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Iniciando escaneo...");
  const [data, setData] = useState<RoastData | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Efecto de texto hacker durante la carga
  useEffect(() => {
    if (!loading) return;
    const texts = ["Cloneando repo...", "Juzgando commits...", "Buscando bugs...", "Consultando a los dioses...", "Generando sarcasmo..."];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i % texts.length]);
      i++;
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleRoast = async () => {
    if (!url.includes("github.com")) {
      setError("⚠️ Pon una URL de GitHub válida.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url, mode }), // Enviamos el modo
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!data) return;
    const text = `🔥 GitRoast Score: ${data.score}/10\n"${data.roast_title}"\n${data.summary}\n\nDescubre tu nivel en: gitroast.app`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400 border-emerald-500 shadow-emerald-500/50";
    if (score >= 5) return "text-yellow-400 border-yellow-500 shadow-yellow-500/50";
    return "text-red-500 border-red-500 shadow-red-500/50";
  };

  return (
    <main className="min-h-screen bg-black text-slate-200 font-sans selection:bg-orange-500/30 overflow-x-hidden">

      {/* Background FX */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,18,20,0.9),rgba(0,0,0,1)),url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_500px_at_50%_-100px,#3b0a0a,transparent)] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 flex flex-col items-center">

        {/* HEADER */}
        <div className="mb-10 text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-900/80 border border-slate-700 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-mono text-slate-400">SYSTEM READY</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-600">
            GIT<span className="text-orange-600">ROAST</span>
          </h1>
          <p className="text-slate-500 text-lg">La auditoría de código que no pediste.</p>
        </div>

        {/* CONTROLS */}
        <div className="w-full max-w-xl space-y-6">

          {/* Mode Selector */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setMode("spicy")}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === "spicy" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
            >
              <Flame className="w-4 h-4" /> SPICY
            </button>
            <button
              onClick={() => setMode("nuclear")}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === "nuclear" ? "bg-red-900/80 text-red-100 shadow-lg shadow-red-900/20" : "text-slate-500 hover:text-red-400"}`}
            >
              <Skull className="w-4 h-4" /> NUCLEAR
            </button>
          </div>

          {/* Input */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-black rounded-xl border border-slate-800 flex items-center p-2">
              <Github className="w-6 h-6 text-slate-500 ml-3" />
              <input
                type="text"
                placeholder="github.com/usuario/repo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRoast()}
                className="flex-1 bg-transparent text-white placeholder:text-slate-700 text-lg px-4 py-3 outline-none font-mono"
              />
              <button
                onClick={handleRoast}
                disabled={loading || !url}
                className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {loading ? <span className="animate-spin">⏳</span> : "ROAST"}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center font-mono text-orange-500 text-sm animate-pulse">
              {`> ${loadingText}`}
            </div>
          )}

          {error && <div className="text-red-500 text-center bg-red-950/30 p-3 rounded-lg border border-red-900">{error}</div>}
        </div>

        {/* RESULT CARD */}
        {data && (
          <div className="w-full mt-12 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-orange-900/10">

              {/* Top Bar */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${data.score > 5 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs font-mono text-slate-400 uppercase">Analysis Complete</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white group relative"
                  title="Copiar resultado"
                >
                  {copied ? <span className="text-green-400 text-xs font-bold mr-2">COPIADO!</span> : null}
                  {copied ? <Share2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Score */}
                <div className="flex flex-col items-center justify-center min-w-[150px]">
                  <div className={`w-32 h-32 rounded-full border-[6px] flex items-center justify-center bg-black shadow-[0_0_30px_rgba(0,0,0,0.5)] ${getScoreColor(data.score)}`}>
                    <span className="text-6xl font-black text-white">{data.score}</span>
                  </div>
                  <span className="mt-4 text-xs font-mono text-slate-500 tracking-[0.2em]">CODE SCORE</span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <h2 className="text-3xl font-bold text-white leading-tight">{data.roast_title}</h2>
                  <p className="text-slate-300 text-lg leading-relaxed border-l-2 border-slate-700 pl-4">
                    {data.summary}
                  </p>

                  {/* Red Flags */}
                  <div className="mt-6 bg-black/40 rounded-xl p-4 border border-slate-800">
                    <h3 className="text-xs font-bold text-red-400 uppercase mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" /> Critical Issues
                    </h3>
                    <ul className="space-y-2">
                      {data.red_flags.map((flag, i) => (
                        <li key={i} className="text-sm text-slate-400 font-mono flex gap-2">
                          <span className="text-red-500">{`>`}</span> {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer Joke */}
              <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <p className="text-slate-500 italic text-sm flex items-center justify-center gap-2">
                  <Zap className="w-3 h-3" /> {data.best_dev_joke}
                </p>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}
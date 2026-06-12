"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";

interface Props {
  conviteSlug: string;
  accentColor?: string;
}

export function RsvpForm({ conviteSlug, accentColor = "orange" }: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [acompanhantes, setAcompanhantes] = useState(0);
  const [status, setStatus] = useState<"confirmado" | "recusado" | "talvez">("confirmado");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const colorMap: Record<string, { btn: string; ring: string; bg: string }> = {
    orange: { btn: "bg-orange-500 hover:bg-orange-600", ring: "ring-orange-300", bg: "bg-orange-50" },
    rose: { btn: "bg-rose-500 hover:bg-rose-600", ring: "ring-rose-300", bg: "bg-rose-50" },
    blue: { btn: "bg-blue-400 hover:bg-blue-500", ring: "ring-blue-300", bg: "bg-blue-50" },
  };
  const colors = colorMap[accentColor] || colorMap.orange;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setError("Informe seu nome");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          convite_slug: conviteSlug,
          nome: nome.trim(),
          telefone: telefone.trim() || null,
          acompanhantes,
          status,
          mensagem: mensagem.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao confirmar");

      setSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao confirmar presenca";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className={`w-16 h-16 ${colors.btn.split(" ")[0]} rounded-full flex items-center justify-center mx-auto mb-3`}>
          <Check className="w-8 h-8 text-white" />
        </div>
        <p className="text-lg font-medium text-gray-700">
          {status === "confirmado"
            ? "Presenca confirmada!"
            : status === "talvez"
            ? "Resposta registrada!"
            : "Resposta registrada. Sentiremos sua falta!"}
        </p>
        <p className="text-sm text-gray-400 mt-1">Obrigado, {nome}!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Status buttons */}
      <div className="grid grid-cols-3 gap-2">
        {([
          { value: "confirmado" as const, label: "Vou!", icon: "✅" },
          { value: "talvez" as const, label: "Talvez", icon: "🤔" },
          { value: "recusado" as const, label: "Nao posso", icon: "😢" },
        ]).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatus(opt.value)}
            className={`py-3 px-2 rounded-xl text-sm font-medium transition-all border-2 ${
              status === opt.value
                ? `${colors.btn.split(" ")[0]} text-white border-transparent`
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="block text-lg mb-1">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Nome */}
      <input
        type="text"
        placeholder="Seu nome completo *"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 ${colors.ring} text-gray-700 text-sm`}
        required
      />

      {/* Telefone */}
      <input
        type="tel"
        placeholder="Seu WhatsApp (opcional)"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 ${colors.ring} text-gray-700 text-sm`}
      />

      {/* Acompanhantes */}
      {status === "confirmado" && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Acompanhantes:</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAcompanhantes(Math.max(0, acompanhantes - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
            >
              -
            </button>
            <span className="text-lg font-medium w-6 text-center text-gray-700">{acompanhantes}</span>
            <button
              type="button"
              onClick={() => setAcompanhantes(acompanhantes + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Mensagem */}
      <textarea
        placeholder="Deixe uma mensagem (opcional)"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        rows={2}
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 ${colors.ring} text-gray-700 text-sm resize-none`}
      />

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full ${colors.btn} text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar resposta"
        )}
      </button>
    </form>
  );
}

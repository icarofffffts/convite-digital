"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, CheckCircle2, Copy, Sparkles, MapPin, Calendar, User } from "lucide-react";
import { PLANO_PRECOS } from "@/lib/types";
import { formatCurrency, getAppUrl } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
  nome_cliente: z.string().min(3, "Nome muito curto"),
  email: z.string().email("Email invalido"),
  telefone: z.string().min(10, "Telefone invalido"),
  nome_anfitriao: z.string().min(3, "Nome muito curto"),
  titulo_evento: z.string().min(5, "Titulo muito curto"),
  data_evento: z.string().min(1, "Data e obrigatoria"),
  local_nome: z.string().min(3, "Nome do local obrigatorio"),
  local_endereco: z.string().min(5, "Endereco obrigatorio"),
  local_maps_url: z.string().url("URL do mapa invalida").optional().or(z.literal("")),
  mensagem: z.string().optional(),
  tema_slug: z.string().optional(), // Alterado de tema_id para tema_slug
  plano: z.enum(["basico", "premium", "luxo"]),
});

type FormData = z.infer<typeof formSchema>;

// Mock temas para o frontend (os mesmos criados no SQL)
const TEMAS = [
  { slug: "festa-tropical", nome: "Festa Tropical" },
  { slug: "romance-elegante", nome: "Romance Elegante" },
  { slug: "mundo-baby", nome: "Mundo Baby" },
];

function CriarConviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const temaSlugParam = searchParams.get("tema");
  const planoParam = searchParams.get("plano") as "basico" | "premium" | "luxo" | null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createdConvite, setCreatedConvite] = useState<{ slug: string; id: string; valor: number } | null>(null);
  const [pixData, setPixData] = useState<{qrCode: string, qrCodeBase64: string} | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plano: planoParam || "basico",
      tema_slug: TEMAS.find(t => t.slug === temaSlugParam)?.slug || TEMAS[0].slug,
      nome_cliente: "",
      email: "",
      telefone: "",
      nome_anfitriao: "",
      titulo_evento: "",
      data_evento: "",
      local_nome: "",
      local_endereco: "",
      local_maps_url: "",
      mensagem: "",
    },
  });

  const watchPlano = form.watch("plano");

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch("/api/convites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao criar convite");

      setCreatedConvite(json.convite);
      setPixData(json.pix);
      setStep(3);
      toast.success("Convite criado com sucesso!");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Erro desconhecido");
    }
  }

  function renderStep1() {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Seus dados
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome *</label>
              <input
                {...form.register("nome_cliente")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="Como quer ser chamado?"
              />
              {form.formState.errors.nome_cliente && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.nome_cliente.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
              <input
                {...form.register("telefone")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="(11) 99999-9999"
              />
              {form.formState.errors.telefone && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.telefone.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                {...form.register("email")}
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="seu@email.com"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Escolha do Plano e Tema</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plano *</label>
              <select
                {...form.register("plano")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 bg-white outline-none"
              >
                <option value="basico">Basico - {formatCurrency(PLANO_PRECOS.basico)}</option>
                <option value="premium">Premium (com RSVP) - {formatCurrency(PLANO_PRECOS.premium)}</option>
                <option value="luxo">Luxo (Completo) - {formatCurrency(PLANO_PRECOS.luxo)}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tema *</label>
              <select
                {...form.register("tema_slug")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 bg-white outline-none"
              >
                {TEMAS.map((t) => (
                  <option key={t.slug} value={t.slug}>{t.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            const valid = await form.trigger(["nome_cliente", "email", "telefone", "plano", "tema_slug"]);
            if (valid) setStep(2);
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-8"
        >
          Proximo: Dados do Evento
          <ArrowLeft className="w-5 h-5 rotate-180" />
        </button>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Dados do Evento
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Titulo do Evento *</label>
              <input
                {...form.register("titulo_evento")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="Ex: Casamento de Ana e Joao"
              />
              {form.formState.errors.titulo_evento && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.titulo_evento.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do(s) Anfitriao(oes) *</label>
              <input
                {...form.register("nome_anfitriao")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Ex: Familia Silva"
              />
              {form.formState.errors.nome_anfitriao && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.nome_anfitriao.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora *</label>
              <input
                {...form.register("data_evento")}
                type="datetime-local"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {form.formState.errors.data_evento && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.data_evento.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            Localizacao
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Local *</label>
              <input
                {...form.register("local_nome")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Ex: Buffet Alegria"
              />
              {form.formState.errors.local_nome && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.local_nome.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereco Completo *</label>
              <input
                {...form.register("local_endereco")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Rua das Flores, 123 - Centro, BH"
              />
              {form.formState.errors.local_endereco && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.local_endereco.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link do Google Maps (Opcional)</label>
              <input
                {...form.register("local_maps_url")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem para os convidados (Opcional)</label>
          <textarea
            {...form.register("mensagem")}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            placeholder="Sua presenca e muito importante para nos..."
          />
        </div>

        {/* Resumo Valor */}
        <div className="bg-purple-50 rounded-xl p-4 flex items-center justify-between border border-purple-100">
          <div>
            <p className="text-purple-900 font-medium">Total a pagar</p>
            <p className="text-sm text-purple-700">Pagamento unico via Pix</p>
          </div>
          <span className="text-2xl font-bold text-purple-900">
            {formatCurrency(PLANO_PRECOS[watchPlano as keyof typeof PLANO_PRECOS] || 29)}
          </span>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-6 py-4 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition-colors"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {form.formState.isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Finalizando...</>
            ) : (
              <><CheckCircle2 className="w-5 h-5" /> Criar Convite</>
            )}
          </button>
        </div>
      </div>
    );
  }

  function renderStep3() {
    if (!createdConvite) return null;
    const url = `${getAppUrl()}/${createdConvite.slug}`;

    return (
      <div className="text-center py-8 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Convite Criado!</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Seu convite foi gerado com sucesso. Para ativa-lo, realize o pagamento via Pix.
        </p>

        {/* Fake Pix */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-8 max-w-sm mx-auto">
          <p className="text-sm text-gray-500 mb-2">Valor do Plano</p>
          <p className="text-3xl font-bold text-gray-800 mb-6">{formatCurrency(createdConvite.valor)}</p>
          
          <div className="w-48 h-48 bg-white border border-gray-200 rounded-xl mx-auto mb-6 flex items-center justify-center overflow-hidden">
            {pixData?.qrCodeBase64 ? (
              <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code Pix" className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-gray-400 text-sm font-medium">Gerando QR Code...</span>
            )}
          </div>

          <button 
            onClick={() => {
              if (pixData?.qrCode) {
                navigator.clipboard.writeText(pixData.qrCode);
                toast.success("Codigo Pix copiado!");
              }
            }}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Copy className="w-4 h-4" /> Copiar Codigo Pix
          </button>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 max-w-md mx-auto text-left">
          <p className="text-sm text-purple-900 font-medium mb-1">Apos o pagamento:</p>
          <p className="text-sm text-purple-700 mb-3">
            O link abaixo sera ativado automaticamente e voce podera enviar para seus convidados!
          </p>
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-purple-200">
            <input type="text" readOnly value={url} className="flex-1 bg-transparent text-sm text-gray-600 outline-none px-2" />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(url);
                toast.success("Link copiado!");
              }}
              className="p-2 hover:bg-purple-100 rounded-md text-purple-600 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <Link href="/" className="inline-block mt-8 text-gray-500 hover:text-purple-600 font-medium">
          Voltar para o inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 font-medium mb-8">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        {/* Header Steps */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crie seu Convite</h1>
          <p className="text-gray-500">Preencha as informacoes abaixo para gerar seu link exclusivo.</p>
          
          <div className="flex items-center gap-4 mt-6">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-purple-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`} />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8">
          {step < 3 ? (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
            </form>
          ) : (
            renderStep3()
          )}
        </div>
      </div>
    </div>
  );
}

export default function CriarConvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-600"/></div>}>
      <CriarConviteContent />
    </Suspense>
  );
}

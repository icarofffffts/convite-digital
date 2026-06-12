import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Convite } from "@/lib/types";

// Importacao dos temas
import { AniversarioTheme } from "@/components/themes/aniversario-theme";
import { CasamentoTheme } from "@/components/themes/casamento-theme";
import { ChaBebTheme } from "@/components/themes/cha-bebe-theme";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// Configura Metadata (SEO) dinamicamente para compartilhar bonito no WhatsApp
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("convites")
    .select("titulo_evento, nome_anfitriao")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Convite Nao Encontrado" };

  return {
    title: `Voce foi convidado(a)! | ${data.titulo_evento}`,
    description: `${data.nome_anfitriao} esta te convidando. Clique para ver os detalhes e confirmar presenca!`,
    openGraph: {
      title: `Convite Especial: ${data.titulo_evento}`,
      description: `Clique para ver os detalhes do evento de ${data.nome_anfitriao}.`,
    },
  };
}

export default async function ConvitePage({ params }: Props) {
  const slug = (await params).slug;
  const supabase = getSupabaseAdmin();

  // Buscar dados completos do convite
  const { data, error } = await supabase
    .from("convites")
    .select(`
      *,
      tema:temas(*)
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  const convite = data as Convite;

  // Se nao estiver pago e ativo, bloqueia
  if (!convite.ativo || convite.status_pagamento !== "pago") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm text-center shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Convite Inativo</h1>
          <p className="text-gray-500 text-sm">
            Este convite ainda nao foi liberado pelo anfitriao ou o pagamento esta pendente.
          </p>
        </div>
      </div>
    );
  }

  // Incrementar view via RPC (assincrono, nao bloqueia a renderizacao)
  supabase.rpc("incrementar_views", { convite_slug: slug }).then();

  // Renderizar o tema correto baseado no cadastro do banco
  const temaSlug = convite.tema?.slug;

  switch (temaSlug) {
    case "festa-tropical":
      return <AniversarioTheme convite={convite} />;
    case "romance-elegante":
      return <CasamentoTheme convite={convite} />;
    case "mundo-baby":
      return <ChaBebTheme convite={convite} />;
    default:
      // Fallback para o tema de aniversario caso o tema nao seja reconhecido
      return <AniversarioTheme convite={convite} />;
  }
}

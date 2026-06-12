import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { generateSlug } from "@/lib/utils";
import { PLANO_PRECOS } from "@/lib/types";

// POST /api/convites - Criar novo convite
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin();

    const {
      nome_anfitriao,
      titulo_evento,
      data_evento,
      local_nome,
      local_endereco,
      local_maps_url,
      mensagem,
      tema_slug,
      plano = "basico",
      email,
      nome_cliente,
      telefone,
    } = body;

    // Validações básicas
    if (!nome_anfitriao || !titulo_evento || !data_evento || !email || !nome_cliente) {
      return NextResponse.json(
        { error: "Campos obrigatorios: nome_anfitriao, titulo_evento, data_evento, email, nome_cliente" },
        { status: 400 }
      );
    }

    // Criar ou buscar cliente
    let cliente_id: string;
    const { data: existingCliente, error: findError } = await supabase
      .from("clientes")
      .select("id")
      .eq("email", email)
      .maybeSingle(); // maybeSingle evita erro se não encontrar nada

    if (existingCliente) {
      cliente_id = existingCliente.id;
    } else {
      const { data: newCliente, error: clienteError } = await supabase
        .from("clientes")
        .insert({ nome: nome_cliente, email, telefone })
        .select("id")
        .single();

      if (clienteError) {
        console.error("Erro ao criar cliente:", clienteError);
        throw clienteError;
      }
      cliente_id = newCliente.id;
    }

    // Gerar slug único
    const slug = generateSlug(8);
    const valor = PLANO_PRECOS[plano as keyof typeof PLANO_PRECOS] || 29;

    // Buscar o ID real do tema pelo slug
    let db_tema_id = null;
    if (tema_slug) {
      const { data: temaRow } = await supabase
        .from("temas")
        .select("id")
        .eq("slug", tema_slug)
        .single();
      
      if (temaRow) {
        db_tema_id = temaRow.id;
      }
    }

    // Criar convite
    const { data: convite, error } = await supabase
      .from("convites")
      .insert({
        slug,
        cliente_id,
        tema_id: db_tema_id,
        plano,
        nome_anfitriao,
        titulo_evento,
        data_evento,
        local_nome,
        local_endereco,
        local_maps_url,
        mensagem,
        valor_pago: valor,
        status_pagamento: "pendente",
        expira_em: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("*")
      .single();

    if (error) throw error;

    // Criar registro de pagamento
    await supabase.from("pagamentos").insert({
      convite_id: convite.id,
      metodo: "pix",
      valor,
      status: "pendente",
    });

    return NextResponse.json({
      success: true,
      convite: {
        id: convite.id,
        slug: convite.slug,
        valor,
        plano,
      },
    });
  } catch (error: any) {
    console.error("Erro detalhado ao criar convite:", error);
    // Extrai a mensagem real de erros do Supabase que não são instâncias de Error padrão
    const message = error?.message || error?.details || JSON.stringify(error) || "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/convites?slug=xxx - Buscar convite por slug
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug obrigatorio" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: convite, error } = await supabase
      .from("convites")
      .select(`
        *,
        tema:temas(*),
        rsvps:rsvp(*)
      `)
      .eq("slug", slug)
      .eq("ativo", true)
      .single();

    if (error || !convite) {
      return NextResponse.json({ error: "Convite nao encontrado" }, { status: 404 });
    }

    // Incrementar visualizações
    await supabase.rpc("incrementar_views", { convite_slug: slug });

    return NextResponse.json({ convite });
  } catch (error: unknown) {
    console.error("Erro ao buscar convite:", error);
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

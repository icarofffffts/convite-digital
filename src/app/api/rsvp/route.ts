import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// POST /api/rsvp - Confirmar presença
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { convite_slug, nome, telefone, acompanhantes = 0, status = "confirmado", mensagem } = body;

    if (!convite_slug || !nome) {
      return NextResponse.json(
        { error: "Campos obrigatorios: convite_slug, nome" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Buscar convite pelo slug
    const { data: convite, error: conviteError } = await supabase
      .from("convites")
      .select("id, plano")
      .eq("slug", convite_slug)
      .eq("ativo", true)
      .eq("status_pagamento", "pago")
      .single();

    if (conviteError || !convite) {
      return NextResponse.json({ error: "Convite nao encontrado ou inativo" }, { status: 404 });
    }

    // Verificar se o plano permite RSVP
    if (convite.plano === "basico") {
      return NextResponse.json(
        { error: "Este convite nao possui confirmacao de presenca" },
        { status: 403 }
      );
    }

    // Verificar se já confirmou (mesmo nome + telefone)
    if (telefone) {
      const { data: existing } = await supabase
        .from("rsvp")
        .select("id")
        .eq("convite_id", convite.id)
        .eq("telefone", telefone)
        .single();

      if (existing) {
        // Atualizar RSVP existente
        const { data: updated, error: updateError } = await supabase
          .from("rsvp")
          .update({ nome, acompanhantes, status, mensagem })
          .eq("id", existing.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return NextResponse.json({ success: true, rsvp: updated, updated: true });
      }
    }

    // Criar novo RSVP
    const { data: rsvp, error } = await supabase
      .from("rsvp")
      .insert({
        convite_id: convite.id,
        nome,
        telefone,
        acompanhantes,
        status,
        mensagem,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, rsvp });
  } catch (error: unknown) {
    console.error("Erro ao confirmar presenca:", error);
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/rsvp?convite_slug=xxx - Listar RSVPs de um convite
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const conviteSlug = searchParams.get("convite_slug");

    if (!conviteSlug) {
      return NextResponse.json({ error: "convite_slug obrigatorio" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: convite } = await supabase
      .from("convites")
      .select("id")
      .eq("slug", conviteSlug)
      .single();

    if (!convite) {
      return NextResponse.json({ error: "Convite nao encontrado" }, { status: 404 });
    }

    const { data: rsvps, error } = await supabase
      .from("rsvp")
      .select("*")
      .eq("convite_id", convite.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const stats = {
      total: rsvps?.length || 0,
      confirmados: rsvps?.filter((r) => r.status === "confirmado").length || 0,
      recusados: rsvps?.filter((r) => r.status === "recusado").length || 0,
      talvez: rsvps?.filter((r) => r.status === "talvez").length || 0,
      total_pessoas:
        (rsvps?.reduce(
          (acc, r) => acc + (r.status === "confirmado" ? 1 + r.acompanhantes : 0),
          0
        ) || 0),
    };

    return NextResponse.json({ rsvps, stats });
  } catch (error: unknown) {
    console.error("Erro ao listar RSVPs:", error);
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

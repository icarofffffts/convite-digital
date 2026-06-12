import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// POST /api/webhook - Webhook do Mercado Pago
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, data } = body;

    // Verificar se é notificação de pagamento
    if (action !== "payment.created" && action !== "payment.updated") {
      return NextResponse.json({ received: true });
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID missing" }, { status: 400 });
    }

    // Buscar dados do pagamento no Mercado Pago
    const mpToken = process.env.MP_ACCESS_TOKEN;
    if (!mpToken) {
      console.error("MP_ACCESS_TOKEN nao configurado");
      return NextResponse.json({ error: "Config error" }, { status: 500 });
    }

    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: { Authorization: `Bearer ${mpToken}` },
      }
    );

    if (!mpResponse.ok) {
      console.error("Erro ao consultar MP:", mpResponse.status);
      return NextResponse.json({ error: "MP error" }, { status: 500 });
    }

    const payment = await mpResponse.json();
    const externalRef = payment.external_reference; // slug do convite
    const status = payment.status; // approved, pending, rejected, etc.

    if (!externalRef) {
      return NextResponse.json({ received: true });
    }

    const supabase = getSupabaseAdmin();

    // Mapear status do MP para nosso status
    let statusPagamento: "pago" | "pendente" | "cancelado" = "pendente";
    if (status === "approved") statusPagamento = "pago";
    else if (status === "rejected" || status === "cancelled") statusPagamento = "cancelado";

    // Atualizar convite
    const updateData: Record<string, unknown> = {
      status_pagamento: statusPagamento,
      payment_id: String(paymentId),
      updated_at: new Date().toISOString(),
    };

    if (statusPagamento === "pago") {
      updateData.paid_at = new Date().toISOString();
    }

    await supabase
      .from("convites")
      .update(updateData)
      .eq("slug", externalRef);

    // Atualizar registro de pagamento
    await supabase
      .from("pagamentos")
      .update({
        status: statusPagamento,
        external_id: String(paymentId),
        gateway_response: payment,
        updated_at: new Date().toISOString(),
      })
      .eq("convite_id", (
        await supabase
          .from("convites")
          .select("id")
          .eq("slug", externalRef)
          .single()
      ).data?.id);

    console.log(`Pagamento ${paymentId} - Status: ${statusPagamento} - Convite: ${externalRef}`);

    return NextResponse.json({ success: true, status: statusPagamento });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

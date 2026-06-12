import { getSupabaseAdmin } from "@/lib/supabase";
import { Convite } from "@/lib/types";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { Users, Eye, CheckCircle2, Search, Settings } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Disable cache para admin

export default async function AdminDashboard() {
  const supabase = getSupabaseAdmin();

  // Buscar resumo
  const { data: convites } = await supabase
    .from("convites")
    .select(`
      id, slug, titulo_evento, nome_anfitriao, status_pagamento, valor_pago, created_at, visualizacoes, plano,
      rsvps:rsvp(id)
    `)
    .order("created_at", { ascending: false });

  const stats = {
    total: convites?.length || 0,
    pagos: convites?.filter(c => c.status_pagamento === "pago").length || 0,
    receita: convites?.filter(c => c.status_pagamento === "pago").reduce((acc, c) => acc + (Number(c.valor_pago) || 0), 0) || 0,
    views: convites?.reduce((acc, c) => acc + (c.visualizacoes || 0), 0) || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Gerenciamento de convites e receita</p>
          </div>
          <Link href="/" className="text-sm font-medium text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors">
            Ir para o site
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Convites", value: stats.total, icon: Users, color: "blue" },
            { label: "Convites Pagos", value: stats.pagos, icon: CheckCircle2, color: "green" },
            { label: "Receita (Pix)", value: formatCurrency(stats.receita), icon: Search, color: "purple" },
            { label: "Visualizacoes", value: stats.views, icon: Eye, color: "orange" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <div className={`w-10 h-10 rounded-full bg-${stat.color}-50 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Ultimos Convites Gerados</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-medium">Evento</th>
                  <th className="px-6 py-3 font-medium">Plano</th>
                  <th className="px-6 py-3 font-medium">Status Pag.</th>
                  <th className="px-6 py-3 font-medium">Data</th>
                  <th className="px-6 py-3 font-medium">Views / RSVP</th>
                  <th className="px-6 py-3 font-medium text-right">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {convites?.map((convite) => (
                  <tr key={convite.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{convite.titulo_evento}</p>
                      <p className="text-xs text-gray-500">por {convite.nome_anfitriao}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                        {convite.plano}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {convite.status_pagamento === "pago" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Pago
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Pendente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDateShort(convite.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-gray-500" title="Views">
                          <Eye className="w-3.5 h-3.5" /> {convite.visualizacoes}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500" title="RSVPs">
                          <Users className="w-3.5 h-3.5" /> {(convite.rsvps as any[])?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/convite/${convite.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Ver Convite"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Configuracoes">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  PartyPopper,
  Baby,
  Check,
  ArrowRight,
  MessageCircle,
  Star,
  Zap,
  Share2,
  Users,
} from "lucide-react";
import { PLANO_PRECOS, PLANO_FEATURES, type Plano } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const temas = [
  {
    slug: "festa-tropical",
    nome: "Festa Tropical",
    tipo: "Aniversario",
    emoji: "🎉",
    gradient: "from-orange-400 via-pink-500 to-purple-600",
    desc: "Cores vibrantes e confetes animados para festas inesqueciveis",
    icon: PartyPopper,
  },
  {
    slug: "romance-elegante",
    nome: "Romance Elegante",
    tipo: "Casamento",
    emoji: "💍",
    gradient: "from-rose-200 via-pink-100 to-amber-100",
    desc: "Sofisticacao em tons rose e dourado com petalas flutuantes",
    icon: Heart,
    dark: true,
  },
  {
    slug: "mundo-baby",
    nome: "Mundo Baby",
    tipo: "Cha de Bebe",
    emoji: "👶",
    gradient: "from-blue-200 via-pink-100 to-yellow-100",
    desc: "Delicado e fofo em tons pastel com estrelinhas e nuvens",
    icon: Baby,
    dark: true,
  },
];

const planos: Plano[] = ["basico", "premium", "luxo"];
const planoLabels: Record<Plano, string> = {
  basico: "Basico",
  premium: "Premium",
  luxo: "Luxo",
};
const planoEmoji: Record<Plano, string> = {
  basico: "⭐",
  premium: "🌟",
  luxo: "💎",
};

const depoimentos = [
  {
    nome: "Ana Paula",
    texto: "Amei o convite do aniversario da minha filha! Todo mundo elogiou.",
    estrelas: 5,
  },
  {
    nome: "Carlos e Mariana",
    texto: "Nosso convite de casamento ficou lindo, elegante e super pratico de enviar.",
    estrelas: 5,
  },
  {
    nome: "Fernanda",
    texto: "Usei para o cha de bebe e foi perfeito. A confirmacao de presenca ajudou demais!",
    estrelas: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ scale: [0.5, 1.5, 0.5], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Convites digitais que encantam</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Seu evento merece um
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                convite especial
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Crie convites digitais interativos com animacoes, contagem regressiva
              e confirmacao de presenca. Envie por WhatsApp em segundos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/criar"
                className="inline-flex items-center justify-center gap-2 bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-xl shadow-purple-900/20"
              >
                Criar meu convite
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#temas"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-2xl font-medium text-lg transition-colors"
              >
                Ver temas
              </a>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 md:gap-16 mt-14">
              {[
                { label: "Convites criados", value: "500+" },
                { label: "Eventos", value: "200+" },
                { label: "Presencas confirmadas", value: "2.000+" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 1440 60" fill="none">
          <path d="M0 60L1440 60V20C1200 50 960 0 720 20C480 40 240 10 0 30V60Z" fill="white" />
        </svg>
      </section>

      {/* Como funciona */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Como funciona
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Em apenas 3 passos voce tem um convite profissional pronto para enviar
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: Sparkles,
                title: "Escolha o tema",
                desc: "Selecione entre nossos temas exclusivos para cada tipo de evento",
              },
              {
                step: "2",
                icon: Zap,
                title: "Personalize",
                desc: "Preencha as informacoes do evento: data, local, mensagem e mais",
              },
              {
                step: "3",
                icon: Share2,
                title: "Compartilhe",
                desc: "Receba o link do convite e envie por WhatsApp, Instagram ou onde quiser",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-purple-600" />
                </div>
                <div className="inline-flex items-center justify-center w-7 h-7 bg-purple-600 text-white text-sm font-bold rounded-full mb-3">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Temas */}
      <section id="temas" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Nossos temas
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Cada tema e unico, com animacoes e design profissional
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {temas.map((tema, i) => (
              <motion.div
                key={tema.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link href={`/criar?tema=${tema.slug}`} className="block group">
                  <div className={`bg-gradient-to-br ${tema.gradient} rounded-3xl p-8 h-56 flex flex-col justify-end relative overflow-hidden transition-transform group-hover:scale-[1.02]`}>
                    <span className="text-5xl absolute top-6 right-6">{tema.emoji}</span>
                    <div>
                      <span className={`text-xs uppercase tracking-wider ${tema.dark ? "text-gray-600" : "text-white/80"}`}>
                        {tema.tipo}
                      </span>
                      <h3 className={`text-xl font-bold ${tema.dark ? "text-gray-800" : "text-white"}`}>
                        {tema.nome}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 px-1">{tema.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Novos temas adicionados toda semana
          </p>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Planos e precos
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Pagamento unico. Sem mensalidade. Seu convite fica ativo por 1 ano.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {planos.map((plano, i) => (
              <motion.div
                key={plano}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-3xl p-6 border-2 transition-shadow ${
                  plano === "premium"
                    ? "border-purple-500 shadow-xl shadow-purple-100 relative"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {plano === "premium" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Mais popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <span className="text-3xl">{planoEmoji[plano]}</span>
                  <h3 className="text-lg font-bold text-gray-800 mt-2">{planoLabels[plano]}</h3>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-gray-800">
                      {formatCurrency(PLANO_PRECOS[plano])}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">unico</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {PLANO_FEATURES[plano].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/criar?plano=${plano}`}
                  className={`block w-full text-center py-3 rounded-xl font-medium transition-colors ${
                    plano === "premium"
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Escolher {planoLabels[plano]}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-14">
            O que nossos clientes dizem
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {depoimentos.map((dep, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: dep.estrelas }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">&ldquo;{dep.texto}&rdquo;</p>
                <p className="text-sm font-medium text-gray-800">{dep.nome}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-10 md:p-14 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para criar seu convite?
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Em menos de 5 minutos voce tem um convite profissional pronto
              para enviar por WhatsApp.
            </p>
            <Link
              href="/criar"
              className="inline-flex items-center gap-2 bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
            >
              Criar agora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-800">Convite Digital</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="https://wa.me/5531999999999" className="hover:text-gray-700 flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              Contato
            </a>
            <a href="#planos" className="hover:text-gray-700">Precos</a>
            <a href="#temas" className="hover:text-gray-700">Temas</a>
          </div>
          <p className="text-xs text-gray-400">
            {new Date().getFullYear()} Convite Digital. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

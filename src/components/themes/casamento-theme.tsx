"use client";

import { motion } from "framer-motion";
import { Convite } from "@/lib/types";
import { Countdown } from "@/components/ui/countdown";
import { RsvpForm } from "@/components/ui/rsvp-form";
import { MapPin, Calendar, Heart, Share2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  convite: Convite;
}

export function CasamentoTheme({ convite }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 relative overflow-hidden">
      {/* Pétalas flutuantes */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, Math.sin(i) * 100],
              rotate: [0, 360],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear",
            }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-12">
        {/* Ornamento superior */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-4"
        >
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4" />
          <span className="text-5xl">💍</span>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Nomes do casal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-10"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-rose-400 mb-3">Convite de Casamento</p>
          <h1
            className="text-4xl md:text-5xl font-light text-gray-800 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {convite.titulo_evento}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-16 h-px bg-amber-300" />
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <div className="w-16 h-px bg-amber-300" />
          </div>
        </motion.div>

        {/* Card elegante */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl shadow-xl p-8 mb-8"
        >
          {/* Mensagem */}
          {convite.mensagem && (
            <div className="text-center mb-8">
              <p className="text-gray-600 italic leading-relaxed text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                &ldquo;{convite.mensagem}&rdquo;
              </p>
            </div>
          )}

          {/* Convite formal */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm mb-2">
              {convite.nome_anfitriao} tem a honra de convidar voce para a celebracao
            </p>
          </div>

          {/* Data */}
          <div className="bg-rose-50/50 rounded-xl p-6 mb-6 text-center">
            <Calendar className="w-6 h-6 text-rose-400 mx-auto mb-2" />
            <p className="text-lg font-medium text-gray-800">{formatDate(convite.data_evento)}</p>
          </div>

          {/* Local */}
          {convite.local_nome && (
            <div className="bg-rose-50/50 rounded-xl p-6 mb-6 text-center">
              <MapPin className="w-6 h-6 text-rose-400 mx-auto mb-2" />
              <p className="font-medium text-gray-800">{convite.local_nome}</p>
              {convite.local_endereco && (
                <p className="text-sm text-gray-500 mt-1">{convite.local_endereco}</p>
              )}
              {convite.local_maps_url && (
                <a
                  href={convite.local_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-rose-500 hover:text-rose-600 text-sm underline"
                >
                  Ver localizacao no mapa
                </a>
              )}
            </div>
          )}

          {/* Countdown */}
          <Countdown targetDate={convite.data_evento} colorClass="text-rose-500" />
        </motion.div>

        {/* RSVP */}
        {(convite.plano === "premium" || convite.plano === "luxo") && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl shadow-xl p-8 mb-8"
          >
            <div className="text-center mb-6">
              <Heart className="w-6 h-6 text-rose-400 mx-auto mb-2" />
              <h3 className="text-xl font-medium text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Confirme sua presenca
              </h3>
              <p className="text-gray-500 text-sm mt-1">Ficaremos felizes com sua presenca</p>
            </div>
            <RsvpForm conviteSlug={convite.slug} accentColor="rose" />
          </motion.div>
        )}

        {/* Compartilhar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: convite.titulo_evento,
                  text: `Voce esta convidado para ${convite.titulo_evento}!`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-500 border border-rose-200 px-6 py-3 rounded-full transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar convite
          </button>
        </motion.div>

        <p className="text-center text-gray-400 text-xs mt-10">
          Feito com <Heart className="w-3 h-3 inline text-rose-300" /> por Convite Digital
        </p>
      </div>
    </div>
  );
}

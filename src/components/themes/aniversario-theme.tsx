"use client";

import { motion } from "framer-motion";
import { Convite } from "@/lib/types";
import { Countdown } from "@/components/ui/countdown";
import { RsvpForm } from "@/components/ui/rsvp-form";
import { MapPin, Calendar, Clock, Heart, Share2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  convite: Convite;
}

export function AniversarioTheme({ convite }: Props) {
  const config = convite.tema?.config;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 relative overflow-hidden">
      {/* Confetti decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              backgroundColor: ["#FF6B35", "#F7C948", "#2D9CDB", "#FF4081", "#7C4DFF"][i % 5],
            }}
            animate={{
              y: ["0vh", "110vh"],
              rotate: [0, 360],
              opacity: [1, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-center mb-8"
        >
          <span className="text-7xl block mb-4">🎉</span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg"
            style={{ fontFamily: config?.fontFamily || "Poppins, sans-serif" }}
          >
            {convite.titulo_evento}
          </motion.h1>
        </motion.div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-6"
        >
          {/* Anfitrião */}
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm uppercase tracking-wider">Voce esta convidado(a) para</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">{convite.titulo_evento}</h2>
            <p className="text-orange-500 font-medium mt-1">por {convite.nome_anfitriao}</p>
          </div>

          {/* Mensagem */}
          {convite.mensagem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-orange-50 rounded-2xl p-4 mb-6 text-center"
            >
              <p className="text-gray-700 italic leading-relaxed">&ldquo;{convite.mensagem}&rdquo;</p>
            </motion.div>
          )}

          {/* Data e hora */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium">{formatDate(convite.data_evento)}</p>
              </div>
            </div>

            {convite.local_nome && (
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">{convite.local_nome}</p>
                  {convite.local_endereco && (
                    <p className="text-sm text-gray-500">{convite.local_endereco}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mapa */}
          {convite.local_maps_url && (
            <a
              href={convite.local_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-xl font-medium transition-colors mb-6"
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Ver no Google Maps
            </a>
          )}

          {/* Countdown */}
          <Countdown targetDate={convite.data_evento} colorClass="text-orange-500" />
        </motion.div>

        {/* RSVP */}
        {(convite.plano === "premium" || convite.plano === "luxo") && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-6"
          >
            <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
              Confirme sua presenca
            </h3>
            <RsvpForm conviteSlug={convite.slug} accentColor="orange" />
          </motion.div>
        )}

        {/* Compartilhar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: convite.titulo_evento,
                  text: `Voce foi convidado para ${convite.titulo_evento}!`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar convite
          </button>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-8">
          Feito com <Heart className="w-3 h-3 inline text-red-300" /> por Convite Digital
        </p>
      </div>
    </div>
  );
}

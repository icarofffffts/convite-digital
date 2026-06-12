"use client";

import { motion } from "framer-motion";
import { Convite } from "@/lib/types";
import { Countdown } from "@/components/ui/countdown";
import { RsvpForm } from "@/components/ui/rsvp-form";
import { MapPin, Calendar, Heart, Share2, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  convite: Convite;
}

export function ChaBebTheme({ convite }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-pink-50 to-yellow-50 relative overflow-hidden">
      {/* Estrelinhas flutuantes */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 180],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-200" />
          </motion.div>
        ))}
      </div>

      {/* Nuvens decorativas */}
      <div className="absolute inset-0 pointer-events-none">
        {[10, 30, 60, 80].map((left, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/40 rounded-full"
            style={{
              left: `${left}%`,
              top: `${5 + i * 8}%`,
              width: `${80 + i * 20}px`,
              height: `${30 + i * 5}px`,
            }}
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-10">
        {/* Header fofo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-center mb-8"
        >
          <span className="text-7xl block mb-3">👶</span>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-sm uppercase tracking-[0.2em] text-pink-400 mb-2">Cha de Bebe</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-gray-700"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              {convite.titulo_evento}
            </h1>
          </motion.div>
        </motion.div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-xl border-2 border-blue-100 p-6 md:p-8 mb-6"
        >
          {/* Quem convida */}
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm">
              {convite.nome_anfitriao} convida voce para celebrar a chegada do bebe!
            </p>
          </div>

          {/* Mensagem */}
          {convite.mensagem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-4 mb-6 text-center"
            >
              <p className="text-gray-600 italic">&ldquo;{convite.mensagem}&rdquo;</p>
            </motion.div>
          )}

          {/* Info do evento */}
          <div className="space-y-4 mb-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Quando</p>
                <p className="font-medium text-gray-700">{formatDate(convite.data_evento)}</p>
              </div>
            </motion.div>

            {convite.local_nome && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Onde</p>
                  <p className="font-medium text-gray-700">{convite.local_nome}</p>
                  {convite.local_endereco && (
                    <p className="text-sm text-gray-400">{convite.local_endereco}</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Mapa */}
          {convite.local_maps_url && (
            <a
              href={convite.local_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-blue-400 to-pink-400 hover:from-blue-500 hover:to-pink-500 text-white text-center py-3 rounded-2xl font-medium transition-all mb-6"
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Ver no Google Maps
            </a>
          )}

          {/* Countdown */}
          <Countdown targetDate={convite.data_evento} colorClass="text-blue-400" />
        </motion.div>

        {/* RSVP */}
        {(convite.plano === "premium" || convite.plano === "luxo") && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-xl border-2 border-pink-100 p-6 md:p-8 mb-6"
          >
            <div className="text-center mb-4">
              <span className="text-3xl">🍼</span>
              <h3 className="text-lg font-bold text-gray-700 mt-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                Confirme sua presenca
              </h3>
            </div>
            <RsvpForm conviteSlug={convite.slug} accentColor="blue" />
          </motion.div>
        )}

        {/* Compartilhar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
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
            className="inline-flex items-center gap-2 bg-white/60 hover:bg-white/80 text-gray-600 border border-blue-200 px-6 py-3 rounded-full transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar convite
          </button>
        </motion.div>

        <p className="text-center text-gray-400 text-xs mt-8">
          Feito com <Heart className="w-3 h-3 inline text-pink-300" /> por Convite Digital
        </p>
      </div>
    </div>
  );
}

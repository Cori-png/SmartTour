export default function AppBanner() {
  return (
    <div className="mx-12 mb-14 bg-green-700 rounded-2xl flex items-center justify-between px-9 py-7 gap-5 relative overflow-hidden">

      {/* Cercles décoratifs */}
      <div className="absolute right-[-60px] top-[-60px] w-[220px] h-[220px] rounded-full bg-white/[0.06]" aria-hidden="true" />
      <div className="absolute right-[60px] bottom-[-80px] w-[180px] h-[180px] rounded-full bg-white/[0.04]" aria-hidden="true" />

      {/* Texte */}
      <div className="relative z-10">
        <p className="text-lg font-extrabold text-white mb-1">
          Emportez votre voyage partout avec vous !
        </p>
        <p className="text-[13px] text-white/75">Téléchargez notre application mobile</p>
      </div>

      {/* Boutons stores */}
      <div className="flex gap-3 relative z-10">

        <a
          href="#"
          className="flex items-center gap-2.5 bg-black/22 border border-white/18 text-white rounded-xl px-4 py-2.5 hover:bg-black/35 transition-colors"
          aria-label="Télécharger sur Google Play"
        >
          <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.18 23.18c.28.16.6.16.88 0l9.5-5.5-2.5-2.5-7.88 8zM.5 1.39C.19 1.7 0 2.19 0 2.85v18.3c0 .66.19 1.15.5 1.46l.08.07 10.25-10.25v-.24L.58 1.32.5 1.39zm20.18 7.19L17.5 6.56l-2.65 2.65 2.65 2.65 3.2-1.87c.91-.53.91-1.39-.02-1.91zM3.18.82 13.06 6.44 10.58 8.92 3.18.82z" />
          </svg>
          <div>
            <p className="text-[9px] uppercase tracking-[0.5px] opacity-75">Disponible sur</p>
            <p className="text-[13px] font-bold">Google Play</p>
          </div>
        </a>

        <a
          href="#"
          className="flex items-center gap-2.5 bg-black/22 border border-white/18 text-white rounded-xl px-4 py-2.5 hover:bg-black/35 transition-colors"
          aria-label="Télécharger sur l'App Store"
        >
          <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <div>
            <p className="text-[9px] uppercase tracking-[0.5px] opacity-75">Télécharger dans</p>
            <p className="text-[13px] font-bold">l'App Store</p>
          </div>
        </a>

      </div>
    </div>
  );
}

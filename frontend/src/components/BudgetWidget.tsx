import { Wallet, Car, Tent, UtensilsCrossed, ChevronDown } from "lucide-react";

// ── Types ────────────────────────────────────────────────────
export type TransportMode = "voiture" | "taxi" | "moto" | "bus";
export type HebergementType = "aucun" | "camping" | "auberge" | "hotel" | "resort";

export type BudgetParams = {
  transport: TransportMode;
  hebergement: HebergementType;
  restauration: number;   // FCFA par jour
  nbJours: number;
};

type Props = {
  totalKm: number;
  totalEntree: number;
  params: BudgetParams;
  onChange: (params: BudgetParams) => void;
};

// ── Config tarifs ─────────────────────────────────────────────
const TRANSPORT_FCFA_KM: Record<TransportMode, number> = {
  voiture: 120,
  taxi: 180,
  moto: 80,
  bus: 50,
};

const TRANSPORT_LABELS: Record<TransportMode, { label: string; icon: string }> = {
  voiture: { label: "Voiture", icon: "🚗" },
  taxi: { label: "Taxi", icon: "🚕" },
  moto: { label: "Taxi-moto", icon: "🛵" },
  bus: { label: "Bus", icon: "🚌" },
};

const HEBERGEMENT_FCFA_NUIT: Record<HebergementType, number> = {
  aucun: 0,
  camping: 3000,
  auberge: 8000,
  hotel: 20000,
  resort: 45000,
};

const HEBERGEMENT_LABELS: Record<HebergementType, { label: string; icon: string }> = {
  aucun: { label: "Pas d'hébergement", icon: "🏠" },
  camping: { label: "Camping", icon: "⛺" },
  auberge: { label: "Auberge", icon: "🏡" },
  hotel: { label: "Hôtel standard", icon: "🏨" },
  resort: { label: "Resort / Luxe", icon: "🏩" },
};

// ── Helpers ───────────────────────────────────────────────────
export function computeBudget(totalKm: number, totalEntree: number, p: BudgetParams) {
  const transport = Math.round(totalKm * TRANSPORT_FCFA_KM[p.transport]);
  const hebergement = HEBERGEMENT_FCFA_NUIT[p.hebergement] * Math.max(0, p.nbJours - 1);
  const restauration = p.restauration * p.nbJours;
  const total = totalEntree + transport + hebergement + restauration;
  return { transport, hebergement, restauration, total };
}

// ── Barre de proportion ───────────────────────────────────────
function BudgetBar({
  items,
}: {
  items: { label: string; value: number; color: string }[];
}) {
  const total = items.reduce((s, i) => s + i.value, 0);
  if (total === 0) return null;

  return (
    <div className="space-y-2">
      {/* Barre empilée */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {items
          .filter((i) => i.value > 0)
          .map((item) => (
            <div
              key={item.label}
              className={`${item.color} transition-all duration-500`}
              style={{ width: `${(item.value / total) * 100}%` }}
            />
          ))}
      </div>
      {/* Légende */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-[11px] text-gray-500">
              {item.label} ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Select stylisé ────────────────────────────────────────────
function StyledSelect<T extends string>({
  value, onChange, options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 text-[12px] text-gray-700 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.icon} {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────
export default function BudgetWidget({ totalKm, totalEntree, params, onChange }: Props) {
  const budget = computeBudget(totalKm, totalEntree, params);

  function set<K extends keyof BudgetParams>(key: K, value: BudgetParams[K]) {
    onChange({ ...params, [key]: value });
  }

  const barItems = [
    { label: "Entrées", value: totalEntree, color: "bg-green-500" },
    { label: "Transport", value: budget.transport, color: "bg-blue-500" },
    { label: "Hébergement", value: budget.hebergement, color: "bg-purple-500" },
    { label: "Restauration", value: budget.restauration, color: "bg-orange-400" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <h3 className="text-[13px] font-bold text-gray-800 flex items-center gap-2">
        <Wallet className="w-4 h-4 text-green-600" />
        Budget estimé
      </h3>

      {/* Sélecteurs */}
      <div className="grid grid-cols-2 gap-3">
        {/* Transport */}
        <div>
          <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
            <Car className="w-3 h-3" /> Transport
          </label>
          <StyledSelect
            value={params.transport}
            onChange={(v) => set("transport", v)}
            options={(Object.keys(TRANSPORT_LABELS) as TransportMode[]).map((k) => ({
              value: k,
              label: TRANSPORT_LABELS[k].label,
              icon: TRANSPORT_LABELS[k].icon,
            }))}
          />
          <p className="text-[10px] text-gray-400 mt-1">
            {TRANSPORT_FCFA_KM[params.transport]} FCFA/km
          </p>
        </div>

        {/* Hébergement */}
        <div>
          <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
            <Tent className="w-3 h-3" /> Hébergement
          </label>
          <StyledSelect
            value={params.hebergement}
            onChange={(v) => set("hebergement", v)}
            options={(Object.keys(HEBERGEMENT_LABELS) as HebergementType[]).map((k) => ({
              value: k,
              label: HEBERGEMENT_LABELS[k].label,
              icon: HEBERGEMENT_LABELS[k].icon,
            }))}
          />
          <p className="text-[10px] text-gray-400 mt-1">
            {HEBERGEMENT_FCFA_NUIT[params.hebergement].toLocaleString("fr-FR")} FCFA/nuit
          </p>
        </div>
      </div>

      {/* Restauration / jour */}
      <div>
        <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
          <UtensilsCrossed className="w-3 h-3" /> Restauration / jour (FCFA)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={30000}
            step={1000}
            value={params.restauration}
            onChange={(e) => set("restauration", Number(e.target.value))}
            className="flex-1 accent-green-600"
          />
          <span className="text-[12px] font-bold text-gray-700 w-24 text-right flex-shrink-0">
            {params.restauration.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      </div>

      {/* Barre visuelle */}
      <BudgetBar items={barItems} />

      {/* Tableau détaillé */}
      <div className="space-y-2 border-t border-gray-100 pt-3">
        {[
          { label: "Entrées sites", value: totalEntree },
          { label: `Transport (~${totalKm} km)`, value: budget.transport },
          {
            label: `Hébergement (${Math.max(0, params.nbJours - 1)} nuit${params.nbJours > 2 ? "s" : ""})`,
            value: budget.hebergement
          },
          {
            label: `Restauration (${params.nbJours} jour${params.nbJours > 1 ? "s" : ""})`,
            value: budget.restauration
          },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-[12px]">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold text-gray-800">
              {value === 0 ? "—" : `${value.toLocaleString("fr-FR")} FCFA`}
            </span>
          </div>
        ))}
        <div className="flex justify-between text-[14px] font-extrabold border-t border-gray-200 pt-2.5 mt-1">
          <span className="text-gray-900">Total estimé</span>
          <span className="text-green-700">{budget.total.toLocaleString("fr-FR")} FCFA</span>
        </div>
      </div>
    </div>
  );
}

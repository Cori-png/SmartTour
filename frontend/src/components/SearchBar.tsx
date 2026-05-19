import { useState } from "react";
import { Search, MapPin, Clock, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SearchForm = {
  recherche:   string;
  destination: string;
  dureeMax:    string;
  budgetMax:   string;
};

export default function SearchBar() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SearchForm>({
    recherche: "", destination: "", dureeMax: "", budgetMax: "",
  });

  function handleChange(key: keyof SearchForm, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (form.recherche.trim())   params.set("q",         form.recherche.trim());
    if (form.destination.trim()) params.set("ville",     form.destination.trim());
    if (form.dureeMax.trim())    params.set("dureeMax",  form.dureeMax.trim());
    if (form.budgetMax.trim())   params.set("budgetMax", form.budgetMax.trim());
    navigate(`/explorer?${params.toString()}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  const FIELDS = [
    { key: "recherche"   as const, icon: <Search  className="w-3 h-3 text-green-600" />, label: "Site, ville ou tag…",  placeholder: "Ex : Ouidah, plage, vaudou…", type: "text"   },
    { key: "destination" as const, icon: <MapPin  className="w-3 h-3 text-green-600" />, label: "Ville ou région",       placeholder: "Ex : Cotonou, Abomey…",       type: "text"   },
    { key: "dureeMax"    as const, icon: <Clock   className="w-3 h-3 text-green-600" />, label: "Durée max (heures)",    placeholder: "Ex : 2, 4, 8…",               type: "number" },
    { key: "budgetMax"   as const, icon: <Wallet  className="w-3 h-3 text-green-600" />, label: "Budget max (FCFA)",     placeholder: "Ex : 5000",                   type: "number" },
  ];

  return (
    <div className="relative z-10 mx-4 sm:mx-8 md:mx-12 -mt-6 sm:-mt-8">
      <div className="bg-white rounded-2xl shadow-[0_6px_28px_rgba(0,0,0,0.13),0_1px_4px_rgba(0,0,0,0.06)]">

        {/* ── Mobile : 2×2 grid + bouton pleine largeur ── */}
        <div className="md:hidden">
          <div className="grid grid-cols-2">
            {FIELDS.map((field, i) => (
              <div
                key={field.key}
                className={`flex flex-col gap-1 px-4 py-3 ${
                  i < 2 ? "border-b" : ""
                } ${
                  i % 2 === 0 ? "border-r" : ""
                } border-gray-200`}
              >
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.6px] text-gray-400 select-none">
                  {field.icon}{field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={e => handleChange(field.key, e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={field.placeholder}
                  min={field.type === "number" ? 0 : undefined}
                  autoComplete="off"
                  className="text-[13px] text-gray-700 outline-none bg-transparent"
                />
              </div>
            ))}
          </div>
          <div className="px-3 py-2.5">
            <button
              onClick={handleSearch}
              className="w-full py-3 bg-green-700 text-white text-sm font-bold rounded-xl hover:bg-green-800 active:scale-95 transition-all"
            >
              Rechercher
            </button>
          </div>
        </div>

        {/* ── Desktop : flex row inline ── */}
        <div className="hidden md:flex items-stretch pr-2.5 py-2.5">
          {FIELDS.map((field, i) => (
            <div
              key={field.key}
              className={`flex flex-col gap-1 px-5 py-2.5 hover:bg-green-50/60 rounded-xl transition-colors flex-1 ${
                i < FIELDS.length - 1 ? "border-r border-gray-200" : ""
              }`}
            >
              <label className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.6px] text-gray-400 select-none whitespace-nowrap">
                {field.icon}{field.label}
              </label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={e => handleChange(field.key, e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={field.placeholder}
                min={field.type === "number" ? 0 : undefined}
                autoComplete="off"
                className="text-[13px] text-gray-700 outline-none bg-transparent w-full"
              />
            </div>
          ))}

          <button
            onClick={handleSearch}
            className="ml-2.5 flex-shrink-0 px-7 py-3.5 bg-green-700 text-white text-sm font-bold rounded-xl hover:bg-green-800 active:scale-95 transition-all whitespace-nowrap self-center"
          >
            Rechercher
          </button>
        </div>

      </div>
    </div>
  );
}

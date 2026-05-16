import { useState } from "react";
import { Search, MapPin, Calendar, Wallet } from "lucide-react";
import type { ReactNode } from "react";


type SearchForm = {
  activite: string;
  destination: string;
  sejour: string;
  budget: string;
};

type Field = {
  key: keyof SearchForm;
  icon: ReactNode;
  label: string;
  placeholder: string;
  border: boolean;
};


const FIELDS: Field[] = [
  {
    key: "activite",
    icon: <Search className="w-3 h-3 text-green-600" />,
    label: "Que souhaitez-vous faire ?",
    placeholder: "Ex : Visiter, se détendre, aventure...",
    border: true,
  },
  {
    key: "destination",
    icon: <MapPin className="w-3 h-3 text-green-600" />,
    label: "Où allez-vous ?",
    placeholder: "Ex : Ouidah, Abomey, Ganvié...",
    border: true,
  },
  {
    key: "sejour",
    icon: <Calendar className="w-3 h-3 text-green-600" />,
    label: "Durée du séjour",
    placeholder: "Ex: 3 jours",
    border: true,
  },
  {
    key: "budget",
    icon: <Wallet className="w-3 h-3 text-green-600" />,
    label: "Budget",
    placeholder: "Ex : 5000 FCFA",
    border: false,
  },
];

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────
export default function SearchBar() {
  const [form, setForm] = useState<SearchForm>({
    activite: "",
    destination: "",
    sejour: "",
    budget: "",
  });

   function handleChange(key: keyof SearchForm, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSearch() {
    // 🔁 À brancher sur la page Explorer avec les filtres en query params
    console.log("Recherche :", form);
  }

  return (
    <div className="relative z-10 mx-12 -mt-8">
      <div className="flex items-center bg-white rounded-2xl shadow-[0_6px_28px_rgba(0,0,0,0.13),0_1px_4px_rgba(0,0,0,0.06)] pr-2.5 py-2.5">

        {FIELDS.map((field) => (
          <div
            key={field.key}
            className={`flex-1 flex flex-col gap-1 px-5 py-2.5 cursor-pointer hover:bg-green-50/60 rounded-xl transition-colors ${
              field.border ? "border-r border-gray-200" : ""
            }`}
          >
            <label className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.6px] text-gray-400 cursor-pointer select-none">
              {field.icon}
              {field.label}
            </label>
            
            <input
              type={
                field.key === "budget"
                  ? "number"
                  : "text"
              }
              value={form[field.key]}
              onChange={(e) =>
                handleChange(
                  field.key,
                  e.target.value
                )
              }
              placeholder={field.placeholder}
              min={
                field.key === "budget"
                  ? 0
                  : undefined
              }
              className="text-[13px] text-gray-700 outline-none bg-transparent"
            />

          </div>
        ))}

        <button
          onClick={handleSearch}
          className="ml-2.5 px-7 py-3.5 bg-green-700 text-white text-sm font-bold rounded-xl hover:bg-green-800 active:scale-95 transition-all whitespace-nowrap"
        >
          Rechercher
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { EyeOff, ArrowLeft } from 'lucide-react';

interface CamouflageScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CamouflageScreen: React.FC<CamouflageScreenProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-white text-slate-800 p-8 sm:p-12 overflow-y-auto font-sans cursor-pointer animate-fade-in select-none"
      title="Қайта оралу үшін кез келген жерді басыңыз (Esc)"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Fake Study Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-600">
              10-СЫНЫП • ЖАЛПЫ БИОЛОГИЯ ЖӘНЕ ГЕНЕТИКА
            </span>
            <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">
              § 14. Жасушаның құрылысы мен зат алмасу биохимиясы
            </h1>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Дәптерді жабу (DEMEU AI-ға оралу)</span>
          </button>
        </div>

        {/* Fake Academic Note Content */}
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            <strong>Жасуша мембранасы</strong> (плазмалемма) — жасушаны сыртқы ортадан бөліп тұратын және зат алмасуды реттейтін қос қабатты фосфолипидті құрылым. Мембрананың негізгі қызметтері: тосқауылдық, тасымалдаушы, рецепторлық және жасушааралық байланыс.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 my-4 space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Негізгі органоидтар және олардың қызметі:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Митохондрия:</strong> Жасушаның «энергетикалық станциясы», АТФ (аденозинтрифосфат) синтезін жүзеге асырады.</li>
              <li><strong>Рибосомалар:</strong> РНҚ және белоктардан тұратын, нәруыз биосинтезінің негізгі орны.</li>
              <li><strong>Эндоплазмалық тор (ЭПТ):</strong> Түйіршікті (нәруыз синтезі) және тегіс (липидтер мен көмірсулар синтезі) болып бөлінеді.</li>
              <li><strong>Гольджи аппараты:</strong> Заттарды жинақтау, өзгерту және жасушадан тыс жерге тасымалдау қызметі.</li>
            </ul>
          </div>

          <p>
            <strong>Кребс циклі</strong> (үшкарбон қышқылдарының циклі) — барлық аэробты организмдердегі жасушалық тыныс алудың негізгі кезеңі. Ол митохондрия матриксінде жүреді және көмірсулар, майлар мен аминқышқылдарының тотығуының соңғы ортақ жолы болып табылады.
          </p>
        </div>

        {/* Bottom hint */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Оқулық: Биология 10-сынып (Қоғамдық-гуманитарлық бағыт)</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <EyeOff className="w-3.5 h-3.5" />
            Қауіпсіз камуфляж режимі белсенді (Басу арқылы жабу)
          </span>
        </div>

      </div>
    </div>
  );
};

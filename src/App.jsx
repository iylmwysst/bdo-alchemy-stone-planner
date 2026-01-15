import React, { useState, useMemo } from 'react';
import { Calculator, Database, Info, ShieldCheck, TrendingUp, History, AlertCircle, CheckCircle2, ArrowBigUp, Coins, Languages } from 'lucide-react';

// Fixed price per Brimming Essence of Aether
const STONE_PRICE = 100000000; // 100,000,000 Silver (100M)

// Base Upgrade data constants
const UPGRADE_BASE_DATA = [
  { id: 'imperfect', en: 'Imperfect', th: 'ไม่สมบูรณ์', rate: 1, cost: 0, pity: 0, avgClicks: 0, color: 'bg-gray-100 text-gray-800' },
  { id: 'sturdy', en: 'Sturdy', th: 'แข็งแกร่ง', rate: 0.55055, cost: 2, pity: 2, avgClicks: 1.65, color: 'bg-green-100 text-green-800' },
  { id: 'sharp', en: 'Sharp', th: 'แหลมคม', rate: 0.20064, cost: 3, pity: 5, avgClicks: 3.68, color: 'bg-blue-100 text-blue-800' },
  { id: 'resplendent', en: 'Resplendent', th: 'เจิดจรัส', rate: 0.033158, cost: 10, pity: 30, avgClicks: 19.56, color: 'bg-yellow-100 text-yellow-800' },
  { id: 'splendid', en: 'Splendid', th: 'งดงาม', rate: 0.012588, cost: 20, pity: 80, avgClicks: 50.97, color: 'bg-purple-100 text-purple-800' },
  { id: 'shining', en: 'Shining', th: 'เรืองแสง', rate: 0.004005, cost: 30, pity: 250, avgClicks: 158.5, color: 'bg-red-100 text-red-800' },
];

const translations = {
  th: {
    title: "ระบบวางแผนขัดเกลาหินแปรธาตุ",
    subtitle: "เครื่องคำนวณงบประมาณและทรัพยากร (ระบบทั่งตีเหล็กโบราณ)",
    tab_calc: "เครื่องคำนวณ",
    tab_data: "สถิติการขัดเกลา",
    input_stones: "จำนวนน้ำบริสุทธิ์แห่งฟากฟ้าอัดแน่นที่มี",
    input_level: "ระดับหินแปรธาตุปัจจุบัน",
    input_stack: "น้ำบริสุทธิ์อากริสสะสม (ทั่งโบราณ)",
    stack_note: "* ขั้นนี้ต้องการ {n} ครั้งเพื่อเปิดใช้งานทั่งตีเหล็กโบราณ (100%)",
    next_goal: "เป้าหมายการเลื่อนระดับ (คำนวณการันตี 100%)",
    goal_label: "เป้าหมาย",
    enough: "ทรัพยากรเพียงพอ",
    missing: "ขาดอีก",
    total_prep: "น้ำบริสุทธิ์ฯ ที่ต้องเตรียมรวม",
    max_price: "ราคาสูงสุดเฉพาะขั้นนี้",
    max_price_total: "ราคารวมการันตี (Silver)",
    not_reached: "คุณอยู่ที่ระดับสูงสุดแล้ว",
    tips_agris: "น้ำบริสุทธิ์อากริส: ระบบจะสะสมแต้มทุกครั้งที่ล้มเหลว เมื่อถึงขีดจำกัดจะสามารถใช้ 'ทั่งตีเหล็กโบราณ' เพื่อสำเร็จ 100%",
    tips_roadmap: "ระบบวางแผน: คำนวณยอดสะสมของน้ำบริสุทธิ์แห่งฟากฟ้าอัดแน่นที่ต้องใช้จนถึงระดับเป้าหมายโดยอิงจากระบบการันตี (ราคาหิน Fix ที่ 100M)",
    col_level: "ระดับการขัดเกลา",
    col_chance: "โอกาสสำเร็จ",
    col_cost: "น้ำบริสุทธิ์ฯ/ครั้ง",
    col_pity: "ขีดจำกัดอากริส",
    col_avg: "ค่าเฉลี่ยครั้งที่คาด",
    col_click: "ราคา/ครั้ง",
    unit_stones: "ชิ้น",
    pity_times: "ครั้ง",
  },
  en: {
    title: "Alchemy Stone Enhancement Planner",
    subtitle: "Budget & Resource Calculator (Ancient Anvil System)",
    tab_calc: "Calculator",
    tab_data: "Enhancement Stats",
    input_stones: "Brimming Essence of Aether owned",
    input_level: "Current Alchemy Stone Level",
    input_stack: "Agris Essence Stack (Ancient Anvil)",
    stack_note: "* This stage requires {n} attempts to trigger Ancient Anvil (100%)",
    next_goal: "Enhancement Milestones (100% Pity)",
    goal_label: "Goal",
    enough: "Sufficient Resources",
    missing: "Missing",
    total_prep: "Total Brimming Essence Required",
    max_price: "Max silver cost for this stage",
    max_price_total: "Total Pity Price (Silver)",
    not_reached: "You have reached the maximum level",
    tips_agris: "Agris Essence: Pity points accumulate on failure. Reaching the limit allows using the 'Ancient Anvil' for 100% success.",
    tips_roadmap: "Planner: Calculates cumulative 'Brimming Essence of Aether' needed to reach goals via pity (Fixed Price 100M/unit).",
    col_level: "Enhancement Level",
    col_chance: "Success Rate",
    col_cost: "Essence/Click",
    col_pity: "Agris Limit",
    col_avg: "Avg. Expected",
    col_click: "Price/Click",
    unit_stones: "Units",
    pity_times: "Attempts",
  }
};

const App = () => {
  const [lang, setLang] = useState('th');
  const [activeTab, setActiveTab] = useState('calculator');
  const [skyStones, setSkyStones] = useState('');
  const [startLevel, setStartLevel] = useState(0);
  const [currentAttempts, setCurrentAttempts] = useState('');

  const t = (key) => translations[lang][key] || key;

  // Compute actual data based on the FIXED stone price (100M)
  const upgradeData = useMemo(() => {
    return UPGRADE_BASE_DATA.map(item => ({
      ...item,
      clickCost: item.cost * STONE_PRICE
    }));
  }, []);

  const getLevelName = (item) => {
    if (lang === 'th') {
      return `${item.en} (${item.th})`;
    }
    return item.en;
  };

  const formatNumber = (num) => num.toLocaleString();

  const handleLevelChange = (index) => {
    setStartLevel(index);
    setCurrentAttempts('');
  };

  const roadmapData = useMemo(() => {
    let results = [];
    let cumulativePityStones = 0;
    const numSkyStones = parseInt(skyStones) || 0;
    const numCurrentAttempts = parseInt(currentAttempts) || 0;

    for (let i = startLevel + 1; i < upgradeData.length; i++) {
      const level = upgradeData[i];
      const isNextLevel = (i === startLevel + 1);
      const attemptsDone = isNextLevel ? numCurrentAttempts : 0;
      const remainingPity = Math.max(0, level.pity - attemptsDone);

      cumulativePityStones += remainingPity * level.cost;

      results.push({
        ...level,
        totalNeeded: cumulativePityStones,
        missing: Math.max(0, cumulativePityStones - numSkyStones),
        progress: Math.min(100, (numSkyStones / cumulativePityStones) * 100)
      });
    }
    return results;
  }, [skyStones, startLevel, currentAttempts, upgradeData]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto relative">

        {/* Language Toggle Button */}
        <div className="absolute top-0 right-0 z-10">
          <button
            onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all text-sm font-bold text-indigo-600"
          >
            <Languages size={18} />
            {lang === 'th' ? 'English Mode' : 'ภาษาไทย'}
          </button>
        </div>

        {/* Header */}
        <header className="mb-8 text-center pt-10 md:pt-0">
          <h2 className="text-indigo-600 font-bold tracking-widest text-xs mb-2 uppercase">Black Desert Enhancement Tool</h2>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('title')}</h1>
          <p className="text-slate-500">{t('subtitle')}</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
                activeTab === 'calculator' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Calculator size={18} />
              <span>{t('tab_calc')}</span>
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
                activeTab === 'table' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Database size={18} />
              <span>{t('tab_data')}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {activeTab === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-bottom border-slate-200">
                  <tr>
                    <th className="p-4 font-semibold text-slate-700">{t('col_level')}</th>
                    <th className="p-4 font-semibold text-slate-700 text-center">{t('col_chance')}</th>
                    <th className="p-4 font-semibold text-slate-700 text-center">{t('col_cost')}</th>
                    <th className="p-4 font-semibold text-slate-700 text-center">{t('col_pity')}</th>
                    <th className="p-4 font-semibold text-slate-700 text-center">{t('col_avg')}</th>
                    <th className="p-4 font-semibold text-slate-700 text-right">{t('col_click')}</th>
                    <th className="p-4 font-semibold text-indigo-700 text-right bg-indigo-50/30">{t('max_price_total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {upgradeData.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold">{getLevelName(item)}</td>
                      <td className="p-4 text-center">{item.cost > 0 ? `${(item.rate * 100).toFixed(4)}%` : '-'}</td>
                      <td className="p-4 text-center font-mono">{item.cost > 0 ? item.cost : '-'}</td>
                      <td className="p-4 text-center font-semibold text-indigo-600">{item.pity > 0 ? `${item.pity} ${t('pity_times')}` : '-'}</td>
                      <td className="p-4 text-center font-mono text-green-600">{item.avgClicks > 0 ? `${item.avgClicks} ${t('pity_times')}` : '-'}</td>
                      <td className="p-4 text-right font-mono text-xs">
                        {item.clickCost > 0 ? formatNumber(item.clickCost) : '-'}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-indigo-700 bg-indigo-50/10">
                        {item.pity > 0 ? formatNumber(item.clickCost * item.pity) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500">
                <Info size={14} />
                <span>{t('tips_agris')}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                {/* Input Section */}
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-inner">
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">
                      {t('input_stones')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={skyStones}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || value === '-') {
                            setSkyStones('');
                          } else {
                            const parsed = parseInt(value);
                            if (!isNaN(parsed) && parsed >= 0) {
                              setSkyStones(value);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === '' || e.target.value === '-') {
                            setSkyStones('0');
                          }
                        }}
                        placeholder="0"
                        className="w-full pl-4 pr-16 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-xl font-mono shadow-sm bg-white"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{t('unit_stones')}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-medium italic">
                      <Coins size={12} />
                      <span>Fixed Price: 100,000,000 Silver per unit</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t('input_level')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {upgradeData.map((item, index) => (
                        <button
                          key={item.id}
                          onClick={() => handleLevelChange(index)}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                            startLevel === index
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                              : 'border-slate-100 bg-white hover:border-slate-200'
                          }`}
                        >
                          <span className="font-bold text-[10px] sm:text-[11px] text-left leading-tight">
                            {getLevelName(item)}
                          </span>
                          {startLevel === index && <ShieldCheck size={14} className="flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Show Stack input only if NOT Imperfect and there is a next level to pity into */}
                  {startLevel < upgradeData.length - 1 && (
                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2 shadow-sm">
                      <label className="block text-sm font-bold text-indigo-900 mb-2">
                        {t('input_stack')}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={currentAttempts}
                          max={upgradeData[startLevel + 1].pity}
                          onChange={(e) => {
                            const value = e.target.value;
                            const maxValue = upgradeData[startLevel + 1].pity;
                            if (value === '' || value === '-') {
                              setCurrentAttempts('');
                            } else {
                              const parsed = parseInt(value);
                              if (!isNaN(parsed) && parsed >= 0 && parsed <= maxValue) {
                                setCurrentAttempts(value);
                              }
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === '' || e.target.value === '-') {
                              setCurrentAttempts('0');
                            }
                          }}
                          placeholder="0"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-white bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-xl font-mono shadow-sm"
                        />
                        <History className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                      </div>
                      <p className="text-[10px] text-indigo-600 mt-2 font-medium">
                        {t('stack_note').replace('{n}', upgradeData[startLevel + 1].pity)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Analysis/Summary Section */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 overflow-y-auto max-h-[600px] flex flex-col shadow-inner">
                  <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold uppercase tracking-wider text-xs">
                    <TrendingUp size={16} />
                    <span>{t('next_goal')}</span>
                  </div>

                  <div className="space-y-4 flex-grow">
                    {roadmapData.length > 0 ? (
                      roadmapData.map((item) => (
                        <div key={item.id} className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{t('goal_label')}</span>
                              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                <ArrowBigUp size={14} className="text-green-500 group-hover:translate-y--1 transition-transform" />
                                {getLevelName(item)}
                              </h3>
                            </div>
                            <div className="text-right">
                              {item.missing <= 0 ? (
                                <div className="flex items-center gap-1 text-green-600 font-bold text-[10px] bg-green-50 px-2 py-1 rounded-md">
                                  <CheckCircle2 size={12} /> {t('enough')}
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-500 font-bold text-[10px] bg-red-50 px-2 py-1 rounded-md">
                                  <AlertCircle size={12} /> {t('missing')} {item.missing.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between text-[10px] mb-1 font-medium">
                            <span className="text-slate-500">{t('total_prep')}: <span className="font-bold text-slate-700">{item.totalNeeded.toLocaleString()}</span></span>
                            <span className="font-mono font-bold text-indigo-600">{item.progress.toFixed(1)}%</span>
                          </div>

                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 shadow-inner">
                            <div
                              className={`h-full transition-all duration-1000 ease-out shadow-sm ${
                                item.progress >= 100 ? 'bg-green-500' : 'bg-indigo-500'
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <div className="mt-2 flex items-center gap-1 text-[9px] text-slate-400">
                             <Coins size={10} />
                             <span>{t('max_price')}: {formatNumber(item.clickCost * item.pity)} Silver</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <ShieldCheck size={48} className="mb-2 opacity-10" />
                        <p className="text-sm font-medium">{t('not_reached')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-8">
                 <div className="p-4 rounded-xl bg-indigo-50 text-indigo-800 text-sm flex gap-3 border border-indigo-100 shadow-sm transition-all hover:bg-indigo-100">
                    <Info className="flex-shrink-0 text-indigo-500" size={18} />
                    <p>{t('tips_agris')}</p>
                 </div>
                 <div className="p-4 rounded-xl bg-slate-100 text-slate-700 text-sm flex gap-3 border border-slate-200 shadow-sm transition-all hover:bg-slate-200">
                    <History className="flex-shrink-0 text-slate-500" size={18} />
                    <p>{t('tips_roadmap')}</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

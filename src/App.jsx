import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, TrendingUp, Search, Briefcase, Clock, 
  Settings, Plus, Download, Upload, Trash2, Activity,
  ArrowRightLeft, AlertCircle, RefreshCw, ChevronDown, Check, X,
  Info
} from 'lucide-react';

// =========================================================================
// 🚀 CONFIGURATION: CLOUDFLARE WORKER URL
// =========================================================================
const CLOUDFLARE_WORKER_URL = "https://paper-trade-proxy.guptanehal-aaa.workers.dev"; 
// =========================================================================

// --- DATA: Comprehensive Nifty 500 Symbols ---
const NIFTY_SYMBOLS = [
  "360ONE", "3MINDIA", "ABB", "ACC", "ACMESOLAR", "AIAENG", "APLAPOLLO", "AUBANK", "AWL", "AADHARHFC",
  "AARTIIND", "AAVAS", "ABBOTINDIA", "ACE", "ADANIENSOL", "ADANIENT", "ADANIGREEN", "ADANIPORTS", "ADANIPOWER", "ATGL",
  "ABCAPITAL", "ABFRL", "AEGISCHEM", "AETHER", "AFFLE", "AJANTPHARM", "APLLTD", "ALKEM", "ALKYLAMINE", "ALLCARGO",
  "ALOKINDS", "AMAREJABAT", "AMBER", "AMBUJACEM", "ANANDRATHI", "ANGELONE", "ANURAS", "APARINDS", "APOLLOHOSP", "APOLLOTYRE",
  "APTUS", "ACI", "ASAHIINDIA", "ASHOKLEY", "ASIANPAINT", "ASTERDM", "ASTRAL", "ATUL", "AUROPHARMA", "AVANTIFEED",
  "DMART", "AXISBANK", "BEML", "BLS", "BSE", "BAJAJ-AUTO", "BAJFINANCE", "BAJAJFINSV", "BAJAJHLDNG", "BALAMINES",
  "BALKRISIND", "BALRAMCHIN", "BANDHANBNK", "BANKBARODA", "BANKINDIA", "MAHABANK", "BATAINDIA", "BAYERCROP", "BERGEPAINT", "BDL",
  "BEL", "BHARATFORG", "BHEL", "BPCL", "BHARTIARTL", "BIOCON", "BIPABHARMA", "BIRLACORPN", "BSOFT", "BLUEDART",
  "BLUESTARCO", "BOMBAYBURM", "BOSCHLTD", "BRIGADE", "BRITANNIA", "MAPMYINDIA", "CCL", "CESC", "CGPOWER", "CAMS",
  "CANFINHOME", "CANBK", "CGCL", "CARBORUNIV", "CASTROLIND", "CEATLTD", "CENTRALBK", "CDSL", "CENTURYPLY", "CENTURYTEX",
  "CERA", "CHALET", "CHAMBLFERT", "CHEMPLASTS", "CHENGTC", "CHOLAFIN", "CHOLAHLDNG", "CIPLA", "CUB", "CLEAN",
  "COALINDIA", "COCHINSHIP", "COFORGE", "COLPAL", "COMPINFO", "CONCOR", "COROMANDEL", "CRAFTSMAN", "CREDITACC", "CROMPTON",
  "CUMMINSIND", "CYIENT", "DCMSHRIRAM", "DLF", "DABUR", "DALBHARAT", "DATAPATTNS", "DEEPAKFERT", "DEEPAKNTR", "DELHIVERY",
  "DELTACORP", "DEVYANI", "DIVISLAB", "DIXON", "LALPATHLAB", "DRREDDY", "EIDPARRY", "EIHOTEL", "EPL", "EASEMYTRIP",
  "EICHERMOT", "ELECON", "ELGIEQUIP", "EMAMILTD", "ENDURANCE", "ENGINERSIN", "ENIL", "EQUITASBNK", "ERIS", "ESCORTS",
  "EXIDEIND", "FDC", "NYKAA", "FEDERALBNK", "FACT", "FINEORG", "FINCABLES", "FINPIPE", "FSL", "FORTIS",
  "GRINFRA", "GAIL", "GMMPFAUDLR", "GMRINFRA", "GALAXYSURF", "GARFIBRES", "GICRE", "GILLETTE", "GLAND", "GLAXO",
  "GLENMARK", "MEDPLUS", "GLOBALVECT", "GODFRYPHLP", "GODREJAGRO", "GODREJCP", "GODREJIND", "GODREJPROP", "STARHEALTH", "GRANULES",
  "GRAPHITE", "GRASIM", "GESHIP", "GRINDWELL", "GUJGASLTD", "GNFC", "GPPL", "GSFC", "GSPL", "HEG",
  "HCLTECH", "HDFCAMC", "HDFCBANK", "HDFCLIFE", "HFCL", "HAL", "HINDALCO", "HINDCOPPER", "HINDPETRO", "HINDUNILVR",
  "HINDZINC", "HITACHIQIE", "HONAUT", "HUDCO", "ICICIBANK", "ICICIGI", "ICICIPRULI", "ISEC", "IDBI", "IDFCFIRSTB",
  "IDFC", "IFBIND", "IIFL", "IL&FSTRANS", "IRB", "IRCON", "ITC", "ITI", "INDIACEM", "IBULHSGFIN",
  "IBREALEST", "INDIAMART", "INDIANB", "IEX", "INDHOTEL", "IOC", "IOB", "IRCTC", "IRFC", "INDIGOPNTS",
  "ICIL", "INDOCO", "IGL", "INDUSINDBK", "NAUKRI", "INFY", "INGERRAND", "INOXWIND", "INTELLECT", "INDIGO",
  "IPCALAB", "JBCHEPHARM", "JKCEMENT", "JKLAKSHMI", "JKPAPER", "JKTYRE", "J&KBANK", "JMFINANCIL", "JSWENERGY", "JSWSTEEL",
  "JAGRAN", "JAICORPLTD", "JINDALSAW", "JSL", "JINDALSTEL", "JIOFIN", "JUBLFOOD", "JUBLINGREA", "JUBLPHARMA", "JUSTDIAL",
  "KPRMILL", "KEI", "KNRCON", "KPITTECH", "KRBL", "KSB", "KAJARIACER", "KALYANKJIL", "KANSAINER", "KARURVYSYA",
  "KAYNES", "KEC", "KOTAKBANK", "KIMS", "L&TFH", "LTTS", "LICHSGFIN", "LTIM", "LT", "LAOPALA",
  "LAURUSLABS", "LICI", "LINDEINDIA", "LUPIN", "LUXIND", "MMTC", "MRF", "MTARTECH", "MACROTECH", "MGL",
  "M&MFIN", "M&M", "MAHSEAMLES", "MAHLOG", "MANAPPURAM", "MARICO", "MARUTI", "MASTEK", "MFSL", "MAXHEALTH",
  "MAZDOCK", "MEDANTA", "METROBRAND", "METROPOLIS", "MINDACORP", "MINDAIND", "MOTILALOFS", "MPHASIS", "MCX", "MUTHOOTFIN",
  "NATCOPHARM", "NHPC", "NLCINDIA", "NMDC", "NOCIL", "NTPC", "NH", "NATIONALUM", "NAVINFLUOR", "NAZARA",
  "NESTLEIND", "NETWORK18", "NILKAMAL", "NIPPONLIFE", "NUVOCO", "OBEROIRLTY", "ONGC", "OIL", "OLECTRA", "PAYTM",
  "OFSS", "ORIENTELEC", "PIIND", "PNB", "PVRINOX", "PAGEIND", "PATANJALI", "PERSISTENT", "PETRONET", "PFIZER",
  "PHOENIXLTD", "PIDILITIND", "PEL", "PPLPHARMA", "POLYMED", "POLYCAB", "POONAWALLA", "PFC", "POWERGRID", "PRAJIND",
  "PRESTIGE", "PRINCEPIPE", "PRSMJOHNSN", "PRIVISCL", "PGHL", "PGHH", "PNBHOUSING", "QUESS", "RRKABEL", "RBLBANK",
  "RECLTD", "RHIM", "RITES", "RADICO", "RVNL", "RAILTEL", "RAIN", "RAJESHEXPO", "RALLIS", "RCF",
  "RATNAMANI", "RAYMOND", "REDINGTON", "RELAXO", "RELIANCE", "RBA", "ROSSARI", "ROUTE", "SBICARD", "SBILIFE",
  "SBIN", "SKFINDIA", "SRF", "SJVN", "SANOFI", "SAPPHIRE", "SAREGAMA", "SCHAEFFLER", "SHARDACROP", "SHOPERSTOP",
  "SHREECEM", "SHRIRAMFIN", "SHYAMMETL", "SIEMENS", "SIS", "SOBHA", "SOLARINDS", "SONACOMS", "SONATSOFTW", "SOUTHBANK",
  "STAR", "SAIL", "SWSOLAR", "STLTECH", "STARCEMENT", "SUMICHEM", "SUNPHARMA", "SUNTV", "SUNDARMFIN", "SUNDRMFAST",
  "SUNTECK", "SUPRAJIT", "SUPREMEIND", "SUVENPHAR", "SUZLON", "SWANENERGY", "SYMPHONY", "SYNGENE", "TCIEXP", "TCNSBRANDS",
  "TTKPRESTIG", "TV18BRDCST", "TVSMOTOR", "TANLA", "TATACHEM", "TATACOMM", "TCS", "TATACONSUM", "TATAELXSI", "TATAINVEST",
  "TATAMOTORS", "TATAPOWER", "TATASTEEL", "TTML", "TEAMLEASE", "TECHM", "TEJASNET", "NIACL", "RAMCOCEM", "THERMAX",
  "TIMKEN", "TITAN", "TORNTPHARM", "TORNTPOWER", "TRENT", "TRIDENT", "TRIVENI", "TRITURBINE", "TIINDIA", "UCOBANK",
  "UNOMINDA", "UPL", "UTIAMC", "UJJIVANSFB", "ULTRACEMCO", "UNIONBANK", "UBL", "MCDOWELL-N", "VGUARD", "VMART",
  "VIPIND", "VAIBHAVGBL", "VAKRANGEE", "VALIANTORG", "VTL", "VARROC", "VBL", "VEDL", "VENKEYS", "VIJAYA",
  "VINATIORGA", "IDEA", "VOLTAS", "WELCORP", "WELSPUNIND", "WESTLIFE", "WHIRLPOOL", "WIPRO", "WOCKPHARMA", "YESBANK",
  "ZFCVINDIA", "ZEEL", "ZENSARTECH", "ZOMATO", "ZYDUSLIFE", "ZYDUSWELL", "WAAREEENER", "WELSPUNLIV", "VAML", "VOGL",
  "VMM", "IREDA", "LODHA", "HEROMOTOCO"
];

const UNIQUE_NIFTY_SYMBOLS = Array.from(new Set(NIFTY_SYMBOLS));
const NIFTY_STOCKS = UNIQUE_NIFTY_SYMBOLS.map(symbol => ({ 
  symbol, 
  name: `${symbol} - Nifty 500 Constituent` 
}));

// --- LOCAL CACHE TO PREVENT RATE LIMITING ---
const PRICE_CACHE = {}; 
const CACHE_DURATION_MS = 15 * 1000; // 15-second strict caching

const fetchStockPrice = async (symbol) => {
  // 1. In-Memory 15-second Cache
  if (PRICE_CACHE[symbol] && (Date.now() - PRICE_CACHE[symbol].timestamp < CACHE_DURATION_MS)) {
    return PRICE_CACHE[symbol].price;
  }

  const saveToCache = (price) => {
    if (price && !isNaN(price)) {
      PRICE_CACHE[symbol] = { price, timestamp: Date.now() };
      return price;
    }
    return null;
  };

  // 2. Fetch using Cloudflare Worker (Best, Zero-CORS, direct to Groww/Yahoo)
  if (CLOUDFLARE_WORKER_URL) {
    try {
      const res = await fetch(`${CLOUDFLARE_WORKER_URL}?symbol=${symbol}`);
      if (res.ok) {
        const data = await res.json();
        if (data.price) return saveToCache(parseFloat(data.price));
      }
    } catch (e) {
      console.warn("Cloudflare Worker fetch failed. Check URL or Worker status.", e);
    }
  }

  // 3. Fallback to public proxies (Only used if Worker URL is empty or fails)
  try {
    const backupUrl = `https://api.allorigins.win/get?disableCache=true&url=${encodeURIComponent(`https://groww.in/v1/api/stocks_data/v1/tr_live_prices/exchange/NSE/segment/CASH/${symbol}/latest`)}`;
    const res = await fetch(backupUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.contents) {
        const parsed = JSON.parse(data.contents);
        if (parsed.ltp) return saveToCache(parseFloat(parsed.ltp));
      }
    }
  } catch (e) { /* ignore fallback error */ }
  
  console.error(`All data fetches failed for ${symbol}.`);
  return null; 
};

// Mutual Funds Fetcher (MFAPI is completely open and doesn't require CORS proxies)
const searchMutualFunds = async (query) => {
  if (!query || query.length < 3) return [];
  try {
    const response = await fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.slice(0, 15).map(mf => ({ symbol: mf.schemeCode.toString(), name: mf.schemeName, type: 'mf' }));
  } catch (error) { return []; }
};

const fetchMFPrice = async (schemeCode) => {
  if (PRICE_CACHE[schemeCode] && (Date.now() - PRICE_CACHE[schemeCode].timestamp < CACHE_DURATION_MS)) {
    return PRICE_CACHE[schemeCode].price;
  }
  try {
    const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}/latest`);
    const data = await response.json();
    const price = parseFloat(data.data[0].nav);
    PRICE_CACHE[schemeCode] = { price, timestamp: Date.now() };
    return price;
  } catch (error) { return null; }
};

// --- MAIN COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // App Data (Multi-Portfolio Architecture)
  const [userProfile, setUserProfile] = useState({ name: '' });
  const [appData, setAppData] = useState({
    activePortfolioId: '',
    portfolios: []
  });
  
  const [livePrices, setLivePrices] = useState({});
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);

  // UI State for Modals
  const [toast, setToast] = useState(null); 
  const [confirmDialog, setConfirmDialog] = useState(null); 
  const [createPortfolioModal, setCreatePortfolioModal] = useState(false);
  const [fundsModal, setFundsModal] = useState(null); 

  // Derived Active Portfolio
  const activePortfolio = appData.portfolios.find(p => p.id === appData.activePortfolioId) || null;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateActivePortfolio = (updates) => {
    setAppData(prev => ({
      ...prev,
      portfolios: prev.portfolios.map(p => 
        p.id === prev.activePortfolioId ? { ...p, ...updates } : p
      )
    }));
  };

  // Initialization & Migration
  useEffect(() => {
    const loadData = async () => {
      const savedProfile = localStorage.getItem('pt_user');
      const savedData = localStorage.getItem('pt_v3_data');
      
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));
      
      if (savedData) {
        setAppData(JSON.parse(savedData));
      } else {
        const oldProfile = localStorage.getItem('pt_profile');
        if (oldProfile) {
          const profile = JSON.parse(oldProfile);
          setUserProfile({ name: profile.name });
          const wallet = JSON.parse(localStorage.getItem('pt_wallet') || '100000');
          const holdings = JSON.parse(localStorage.getItem('pt_holdings') || '[]');
          const orders = JSON.parse(localStorage.getItem('pt_orders') || '[]');
          const sips = JSON.parse(localStorage.getItem('pt_sips') || '[]');

          setAppData({
            activePortfolioId: 'pf-migrated',
            portfolios: [{
              id: 'pf-migrated', name: `Imported PF`, wallet, holdings, orders, sips, realizedPnl: 0
            }]
          });
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Save State
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('pt_user', JSON.stringify(userProfile));
      localStorage.setItem('pt_v3_data', JSON.stringify(appData));
    }
  }, [userProfile, appData, loading]);

  // SIP Catchup Engine
  useEffect(() => {
    if (!activePortfolio) return;
    
    const runSipCatchup = async () => {
      const currentSips = activePortfolio.sips;
      if (!currentSips || currentSips.length === 0) return;
      
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentDate = today.getDate();
      const currentYear = today.getFullYear();
      
      let updatedWallet = activePortfolio.wallet;
      let updatedHoldings = [...activePortfolio.holdings];
      let newOrders = [];
      let sipsUpdated = false;
      let updatedSips = [...currentSips];

      for (let i = 0; i < updatedSips.length; i++) {
        const sip = updatedSips[i];
        if (sip.lastProcessedMonth !== `${currentYear}-${currentMonth}` && currentDate >= sip.dateOfMonth) {
            let price = sip.type === 'mf' ? await fetchMFPrice(sip.symbol) : await fetchStockPrice(sip.symbol);
            if (!price) continue; 

            if (updatedWallet >= sip.amount) {
              const qty = sip.amount / price;
              updatedWallet -= sip.amount;
              
              const existingIdx = updatedHoldings.findIndex(h => h.symbol === sip.symbol);
              if (existingIdx >= 0) {
                const h = updatedHoldings[existingIdx];
                const totalCost = (h.qty * h.avgPrice) + sip.amount;
                updatedHoldings[existingIdx] = { ...h, qty: h.qty + qty, avgPrice: totalCost / (h.qty + qty) };
              } else {
                updatedHoldings.push({ symbol: sip.symbol, name: sip.name, type: sip.type, qty, avgPrice: price });
              }

              newOrders.push({
                id: Date.now() + Math.random(), date: new Date().toISOString(), symbol: sip.symbol, name: sip.name,
                type: sip.type, action: 'SIP BUY', qty: qty, price: price, total: sip.amount
              });

              updatedSips[i].lastProcessedMonth = `${currentYear}-${currentMonth}`;
              sipsUpdated = true;
            }
        }
      }

      if (sipsUpdated) {
        updateActivePortfolio({
          wallet: updatedWallet,
          holdings: updatedHoldings,
          sips: updatedSips,
          orders: [...newOrders, ...activePortfolio.orders]
        });
        showToast("Scheduled SIPs executed automatically.", "success");
      }
    };

    runSipCatchup();
  }, [appData.activePortfolioId]);

  // Refresh Prices with 15-second polling approach
  useEffect(() => {
    if (!activePortfolio) return;
    
    let isMounted = true;
    const refreshPortfolioPrices = async () => {
      const newPrices = { ...livePrices };
      let changed = false;
      for (const h of activePortfolio.holdings) {
        const p = h.type === 'mf' ? await fetchMFPrice(h.symbol) : await fetchStockPrice(h.symbol);
        if (p && newPrices[h.symbol] !== p) {
          newPrices[h.symbol] = p;
          changed = true;
        }
      }
      if (changed && isMounted) setLivePrices(newPrices);
    };

    if (activeTab === 'dashboard') {
      refreshPortfolioPrices();
      const interval = setInterval(refreshPortfolioPrices, 15000); // 15s poll
      return () => { isMounted = false; clearInterval(interval); };
    }
  }, [activeTab, activePortfolio?.holdings]);

  const formatMoney = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount || 0);

  // --- MODALS & OVERLAYS ---

  const Toast = () => {
    if (!toast) return null;
    return (
      <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 shadow-2xl border ${toast.type === 'error' ? 'bg-red-950 border-red-900 text-red-100' : 'bg-green-950 border-green-900 text-green-100'}`}>
        {toast.type === 'error' ? <AlertCircle size={20} className="text-red-500" /> : <Check size={20} className="text-green-500" />}
        <span className="text-sm font-medium tracking-wide">{toast.message}</span>
      </div>
    );
  };

  const ConfirmModal = () => {
    if (!confirmDialog) return null;
    return (
      <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
        <div className="bg-zinc-950 border border-zinc-800 p-6 max-w-sm w-full">
          <h3 className="text-lg font-medium text-white mb-2">Confirmation Required</h3>
          <p className="text-sm text-zinc-400 mb-6">{confirmDialog.message}</p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmDialog(null)} className="flex-1 py-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800">Cancel</button>
            <button 
              onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }} 
              className="flex-1 py-2 text-xs uppercase tracking-widest text-white bg-red-600 hover:bg-red-700"
            >Confirm</button>
          </div>
        </div>
      </div>
    );
  };

  const CreatePortfolioModal = () => {
    if (!createPortfolioModal) return null;
    const [name, setName] = useState('');
    const [cap, setCap] = useState(100000);

    const handleCreate = () => {
      if (!name) return showToast("Please enter a portfolio name", "error");
      const newId = 'pf-' + Date.now();
      setAppData(prev => ({
        activePortfolioId: newId,
        portfolios: [...prev.portfolios, {
          id: newId, name, wallet: Number(cap), holdings: [], orders: [], sips: [], realizedPnl: 0
        }]
      }));
      showToast(`Portfolio "${name}" created.`);
      setCreatePortfolioModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
        <div className="bg-zinc-950 border border-zinc-800 p-6 max-w-sm w-full">
          <h3 className="text-lg font-medium text-white mb-4">Create New Portfolio</h3>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Portfolio Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Core Tech" className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-white text-sm outline-none focus:border-zinc-500"/>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Starting Capital (₹)</label>
              <input type="number" value={cap} onChange={e => setCap(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-white text-sm outline-none focus:border-zinc-500"/>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setCreatePortfolioModal(false)} className="flex-1 py-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800">Cancel</button>
            <button onClick={handleCreate} className="flex-1 py-2 text-xs uppercase tracking-widest text-zinc-900 bg-zinc-100 hover:bg-white">Create</button>
          </div>
        </div>
      </div>
    );
  };

  const FundsModal = () => {
    if (!fundsModal) return null;
    const [amt, setAmt] = useState('');
    const isAdd = fundsModal === 'add';

    const handleSubmit = () => {
      const val = Number(amt);
      if (!val || val <= 0) return showToast("Enter a valid amount", "error");
      
      if (!isAdd && val > activePortfolio.wallet) {
        return showToast("Insufficient funds to withdraw", "error");
      }

      updateActivePortfolio({ wallet: isAdd ? activePortfolio.wallet + val : activePortfolio.wallet - val });
      showToast(`Successfully ${isAdd ? 'added' : 'withdrawn'} ${formatMoney(val)}`);
      setFundsModal(null);
    };

    return (
      <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
        <div className="bg-zinc-950 border border-zinc-800 p-6 max-w-sm w-full">
          <h3 className="text-lg font-medium text-white mb-4">{isAdd ? 'Inject Virtual Funds' : 'Withdraw Funds'}</h3>
          <div className="mb-6">
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Amount (₹)</label>
            <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="0.00" className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-white text-sm outline-none focus:border-zinc-500"/>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setFundsModal(null)} className="flex-1 py-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 py-2 text-xs uppercase tracking-widest text-zinc-900 bg-zinc-100 hover:bg-white">Confirm</button>
          </div>
        </div>
      </div>
    );
  };

  // --- INITIAL LOGIN ROUTING ---
  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm">Loading workspace...</div>;

  if (!userProfile.name) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-zinc-300 font-sans">
        <div className="max-w-sm w-full bg-zinc-900 p-8 border border-zinc-800 text-center">
          <Activity size={32} className="text-zinc-500 mx-auto mb-4"/>
          <h1 className="text-xl font-medium text-zinc-100 mb-2">PaperTrade Terminal</h1>
          <p className="text-xs text-zinc-500 mb-8 uppercase tracking-widest">Identify Yourself</p>
          <input 
            type="text" id="loginName"
            className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-center text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm mb-4"
            placeholder="Enter your name"
          />
          <button 
            onClick={() => { 
              const name = document.getElementById('loginName').value;
              if (name.trim()) setUserProfile({ name });
              else showToast("Please enter a name", "error");
            }}
            className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-medium py-3 px-4 transition-colors text-xs uppercase tracking-widest"
          >
            Access Terminal
          </button>
        </div>
        <Toast />
      </div>
    );
  }

  if (appData.portfolios.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-zinc-300 font-sans">
        <div className="max-w-sm w-full bg-zinc-900 p-8 border border-zinc-800">
          <h1 className="text-lg font-medium text-zinc-100 mb-6 border-b border-zinc-800 pb-4">Welcome, {userProfile.name}. <br/><span className="text-sm text-zinc-500 font-normal">Create your first portfolio.</span></h1>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Portfolio Name</label>
              <input type="text" id="setupName" className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm" placeholder="e.g. Portfolio 1" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Starting Capital (₹)</label>
              <input type="number" id="setupCap" defaultValue={100000} className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm" />
            </div>
            <button 
              onClick={() => { 
                const name = document.getElementById('setupName').value || 'Portfolio 1';
                const cap = Number(document.getElementById('setupCap').value) || 100000;
                const newId = 'pf-' + Date.now();
                setAppData({
                  activePortfolioId: newId,
                  portfolios: [{ id: newId, name: name, wallet: cap, holdings: [], orders: [], sips: [], realizedPnl: 0 }]
                });
              }}
              className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-medium py-3 px-4 transition-colors text-xs uppercase tracking-widest mt-4"
            >
              Initialize Portfolio
            </button>
          </div>
        </div>
        <Toast />
      </div>
    );
  }

  // --- MAIN APP VIEWS ---

  const Topbar = () => (
    <div className="bg-zinc-950 border-b border-zinc-900 px-6 py-3 sticky top-0 z-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left: Brand & Portfolio Switcher */}
        <div className="flex items-center gap-4 w-full md:w-auto relative">
          <div className="flex items-center gap-2 text-zinc-100">
            <Activity size={18} className="text-zinc-500"/>
            <span className="font-medium text-sm tracking-wide hidden sm:block">PAPERTRADE</span>
          </div>
          
          <div className="h-4 w-px bg-zinc-800 hidden sm:block"></div>

          {/* Portfolio Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setPortfolioDropdownOpen(!portfolioDropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800"
            >
              <Briefcase size={14} className="text-zinc-500" />
              {activePortfolio.name}
              <ChevronDown size={14} className="text-zinc-500" />
            </button>
            
            {portfolioDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-md shadow-2xl z-50 overflow-hidden">
                <div className="flex justify-between items-center px-3 py-2 border-b border-zinc-800">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">Portfolios</span>
                  <button onClick={() => { setPortfolioDropdownOpen(false); setCreatePortfolioModal(true); }} className="text-zinc-400 hover:text-white" title="New Portfolio">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {appData.portfolios.map(pf => (
                    <button 
                      key={pf.id}
                      onClick={() => {
                        setAppData(prev => ({ ...prev, activePortfolioId: pf.id }));
                        setPortfolioDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between ${pf.id === activePortfolio.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                    >
                      <span className="truncate">{pf.name}</span>
                      {pf.id === activePortfolio.id && <Check size={14} className="text-green-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Navigation Tabs */}
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto hide-scrollbar text-xs font-medium uppercase tracking-widest text-zinc-500">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'market', label: 'Market' },
            { id: 'funds', label: 'Funds' },
            { id: 'ledger', label: 'Ledger' },
            { id: 'settings', label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-zinc-300 text-zinc-100' : 'border-transparent hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const Dashboard = () => {
    // Math Calculations
    const investedValue = activePortfolio.holdings.reduce((total, h) => total + (h.qty * h.avgPrice), 0);
    const currentValue = activePortfolio.holdings.reduce((total, h) => total + (h.qty * (livePrices[h.symbol] || h.avgPrice)), 0);
    const unrealizedPnl = currentValue - investedValue;
    const unrealizedPercent = investedValue > 0 ? (unrealizedPnl / investedValue) * 100 : 0;
    
    // Total Net Worth = Cash + Value of holdings
    const netWorth = activePortfolio.wallet + currentValue;

    return (
      <div className="p-6 max-w-5xl mx-auto space-y-8 font-sans">
        
        {/* Top Header: Net Worth & P&L */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-8 gap-6">
           <div>
             <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-2">Total Net Worth</div>
             <div className="text-5xl font-light text-zinc-100 tracking-tight">
               {formatMoney(netWorth)}
             </div>
           </div>
           
           <div className="flex gap-8">
             <div className="text-left md:text-right">
               <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-1 flex items-center md:justify-end gap-1"><Info size={12}/> Realized P&L (Saved)</div>
               <div className={`text-xl font-medium ${activePortfolio.realizedPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                 {activePortfolio.realizedPnl >= 0 ? '+' : ''}{formatMoney(activePortfolio.realizedPnl)}
               </div>
             </div>
             <div className="text-left md:text-right">
               <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-1">Unrealized P&L (Live)</div>
               <div className={`text-xl font-medium flex items-center md:justify-end gap-2 ${unrealizedPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                 <span>{unrealizedPnl >= 0 ? '+' : ''}{formatMoney(unrealizedPnl)}</span>
                 <span className={`text-xs px-1.5 py-0.5 ${unrealizedPnl >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                   {unrealizedPnl >= 0 ? '+' : ''}{unrealizedPercent.toFixed(2)}%
                 </span>
               </div>
             </div>
           </div>
        </div>

        {/* Current Holdings Table */}
        <div>
          <h2 className="text-xs uppercase tracking-widest font-medium text-zinc-500 mb-4">Current Holdings</h2>
          {activePortfolio.holdings.length === 0 ? (
            <div className="py-12 text-zinc-600 text-sm text-center border border-dashed border-zinc-800">No open positions.</div>
          ) : (
            <div className="border border-zinc-800 divide-y divide-zinc-800 bg-zinc-950">
              {activePortfolio.holdings.map((h, i) => {
                const currentPrice = livePrices[h.symbol] || h.avgPrice;
                const invested = h.qty * h.avgPrice;
                const currentVal = h.qty * currentPrice;
                const pnl = currentVal - invested;
                return (
                  <div key={i} className="p-4 hover:bg-zinc-900 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-100 text-sm">{h.symbol}</span>
                        <span className="text-[9px] uppercase border border-zinc-700 text-zinc-500 px-1">{h.type}</span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-1 font-mono">{h.qty.toFixed(4)} Units @ {formatMoney(h.avgPrice)}</div>
                    </div>
                    <div className="flex items-center gap-8 text-right font-mono text-sm">
                      <div className="hidden sm:block">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Invested</div>
                        <div className="text-zinc-300">{formatMoney(invested)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Current</div>
                        <div className="text-zinc-100">{formatMoney(currentVal)}</div>
                      </div>
                      <div className={`w-20 ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pnl >= 0 ? '+' : ''}{((pnl / invested) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const Market = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [marketType, setMarketType] = useState('stocks');
    const [mfResults, setMfResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);

    const stockResults = useMemo(() => {
      if (!searchQuery) return NIFTY_STOCKS.slice(0, 20);
      return NIFTY_STOCKS.filter(s => 
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 50); 
    }, [searchQuery]);

    useEffect(() => {
      if (marketType === 'mf' && searchQuery.length >= 3) {
        setIsSearching(true);
        const timer = setTimeout(() => {
          searchMutualFunds(searchQuery).then(res => { setMfResults(res); setIsSearching(false); });
        }, 500);
        return () => clearTimeout(timer);
      } else { setMfResults([]); }
    }, [searchQuery, marketType]);

    const handleAssetClick = async (asset) => {
      setSelectedAsset({ ...asset, loading: true });
      const price = marketType === 'mf' ? await fetchMFPrice(asset.symbol) : await fetchStockPrice(asset.symbol);
      if(price === null) showToast(`Failed to fetch live price for ${asset.symbol}`, "error");
      setSelectedAsset({ ...asset, price, loading: false });
    };

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex gap-6 mb-6 border-b border-zinc-900 pb-2">
          <button 
            className={`text-xs font-medium uppercase tracking-widest transition-colors ${marketType === 'stocks' ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-400'}`}
            onClick={() => { setMarketType('stocks'); setSearchQuery(''); }}
          >
            Equities (NSE)
          </button>
          <button 
            className={`text-xs font-medium uppercase tracking-widest transition-colors ${marketType === 'mf' ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-400'}`}
            onClick={() => { setMarketType('mf'); setSearchQuery(''); }}
          >
            Mutual Funds
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-zinc-600" size={16} />
          <input 
            type="text"
            placeholder={marketType === 'stocks' ? "Search 500+ Nifty equities..." : "Search Mutual Funds..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 pl-10 pr-4 py-2.5 text-zinc-100 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>

        <div className="border border-zinc-800 divide-y divide-zinc-800">
          {marketType === 'stocks' && stockResults.map(stock => (
            <div key={stock.symbol} onClick={() => handleAssetClick({...stock, type: 'stock'})} className="p-4 bg-zinc-950 hover:bg-zinc-900 cursor-pointer flex justify-between items-center transition-colors group">
              <div>
                <div className="text-zinc-100 font-medium text-sm">{stock.symbol}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{stock.name}</div>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-600 group-hover:text-zinc-300 transition-colors border border-zinc-800 px-2 py-1">Trade</div>
            </div>
          ))}

          {marketType === 'mf' && isSearching && <div className="p-8 text-zinc-500 text-xs text-center uppercase tracking-widest">Searching API...</div>}
          
          {marketType === 'mf' && !isSearching && mfResults.map(mf => (
            <div key={mf.symbol} onClick={() => handleAssetClick(mf)} className="p-4 bg-zinc-950 hover:bg-zinc-900 cursor-pointer flex justify-between items-center transition-colors group">
              <div className="pr-4">
                <div className="text-zinc-100 font-medium text-sm line-clamp-1">{mf.name}</div>
                <div className="text-xs text-zinc-500 mt-0.5 font-mono">{mf.symbol}</div>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-600 group-hover:text-zinc-300 transition-colors border border-zinc-800 px-2 py-1">Trade</div>
            </div>
          ))}
        </div>

        {selectedAsset && <TradeModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />}
      </div>
    );
  };

  const TradeModal = ({ asset, onClose }) => {
    const [action, setAction] = useState('buy');
    const [amount, setAmount] = useState('');
    const [qty, setQty] = useState('');
    const [sipDate, setSipDate] = useState('5');

    const holding = activePortfolio.holdings.find(h => h.symbol === asset.symbol);
    const maxSellQty = holding ? holding.qty : 0;

    const handleExecute = () => {
      if (asset.loading || !asset.price) return;
      const numAmount = Number(amount);
      const numQty = Number(qty);
      
      let newWallet = activePortfolio.wallet;
      let newHoldings = [...activePortfolio.holdings];
      let newOrders = [...activePortfolio.orders];
      let newRealizedPnl = activePortfolio.realizedPnl || 0;
      let newSips = [...activePortfolio.sips];

      if (action === 'buy') {
        let totalCost, finalQty;
        if (asset.type === 'mf') {
          if (!numAmount || numAmount <= 0) return showToast("Enter valid amount", "error");
          if (numAmount > newWallet) return showToast("Insufficient cash in Funds.", "error");
          totalCost = numAmount; finalQty = numAmount / asset.price;
        } else {
          if (!numQty || numQty <= 0) return showToast("Enter valid quantity", "error");
          totalCost = numQty * asset.price; finalQty = numQty;
          if (totalCost > newWallet) return showToast("Insufficient cash in Funds.", "error");
        }

        newWallet -= totalCost;
        const existingIdx = newHoldings.findIndex(h => h.symbol === asset.symbol);
        if (existingIdx >= 0) {
          const h = newHoldings[existingIdx];
          newHoldings[existingIdx] = { ...h, qty: h.qty + finalQty, avgPrice: ((h.qty * h.avgPrice) + totalCost) / (h.qty + finalQty) };
        } else {
          newHoldings.push({ symbol: asset.symbol, name: asset.name, type: asset.type, qty: finalQty, avgPrice: asset.price });
        }
        newOrders.unshift({ id: Date.now(), date: new Date().toISOString(), symbol: asset.symbol, type: asset.type, action: 'BUY', qty: finalQty, price: asset.price, total: totalCost });
        showToast(`Successfully bought ${asset.symbol}`);

      } else if (action === 'sell') {
        let sellQty, totalProceeds;
        if (asset.type === 'mf') {
           if (!numAmount || numAmount <= 0) return showToast("Enter valid amount", "error");
           sellQty = numAmount / asset.price;
           if (sellQty > maxSellQty) return showToast("Insufficient holdings", "error");
           totalProceeds = numAmount;
        } else {
           if (!numQty || numQty <= 0) return showToast("Enter valid quantity", "error");
           if (numQty > maxSellQty) return showToast("Insufficient holdings", "error");
           sellQty = numQty; totalProceeds = numQty * asset.price;
        }

        const existingIdx = newHoldings.findIndex(h => h.symbol === asset.symbol);
        const h = newHoldings[existingIdx];
        
        // --- REALIZED P&L ACCOUNTING ---
        const buyValue = sellQty * h.avgPrice;
        const profitLossOnTrade = totalProceeds - buyValue;
        newRealizedPnl += profitLossOnTrade;
        // -------------------------------

        newWallet += totalProceeds;
        
        if (h.qty - sellQty <= 0.0001) newHoldings.splice(existingIdx, 1);
        else newHoldings[existingIdx] = { ...h, qty: h.qty - sellQty };
        
        newOrders.unshift({ id: Date.now(), date: new Date().toISOString(), symbol: asset.symbol, type: asset.type, action: 'SELL', qty: sellQty, price: asset.price, total: totalProceeds, pnl: profitLossOnTrade });
        showToast(`Successfully sold ${asset.symbol}`);

      } else if (action === 'sip') {
        if (!numAmount || numAmount <= 0) return showToast("Enter valid amount", "error");
        newSips.push({ id: Date.now(), symbol: asset.symbol, name: asset.name, type: asset.type, amount: numAmount, dateOfMonth: Number(sipDate), lastProcessedMonth: 'none' });
        showToast(`SIP registered for ${asset.symbol}`);
      }

      updateActivePortfolio({ wallet: newWallet, holdings: newHoldings, orders: newOrders, sips: newSips, realizedPnl: newRealizedPnl });
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
        <div className="bg-zinc-950 w-full max-w-md border border-zinc-800 shadow-2xl flex flex-col">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg text-zinc-100">{asset.symbol}</h3>
              <p className="text-zinc-500 text-xs mt-1 line-clamp-1">{asset.name}</p>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-100 transition-colors"><X size={20} /></button>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-zinc-800">
              <span className="text-zinc-500 text-xs uppercase tracking-widest">Market Price</span>
              {asset.loading ? (
                <span className="text-zinc-400 text-sm">Fetching...</span>
              ) : asset.price === null ? (
                <span className="text-red-500 text-sm">Unavailable</span>
              ) : (
                <span className="text-2xl font-light text-zinc-100">{formatMoney(asset.price)}</span>
              )}
            </div>

            <div className="flex gap-2 mb-6">
              {['buy', 'sell', 'sip'].map(a => (
                <button 
                  key={a} onClick={() => setAction(a)}
                  className={`flex-1 py-2 text-xs uppercase tracking-widest font-medium transition-colors border ${
                    action === a 
                      ? (a === 'sell' ? 'bg-red-900/20 border-red-900 text-red-500' : 'bg-zinc-100 border-zinc-100 text-zinc-900') 
                      : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {action !== 'sip' && (
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500">
                  <span>FUNDS: <span className="text-zinc-300 font-mono">{formatMoney(activePortfolio.wallet)}</span></span>
                  {holding && <span>POS: <span className="text-zinc-300 font-mono">{holding.qty.toFixed(2)}</span></span>}
                </div>
              )}

              {asset.type === 'stock' && action !== 'sip' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Quantity</label>
                  <input 
                    type="number" value={qty} onChange={e => setQty(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm"
                    placeholder="0" disabled={!asset.price}
                  />
                  {qty && asset.price && <div className="text-xs text-zinc-500 mt-2 text-right">Trade Value: {formatMoney(Number(qty) * asset.price)}</div>}
                </div>
              )}

              {(asset.type === 'mf' || action === 'sip') && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Amount (₹)</label>
                  <input 
                    type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm"
                    placeholder="0.00" disabled={!asset.price && action !== 'sip'}
                  />
                  {amount && asset.price && action !== 'sip' && <div className="text-xs text-zinc-500 mt-2 text-right">Est. Units: {(Number(amount) / asset.price).toFixed(4)}</div>}
                </div>
              )}

              {action === 'sip' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Day of Month (1-28)</label>
                  <input 
                    type="number" min="1" max="28" value={sipDate} onChange={e => setSipDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-950">
            <button 
              onClick={handleExecute}
              disabled={asset.loading || (!asset.price && action !== 'sip')}
              className={`w-full py-3 text-xs uppercase tracking-widest font-medium transition-colors ${
                asset.loading || (!asset.price && action !== 'sip') ? 'opacity-50 cursor-not-allowed bg-zinc-900 text-zinc-600' 
                : action === 'sell' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-zinc-100 hover:bg-white text-zinc-900'
              }`}
            >
              Execute {action}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Funds = () => {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
         <h2 className="text-xs uppercase tracking-widest font-medium text-zinc-500 mb-4">Cash Management</h2>
         <div className="bg-zinc-950 border border-zinc-800 p-8 flex flex-col items-center justify-center text-center">
            <Wallet size={32} className="text-zinc-600 mb-4" />
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Available Funds for Trading</div>
            <div className="text-5xl font-light text-zinc-100 mb-10 tracking-tight">{formatMoney(activePortfolio.wallet)}</div>
            
            <div className="flex gap-4 w-full max-w-sm">
               <button 
                 onClick={() => setFundsModal('add')}
                 className="flex-1 bg-zinc-100 hover:bg-white text-zinc-900 font-medium py-3 text-[10px] uppercase tracking-widest transition-colors"
               >
                 Add Funds
               </button>
               <button 
                 onClick={() => setFundsModal('withdraw')}
                 className="flex-1 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-medium py-3 text-[10px] uppercase tracking-widest transition-colors"
               >
                 Withdraw
               </button>
            </div>
         </div>
      </div>
    );
  };

  const Ledger = () => (
    <div className="p-6 max-w-4xl mx-auto space-y-12">
      <section>
        <h2 className="text-xs uppercase tracking-widest font-medium text-zinc-500 mb-4 flex items-center gap-2"><Clock size={14}/> Active SIPs / Automations</h2>
        {activePortfolio.sips.length === 0 ? (
          <div className="py-8 text-zinc-600 text-sm text-center border border-dashed border-zinc-800">No active plans.</div>
        ) : (
          <div className="border border-zinc-800 divide-y divide-zinc-800 bg-zinc-950">
            {activePortfolio.sips.map(s => (
              <div key={s.id} className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-zinc-100 text-sm">{s.symbol}</div>
                  <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">Execute Day: {s.dateOfMonth}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-zinc-100 font-mono text-sm">{formatMoney(s.amount)}/mo</div>
                  <button onClick={() => {
                    setConfirmDialog({
                      message: `Cancel monthly SIP for ${s.symbol}?`,
                      onConfirm: () => {
                        updateActivePortfolio({ sips: activePortfolio.sips.filter(x => x.id !== s.id) });
                        showToast(`SIP for ${s.symbol} cancelled.`);
                      }
                    });
                  }} className="text-red-500 text-[9px] border border-red-900/50 px-2 py-1 uppercase tracking-widest hover:bg-red-950 transition-colors">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest font-medium text-zinc-500 mb-4 flex items-center gap-2"><ArrowRightLeft size={14}/> Execution Log</h2>
        {activePortfolio.orders.length === 0 ? (
          <div className="py-8 text-zinc-600 text-sm text-center border border-dashed border-zinc-800">No execution history.</div>
        ) : (
          <div className="border border-zinc-800 divide-y divide-zinc-800 bg-zinc-950 font-mono text-sm">
            {activePortfolio.orders.map(o => (
              <div key={o.id} className="p-4 flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] uppercase w-16 px-1 py-0.5 text-center border ${o.action.includes('BUY') ? 'border-green-900/50 text-green-500 bg-green-950/20' : 'border-red-900/50 text-red-500 bg-red-950/20'}`}>
                    {o.action}
                  </span>
                  <div>
                    <div className="text-zinc-100 font-sans">{o.symbol}</div>
                    <div className="text-zinc-500 text-[10px] font-sans mt-0.5">{new Date(o.date).toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-center">
                  <div className="text-zinc-400 text-xs">
                    {o.qty.toFixed(4)} @ {formatMoney(o.price)}
                  </div>
                  <div className="text-zinc-100 font-medium mt-0.5">{formatMoney(o.total)}</div>
                  {o.pnl !== undefined && (
                    <div className={`text-[10px] mt-1 ${o.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      PNL: {o.pnl >= 0 ? '+' : ''}{formatMoney(o.pnl)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const SettingsTab = () => (
    <div className="p-6 max-w-4xl mx-auto space-y-12">
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xs uppercase tracking-widest font-medium text-zinc-500 flex items-center gap-2"><Briefcase size={14}/> Portfolio Management</h2>
          <button 
            onClick={() => setCreatePortfolioModal(true)}
            className="text-[10px] uppercase tracking-widest text-zinc-100 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 transition-colors"
          >
            + Create New
          </button>
        </div>
        
        <div className="border border-zinc-800 divide-y divide-zinc-800 bg-zinc-950">
          {appData.portfolios.map(pf => (
            <div key={pf.id} className="p-4 flex justify-between items-center">
              <div>
                <div className="font-medium text-zinc-100 text-sm flex items-center gap-2">
                  {pf.name}
                  {pf.id === appData.activePortfolioId && <span className="text-[9px] uppercase bg-zinc-800 px-1.5 py-0.5 text-zinc-400">Active</span>}
                </div>
                <div className="text-xs text-zinc-500 mt-1 font-mono">Cash: {formatMoney(pf.wallet)}</div>
              </div>
              <div className="flex gap-4">
                {appData.portfolios.length > 1 && (
                  <button 
                    onClick={() => {
                      setConfirmDialog({
                        message: `Permanently delete portfolio "${pf.name}" and all its history?`,
                        onConfirm: () => {
                          setAppData(prev => {
                            const newPortfolios = prev.portfolios.filter(p => p.id !== pf.id);
                            return {
                              activePortfolioId: prev.activePortfolioId === pf.id ? newPortfolios[0].id : prev.activePortfolioId,
                              portfolios: newPortfolios
                            };
                          });
                          showToast(`Portfolio deleted.`);
                        }
                      });
                    }}
                    className="text-red-500 hover:text-red-400 text-[10px] uppercase tracking-widest transition-colors"
                  >Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest font-medium text-zinc-500 mb-4 flex items-center gap-2"><Settings size={14}/> Global Data Management</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              const blob = new Blob([JSON.stringify(appData)], { type: 'application/json' });
              const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `papertrade_export.json`; a.click();
              showToast("Data exported successfully.");
            }} 
            className="border border-zinc-700 text-zinc-300 hover:bg-zinc-800 px-4 py-3 text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Download size={14} /> Export Backup
          </button>
          <button 
            onClick={() => { 
              setConfirmDialog({
                message: "Purge ALL portfolios and data? This resets the entire application and cannot be undone.",
                onConfirm: () => {
                   localStorage.removeItem('pt_user');
                   localStorage.removeItem('pt_v3_data');
                   window.location.reload();
                }
              });
            }} 
            className="border border-red-900 text-red-500 hover:bg-red-950 px-4 py-3 text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Trash2 size={14} /> Factory Reset
          </button>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-zinc-800 flex flex-col">
      <Topbar />
      <main className="flex-1 pb-12"> 
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'market' && <Market />}
        {activeTab === 'funds' && <Funds />}
        {activeTab === 'ledger' && <Ledger />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
      
      {/* Global Modals */}
      <Toast />
      <ConfirmModal />
      <CreatePortfolioModal />
      <FundsModal />
    </div>
  );
}
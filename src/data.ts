export type ToolProfile = {
  id: string;
  name: string;
  maker: string;
  category: "通用助理" | "工作代理" | "研究工具" | "組織整合";
  headline: string;
  bestFor: string[];
  watchFor: string;
  access: string;
  source: string;
  accent: string;
};

export const modes = [
  {
    id: "chat",
    index: "01",
    name: "Chat",
    label: "即問即答",
    human: "拆解問題、逐輪追問",
    ai: "快速回覆、改寫、腦力激盪",
    hr: "把研究摘要改寫成課堂說明",
    control: "核對內容，別把流暢當正確",
    prompt: "請先重述我的需求，列出你還缺少的三項資訊，再開始回答。",
  },
  {
    id: "research",
    index: "02",
    name: "Research",
    label: "跨來源查證",
    human: "界定問題、來源範圍與證據標準",
    ai: "規劃搜尋、閱讀多個來源、產生附來源報告",
    hr: "探索混合辦公與離職意圖的近期研究",
    control: "逐筆開啟來源，核對研究設計與結論",
    prompt: "只使用可追溯來源；把事實、推論與待查證事項分欄呈現。",
  },
  {
    id: "work",
    index: "03",
    name: "Work / Cowork",
    label: "委派完整成果",
    human: "描述成果、提供檔案、設置權限與審查點",
    ai: "跨檔案、多步驟執行，交付報告、表格或簡報",
    hr: "把匿名訪談、問卷與課綱整理成教學套件",
    control: "敏感資料最小化；高影響步驟須停下確認",
    prompt: "先提出工作計畫；遇到個資、外部分享或不可逆操作時必須暫停。",
  },
  {
    id: "agent",
    index: "04",
    name: "Coding Agent",
    label: "建立可執行成果",
    human: "提供工作區、驗收條件與測試方式",
    ai: "讀寫檔案、分析資料、建立網站並執行測試",
    hr: "把匿名問卷轉成可重複使用的互動儀表板",
    control: "審查資料、程式變更與部署範圍",
    prompt: "完成後必須執行測試，列出修改內容、限制與重現步驟。",
  },
];

export const tools: ToolProfile[] = [
  {
    id: "chatgpt-work",
    name: "ChatGPT Chat / Work",
    maker: "OpenAI",
    category: "工作代理",
    headline: "Chat 處理快速協作；Work 適合多步驟研究、分析與完成型交付。",
    bestFor: ["研究報告", "文件／試算表／簡報", "長任務協作"],
    watchFor: "Work 的帳號與工作區可用性可能不同；先確認資料與連接器權限。",
    access: "依合格付費方案與工作區設定",
    source: "https://help.openai.com/en/articles/20001275/",
    accent: "#ffb76b",
  },
  {
    id: "codex",
    name: "Codex",
    maker: "OpenAI",
    category: "工作代理",
    headline: "能在工作區讀寫檔案、執行測試，適合資料流程、網站與研究工具製作。",
    bestFor: ["資料清理腳本", "互動網站", "可重現研究流程"],
    watchFor: "它是技術工作代理，不等於文獻資料庫；仍需明確驗收與權限邊界。",
    access: "桌面與開發工作流程；依方案而異",
    source: "https://openai.com/codex/for-work/",
    accent: "#72d4b4",
  },
  {
    id: "claude-cowork",
    name: "Claude Chat / Cowork",
    maker: "Anthropic",
    category: "工作代理",
    headline: "Chat 適合當下協作；Cowork 面向非技術工作者，能跨本機檔案與應用完成任務。",
    bestFor: ["跨檔案整合", "質性資料整理", "長篇文件交付"],
    watchFor: "Claude for Work 是組織方案；Claude Cowork 是知識工作代理，兩者不要混稱。",
    access: "Cowork 透過桌面程式與付費方案提供",
    source: "https://www.anthropic.com/product/claude-cowork",
    accent: "#e8916f",
  },
  {
    id: "gemini-notebook",
    name: "Gemini / Gemini Notebook",
    maker: "Google",
    category: "通用助理",
    headline: "Gemini 處理通用任務；Gemini Notebook（原 NotebookLM）以指定來源為核心組織與轉化材料。",
    bestFor: ["來源導向問答", "課程學習包", "音訊／圖解／測驗"],
    watchFor: "來源導向不代表零錯誤；引用仍要回到原文脈絡核對。",
    access: "支援地區與功能依帳號／方案而異",
    source: "https://support.google.com/gemininotebook/answer/16164461",
    accent: "#85b6ff",
  },
  {
    id: "m365-researcher",
    name: "Microsoft 365 Copilot Researcher",
    maker: "Microsoft",
    category: "組織整合",
    headline: "能結合使用者有權存取的 Microsoft 365 工作內容與網路來源，處理多步驟研究。",
    bestFor: ["組織內部研究", "會議／郵件／文件整合", "可分享研究報告"],
    watchFor: "可見資料仍取決於原有權限；組織治理與管理設定不可省略。",
    access: "Microsoft 365 Copilot 授權與管理設定",
    source: "https://learn.microsoft.com/en-us/microsoft-365/copilot/researcher-agent",
    accent: "#9ab8ff",
  },
  {
    id: "elicit",
    name: "Elicit",
    maker: "Elicit",
    category: "研究工具",
    headline: "以研究問題驅動論文搜尋、篩選、資料擷取與系統性回顧工作流。",
    bestFor: ["文獻篩選", "證據表", "系統性回顧初步流程"],
    watchFor: "出版級回顧仍需傳統資料庫策略、完整紀錄與人工複核。",
    access: "基本與進階方案功能不同",
    source: "https://elicit.com/blog/systematic-review/",
    accent: "#b89cff",
  },
  {
    id: "consensus",
    name: "Consensus",
    maker: "Consensus",
    category: "研究工具",
    headline: "以學術論文為檢索範圍，提供有引用的研究綜整與深度搜尋。",
    bestFor: ["問題導向探索", "跨研究綜整", "快速找起始文獻"],
    watchFor: "真實論文也可能被錯讀；需核對方法、樣本與原文結論。",
    access: "免費與付費搜尋深度不同",
    source: "https://consensus.app/home/blog/how-consensus-works/",
    accent: "#75c2e8",
  },
  {
    id: "scite",
    name: "Scite",
    maker: "Research Solutions",
    category: "研究工具",
    headline: "利用 Smart Citations 查看文獻如何支持、反駁或提及某項研究。",
    bestFor: ["引用脈絡", "爭議辨識", "參考文獻檢查"],
    watchFor: "分類是輔助訊號，不應取代閱讀引用段落與原始研究。",
    access: "部分功能需訂閱或機構存取",
    source: "https://scite.ai/",
    accent: "#76d9c7",
  },
];

export const radarTools = [
  {
    name: "ResearchRabbit",
    use: "從種子論文沿引用網絡探索、整理與追蹤研究。",
    source: "https://www.researchrabbit.ai/features",
  },
  {
    name: "Connected Papers",
    use: "用共被引與書目耦合建立相似論文視覺圖譜。",
    source: "https://www.connectedpapers.com/about",
  },
  {
    name: "Semantic Scholar",
    use: "免費 AI 驅動的科學文獻搜尋、引用分類與探索。",
    source: "https://www.semanticscholar.org/about",
  },
];

export const useCaseTracks = {
  research: {
    label: "研究",
    lead: "讓 AI 加速探索與整理，把判斷、方法與責任留給研究者。",
    items: [
      ["問題形成", "請 AI 提出競爭性理論解釋，再由研究者界定貢獻。"],
      ["文獻探索", "先找種子文獻、畫引用網絡，再做可重現的資料庫檢索。"],
      ["資料分析", "只用匿名或合成資料，保留程式、決策紀錄與人工檢核。"],
      ["論文修訂", "要求標出證據不足、邏輯跳躍與替代解釋，而不只是潤稿。"],
    ],
  },
  teaching: {
    label: "教學",
    lead: "把教材轉成能對話的學習環境，而非只把講義變短。",
    items: [
      ["課程設計", "從學習目標反推活動、評量規準與錯誤示例。"],
      ["個案教學", "產生不同角色立場，讓學生練習權衡而非猜標準答案。"],
      ["來源學習", "用指定教材建立問答、測驗、概念圖與音訊導讀。"],
      ["AI 素養", "要求學生提交 Prompt、核查紀錄與 AI 使用揭露。"],
    ],
  },
  practice: {
    label: "HR 實務",
    lead: "先自動化低風險的整理與草擬，再處理牽涉權益的判斷。",
    items: [
      ["招募溝通", "依職能模型草擬職缺與結構式面試題，由專業者審定。"],
      ["員工聲音", "彙整匿名意見與代表性主題，不推論單一員工。"],
      ["學習發展", "把政策與教材轉成角色化學習路徑和常見問答。"],
      ["人力報告", "協助產生圖表敘事、異常檢查與後續追問。"],
    ],
  },
};

export const promptScenarios = {
  literature: {
    label: "文獻探索",
    seed: "我想研究混合辦公對員工離職意圖的影響，請幫我找文獻。",
    parts: [
      ["role", "角色", "你是一位熟悉組織行為、人力資源研究與證據綜整方法的研究助理。"],
      ["goal", "目標", "協助我建立「混合辦公如何影響員工離職意圖」的探索性文獻地圖，而不是直接代寫文獻回顧。"],
      ["context", "背景", "研究情境以 2020–2026 年知識工作者為主，關注自主性、孤立感、主管支持與工作家庭界線等機制。"],
      ["process", "步驟", "先拆解概念與同義詞，再提出搜尋策略、代表性理論、實證研究與相互矛盾的結果。"],
      ["format", "格式", "輸出研究問題精煉、關鍵詞組、證據表、理論路徑及下一步搜尋建議。"],
      ["quality", "品質", "區分後設分析、縱貫研究、橫斷研究與評論；不可用引用數取代品質判斷。"],
      ["guardrail", "護欄", "不要虛構文獻、DOI 或研究結果；找不到時直接說明。"],
      ["verify", "查證", "每筆文獻附可開啟來源，並標示已核對、待核對及僅為搜尋線索。"],
    ],
  },
  survey: {
    label: "匿名意見分析",
    seed: "幫我分析員工意見調查，告訴我員工最不滿意什麼。",
    parts: [
      ["role", "角色", "你是一位重視隱私與研究品質的員工體驗分析顧問。"],
      ["goal", "目標", "從已匿名化的意見文字辨識主題、張力與可驗證的改善假設。"],
      ["context", "背景", "資料是教學用合成文本，不代表真實員工；不可推論個人身分、人格或績效。"],
      ["process", "步驟", "先建立編碼表，再雙輪編碼、列出反例，最後提出需追加蒐集的資料。"],
      ["format", "格式", "輸出主題、證據句、出現範圍、可能解釋、替代解釋與建議追問。"],
      ["quality", "品質", "少數意見不可被多數主題淹沒；避免把頻率直接當成重要性。"],
      ["guardrail", "護欄", "不得把主題連結到個人、部門或任何可識別群體。"],
      ["verify", "查證", "每個結論都附資料中的代表句與反例，並標示信心水準。"],
    ],
  },
  course: {
    label: "課程設計",
    seed: "幫我做一堂生成式 AI 與人力資源的課。",
    parts: [
      ["role", "角色", "你是一位熟悉成人學習、HRM 與 AI 素養的教學設計師。"],
      ["goal", "目標", "設計一堂 60 分鐘、能讓 HR 學術工作者實際操作的入門到中階課程。"],
      ["context", "背景", "學員有研究經驗但 AI 熟練度不同；現場可投影與使用手機。"],
      ["process", "步驟", "以引起動機、概念框架、示範、練習、倫理決策與行動承諾編排。"],
      ["format", "格式", "輸出逐段時間、講師提示、學員任務、示範 Prompt 與備用方案。"],
      ["quality", "品質", "每 10 分鐘至少有一次可觀察的學習活動，並對應明確學習目標。"],
      ["guardrail", "護欄", "不可要求學員上傳真實員工資料或把 AI 當成權益決策者。"],
      ["verify", "查證", "產品功能附官方來源；無法確認的功能必須標示方案或推出限制。"],
    ],
  },
};

export const agentSteps = [
  ["理解任務", "確認成果是匿名調查洞察、教學報告與互動摘要頁。", "done"],
  ["建立計畫", "資料檢查 → 主題編碼 → 圖表 → 報告 → 品質檢查。", "done"],
  ["檢查資料", "發現 18 筆合成文字、6 個量化欄位，無姓名與聯絡資訊。", "done"],
  ["需要確認", "系統準備將分析摘要寫入新的公開資料夾。是否允許？", "approval"],
  ["執行分析", "建立 4 個主題、2 個反例與 3 個待驗證假設。", "pending"],
  ["製作成果", "產出教學報告、圖表與可重複使用的 Prompt。", "pending"],
  ["自我檢查", "檢查匿名性、數字一致性、來源與限制陳述。", "pending"],
  ["交付審查", "標出仍需人類判斷的 3 個結論。", "pending"],
];

export const ethicsCases = [
  {
    title: "把未匿名履歷上傳至個人免費帳號，請 AI 排名前十名。",
    answer: "stop",
    reason: "涉及可識別個資與高影響就業決策；應先確認合法基礎、組織工具、資料最小化與人工決策流程。",
    risk: "個資 × 公平 × 權益決策",
  },
  {
    title: "在核准的機構環境中，整理已去識別化的訪談逐字稿，並由兩位研究者複核編碼。",
    answer: "assist",
    reason: "可以輔助，但仍要保留研究者判斷、編碼紀錄、反例與資料使用範圍。",
    risk: "研究品質 × 可追溯性",
  },
  {
    title: "讓 AI 直接依文字評語計算員工年度績效分數並自動送出。",
    answer: "stop",
    reason: "績效評分會影響個人權益；AI 可協助整理證據，但不應取代負責任的管理判斷與申訴機制。",
    risk: "自動化偏誤 × 課責",
  },
  {
    title: "請 AI 生成十篇參考文獻，看到格式完整就直接放入論文。",
    answer: "stop",
    reason: "格式完整不代表文獻存在。必須逐筆核對資料庫、DOI、作者、年份與原文。",
    risk: "幻覺 × 學術誠信",
  },
  {
    title: "把指定教材放入來源導向工具，生成概念圖與測驗，再逐題核對教材內容。",
    answer: "delegate",
    reason: "低風險的內容轉換可以交付，但教師仍要檢查難度、答案與學習目標。",
    risk: "教學品質",
  },
  {
    title: "依已核定的職能模型草擬結構式面試題，交由用人主管與 HR 審定。",
    answer: "assist",
    reason: "適合用 AI 擴充初稿，但題目效度、公平性、合法性與最終採用仍由專業者負責。",
    risk: "效度 × 公平",
  },
  {
    title: "將匿名員工意見依主題聚合，保留少數意見與反例，不推論單一員工。",
    answer: "assist",
    reason: "適合 AI 輔助整理；應保留原始證據、說明樣本限制，並避免用頻率取代重要性。",
    risk: "隱私 × 過度推論",
  },
];

export const officialSources = [
  ["OpenAI", "ChatGPT Work and Codex", "https://help.openai.com/en/articles/20001275/"],
  ["OpenAI", "Codex for work", "https://openai.com/codex/for-work/"],
  ["Anthropic", "Claude Cowork", "https://www.anthropic.com/product/claude-cowork"],
  ["Anthropic", "Claude for Work learning center", "https://www.anthropic.com/learn/claude-for-work"],
  ["Google", "Gemini Notebook（原 NotebookLM）說明", "https://support.google.com/gemininotebook/answer/16164461"],
  ["Google", "AI for human resource teams", "https://workspace.google.com/solutions/ai/hr/"],
  ["Microsoft", "Microsoft 365 Copilot Researcher agent", "https://learn.microsoft.com/en-us/microsoft-365/copilot/researcher-agent"],
  ["Elicit", "Systematic Review workflow", "https://elicit.com/blog/systematic-review/"],
  ["Consensus", "How Consensus works", "https://consensus.app/home/blog/how-consensus-works/"],
  ["Scite", "AI for Research / Smart Citations", "https://scite.ai/"],
  ["ResearchRabbit", "Features", "https://www.researchrabbit.ai/features"],
  ["Connected Papers", "How it works", "https://www.connectedpapers.com/about"],
  ["Semantic Scholar", "About Semantic Scholar", "https://www.semanticscholar.org/about"],
  ["法務部", "個人資料保護法", "https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0050021"],
  ["教育部", "生成式 AI 應用於教學與研究教材包", "https://ethics.moe.edu.tw/packagepost/detail/5/"],
];

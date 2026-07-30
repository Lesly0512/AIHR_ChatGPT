import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  agentSteps,
  ethicsCases,
  modes,
  officialSources,
  promptScenarios,
  radarTools,
  tools,
  useCaseTracks,
} from "./data";
import siteBuildPrompt from "../PROMPT.md?raw";

type ScenarioKey = keyof typeof promptScenarios;
type TrackKey = keyof typeof useCaseTracks;

const sections = [
  ["home", "開場", "5′"],
  ["evolution", "工作模式", "7′"],
  ["applications", "應用地圖", "5′"],
  ["tools", "工具選擇", "10′"],
  ["prompt-lab", "Prompt 實驗", "15′"],
  ["agent", "Agent 模擬", "10′"],
  ["ethics", "倫理挑戰", "8′"],
  ["action", "行動卡", "5′"],
  ["build-prompt", "建站 Prompt", "延伸"],
  ["sources", "官方來源", "延伸"],
] as const;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [instructorMode, setInstructorMode] = useState(false);
  const [seconds, setSeconds] = useState(3600);
  const [timerRunning, setTimerRunning] = useState(false);
  const [copied, setCopied] = useState("");
  const [modeId, setModeId] = useState("chat");
  const [track, setTrack] = useState<TrackKey>("research");
  const [toolFilter, setToolFilter] = useState("全部");
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("literature");
  const [selectedParts, setSelectedParts] = useState<string[]>([
    "role",
    "goal",
    "context",
  ]);
  const [customSeed, setCustomSeed] = useState(promptScenarios.literature.seed);
  const [agentIndex, setAgentIndex] = useState(-1);
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentStatus, setAgentStatus] = useState("");
  const [ethicsIndex, setEthicsIndex] = useState(0);
  const [ethicsAnswers, setEthicsAnswers] = useState<string[]>([]);
  const [ethicsFeedback, setEthicsFeedback] = useState("");
  const [recommend, setRecommend] = useState({
    task: "research",
    data: "sources",
    sensitivity: "public",
    citation: "yes",
    autonomy: "guided",
  });
  const [actionCard, setActionCard] = useState({
    mission: "把指定文獻整理成可查證的證據表",
    tool: "研究工具＋來源導向助理",
    data: "已取得權限的論文與研究問題",
    checkpoint: "逐筆核對引用、方法與原文結論",
    forbidden: "未匿名個資、未公開審稿內容",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0.05, 0.25, 0.6] },
    );
    sections.forEach(([id]) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    if (!agentRunning) return;
    const timer = window.setTimeout(() => {
      setAgentIndex((value) => {
        const next = value + 1;
        if (next === 3 || next >= agentSteps.length - 1) {
          setAgentRunning(false);
        }
        return Math.min(next, agentSteps.length - 1);
      });
    }, 850);
    return () => window.clearTimeout(timer);
  }, [agentIndex, agentRunning]);

  const scenario = promptScenarios[scenarioKey];
  const completedPrompt = useMemo(() => {
    const chosen = scenario.parts
      .filter(([id]) => selectedParts.includes(id))
      .map(([, label, value]) => `【${label}】\n${value}`)
      .join("\n\n");
    return `【原始需求】\n${customSeed.trim()}\n\n${chosen}`;
  }, [customSeed, scenario, selectedParts]);

  const promptScore = Math.round(
    (selectedParts.length / scenario.parts.length) * 100,
  );

  const recommendation = useMemo(() => {
    if (recommend.sensitivity === "personal") {
      return {
        warning: true,
        names: ["先不要上傳"],
        reason:
          "先完成去識別化、合法基礎、組織核准與資料處理邊界，再選擇機構允許的工具。",
      };
    }
    const ids: string[] = [];
    if (recommend.task === "build") ids.push("codex");
    if (recommend.task === "research")
      ids.push("elicit", "consensus", "gemini-notebook");
    if (recommend.task === "synthesis")
      ids.push("gemini-notebook", "chatgpt-work", "claude-cowork");
    if (recommend.task === "workplace")
      ids.push("m365-researcher", "chatgpt-work", "claude-cowork");
    if (recommend.autonomy === "multi")
      ids.unshift("chatgpt-work", "claude-cowork");
    if (recommend.citation === "yes") ids.push("scite");
    const unique = [...new Set(ids)].slice(0, 3);
    return {
      warning: false,
      names: unique.map((id) => tools.find((tool) => tool.id === id)?.name ?? id),
      reason:
        recommend.data === "workplace"
          ? "優先選擇能沿用組織權限與治理設定的工作環境，並只連接任務必要資料。"
          : "這組合兼顧任務類型、來源可驗證性與你希望交給 AI 的工作深度。",
    };
  }, [recommend]);

  const filteredTools =
    toolFilter === "全部"
      ? tools
      : tools.filter((tool) => tool.category === toolFilter);

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1800);
    }
  };

  const downloadText = (filename: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const switchScenario = (key: ScenarioKey) => {
    setScenarioKey(key);
    setCustomSeed(promptScenarios[key].seed);
    setSelectedParts(["role", "goal", "context"]);
  };

  const startAgent = () => {
    setAgentStatus("");
    setAgentIndex(0);
    setAgentRunning(true);
  };

  const approveAgent = () => {
    setAgentStatus("已限定寫入「教學輸出」資料夾，且不得外部分享。");
    setAgentIndex(4);
    setAgentRunning(true);
  };

  const rejectAgent = () => {
    setAgentStatus("已拒絕公開資料夾；代理改為只產生本機預覽，不做外部分享。");
    setAgentIndex(4);
    setAgentRunning(true);
  };

  const answerEthics = (answer: string) => {
    if (ethicsFeedback) return;
    const current = ethicsCases[ethicsIndex];
    const correct = answer === current.answer;
    setEthicsAnswers((values) => [...values, correct ? "correct" : "wrong"]);
    setEthicsFeedback(
      `${correct ? "判斷合理。" : "再想一步。"} ${current.reason}`,
    );
  };

  const nextEthics = () => {
    setEthicsFeedback("");
    setEthicsIndex((value) => Math.min(value + 1, ethicsCases.length));
  };

  const actionText = `我的 HR × AI 實驗卡
產生日期：2026-07-30

下週要完成的任務：
${actionCard.mission}

適合的工具類型：
${actionCard.tool}

應準備的資料：
${actionCard.data}

人類審查點：
${actionCard.checkpoint}

不可上傳：
${actionCard.forbidden}

原則：AI 可以加速工作，但資料責任、專業判斷與影響個人權益的決定仍由人負責。`;

  const activeMode = modes.find((mode) => mode.id === modeId)!;
  const ethicsFinished = ethicsIndex >= ethicsCases.length;
  const ethicsScore = ethicsAnswers.filter((answer) => answer === "correct").length;
  const progressIndex = sections.findIndex(([id]) => id === activeSection);
  const progress = Math.max(
    6,
    ((progressIndex + 1) / sections.length) * 100,
  );

  return (
    <div className={instructorMode ? "app instructor-on" : "app"}>
      <a className="skip-link" href="#home">
        跳至主要內容
      </a>

      <header className="topbar">
        <a className="brand" href="#home" aria-label="HR × AI 教學實驗室首頁">
          <span className="brand-mark">HR</span>
          <span>
            <strong>AI 教學實驗室</strong>
            <small>Human judgment, amplified.</small>
          </span>
        </a>
        <div className="top-actions">
          <button
            className={instructorMode ? "toggle active" : "toggle"}
            type="button"
            aria-pressed={instructorMode}
            onClick={() => setInstructorMode((value) => !value)}
          >
            <span aria-hidden="true">◎</span>
            講師模式
          </button>
          <div className="timer" aria-label={`課程計時器 ${formatTime(seconds)}`}>
            <strong>{formatTime(seconds)}</strong>
            <button
              type="button"
              onClick={() => setTimerRunning((value) => !value)}
              aria-label={timerRunning ? "暫停計時" : "開始計時"}
            >
              {timerRunning ? "暫停" : "開始"}
            </button>
            <button
              type="button"
              onClick={() => {
                setTimerRunning(false);
                setSeconds(3600);
              }}
              aria-label="重設六十分鐘計時器"
            >
              重設
            </button>
          </div>
        </div>
      </header>

      <div className="course-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <nav className="section-nav" aria-label="課程章節">
        {sections.map(([id, label, time]) => (
          <a
            className={activeSection === id ? "active" : ""}
            href={`#${id}`}
            key={id}
          >
            <span>{label}</span>
            <small>{time}</small>
          </a>
        ))}
      </nav>

      <main>
        <section className="hero section" id="home">
          <div className="hero-copy">
            <p className="eyebrow">2026.07.30 · HR ACADEMIC EDITION</p>
            <h1>
              AI 不只是回答問題。
              <br />
              <span>它正在成為工作方法。</span>
            </h1>
            <p className="hero-lead">
              用人力資源研究與教學情境，走過「問答、查證、委派、建造」四種
              AI 工作方式。60 分鐘，帶走一個可立即實驗的任務。
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#evolution">
                開始 60 分鐘旅程 <span aria-hidden="true">→</span>
              </a>
              <a className="button ghost" href="#prompt-lab">
                直接進入 Prompt 實驗
              </a>
            </div>
            <div className="hero-notes">
              <span>✓ 不需 API 金鑰</span>
              <span>✓ 全部使用合成資料</span>
              <span>✓ 功能皆附官方來源</span>
            </div>
          </div>

          <div className="hero-console" aria-label="AI 工作方式示意">
            <div className="console-top">
              <span>MISSION 01</span>
              <span className="live-dot">LOCAL SIMULATION</span>
            </div>
            <p className="console-question">
              「我想知道混合辦公是否會提高離職意圖。」
            </p>
            <div className="console-flow">
              {["澄清問題", "界定證據", "查找來源", "保留判斷"].map(
                (item, index) => (
                  <div key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item}</strong>
                  </div>
                ),
              )}
            </div>
            <div className="console-callout">
              <span aria-hidden="true">!</span>
              <p>
                <strong>今天的主角不是工具。</strong>
                <br />
                是你如何定義成果、證據與責任。
              </p>
            </div>
          </div>
          <aside className="instructor-note">
            <strong>講師提示 · 5 分鐘</strong>
            請學員舉手選擇：目前把 AI 當搜尋引擎、助理，還是同事？再指出三者差別不只在能力，也在責任分工。
          </aside>
        </section>

        <section className="section" id="evolution">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 · FROM PROMPTS TO OUTCOMES</p>
              <h2>四種工作模式，一條責任曲線</h2>
            </div>
            <p>
              越往右，AI 能自行完成的步驟越多；你需要設置的邊界、資料權限與審查點也越重要。
            </p>
          </div>

          <div className="mode-grid" role="tablist" aria-label="AI 工作模式">
            {modes.map((mode) => (
              <button
                type="button"
                role="tab"
                aria-selected={modeId === mode.id}
                className={modeId === mode.id ? "mode-card active" : "mode-card"}
                onClick={() => setModeId(mode.id)}
                key={mode.id}
              >
                <span className="mode-index">{mode.index}</span>
                <strong>{mode.name}</strong>
                <small>{mode.label}</small>
              </button>
            ))}
          </div>

          <div className="mode-detail" role="tabpanel">
            <div className="detail-intro">
              <span>{activeMode.index}</span>
              <div>
                <p>目前模式</p>
                <h3>{activeMode.name}</h3>
                <strong>{activeMode.label}</strong>
              </div>
            </div>
            <dl className="detail-grid">
              <div>
                <dt>人要做什麼</dt>
                <dd>{activeMode.human}</dd>
              </div>
              <div>
                <dt>AI 能做什麼</dt>
                <dd>{activeMode.ai}</dd>
              </div>
              <div>
                <dt>HR 情境</dt>
                <dd>{activeMode.hr}</dd>
              </div>
              <div>
                <dt>控制點</dt>
                <dd>{activeMode.control}</dd>
              </div>
            </dl>
            <div className="micro-prompt">
              <span>PROMPT MOVE</span>
              <code>{activeMode.prompt}</code>
              <button
                type="button"
                onClick={() => copyText(activeMode.prompt, `mode-${modeId}`)}
              >
                {copied === `mode-${modeId}` ? "已複製" : "複製"}
              </button>
            </div>
          </div>
          <aside className="instructor-note">
            <strong>講師提示 · 7 分鐘</strong>
            每點一次模式，就問：「哪一個步驟開始讓你不放心？」把回答連回權限、證據與不可逆操作。
          </aside>
        </section>

        <section className="section tinted" id="applications">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 · HR USE-CASE MAP</p>
              <h2>研究、教學、實務：先找工作，再找工具</h2>
            </div>
            <p>
              同一個 AI 工具可以跨場景使用，但方法品質、個資與權益風險不同。
            </p>
          </div>
          <div className="track-tabs" role="tablist" aria-label="HR AI 應用場景">
            {(Object.keys(useCaseTracks) as TrackKey[]).map((key) => (
              <button
                key={key}
                role="tab"
                aria-selected={track === key}
                type="button"
                className={track === key ? "active" : ""}
                onClick={() => setTrack(key)}
              >
                {useCaseTracks[key].label}
              </button>
            ))}
          </div>
          <div className="track-panel" role="tabpanel">
            <p className="track-lead">{useCaseTracks[track].lead}</p>
            <div className="use-case-grid">
              {useCaseTracks[track].items.map(([title, text], index) => (
                <article key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="boundary-banner">
            <span aria-hidden="true">◆</span>
            <div>
              <strong>高影響決策邊界</strong>
              <p>
                履歷排序、升遷、績效與解僱：AI 可以協助整理證據，不能成為無人負責的決策者。
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="tools">
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 · TOOL RADAR</p>
              <h2>2026 工具不是排行榜，而是工作分工</h2>
            </div>
            <p>
              核心比較依 2026-07-30 官方資料整理；方案與推出範圍可能持續變動。
            </p>
          </div>

          <div className="tool-recommender">
            <div className="recommender-form">
              <div className="panel-label">互動 01 · 工具選擇器</div>
              <h3>先回答五件事</h3>
              <div className="question-grid">
                <label>
                  主要任務
                  <select
                    value={recommend.task}
                    onChange={(event) =>
                      setRecommend({ ...recommend, task: event.target.value })
                    }
                  >
                    <option value="research">探索學術研究</option>
                    <option value="synthesis">整合檔案與產出</option>
                    <option value="workplace">組織內部工作</option>
                    <option value="build">建立資料流程或網站</option>
                  </select>
                </label>
                <label>
                  資料在哪裡
                  <select
                    value={recommend.data}
                    onChange={(event) =>
                      setRecommend({ ...recommend, data: event.target.value })
                    }
                  >
                    <option value="sources">指定論文／公開來源</option>
                    <option value="local">本機檔案</option>
                    <option value="workplace">組織郵件／文件／會議</option>
                  </select>
                </label>
                <label>
                  敏感程度
                  <select
                    value={recommend.sensitivity}
                    onChange={(event) =>
                      setRecommend({
                        ...recommend,
                        sensitivity: event.target.value,
                      })
                    }
                  >
                    <option value="public">公開或合成資料</option>
                    <option value="internal">組織內部資料</option>
                    <option value="personal">可識別員工個資</option>
                  </select>
                </label>
                <label>
                  是否需要引用
                  <select
                    value={recommend.citation}
                    onChange={(event) =>
                      setRecommend({
                        ...recommend,
                        citation: event.target.value,
                      })
                    }
                  >
                    <option value="yes">需要逐筆可查證</option>
                    <option value="no">不需要正式引用</option>
                  </select>
                </label>
                <label>
                  希望 AI 工作多深
                  <select
                    value={recommend.autonomy}
                    onChange={(event) =>
                      setRecommend({
                        ...recommend,
                        autonomy: event.target.value,
                      })
                    }
                  >
                    <option value="guided">逐輪協作</option>
                    <option value="multi">多步驟委派</option>
                    <option value="build">建立可執行成果</option>
                  </select>
                </label>
              </div>
            </div>
            <div
              className={
                recommendation.warning
                  ? "recommendation-result warning"
                  : "recommendation-result"
              }
            >
              <span>{recommendation.warning ? "先做治理" : "建議組合"}</span>
              <h3>{recommendation.names.join(" ＋ ")}</h3>
              <p>{recommendation.reason}</p>
              <small>
                這是教學用推薦，不代表產品背書；實際使用前請確認方案與組織政策。
              </small>
            </div>
          </div>

          <div className="filter-row" aria-label="工具分類篩選">
            {["全部", "通用助理", "工作代理", "研究工具", "組織整合"].map(
              (filter) => (
                <button
                  type="button"
                  className={toolFilter === filter ? "active" : ""}
                  onClick={() => setToolFilter(filter)}
                  key={filter}
                >
                  {filter}
                </button>
              ),
            )}
          </div>

          <div className="tool-grid">
            {filteredTools.map((tool) => (
              <article
                className="tool-card"
                key={tool.id}
                style={{ "--tool-accent": tool.accent } as CSSProperties}
              >
                <div className="tool-top">
                  <span>{tool.category}</span>
                  <small>{tool.maker}</small>
                </div>
                <h3>{tool.name}</h3>
                <p>{tool.headline}</p>
                <div className="chips">
                  {tool.bestFor.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="tool-watch">
                  <strong>使用前先看</strong>
                  <p>{tool.watchFor}</p>
                </div>
                <div className="tool-bottom">
                  <small>{tool.access}</small>
                  <a href={tool.source} target="_blank" rel="noreferrer">
                    官方來源 ↗
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="radar-strip">
            <div>
              <p className="eyebrow">EXTENDED RADAR</p>
              <h3>再往外探索</h3>
            </div>
            {radarTools.map((tool) => (
              <a href={tool.source} target="_blank" rel="noreferrer" key={tool.name}>
                <strong>{tool.name}</strong>
                <span>{tool.use}</span>
              </a>
            ))}
          </div>
          <aside className="instructor-note">
            <strong>講師提示 · 10 分鐘</strong>
            先操作選擇器，再請學員反例挑戰：同一任務若加入「可識別員工個資」，推薦結果為何必須先停下來？
          </aside>
        </section>

        <section className="section lab-section" id="prompt-lab">
          <div className="section-heading light">
            <div>
              <p className="eyebrow">04 · PROMPT LAB</p>
              <h2>把一句要求，變成可驗收的任務</h2>
            </div>
            <p>提示詞不是咒語。好的 Prompt 是一份迷你研究設計與工作契約。</p>
          </div>

          <div className="scenario-tabs" role="tablist" aria-label="Prompt 情境">
            {(Object.keys(promptScenarios) as ScenarioKey[]).map((key) => (
              <button
                role="tab"
                aria-selected={scenarioKey === key}
                type="button"
                className={scenarioKey === key ? "active" : ""}
                onClick={() => switchScenario(key)}
                key={key}
              >
                {promptScenarios[key].label}
              </button>
            ))}
          </div>

          <div className="prompt-workbench">
            <div className="prompt-builder">
              <div className="panel-label">互動 02 · Prompt 實驗室</div>
              <label className="seed-label">
                你的原始需求
                <textarea
                  value={customSeed}
                  onChange={(event) => setCustomSeed(event.target.value)}
                  rows={3}
                />
              </label>
              <div className="score-row">
                <div>
                  <span>任務完整度</span>
                  <strong>{promptScore}%</strong>
                </div>
                <div className="score-bar" aria-hidden="true">
                  <span style={{ width: `${promptScore}%` }} />
                </div>
                <small>
                  {promptScore < 50
                    ? "現在 AI 仍需要猜很多。"
                    : promptScore < 90
                      ? "已可工作，再補上品質與查證。"
                      : "成果、限制與驗收條件已清楚。"}
                </small>
              </div>
              <div className="part-list">
                {scenario.parts.map(([id, label, value]) => {
                  const selected = selectedParts.includes(id);
                  return (
                    <label className={selected ? "selected" : ""} key={id}>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          setSelectedParts((values) =>
                            selected
                              ? values.filter((valueId) => valueId !== id)
                              : [...values, id],
                          )
                        }
                      />
                      <span className="part-check">{selected ? "✓" : "+"}</span>
                      <span>
                        <strong>{label}</strong>
                        <small>{value}</small>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="prompt-preview">
              <div className="preview-top">
                <div>
                  <span>STRUCTURED PROMPT</span>
                  <small>本地即時組合</small>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(completedPrompt, "prompt")}
                >
                  {copied === "prompt" ? "已複製 ✓" : "複製完整 Prompt"}
                </button>
              </div>
              <pre>{completedPrompt}</pre>
              <div className="prompt-diff">
                <div>
                  <span>原始需求容易得到</span>
                  <p>一段流暢但範圍模糊、來源難追的答案。</p>
                </div>
                <div>
                  <span>結構化 Prompt 期待得到</span>
                  <p>有範圍、步驟、格式、品質標準與可查證線索的工作成果。</p>
                </div>
              </div>
            </div>
          </div>
          <aside className="instructor-note dark">
            <strong>講師提示 · 15 分鐘</strong>
            先只選三項，讀一次輸出期待；再補上「護欄、查證」，問學員：哪兩項最直接降低學術風險？
          </aside>
        </section>

        <section className="section" id="agent">
          <div className="section-heading">
            <div>
              <p className="eyebrow">05 · AGENT MISSION</p>
              <h2>看 AI 做事，更要看它何時停下</h2>
            </div>
            <p>
              這是一段本地流程模擬，不會呼叫真正模型，也不會讀取或傳送你的檔案。
            </p>
          </div>

          <div className="agent-shell">
            <div className="agent-brief">
              <div className="panel-label">互動 03 · Agent 任務模擬</div>
              <h3>任務：把匿名員工調查做成教學報告</h3>
              <p>
                輸入包含 18 筆合成意見、六個量化欄位與課程需求。成果必須保留反例、說明限制，且不能外部分享。
              </p>
              <div className="synthetic-badge">
                <span aria-hidden="true">◇</span>
                教學模擬資料 · 無真實個資
              </div>
              <details className="dataset-details">
                <summary>查看／下載這次任務的合成資料</summary>
                <p>
                  18 筆量化資料、18 段意見文字，以及 8 筆「請勿引用」的虛構文獻核查練習。
                </p>
                <div>
                  <a href="./data/synthetic-employee-survey.csv" download>
                    量化 CSV
                  </a>
                  <a href="./data/synthetic-comments.json" download>
                    意見 JSON
                  </a>
                  <a href="./data/simulated-literature.json" download>
                    文獻核查 JSON
                  </a>
                </div>
              </details>
              <button
                className="button primary"
                type="button"
                onClick={startAgent}
                disabled={agentRunning}
              >
                {agentIndex < 0 ? "開始任務" : "重新執行"}
              </button>
              {agentStatus && <p className="agent-status">{agentStatus}</p>}
            </div>

            <div className="agent-timeline" aria-live="polite">
              {agentSteps.map(([title, text, type], index) => {
                const state =
                  index < agentIndex
                    ? "done"
                    : index === agentIndex
                      ? type === "approval"
                        ? "approval"
                        : "active"
                      : "pending";
                return (
                  <div className={`agent-step ${state}`} key={title}>
                    <span className="step-node">
                      {state === "done" ? "✓" : String(index + 1)}
                    </span>
                    <div>
                      <div className="step-title">
                        <strong>{title}</strong>
                        <small>
                          {state === "done"
                            ? "完成"
                            : state === "active"
                              ? "執行中"
                              : state === "approval"
                                ? "等待你決定"
                                : "待處理"}
                        </small>
                      </div>
                      <p>{text}</p>
                      {state === "approval" && (
                        <div className="approval-actions">
                          <button type="button" onClick={approveAgent}>
                            限定資料夾後允許
                          </button>
                          <button type="button" onClick={rejectAgent}>
                            拒絕公開寫入
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="agent-lesson">
            <strong>Agent 素養 = 任務規格 × 權限邊界 × 中途審查 × 最終驗收</strong>
            <p>
              「有問我」不是唯一安全機制；更好的方法是事先限制它能看什麼、能改什麼、能分享去哪裡。
            </p>
          </div>
          <aside className="instructor-note">
            <strong>講師提示 · 10 分鐘</strong>
            在批准點停下來投票。強調「允許／拒絕」之外，成熟做法是縮小授權範圍後再批准。
          </aside>
        </section>

        <section className="section ethics-section" id="ethics">
          <div className="section-heading light">
            <div>
              <p className="eyebrow">06 · HUMAN JUDGMENT CHECK</p>
              <h2>這個任務，可以交給 AI 嗎？</h2>
            </div>
            <p>
              依據臺灣個資與學術倫理脈絡，練習辨識資料、證據、公平與權益風險。
            </p>
          </div>

          <div className="ethics-game">
            {!ethicsFinished ? (
              <>
                <div className="ethics-progress">
                  <span>
                    情境 {ethicsIndex + 1} / {ethicsCases.length}
                  </span>
                  <div>
                    {ethicsCases.map((_, index) => (
                      <i
                        key={index}
                        className={index <= ethicsIndex ? "active" : ""}
                      />
                    ))}
                  </div>
                </div>
                <article className="ethics-card">
                  <span className="risk-tag">{ethicsCases[ethicsIndex].risk}</span>
                  <h3>{ethicsCases[ethicsIndex].title}</h3>
                  <div className="ethics-options">
                    <button type="button" onClick={() => answerEthics("delegate")}>
                      <span>01</span>
                      可以交付
                      <small>AI 可完成，人做最後驗收</small>
                    </button>
                    <button type="button" onClick={() => answerEthics("assist")}>
                      <span>02</span>
                      可以輔助
                      <small>AI 只做部分，人保留判斷</small>
                    </button>
                    <button type="button" onClick={() => answerEthics("stop")}>
                      <span>03</span>
                      應該停止
                      <small>先改資料、流程或決策方式</small>
                    </button>
                  </div>
                  {ethicsFeedback && (
                    <div className="ethics-feedback" aria-live="polite">
                      <p>{ethicsFeedback}</p>
                      <button type="button" onClick={nextEthics}>
                        {ethicsIndex === ethicsCases.length - 1
                          ? "查看結果"
                          : "下一個情境 →"}
                      </button>
                    </div>
                  )}
                </article>
              </>
            ) : (
              <div className="ethics-result">
                <span className="result-score">
                  {ethicsScore}/{ethicsCases.length}
                </span>
                <div>
                  <p className="eyebrow">YOUR JUDGMENT SCORE</p>
                  <h3>
                    {ethicsScore >= 6
                      ? "你有成熟的 AI 任務邊界感。"
                      : "下一步：在使用工具前，多問一次「誰承擔後果？」"}
                  </h3>
                  <p>
                    快速檢查五件事：資料是否合法且最小化？來源可查證嗎？是否涉及差別待遇？誰能覆核？誰對結果負責？
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEthicsIndex(0);
                      setEthicsAnswers([]);
                      setEthicsFeedback("");
                    }}
                  >
                    再挑戰一次
                  </button>
                </div>
              </div>
            )}
          </div>
          <aside className="instructor-note dark">
            <strong>講師提示 · 8 分鐘</strong>
            不要只公布答案。請學員說出他們想改哪個條件，才能把「應停止」改造成「可以輔助」。
          </aside>
        </section>

        <section className="section" id="action">
          <div className="section-heading">
            <div>
              <p className="eyebrow">07 · TAKE IT TO WORK</p>
              <h2>把今天的理解，變成下週的小實驗</h2>
            </div>
            <p>
              從低風險、可逆、容易驗收的任務開始。先建立信任，再擴大委派。
            </p>
          </div>

          <div className="action-builder">
            <div className="action-form">
              <div className="panel-label">互動 05 · 我的實驗卡</div>
              {[
                ["mission", "下週要完成的任務"],
                ["tool", "適合的工具類型"],
                ["data", "應準備的資料"],
                ["checkpoint", "人類審查點"],
                ["forbidden", "不可上傳"],
              ].map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    value={actionCard[key as keyof typeof actionCard]}
                    onChange={(event) =>
                      setActionCard({
                        ...actionCard,
                        [key]: event.target.value,
                      })
                    }
                  />
                </label>
              ))}
            </div>
            <div className="action-card-preview">
              <div className="card-date">
                <span>HR × AI EXPERIMENT</span>
                <strong>2026 / 07 / 30</strong>
              </div>
              <p>我的下一個任務</p>
              <h3>{actionCard.mission}</h3>
              <dl>
                <div>
                  <dt>工具</dt>
                  <dd>{actionCard.tool}</dd>
                </div>
                <div>
                  <dt>資料</dt>
                  <dd>{actionCard.data}</dd>
                </div>
                <div>
                  <dt>審查</dt>
                  <dd>{actionCard.checkpoint}</dd>
                </div>
                <div>
                  <dt>禁止</dt>
                  <dd>{actionCard.forbidden}</dd>
                </div>
              </dl>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() => copyText(actionText, "action")}
                >
                  {copied === "action" ? "已複製 ✓" : "複製內容"}
                </button>
                <button
                  type="button"
                  onClick={() => downloadText("我的-HR-AI-實驗卡.txt", actionText)}
                >
                  下載 .txt
                </button>
              </div>
            </div>
          </div>
          <aside className="instructor-note">
            <strong>講師提示 · 5 分鐘</strong>
            給學員 90 秒完成實驗卡，邀請兩人分享。結尾提醒：選一個小任務真的做，比記住所有工具更重要。
          </aside>
        </section>

        <section className="section build-prompt-section" id="build-prompt">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BONUS · META PROMPT</p>
              <h2>這個網站，是怎麼被交代清楚的？</h2>
            </div>
            <p>
              以下是本網站的建置 Prompt。它示範如何把受眾、時間、內容、互動、查證、風險與驗收寫成一份完整任務規格。
            </p>
          </div>
          <div className="meta-prompt">
            <div className="meta-prompt-intro">
              <span className="prompt-number">1</span>
              <div>
                <h3>先定義成果，不只描述主題</h3>
                <p>「做一個 AI 網站」太寬；加上受眾、60 分鐘流程與部署方式後，設計才有判斷依據。</p>
              </div>
              <span className="prompt-number">2</span>
              <div>
                <h3>把風險寫進規格</h3>
                <p>官方來源、個資、權益決策與虛構資料標示不是最後補充，而是核心驗收條件。</p>
              </div>
              <span className="prompt-number">3</span>
              <div>
                <h3>讓完成可以被檢查</h3>
                <p>指定互動數量、鍵盤操作、建置成功與 GitHub Pages 路徑，才能判斷任務是否真的完成。</p>
              </div>
            </div>
            <div className="meta-prompt-document">
              <div className="preview-top">
                <div>
                  <span>FULL BUILD PROMPT</span>
                  <small>本網站實際使用的需求規格</small>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => copyText(siteBuildPrompt, "build")}
                  >
                    {copied === "build" ? "已複製 ✓" : "複製全文"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadText("HR-AI-教學網站-建置Prompt.txt", siteBuildPrompt)
                    }
                  >
                    下載
                  </button>
                </div>
              </div>
              <details>
                <summary>展開完整建站 Prompt</summary>
                <pre>{siteBuildPrompt}</pre>
              </details>
            </div>
          </div>
        </section>

        <section className="section sources-section" id="sources">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SOURCES · VERIFIED 2026.07.30</p>
              <h2>從官方來源開始，也回到原文結束</h2>
            </div>
            <p>
              產品能力、方案與命名會持續變動。教學前請抽查核心連結與所在機構政策。
            </p>
          </div>

          <div className="source-grid">
            {officialSources.map(([maker, title, url], index) => (
              <a href={url} target="_blank" rel="noreferrer" key={url}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>{maker}</small>
                  <strong>{title}</strong>
                </div>
                <b aria-hidden="true">↗</b>
              </a>
            ))}
          </div>

          <div className="closing-manifesto">
            <p>AI 能替你做更多。</p>
            <h2>所以，人更需要知道自己在負責什麼。</h2>
            <a className="button primary" href="#home">
              回到起點 ↑
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <strong>HR × AI 教學實驗室</strong>
          <span>繁體中文 · 臺灣學術與 HR 情境</span>
        </div>
        <p>
          內容查證基準日：2026-07-30。本站為教學用途，不構成法律、研究倫理或人事決策意見。
        </p>
      </footer>

      {copied && (
        <div className="toast" role="status">
          已複製到剪貼簿
        </div>
      )}
    </div>
  );
}

export default App;

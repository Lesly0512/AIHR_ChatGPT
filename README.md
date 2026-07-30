# HR × AI 教學實驗室

這是一套給人力資源管理、組織行為與勞動研究工作者使用的繁體中文互動教學網站。內容以 **2026 年 7 月 30 日**為查證基準，設計成可直接投影授課的 60 分鐘流程。

網站不會呼叫真正的 AI 模型、不需要 API 金鑰，也不會收集資料。所有員工意見、量化資料與文獻紀錄都是教學用合成內容。

## 網站包含什麼

- Chat → Research → Work／Cowork → Coding Agent 工作模式圖
- HR 研究、教學與實務應用地圖
- 2026 年核心 AI 工具卡與官方來源
- 五題式工具選擇器
- 三種情境的 Prompt 實驗室
- 具有批准節點的 Agent 任務模擬
- 七題 HR 倫理決策挑戰
- 可複製、下載的個人行動卡
- 本網站使用的完整建置 Prompt
- 講師模式與 60 分鐘計時器

## 重要文件

- [完整建置 Prompt](./PROMPT.md)
- [60 分鐘教學指南](./TEACHING_GUIDE.md)
- [官方來源與查證紀錄](./SOURCES.md)
- [內容更新指南](./CONTENT_UPDATE_GUIDE.md)
- [測試結果摘要](./TEST_REPORT.md)
- [合成資料說明](./public/data/README.md)

## 在自己的電腦預覽

需要 Node.js 22 以上版本。

```bash
corepack enable
pnpm install
pnpm dev
```

畫面會顯示一個本機網址，例如 `http://localhost:5173`。用瀏覽器開啟即可。

若只想確認正式版本能否產生：

```bash
pnpm build
pnpm preview
```

正式靜態檔案會放在 `dist` 資料夾。

## 部署至 GitHub Pages

專案已附上自動部署流程。

1. 在 GitHub 建立新的 repository。
2. 將這個資料夾的所有檔案上傳到 repository 的 `main` 分支。
3. 進入 GitHub repository 的 **Settings → Pages**。
4. 在 **Build and deployment → Source** 選擇 **GitHub Actions**。
5. 開啟 **Actions** 頁面，等待「Deploy HR AI teaching site to GitHub Pages」完成。
6. 完成後，Pages 頁面會顯示網站網址。

之後每次把更新推送到 `main`，GitHub 都會重新建立並部署網站。

網站使用相對路徑，因此可放在 `https://帳號.github.io/repository名稱/` 這類 GitHub Pages 子路徑。

專案內含 `public/og.png` 分享封面。若你希望所有社群平台都穩定顯示封面，可在取得正式 GitHub Pages 網址後，把 `index.html` 中的 `og:image` 與 `twitter:image` 改成該圖片的完整網址。

## 教學前建議

1. 開啟網站後切換「講師模式」，確認提示文字。
2. 測試 Prompt 複製、Agent 模擬、倫理挑戰與行動卡下載。
3. 抽查核心產品的官方來源，因產品名稱、方案與可用性會持續變動。
4. 使用投影時建議瀏覽器縮放 90%–100%。
5. 不要要求學員上傳真實員工、應徵者或研究參與者資料。

## 技術與隱私

- Vite + React + TypeScript
- 純靜態網站
- 無後端、無資料庫
- 無分析追蹤碼
- 無第三方字型或圖片依賴
- 不儲存表單內容
- 不包含任何 API 金鑰

## 內容免責

本網站用於教學，不構成法律、研究倫理或人事決策意見。正式研究或組織導入前，應依所在機構政策、研究倫理審查、資料治理要求及適用法規辦理。

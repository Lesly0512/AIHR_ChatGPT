# 測試結果摘要

日期：2026-07-30

## 已通過

- TypeScript 型別檢查
- Vite 正式建置
- GitHub Pages 相對資源路徑
- 分享封面與三組合成資料進入正式輸出
- 十個主要網站章節存在
- 工具選擇器、Prompt 實驗室、Agent 模擬、倫理挑戰與行動卡存在
- OpenAI、Anthropic、Google、Microsoft 官方來源存在
- 未偵測到前端 API 金鑰
- 18 筆量化資料
- 18 筆員工意見文字
- 8 筆虛構文獻，其中 2 筆刻意不可靠
- 虛構資料與文獻均有教學警示

自動測試結果：

```text
tests 4
pass 4
fail 0
```

正式輸出：

```text
dist/index.html
dist/assets/
dist/data/
dist/og.png
```

## 響應式與無障礙設計檢查

- 桌機、平板與手機斷點
- 鍵盤焦點樣式
- 跳至主要內容連結
- 主要互動使用原生 button、input、select、textarea
- tab 與 panel 具基本 ARIA 角色
- 複製結果使用狀態訊息
- 不以顏色作為唯一狀態訊號
- 支援 `prefers-reduced-motion`

## 教學前仍建議人工確認

- 在實際授課電腦與投影機上檢查字級及縮放
- 在手機上完成一次 Prompt、倫理題與行動卡下載
- 重新抽查最常介紹的官方產品連結與所在機構政策

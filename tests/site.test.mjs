import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const app = readFileSync("src/App.tsx", "utf8");
const data = readFileSync("src/data.ts", "utf8");
const html = readFileSync("dist/index.html", "utf8");
const comments = JSON.parse(
  readFileSync("public/data/synthetic-comments.json", "utf8"),
);
const literature = JSON.parse(
  readFileSync("public/data/simulated-literature.json", "utf8"),
);
const survey = readFileSync(
  "public/data/synthetic-employee-survey.csv",
  "utf8",
)
  .trim()
  .split(/\r?\n/);

test("production build contains portable static assets", () => {
  assert.match(html, /src="\.\/assets\//);
  assert.match(html, /href="\.\/assets\//);
  assert.ok(existsSync("dist/og.png"));
  assert.ok(existsSync("dist/data/synthetic-comments.json"));
});

test("all teaching sections and interactive components are present", () => {
  for (const id of [
    "home",
    "evolution",
    "applications",
    "tools",
    "prompt-lab",
    "agent",
    "ethics",
    "action",
    "build-prompt",
    "sources",
  ]) {
    assert.match(app, new RegExp(`id="${id}"`));
  }
  assert.match(app, /工具選擇器/);
  assert.match(app, /Prompt 實驗室/);
  assert.match(app, /Agent 任務模擬/);
  assert.match(app, /倫理挑戰/);
  assert.match(app, /我的實驗卡/);
});

test("tool cards use official sources and no embedded API key", () => {
  assert.match(data, /https:\/\/help\.openai\.com/);
  assert.match(data, /https:\/\/www\.anthropic\.com/);
  assert.match(data, /https:\/\/support\.google\.com/);
  assert.match(data, /https:\/\/learn\.microsoft\.com/);
  assert.doesNotMatch(`${app}\n${data}\n${html}`, /sk-[A-Za-z0-9_-]{20,}/);
});

test("synthetic datasets have the promised size and warnings", () => {
  assert.equal(survey.length - 1, 18);
  assert.equal(comments.comments.length, 18);
  assert.equal(literature.records.length, 8);
  assert.match(comments.notice, /教學模擬資料/);
  assert.match(literature.notice, /請勿引用/);
  assert.equal(
    literature.records.filter((record) => record.status.includes("刻意不可靠"))
      .length,
    2,
  );
});

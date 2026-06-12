const WORK_DAYS_PER_MONTH = 21.75;
const DEMO_TICK_MS = 1000;

const els = {
  workView: document.querySelector("#workView"),
  doneView: document.querySelector("#doneView"),
  monthlyIncome: document.querySelector("#monthlyIncome"),
  contractHours: document.querySelector("#contractHours"),
  timer: document.querySelector("#timer"),
  standardRate: document.querySelector("#standardRate"),
  liveRate: document.querySelector("#liveRate"),
  pauseBtn: document.querySelector("#pauseBtn"),
  finishBtn: document.querySelector("#finishBtn"),
  fishBtn: document.querySelector("#fishBtn"),
  backBtn: document.querySelector("#backBtn"),
  newDayBtn: document.querySelector("#newDayBtn"),
  summaryDuration: document.querySelector("#summaryDuration"),
  summaryStandardRate: document.querySelector("#summaryStandardRate"),
  summaryLiveRate: document.querySelector("#summaryLiveRate"),
  summaryMonthly: document.querySelector("#summaryMonthly"),
};

const state = {
  elapsedSeconds: 0,
  hasStarted: false,
  running: false,
  fishMode: false,
  intervalId: null,
};

function numberFromInput(input, fallback) {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getInputs() {
  return {
    monthlyIncome: numberFromInput(els.monthlyIncome, 5000),
    contractHours: numberFromInput(els.contractHours, 8),
  };
}

function formatMoney(value, decimals) {
  return `¥${value.toFixed(decimals)}`;
}

function formatClock(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}小时${minutes}分钟${seconds}秒`;
}

function calculateRates() {
  const { monthlyIncome, contractHours } = getInputs();
  const daySalary = monthlyIncome / WORK_DAYS_PER_MONTH;
  const standardRate = daySalary / contractHours;
  const elapsedHours = state.elapsedSeconds / 3600;
  const effectiveHours = Math.max(elapsedHours, contractHours);
  const liveRate = state.elapsedSeconds > 0 ? daySalary / effectiveHours : 0;
  const estimatedMonthly = liveRate * contractHours * WORK_DAYS_PER_MONTH;
  return { contractHours, standardRate, liveRate, estimatedMonthly };
}

function updateMoneyColor(liveRate, standardRate) {
  const isAfterContract = state.elapsedSeconds >= getInputs().contractHours * 3600;
  els.timer.classList.toggle("timer-after", isAfterContract);
  els.timer.classList.toggle("timer-before", !isAfterContract);
  els.liveRate.classList.toggle("money-red", state.elapsedSeconds > 0 && liveRate < standardRate);
  els.liveRate.classList.toggle("money-blue", state.elapsedSeconds === 0 || liveRate >= standardRate);
}

function render() {
  const { contractHours, standardRate, liveRate, estimatedMonthly } = calculateRates();
  els.timer.value = formatClock(state.elapsedSeconds);
  els.standardRate.textContent = formatMoney(standardRate, 4);
  els.liveRate.textContent = formatMoney(liveRate, 4);
  els.summaryDuration.textContent = formatDuration(state.elapsedSeconds);
  els.summaryStandardRate.textContent = formatMoney(standardRate, 4);
  els.summaryLiveRate.textContent = formatMoney(liveRate, 4);
  els.summaryMonthly.textContent = formatMoney(estimatedMonthly, 2);
  document.querySelector(".summary-estimate span").textContent =
    `计算方式：今日真实时薪 × ${trimNumber(contractHours)}小时 × 21.75天`;
  updateMoneyColor(liveRate, standardRate);
}

function trimNumber(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function showDoneView() {
  state.running = false;
  clearInterval(state.intervalId);
  render();
  els.workView.hidden = true;
  els.doneView.hidden = false;
}

function showWorkView() {
  els.doneView.hidden = true;
  els.workView.hidden = false;
  render();
}

function tick() {
  if (!state.running) {
    return;
  }
  state.elapsedSeconds += 1;
  render();
}

function startInterval() {
  clearInterval(state.intervalId);
  state.intervalId = setInterval(tick, DEMO_TICK_MS);
}

function resetToVideoStart() {
  state.elapsedSeconds = 0;
  state.hasStarted = false;
  state.running = false;
  state.fishMode = false;
  els.pauseBtn.querySelector("span:first-child").textContent = "▶";
  els.pauseBtn.querySelector("span:last-child").textContent = "开始工作";
  els.fishBtn.querySelector("span:last-child").textContent = "开始摸鱼";
  showWorkView();
  clearInterval(state.intervalId);
}

els.pauseBtn.addEventListener("click", () => {
  if (!state.hasStarted) {
    state.hasStarted = true;
    state.running = true;
    window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
  } else {
    state.running = !state.running;
  }

  els.pauseBtn.querySelector("span:first-child").textContent = state.running ? "Ⅱ" : "▶";
  els.pauseBtn.querySelector("span:last-child").textContent = state.running ? "暂停工作" : "继续工作";
  if (state.running) {
    startInterval();
  } else {
    clearInterval(state.intervalId);
  }
});

els.finishBtn.addEventListener("click", showDoneView);

els.fishBtn.addEventListener("click", () => {
  state.fishMode = !state.fishMode;
  els.fishBtn.querySelector("span:last-child").textContent = state.fishMode ? "停止摸鱼" : "开始摸鱼";
  if (state.fishMode) {
    window.open("https://www.douyin.com/", "_blank", "noopener,noreferrer");
  }
});

els.backBtn.addEventListener("click", showWorkView);

els.newDayBtn.addEventListener("click", () => {
  state.elapsedSeconds = 0;
  state.hasStarted = false;
  state.running = false;
  els.pauseBtn.querySelector("span:first-child").textContent = "▶";
  els.pauseBtn.querySelector("span:last-child").textContent = "开始工作";
  showWorkView();
  clearInterval(state.intervalId);
});

[els.monthlyIncome, els.contractHours].forEach((input) => {
  input.addEventListener("input", render);
});

render();

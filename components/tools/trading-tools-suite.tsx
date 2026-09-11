"use client";

import { useMemo, useState } from "react";

type Variant =
  | "position-size-calculator"
  | "risk-reward-calculator"
  | "trading-profit-loss-calculator"
  | "stop-loss-calculator"
  | "take-profit-calculator"
  | "trading-risk-calculator"
  | "margin-calculator"
  | "leverage-calculator"
  | "break-even-calculator"
  | "average-entry-price-calculator"
  | "trading-expectancy-calculator"
  | "drawdown-calculator";

type FieldProps = { label: string; value: string; onChange: (value: string) => void; suffix?: string; step?: string };
const n = (value: string) => Number.parseFloat(value) || 0;
const money = (value: number) => Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0";
const percent = (value: number) => `${value.toFixed(2)}%`;
const focusRing = "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c8f169] focus-visible:ring-offset-1";

function Field({ label, value, onChange, suffix, step = "any" }: FieldProps) {
  return <label className="block">
    <span className="mb-2 block text-xs font-bold text-black/60">{label}</span>
    <div className="relative">
      <input inputMode="decimal" type="number" min="0" step={step} value={value} onChange={(event) => onChange(event.target.value)} className={`min-h-12 w-full rounded-xl border border-[#dcd9d1] bg-white px-3.5 text-sm font-semibold outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-[#c8f169] ${suffix ? "pr-12" : ""}`} />
      {suffix && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-bold text-black/35">{suffix}</span>}
    </div>
  </label>;
}

function Result({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div className="rounded-2xl border border-[#dfe6c9] bg-[#f4f8e9] p-4">
    <p className="text-xs font-bold text-[#5b7025]">{label}</p>
    <p className="mt-1 break-words text-2xl font-black tracking-tight text-[#171717]">{value}</p>
    {note && <p className="mt-1 text-xs leading-5 text-black/45">{note}</p>}
  </div>;
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-2xl border border-[#d8d4c9] bg-[#fffdf8] shadow-[0_8px_24px_rgba(23,23,23,.04)]">
    <div className="border-b border-[#d8d4c9] bg-[#f4f1e9] px-5 py-4 md:px-6">
      <h3 className="text-base font-black">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-black/40">Calculations run locally in your browser. Values are estimates, not financial advice.</p>
    </div>
    <div className="space-y-5 p-5 md:p-6">{children}</div>
  </div>;
}

export default function TradingToolsSuite({ variant }: { variant: Variant }) {
  switch (variant) {
    case "position-size-calculator": return <PositionSize />;
    case "risk-reward-calculator": return <RiskReward />;
    case "trading-profit-loss-calculator": return <TradingPnL />;
    case "stop-loss-calculator": return <StopLoss />;
    case "take-profit-calculator": return <TakeProfit />;
    case "trading-risk-calculator": return <TradingRisk />;
    case "margin-calculator": return <Margin />;
    case "leverage-calculator": return <Leverage />;
    case "break-even-calculator": return <BreakEven />;
    case "average-entry-price-calculator": return <AverageEntry />;
    case "trading-expectancy-calculator": return <Expectancy />;
    case "drawdown-calculator": return <Drawdown />;
  }
}

function PositionSize() {
  const [account, setAccount] = useState("50000"), [risk, setRisk] = useState("1"), [entry, setEntry] = useState("250"), [stop, setStop] = useState("240");
  const result = useMemo(() => { const riskAmount = n(account) * n(risk) / 100; const perUnit = Math.abs(n(entry) - n(stop)); const qty = perUnit > 0 ? Math.floor(riskAmount / perUnit) : 0; return { riskAmount, perUnit, qty, value: qty * n(entry) }; }, [account, risk, entry, stop]);
  return <Shell title="Position Size Calculator"><div className="grid gap-4 sm:grid-cols-2"><Field label="Account size" value={account} onChange={setAccount} /><Field label="Risk per trade" value={risk} onChange={setRisk} suffix="%" /><Field label="Entry price" value={entry} onChange={setEntry} /><Field label="Stop-loss price" value={stop} onChange={setStop} /></div><div className="grid gap-3 sm:grid-cols-3"><Result label="Risk amount" value={money(result.riskAmount)} /><Result label="Risk per unit" value={money(result.perUnit)} /><Result label="Position size" value={`${result.qty.toLocaleString()} units`} note={`Approx. position value: ${money(result.value)}`} /></div></Shell>;
}

function RiskReward() {
  const [entry, setEntry] = useState("250"), [stop, setStop] = useState("240"), [target, setTarget] = useState("270");
  const risk = Math.abs(n(entry) - n(stop)), reward = Math.abs(n(target) - n(entry));
  return <Shell title="Risk / Reward Calculator"><div className="grid gap-4 sm:grid-cols-3"><Field label="Entry price" value={entry} onChange={setEntry} /><Field label="Stop-loss price" value={stop} onChange={setStop} /><Field label="Target price" value={target} onChange={setTarget} /></div><div className="grid gap-3 sm:grid-cols-3"><Result label="Risk per unit" value={money(risk)} /><Result label="Reward per unit" value={money(reward)} /><Result label="Risk / reward" value={risk > 0 ? `1 : ${(reward / risk).toFixed(2)}` : "—"} /></div></Shell>;
}

function TradingPnL() {
  const [side, setSide] = useState<"long" | "short">("long"), [entry, setEntry] = useState("250"), [exit, setExit] = useState("275"), [qty, setQty] = useState("50"), [fees, setFees] = useState("50");
  const gross = (n(exit) - n(entry)) * n(qty) * (side === "long" ? 1 : -1), net = gross - n(fees), invested = n(entry) * n(qty);
  return <Shell title="Trading Profit & Loss Calculator"><div className="flex flex-wrap gap-2" role="group" aria-label="Trade direction"><button type="button" onClick={() => setSide("long")} aria-pressed={side === "long"} className={`${focusRing} min-h-11 rounded-xl border px-4 text-sm font-bold transition ${side === "long" ? "border-[#171717] bg-[#171717] text-white" : "border-[#dcd9d1] bg-white hover:border-[#171717]"}`}>Long</button><button type="button" onClick={() => setSide("short")} aria-pressed={side === "short"} className={`${focusRing} min-h-11 rounded-xl border px-4 text-sm font-bold transition ${side === "short" ? "border-[#171717] bg-[#171717] text-white" : "border-[#dcd9d1] bg-white hover:border-[#171717]"}`}>Short</button></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Field label="Entry price" value={entry} onChange={setEntry} /><Field label="Exit price" value={exit} onChange={setExit} /><Field label="Quantity" value={qty} onChange={setQty} /><Field label="Total fees" value={fees} onChange={setFees} /></div><div className="grid gap-3 sm:grid-cols-3"><Result label="Gross P&L" value={money(gross)} /><Result label="Fees" value={money(n(fees))} /><Result label="Net P&L" value={money(net)} note={invested > 0 ? `${percent((net / invested) * 100)} return on entry value` : undefined} /></div></Shell>;
}

function StopLoss() {
  const [entry, setEntry] = useState("250"), [qty, setQty] = useState("50"), [risk, setRisk] = useState("500");
  const distance = n(qty) > 0 ? n(risk) / n(qty) : 0;
  const longStop = n(entry) - distance, shortStop = n(entry) + distance;
  return <Shell title="Stop-Loss Calculator"><div className="grid gap-4 sm:grid-cols-3"><Field label="Entry price" value={entry} onChange={setEntry} /><Field label="Quantity" value={qty} onChange={setQty} /><Field label="Maximum risk" value={risk} onChange={setRisk} /></div><div className="grid gap-3 sm:grid-cols-2"><Result label="Long stop-loss" value={money(longStop)} note={`Distance: ${money(distance)} per unit`} /><Result label="Short stop-loss" value={money(shortStop)} note={`Distance: ${money(distance)} per unit`} /></div></Shell>;
}

function TakeProfit() {
  const [entry, setEntry] = useState("250"), [stop, setStop] = useState("240"), [rr, setRr] = useState("2");
  const risk = Math.abs(n(entry) - n(stop));
  return <Shell title="Take-Profit Calculator"><div className="grid gap-4 sm:grid-cols-3"><Field label="Entry price" value={entry} onChange={setEntry} /><Field label="Stop-loss price" value={stop} onChange={setStop} /><Field label="Target R multiple" value={rr} onChange={setRr} suffix="R" /></div><div className="grid gap-3 sm:grid-cols-3"><Result label="Risk per unit" value={money(risk)} /><Result label="Reward per unit" value={money(risk * n(rr))} /><Result label="Long target" value={money(n(entry) + risk * n(rr))} note={`Short target: ${money(n(entry) - risk * n(rr))}`} /></div></Shell>;
}

function TradingRisk() {
  const [account, setAccount] = useState("50000"), [risk, setRisk] = useState("1");
  const amount = n(account) * n(risk) / 100;
  return <Shell title="Trading Risk Calculator"><div className="grid gap-4 sm:grid-cols-2"><Field label="Account size" value={account} onChange={setAccount} /><Field label="Risk per trade" value={risk} onChange={setRisk} suffix="%" /></div><Result label="Maximum planned risk" value={money(amount)} note="This is the amount you would lose if the stop is hit, before fees and slippage." /></Shell>;
}

function Margin() {
  const [price, setPrice] = useState("250"), [qty, setQty] = useState("100"), [leverage, setLeverage] = useState("5");
  const value = n(price) * n(qty), margin = n(leverage) > 0 ? value / n(leverage) : 0;
  return <Shell title="Margin Calculator"><div className="grid gap-4 sm:grid-cols-3"><Field label="Entry price" value={price} onChange={setPrice} /><Field label="Quantity" value={qty} onChange={setQty} /><Field label="Leverage" value={leverage} onChange={setLeverage} suffix="×" /></div><div className="grid gap-3 sm:grid-cols-2"><Result label="Position value" value={money(value)} /><Result label="Estimated required margin" value={money(margin)} note="Actual broker margin can vary by instrument and market conditions." /></div></Shell>;
}

function Leverage() {
  const [capital, setCapital] = useState("50000"), [position, setPosition] = useState("250000");
  const leverage = n(capital) > 0 ? n(position) / n(capital) : 0;
  return <Shell title="Leverage Calculator"><div className="grid gap-4 sm:grid-cols-2"><Field label="Capital" value={capital} onChange={setCapital} /><Field label="Position value" value={position} onChange={setPosition} /></div><Result label="Effective leverage" value={`${leverage.toFixed(2)}×`} note="Leverage magnifies both gains and losses." /></Shell>;
}

function BreakEven() {
  const [entry, setEntry] = useState("250"), [qty, setQty] = useState("50"), [fees, setFees] = useState("100"), [side, setSide] = useState<"long" | "short">("long");
  const feePerUnit = n(qty) > 0 ? n(fees) / n(qty) : 0;
  const breakeven = side === "long" ? n(entry) + feePerUnit : n(entry) - feePerUnit;
  return <Shell title="Break-Even Price Calculator"><div className="flex flex-wrap gap-2" role="group" aria-label="Trade direction"><button type="button" onClick={() => setSide("long")} aria-pressed={side === "long"} className={`${focusRing} min-h-11 rounded-xl border px-4 text-sm font-bold transition ${side === "long" ? "border-[#171717] bg-[#171717] text-white" : "border-[#dcd9d1] bg-white hover:border-[#171717]"}`}>Long</button><button type="button" onClick={() => setSide("short")} aria-pressed={side === "short"} className={`${focusRing} min-h-11 rounded-xl border px-4 text-sm font-bold transition ${side === "short" ? "border-[#171717] bg-[#171717] text-white" : "border-[#dcd9d1] bg-white hover:border-[#171717]"}`}>Short</button></div><div className="grid gap-4 sm:grid-cols-3"><Field label="Entry price" value={entry} onChange={setEntry} /><Field label="Quantity" value={qty} onChange={setQty} /><Field label="Round-trip fees" value={fees} onChange={setFees} /></div><div className="grid gap-3 sm:grid-cols-2"><Result label="Break-even price" value={money(breakeven)} /><Result label="Fee per unit" value={money(feePerUnit)} /></div></Shell>;
}

function AverageEntry() {
  const [price1, setPrice1] = useState("250"), [qty1, setQty1] = useState("50"), [price2, setPrice2] = useState("240"), [qty2, setQty2] = useState("100");
  const totalQty = n(qty1) + n(qty2), totalCost = n(price1) * n(qty1) + n(price2) * n(qty2), avg = totalQty > 0 ? totalCost / totalQty : 0;
  return <Shell title="Average Entry Price Calculator"><div className="grid gap-4 sm:grid-cols-2"><Field label="First buy price" value={price1} onChange={setPrice1} /><Field label="First quantity" value={qty1} onChange={setQty1} /><Field label="Second buy price" value={price2} onChange={setPrice2} /><Field label="Second quantity" value={qty2} onChange={setQty2} /></div><div className="grid gap-3 sm:grid-cols-2"><Result label="Average entry price" value={money(avg)} /><Result label="Total quantity" value={totalQty.toLocaleString()} note={`Total cost: ${money(totalCost)}`} /></div></Shell>;
}

function Expectancy() {
  const [winRate, setWinRate] = useState("55"), [avgWin, setAvgWin] = useState("1000"), [avgLoss, setAvgLoss] = useState("600");
  const expectancy = n(winRate) / 100 * n(avgWin) - (1 - n(winRate) / 100) * n(avgLoss);
  const lossRate = 100 - n(winRate);
  return <Shell title="Trading Win Rate & Expectancy Calculator"><div className="grid gap-4 sm:grid-cols-3"><Field label="Win rate" value={winRate} onChange={setWinRate} suffix="%" /><Field label="Average win" value={avgWin} onChange={setAvgWin} /><Field label="Average loss" value={avgLoss} onChange={setAvgLoss} /></div><div className="grid gap-3 sm:grid-cols-3"><Result label="Loss rate" value={percent(lossRate)} /><Result label="Expectancy / trade" value={money(expectancy)} /><Result label="Win / loss ratio" value={n(avgLoss) > 0 ? `${(n(avgWin) / n(avgLoss)).toFixed(2)} : 1` : "—"} /></div></Shell>;
}

function Drawdown() {
  const [peak, setPeak] = useState("100000"), [current, setCurrent] = useState("85000"), [recovery, setRecovery] = useState("0");
  const dd = n(peak) > 0 ? (n(peak) - n(current)) / n(peak) * 100 : 0;
  const needed = n(current) > 0 ? (n(peak) / n(current) - 1) * 100 : 0;
  return <Shell title="Trading Drawdown Calculator"><div className="grid gap-4 sm:grid-cols-3"><Field label="Peak account value" value={peak} onChange={setPeak} /><Field label="Current account value" value={current} onChange={setCurrent} /><Field label="Recovery target" value={recovery} onChange={setRecovery} /></div><div className="grid gap-3 sm:grid-cols-2"><Result label="Drawdown" value={percent(dd)} /><Result label="Gain needed to recover" value={percent(needed)} note={n(recovery) > 0 ? `To reach ${money(n(recovery))}: ${percent(n(current) > 0 ? (n(recovery) / n(current) - 1) * 100 : 0)}` : undefined} /></div></Shell>;
}

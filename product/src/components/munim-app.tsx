"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine, ArrowRight, BookOpenCheck, Check, ChevronRight,
  IndianRupee, Clock3, Download, FileText, Home, Loader2, MessageCircle,
  Plus, ReceiptIndianRupee, RefreshCw, Search, Send, Settings, ShieldCheck,
  Sparkles, TriangleAlert, Users, WalletCards, X,
} from "lucide-react";
import { formatINR, rupeesToPaise } from "@/lib/domain/money";
import type { AuditEvent, Business, Customer, Invoice, InvoiceDraft, InvoicePreview, ItemTemplate, Payment } from "@/lib/domain/types";

type Tab = "home" | "invoices" | "customers" | "receivables" | "settings";
type Snapshot = {
  business: Business; customers: Customer[]; items: ItemTemplate[]; invoices: Invoice[];
  payments: Payment[]; auditEvents: AuditEvent[];
  stats: { invoicedPaise: number; collectedPaise: number; outstandingPaise: number; overduePaise: number };
  mode: "AI" | "DETERMINISTIC_DEMO";
};

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, headers: { "content-type": "application/json", ...(options?.headers || {}) } });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Request failed");
  return body as T;
}

function statusLabel(status: Invoice["status"]) {
  return ({ ISSUED: "Unpaid", PART_PAID: "Part paid", PAID: "Paid", OVERDUE: "Overdue", DRAFT: "Draft", DISPUTED: "Disputed", CANCELLED: "Cancelled" })[status];
}

function StatusPill({ status }: { status: Invoice["status"] }) {
  return <span className={`status status-${status.toLowerCase().replace("_", "-")}`}>{statusLabel(status)}</span>;
}

function NavIcon({ tab }: { tab: Tab }) {
  const props = { size: 19, strokeWidth: 2 };
  if (tab === "home") return <Home {...props} />;
  if (tab === "invoices") return <FileText {...props} />;
  if (tab === "customers") return <Users {...props} />;
  if (tab === "receivables") return <WalletCards {...props} />;
  return <Settings {...props} />;
}

export function MunimApp() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  const refresh = useCallback(async () => {
    try { setSnapshot(await requestJson<Snapshot>("/api/bootstrap")); setError(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load business data"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    void requestJson<Snapshot>("/api/bootstrap")
      .then((data) => { if (active) { setSnapshot(data); setError(""); } })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Could not load business data"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <div className="loading-screen"><div className="brand-mark">M</div><Loader2 className="spin" /><p>Opening your business desk…</p></div>;
  if (!snapshot) return <div className="loading-screen"><TriangleAlert /><h1>Could not open the product</h1><p>{error}</p><button className="button primary" onClick={() => void refresh()}>Try again</button></div>;

  const title = ({ home: "Good morning", invoices: "Invoices", customers: "Customers", receivables: "Receivables", settings: "Business settings" })[tab];
  const nav: { tab: Tab; label: string }[] = [
    { tab: "home", label: "Home" }, { tab: "invoices", label: "Invoices" },
    { tab: "customers", label: "Customers" }, { tab: "receivables", label: "Pending" },
    { tab: "settings", label: "Settings" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">M</div><div><strong>{process.env.NEXT_PUBLIC_PRODUCT_NAME || "AI Munim"}</strong><span>Your business assistant</span></div></div>
        <nav>{nav.map((item) => <button key={item.tab} className={tab === item.tab ? "active" : ""} onClick={() => setTab(item.tab)}><NavIcon tab={item.tab} />{item.label}</button>)}</nav>
        <div className="trust-card"><ShieldCheck size={20} /><strong>Confirmation protected</strong><p>AI can prepare drafts. Only you can post financial entries.</p></div>
        <div className="business-chip"><div className="avatar">{snapshot.business.name.slice(0, 1)}</div><div><strong>{snapshot.business.name}</strong><span>{snapshot.business.gstin || "GSTIN pending"}</span></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div><p className="eyebrow">{snapshot.business.name}</p><h1>{title}{tab === "home" ? `, ${snapshot.business.name.split(" ")[0]}` : ""}</h1></div>
          <div className="top-actions"><span className={`mode-badge ${snapshot.mode === "AI" ? "online" : ""}`}><span />{snapshot.mode === "AI" ? "AI connected" : "Safe demo mode"}</span><button className="icon-button" onClick={() => void refresh()} aria-label="Refresh"><RefreshCw size={18} /></button></div>
        </header>
        {error && <div className="alert error"><TriangleAlert size={18} />{error}<button onClick={() => setError("")}><X size={16} /></button></div>}
        {tab === "home" && <Dashboard snapshot={snapshot} refresh={refresh} setTab={setTab} onPayment={setPaymentInvoice} onError={setError} />}
        {tab === "invoices" && <InvoicesView invoices={snapshot.invoices} onPayment={setPaymentInvoice} />}
        {tab === "customers" && <CustomersView customers={snapshot.customers} refresh={refresh} onError={setError} />}
        {tab === "receivables" && <ReceivablesView invoices={snapshot.invoices} onPayment={setPaymentInvoice} />}
        {tab === "settings" && <SettingsView snapshot={snapshot} refresh={refresh} onError={setError} />}
      </main>

      <nav className="mobile-nav">{nav.map((item) => <button key={item.tab} className={tab === item.tab ? "active" : ""} onClick={() => setTab(item.tab)}><NavIcon tab={item.tab} /><span>{item.label}</span></button>)}</nav>
      {paymentInvoice && <PaymentModal invoice={paymentInvoice} onClose={() => setPaymentInvoice(null)} onSaved={async () => { setPaymentInvoice(null); await refresh(); }} onError={setError} />}
    </div>
  );
}

function Dashboard({ snapshot, refresh, setTab, onPayment, onError }: { snapshot: Snapshot; refresh: () => Promise<void>; setTab: (tab: Tab) => void; onPayment: (invoice: Invoice) => void; onError: (message: string) => void }) {
  const [message, setMessage] = useState("Sharma Traders ka invoice bana do, 25 boxes × ₹850, GST 18%, 15 din credit");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<InvoicePreview | null>(null);
  const [provider, setProvider] = useState("");
  const recent = snapshot.invoices.slice(0, 4);

  async function interpret() {
    setBusy(true);
    try {
      const result = await requestJson<{ preview: InvoicePreview; provider: string }>("/api/assistant", { method: "POST", body: JSON.stringify({ message }) });
      setPreview(result.preview); setProvider(result.provider);
    } catch (cause) { onError(cause instanceof Error ? cause.message : "Could not prepare invoice"); }
    finally { setBusy(false); }
  }

  return <div className="page-grid">
    <section className="content-column">
      <div className="assistant-card">
        <div className="assistant-heading"><div className="spark"><Sparkles size={19} /></div><div><p className="eyebrow">Ask your Munim</p><h2>What would you like to do?</h2></div></div>
        <div className="composer"><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} placeholder="Invoice banao, payment add karo, ya pending pucho…" /><button onClick={() => void interpret()} disabled={busy || message.trim().length < 3}>{busy ? <Loader2 className="spin" size={20} /> : <Send size={20} />}</button></div>
        <div className="suggestions"><span>Try:</span>{["Gupta Enterprises ko ₹35,000 ka bill, GST 18%", "Sharma Traders ka 10 boxes x ₹850 bill"].map((text) => <button key={text} onClick={() => setMessage(text)}>{text}</button>)}</div>
      </div>
      {preview && <InvoicePreviewCard preview={preview} provider={provider} customers={snapshot.customers} onClose={() => setPreview(null)} onIssued={async () => { setPreview(null); await refresh(); setTab("invoices"); }} onError={onError} />}
      <div className="section-title"><div><p className="eyebrow">Latest activity</p><h2>Recent invoices</h2></div><button className="text-button" onClick={() => setTab("invoices")}>View all <ArrowRight size={16} /></button></div>
      <InvoiceTable invoices={recent} onPayment={onPayment} emptyText="Your issued invoices will appear here." />
    </section>
    <aside className="insights-column">
      <div className="stats-grid">
        <StatCard icon={<ReceiptIndianRupee />} label="Invoiced" value={formatINR(snapshot.stats.invoicedPaise)} tone="green" />
        <StatCard icon={<IndianRupee />} label="Collected" value={formatINR(snapshot.stats.collectedPaise)} tone="blue" />
        <StatCard icon={<Clock3 />} label="Outstanding" value={formatINR(snapshot.stats.outstandingPaise)} tone="amber" />
        <StatCard icon={<TriangleAlert />} label="Overdue" value={formatINR(snapshot.stats.overduePaise)} tone="red" />
      </div>
      <div className="side-card"><div className="side-card-head"><div className="icon-soft"><BookOpenCheck size={19} /></div><div><p className="eyebrow">CA mode</p><h3>Books ready to share</h3></div></div><p>Export the invoice register with tax, collection, and outstanding details.</p><a className="button secondary full" href="/api/export/invoices"><ArrowDownToLine size={17} /> Download CSV</a></div>
      <div className="side-card warm"><div className="side-card-head"><div className="icon-soft"><WalletCards size={19} /></div><div><p className="eyebrow">Collection focus</p><h3>{snapshot.invoices.filter((invoice) => invoice.balancePaise > 0).length} invoices need attention</h3></div></div><p>{snapshot.stats.outstandingPaise ? `${formatINR(snapshot.stats.outstandingPaise)} is waiting to be collected.` : "You have no outstanding collections yet."}</p><button className="button dark full" onClick={() => setTab("receivables")}>Review pending <ChevronRight size={17} /></button></div>
    </aside>
  </div>;
}

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return <div className={`stat-card ${tone}`}><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong></div>;
}

function InvoicePreviewCard({ preview: initial, provider, customers, onClose, onIssued, onError }: { preview: InvoicePreview; provider: string; customers: Customer[]; onClose: () => void; onIssued: () => Promise<void>; onError: (message: string) => void }) {
  const [preview, setPreview] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const draft: InvoiceDraft = useMemo(() => ({ customerId: preview.customer?.id || preview.customerId, customerName: preview.customerName, customerPhone: preview.customerPhone, customerStateCode: preview.customerStateCode, invoiceDate: preview.invoiceDate, dueDate: preview.dueDate, lines: preview.calculatedLines.map(({ description, quantity, unit, unitPricePaise, taxRateBps, priceIncludesTax, hsnSac }) => ({ description, quantity, unit, unitPricePaise, taxRateBps, priceIncludesTax, hsnSac })), notes: preview.notes, uncertainFields: preview.uncertainFields, sourceText: preview.sourceText }), [preview]);

  async function recalculate(next: InvoiceDraft) {
    setBusy(true);
    try { setPreview(await requestJson<InvoicePreview>("/api/invoices/preview", { method: "POST", body: JSON.stringify(next) })); setEditing(false); }
    catch (cause) { onError(cause instanceof Error ? cause.message : "Could not recalculate"); }
    finally { setBusy(false); }
  }

  async function confirm() {
    setBusy(true);
    try { await requestJson("/api/invoices", { method: "POST", body: JSON.stringify({ draft, idempotencyKey: crypto.randomUUID() }) }); await onIssued(); }
    catch (cause) { onError(cause instanceof Error ? cause.message : "Could not issue invoice"); }
    finally { setBusy(false); }
  }

  return <div className="preview-card">
    <div className="preview-top"><div><span className="draft-label"><Sparkles size={14} /> Draft prepared · {provider === "OPENAI" ? "AI extraction" : "local safe parser"}</span><h2>Review before issuing</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div>
    {editing ? <DraftEditor draft={draft} customers={customers} busy={busy} onCancel={() => setEditing(false)} onSave={recalculate} /> : <>
      <div className="preview-meta"><div><span>Customer</span><strong>{preview.customerName}</strong></div><div><span>Invoice date</span><strong>{preview.invoiceDate}</strong></div><div><span>Due date</span><strong>{preview.dueDate}</strong></div><div><span>Tax type</span><strong>{preview.interState ? "IGST" : "CGST + SGST"}</strong></div></div>
      <div className="line-card">{preview.calculatedLines.map((line, index) => <div className="line-row" key={`${line.description}-${index}`}><div><strong>{line.description}</strong><span>{line.quantity} {line.unit} × {formatINR(line.unitPricePaise)} · GST {line.taxRateBps / 100}%{line.priceIncludesTax ? " inclusive" : ""}</span></div><strong>{formatINR(line.totalPaise)}</strong></div>)}</div>
      <div className="totals"><div><span>Taxable value</span><strong>{formatINR(preview.totals.taxablePaise)}</strong></div>{preview.interState ? <div><span>IGST</span><strong>{formatINR(preview.totals.igstPaise)}</strong></div> : <><div><span>CGST</span><strong>{formatINR(preview.totals.cgstPaise)}</strong></div><div><span>SGST</span><strong>{formatINR(preview.totals.sgstPaise)}</strong></div></>}<div className="grand-total"><span>Invoice total</span><strong>{formatINR(preview.totals.totalPaise)}</strong></div></div>
      {preview.warnings.length > 0 && <div className="alert warning"><TriangleAlert size={18} /><div>{preview.warnings.map((warning) => <p key={warning}>{warning}</p>)}</div></div>}
      <div className="confirmation-note"><ShieldCheck size={18} /><span>Nothing is posted until you press “Confirm & issue”. Invoice number will be allocated only then.</span></div>
      <div className="preview-actions"><button className="button secondary" onClick={() => setEditing(true)}>Edit details</button><button className="button primary" disabled={busy} onClick={() => void confirm()}>{busy ? <Loader2 className="spin" size={18} /> : <Check size={18} />} Confirm & issue</button></div>
    </>}
  </div>;
}

function DraftEditor({ draft, customers, busy, onCancel, onSave }: { draft: InvoiceDraft; customers: Customer[]; busy: boolean; onCancel: () => void; onSave: (draft: InvoiceDraft) => Promise<void> }) {
  const [form, setForm] = useState(draft);
  const line = form.lines[0];
  function lineField(update: Partial<typeof line>) { setForm({ ...form, lines: [{ ...line, ...update }, ...form.lines.slice(1)], uncertainFields: [] }); }
  return <div className="form-grid preview-editor">
    <label><span>Customer</span><select value={form.customerId || ""} onChange={(event) => { const customer = customers.find((entry) => entry.id === event.target.value); setForm({ ...form, customerId: customer?.id, customerName: customer?.name || form.customerName, customerPhone: customer?.phone, customerStateCode: customer?.stateCode }); }}><option value="">New customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label>
    {!form.customerId && <label><span>Customer name</span><input value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} /></label>}
    <label><span>Description</span><input value={line.description} onChange={(event) => lineField({ description: event.target.value })} /></label>
    <label><span>Quantity</span><input value={line.quantity} inputMode="decimal" onChange={(event) => lineField({ quantity: event.target.value })} /></label>
    <label><span>Rate (₹)</span><input value={(line.unitPricePaise / 100).toFixed(2)} inputMode="decimal" onChange={(event) => { try { lineField({ unitPricePaise: rupeesToPaise(event.target.value || "0") }); } catch { /* keep last valid value */ } }} /></label>
    <label><span>GST rate</span><select value={line.taxRateBps} onChange={(event) => lineField({ taxRateBps: Number(event.target.value) })}>{[0, 500, 1200, 1800, 2800].map((rate) => <option value={rate} key={rate}>{rate / 100}%</option>)}</select></label>
    <label><span>Due date</span><input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} /></label>
    <label className="checkbox"><input type="checkbox" checked={line.priceIncludesTax} onChange={(event) => lineField({ priceIncludesTax: event.target.checked })} /><span>Rate includes GST</span></label>
    <div className="form-actions"><button className="button ghost" onClick={onCancel}>Cancel</button><button className="button primary" disabled={busy} onClick={() => void onSave(form)}>{busy && <Loader2 className="spin" size={17} />} Recalculate</button></div>
  </div>;
}

function InvoiceTable({ invoices, onPayment, emptyText }: { invoices: Invoice[]; onPayment: (invoice: Invoice) => void; emptyText: string }) {
  if (!invoices.length) return <div className="empty-state"><div className="icon-soft"><FileText /></div><h3>No invoices yet</h3><p>{emptyText}</p></div>;
  return <div className="table-card"><div className="table-scroll"><table><thead><tr><th>Invoice</th><th>Customer</th><th>Due</th><th>Amount</th><th>Status</th><th /></tr></thead><tbody>{invoices.map((invoice) => <tr key={invoice.id}><td><strong>{invoice.invoiceNumber}</strong><span>{invoice.invoiceDate}</span></td><td><strong>{invoice.customerSnapshot.name}</strong><span>{invoice.interState ? "Inter-state" : "Intra-state"}</span></td><td>{invoice.dueDate}</td><td><strong>{formatINR(invoice.totals.totalPaise)}</strong><span>{invoice.balancePaise ? `${formatINR(invoice.balancePaise)} pending` : "Fully collected"}</span></td><td><StatusPill status={invoice.status} /></td><td><div className="row-actions"><a title="Invoice PDF" href={`/api/invoices/${invoice.id}/pdf`} target="_blank"><Download size={17} /></a>{invoice.balancePaise > 0 && <><a title="UPI QR" href={`/api/invoices/${invoice.id}/qr`} target="_blank"><IndianRupee size={17} /></a><button title="Record payment" onClick={() => onPayment(invoice)}><Plus size={17} /></button></>}</div></td></tr>)}</tbody></table></div></div>;
}

function InvoicesView({ invoices, onPayment }: { invoices: Invoice[]; onPayment: (invoice: Invoice) => void }) {
  const [query, setQuery] = useState("");
  const filtered = invoices.filter((invoice) => `${invoice.invoiceNumber} ${invoice.customerSnapshot.name}`.toLowerCase().includes(query.toLowerCase()));
  return <section><div className="toolbar"><div className="search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer or invoice" /></div><a className="button secondary" href="/api/export/invoices"><ArrowDownToLine size={17} /> Export</a></div><InvoiceTable invoices={filtered} onPayment={onPayment} emptyText="Create one from the assistant on Home." /></section>;
}

function ReceivablesView({ invoices, onPayment }: { invoices: Invoice[]; onPayment: (invoice: Invoice) => void }) {
  const pending = invoices.filter((invoice) => invoice.balancePaise > 0 && !["CANCELLED", "DISPUTED"].includes(invoice.status)).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const total = pending.reduce((sum, invoice) => sum + invoice.balancePaise, 0);
  return <section><div className="hero-strip"><div><p className="eyebrow">Money to collect</p><strong>{formatINR(total)}</strong><span>across {pending.length} invoices</span></div><Clock3 size={38} /></div><InvoiceTable invoices={pending} onPayment={onPayment} emptyText="No pending receivables. Nice work." /><div className="notice"><MessageCircle size={20} /><div><strong>WhatsApp reminders stay under your control</strong><p>Open an invoice PDF, use the QR, and share from your own WhatsApp. Automated templates will come only after merchant onboarding and policy approval.</p></div></div></section>;
}

function CustomersView({ customers, refresh, onError }: { customers: Customer[]; refresh: () => Promise<void>; onError: (message: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", gstin: "", address: "", stateCode: "22", stateName: "Chhattisgarh" });
  async function save() { try { await requestJson("/api/customers", { method: "POST", body: JSON.stringify(form) }); setAdding(false); setForm({ name: "", phone: "", email: "", gstin: "", address: "", stateCode: "22", stateName: "Chhattisgarh" }); await refresh(); } catch (cause) { onError(cause instanceof Error ? cause.message : "Could not save customer"); } }
  return <section><div className="toolbar"><p className="muted">{customers.length} saved customers</p><button className="button primary" onClick={() => setAdding(true)}><Plus size={17} /> Add customer</button></div>{adding && <div className="panel form-grid"><label><span>Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label><span>Phone</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label><span>GSTIN (optional)</span><input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })} /></label><label><span>State code</span><input value={form.stateCode} maxLength={2} onChange={(e) => setForm({ ...form, stateCode: e.target.value })} /></label><label><span>State name</span><input value={form.stateName} onChange={(e) => setForm({ ...form, stateName: e.target.value })} /></label><label><span>Address</span><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label><div className="form-actions"><button className="button ghost" onClick={() => setAdding(false)}>Cancel</button><button className="button primary" onClick={() => void save()}>Save customer</button></div></div>}<div className="customer-grid">{customers.map((customer) => <article className="customer-card" key={customer.id}><div className="avatar large">{customer.name.slice(0, 1)}</div><div><h3>{customer.name}</h3><p>{customer.phone || "No phone"}</p><span>{customer.gstin || `State ${customer.stateCode}`}</span></div></article>)}</div></section>;
}

function SettingsView({ snapshot, refresh, onError }: { snapshot: Snapshot; refresh: () => Promise<void>; onError: (message: string) => void }) {
  const business = snapshot.business;
  const [form, setForm] = useState({ name: business.name, legalName: business.legalName, gstRegistered: business.gstRegistered, gstin: business.gstin, address: business.address, stateCode: business.stateCode, stateName: business.stateName, phone: business.phone, email: business.email, upiId: business.upiId, invoicePrefix: business.invoicePrefix, defaultDueDays: business.defaultDueDays });
  const [saved, setSaved] = useState(false);
  async function save() { try { await requestJson("/api/business", { method: "PUT", body: JSON.stringify(form) }); setSaved(true); setTimeout(() => setSaved(false), 2500); await refresh(); } catch (cause) { onError(cause instanceof Error ? cause.message : "Could not save business"); } }
  return <div className="settings-grid"><section className="panel"><div className="section-title"><div><p className="eyebrow">Invoice identity</p><h2>Business profile</h2></div>{saved && <span className="saved"><Check size={15} /> Saved</span>}</div><div className="form-grid"><label><span>Trade name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label><span>Legal name</span><input value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} /></label><label><span>GSTIN</span><input value={form.gstin} maxLength={15} onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })} /></label><label><span>State code</span><input value={form.stateCode} maxLength={2} onChange={(e) => setForm({ ...form, stateCode: e.target.value })} /></label><label className="wide"><span>Address</span><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label><label><span>UPI ID</span><input value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} /></label><label><span>Invoice prefix</span><input value={form.invoicePrefix} onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value.toUpperCase() })} /></label><label><span>Default credit days</span><input type="number" value={form.defaultDueDays} onChange={(e) => setForm({ ...form, defaultDueDays: Number(e.target.value) })} /></label><div className="form-actions wide"><button className="button primary" onClick={() => void save()}><Check size={17} /> Save profile</button></div></div></section><aside className="panel"><p className="eyebrow">Recent controls</p><h2>Audit trail</h2><div className="audit-list">{snapshot.auditEvents.length ? snapshot.auditEvents.slice(0, 8).map((event) => <div key={event.id}><div className="audit-dot" /><div><strong>{event.action.replaceAll("_", " ").toLowerCase()}</strong><span>{new Date(event.createdAt).toLocaleString("en-IN")}</span></div></div>) : <p className="muted">Financial activity will be recorded here.</p>}</div></aside></div>;
}

function PaymentModal({ invoice, onClose, onSaved, onError }: { invoice: Invoice; onClose: () => void; onSaved: () => Promise<void>; onError: (message: string) => void }) {
  const [amount, setAmount] = useState((invoice.balancePaise / 100).toFixed(2));
  const [method, setMethod] = useState("UPI");
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  async function save() { setBusy(true); try { await requestJson("/api/payments", { method: "POST", body: JSON.stringify({ invoiceId: invoice.id, amountPaise: rupeesToPaise(amount), method, reference, paidAt: new Date().toISOString(), idempotencyKey: crypto.randomUUID() }) }); await onSaved(); } catch (cause) { onError(cause instanceof Error ? cause.message : "Could not record payment"); } finally { setBusy(false); } }
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="preview-top"><div><p className="eyebrow">Record payment</p><h2>{invoice.customerSnapshot.name}</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div><div className="payment-balance"><span>Outstanding on {invoice.invoiceNumber}</span><strong>{formatINR(invoice.balancePaise)}</strong></div><div className="form-grid one"><label><span>Amount received (₹)</span><input autoFocus value={amount} inputMode="decimal" onChange={(e) => setAmount(e.target.value)} /></label><label><span>Payment method</span><select value={method} onChange={(e) => setMethod(e.target.value)}>{["UPI", "BANK", "CASH", "CHEQUE", "OTHER"].map((value) => <option key={value}>{value}</option>)}</select></label><label><span>Reference (optional)</span><input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="UTR, cheque no., or note" /></label></div><div className="confirmation-note"><ShieldCheck size={18} /><span>This creates an auditable receipt entry. It does not independently verify a bank transfer.</span></div><div className="preview-actions"><button className="button ghost" onClick={onClose}>Cancel</button><button className="button primary" disabled={busy} onClick={() => void save()}>{busy ? <Loader2 className="spin" size={17} /> : <Check size={17} />} Record payment</button></div></div></div>;
}

import { useState, useMemo, useEffect, useCallback, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_MONTH = new Date().toLocaleString("en-US", { month: "long" });
const CURRENT_YEAR = new Date().getFullYear();
const STORAGE_KEY = "ktRM_v2_tenants";

const PAYMENT_METHODS = [
  "Zelle",
  "Cash App",
  "Cash",
  "Check",
  "Venmo",
  "Bank Transfer",
  "Other",
];

const COMPANY = {
  name: "KT Solutions LLC",
  address: "16406 Ash Point Ln, Sugar Land, TX",
  phone: "346-578-1796",
  zelleName: "Christian Chamdet",
  zellePhone: "346-578-1796",
  zelleEmail: "bafang1981@gmail.com",
  cashAppName: "KT solution",
  cashAppHandle: "$Bafang",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const emptyPayments = () => Object.fromEntries(MONTHS.map((m) => [m, 0]));

const normalizeTenant = (t) => ({
  ...t,
  monthlyRent: Math.max(0, Number(t.monthlyRent) || 0),
  securityDeposit: Math.max(0, Number(t.securityDeposit) || 0),
  payments: { ...emptyPayments(), ...(t.payments || {}) },
});

const currency = (v) =>
  "$" +
  Math.max(0, Number(v) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
  });

const sanitize = (str) => String(str || "").trim().slice(0, 500);

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const leaseStatus = (leaseEnd) => {
  if (!leaseEnd) return "unknown";
  const daysLeft = Math.ceil((new Date(leaseEnd) - new Date()) / 86400000);
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 30) return "expiring";
  return "active";
};

// ─── Default Data ─────────────────────────────────────────────────────────────
const DEFAULT_TENANTS = [
  {
    id: generateId(),
    name: "AirBnb",
    unit: "Master",
    phone: "",
    email: "",
    leaseStart: "2026-01-01",
    leaseEnd: "2026-12-31",
    monthlyRent: 800,
    securityDeposit: 0,
    emergencyContact: "",
    notes: "Pays by Zelle",
    paymentMethod: "Zelle",
    payments: { ...emptyPayments(), January: 800, February: 800, March: 800, April: 800 },
  },
  {
    id: generateId(),
    name: "Nounamo",
    unit: "Unit B",
    phone: "",
    email: "",
    leaseStart: "2024-10-01",
    leaseEnd: "2026-09-30",
    monthlyRent: 600,
    securityDeposit: 600,
    emergencyContact: "cyprien",
    notes: "",
    paymentMethod: "Zelle",
    payments: { ...emptyPayments(), January: 600, February: 600, March: 600, April: 600 },
  },
  {
    id: generateId(),
    name: "Admin",
    unit: "Unit D",
    phone: "2012046084",
    email: "",
    leaseStart: "2023-02-01",
    leaseEnd: "2027-01-31",
    monthlyRent: 600,
    securityDeposit: 600,
    emergencyContact: "",
    notes: "Works night shift",
    paymentMethod: "Cash",
    payments: { ...emptyPayments(), February: 600, March: 600, April: 600 },
  },
  {
    id: generateId(),
    name: "Mitch",
    unit: "Unit C",
    phone: "24106403240",
    email: "",
    leaseStart: "2023-07-15",
    leaseEnd: "2026-07-14",
    monthlyRent: 550,
    securityDeposit: 250,
    emergencyContact: "",
    notes: "",
    paymentMethod: "Zelle",
    payments: { ...emptyPayments(), January: 550, February: 550, March: 550, April: 550 },
  },
  {
    id: generateId(),
    name: "Ahmed Hussain",
    unit: "Unit E",
    phone: "2819030205",
    email: "",
    leaseStart: "2026-02-01",
    leaseEnd: "2026-10-31",
    monthlyRent: 600,
    securityDeposit: 300,
    emergencyContact: "",
    notes: "Usually pays early",
    paymentMethod: "Cash",
    payments: { ...emptyPayments(), February: 600, March: 600, April: 600 },
  },
  {
    id: generateId(),
    name: "Ingrid simo",
    unit: "AB",
    phone: "3469782086",
    email: "",
    leaseStart: "2026-02-01",
    leaseEnd: "2027-02-28",
    monthlyRent: 600,
    securityDeposit: 0,
    emergencyContact: "",
    notes: "1st Floor",
    paymentMethod: "Cash App",
    payments: { ...emptyPayments(), February: 600, March: 600, April: 600 },
  },
];

// ─── Storage ──────────────────────────────────────────────────────────────────
const storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      return parsed.map(normalizeTenant);
    } catch {
      return null;
    }
  },
  save(tenants) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants));
    } catch {
      // ignore
    }
  },
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f1117;
    --bg2: #161920;
    --bg3: #1d2029;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --accent: #c8a96e;
    --accent2: #e8c98a;
    --text: #e8e6e0;
    --text2: #9a9690;
    --text3: #6b6862;
    --green: #4caf7d;
    --green-bg: rgba(76,175,125,0.12);
    --red: #e05c5c;
    --red-bg: rgba(224,92,92,0.12);
    --amber: #e09a3c;
    --amber-bg: rgba(224,154,60,0.12);
    --blue: #5b8dee;
    --blue-bg: rgba(91,141,238,0.12);
    --radius: 12px;
    --radius-sm: 8px;
    --shadow: 0 2px 16px rgba(0,0,0,0.4);
    --font-display: 'DM Serif Display', Georgia, serif;
    --font-body: 'Outfit', sans-serif;
    --font-mono: 'DM Mono', monospace;
    --transition: 0.18s ease;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); font-size: 14px; line-height: 1.6; }
  .app { min-height: 100vh; }
  .sidebar { position: fixed; top: 0; left: 0; width: 220px; height: 100vh; background: var(--bg2); border-right: 1px solid var(--border); display: flex; flex-direction: column; z-index: 100; }
  .main { margin-left: 220px; padding: 32px; max-width: 1400px; }
  @media (max-width: 900px) { .sidebar { display: none; } .main { margin-left: 0; padding: 16px; } }

  .sidebar-logo { padding: 28px 20px 20px; border-bottom: 1px solid var(--border); }
  .sidebar-logo-title { font-family: var(--font-display); font-size: 18px; color: var(--accent); line-height: 1.2; }
  .sidebar-logo-sub { font-size: 11px; color: var(--text3); margin-top: 4px; font-family: var(--font-mono); }
  .sidebar-nav { padding: 16px 12px; flex: 1; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-sm); cursor: pointer; color: var(--text2); font-size: 13px; font-weight: 400; transition: var(--transition); border: none; background: none; width: 100%; text-align: left; }
  .nav-item:hover { background: var(--bg3); color: var(--text); }
  .nav-item.active { background: rgba(200,169,110,0.12); color: var(--accent); font-weight: 500; }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; }
  .sidebar-footer { padding: 16px; border-top: 1px solid var(--border); font-size: 11px; color: var(--text3); font-family: var(--font-mono); }

  .card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 20px; }
  .card-sm { padding: 16px; }
  .card-title { font-family: var(--font-display); font-size: 20px; color: var(--text); margin-bottom: 4px; }
  .card-sub { font-size: 13px; color: var(--text2); }

  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 20px; }
  .stat-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .stat-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; font-family: var(--font-mono); margin-bottom: 8px; }
  .stat-value { font-family: var(--font-display); font-size: 28px; color: var(--text); }
  .stat-sub { font-size: 12px; color: var(--text2); margin-top: 4px; }
  .stat-card.accent { border-color: rgba(200,169,110,0.3); background: rgba(200,169,110,0.06); }
  .stat-card.accent .stat-value { color: var(--accent2); }

  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 500; font-family: var(--font-mono); white-space: nowrap; }
  .badge-green  { background: var(--green-bg); color: var(--green); }
  .badge-red    { background: var(--red-bg); color: var(--red); }
  .badge-amber  { background: var(--amber-bg); color: var(--amber); }
  .badge-blue   { background: var(--blue-bg); color: var(--blue); }
  .badge-gray   { background: var(--bg3); color: var(--text2); }

  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; cursor: pointer; transition: var(--transition); border: none; font-family: var(--font-body); white-space: nowrap; }
  .btn-primary { background: var(--accent); color: #0f1117; }
  .btn-primary:hover { background: var(--accent2); }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border2); }
  .btn-ghost:hover { background: var(--bg3); color: var(--text); }
  .btn-danger { background: var(--red-bg); color: var(--red); border: 1px solid rgba(224,92,92,0.2); }
  .btn-danger:hover { background: rgba(224,92,92,0.2); }
  .btn-success { background: var(--green-bg); color: var(--green); border: 1px solid rgba(76,175,125,0.2); }
  .btn-success:hover { background: rgba(76,175,125,0.25); }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn-icon { padding: 6px 8px; }

  .input { width: 100%; padding: 9px 12px; background: var(--bg3); border: 1px solid var(--border2); border-radius: var(--radius-sm); color: var(--text); font-size: 13px; font-family: var(--font-body); transition: var(--transition); outline: none; }
  .input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(200,169,110,0.12); }
  .input::placeholder { color: var(--text3); }
  .input-group { display: flex; flex-direction: column; gap: 5px; }
  .input-label { font-size: 12px; color: var(--text2); font-weight: 500; }
  .input-error { border-color: var(--red) !important; }
  .error-msg { font-size: 11px; color: var(--red); font-family: var(--font-mono); }
  select.input { cursor: pointer; }
  .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }

  .table-wrap { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); }
  table { width: 100%; border-collapse: collapse; min-width: 800px; }
  th { padding: 12px 14px; font-size: 11px; color: var(--text3); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--border); text-align: left; background: var(--bg2); white-space: nowrap; }
  td { padding: 13px 14px; border-bottom: 1px solid var(--border); font-size: 13px; vertical-align: middle; white-space: nowrap; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--bg3); }
  .td-name { font-weight: 500; }
  .td-mono { font-family: var(--font-mono); }

  .pay-input { width: 88px; padding: 6px 8px; border-radius: 6px; font-size: 12px; font-family: var(--font-mono); text-align: center; border: 1px solid; outline: none; background: transparent; }
  .pay-input.paid { border-color: rgba(76,175,125,0.4); color: var(--green); background: var(--green-bg); }
  .pay-input.unpaid { border-color: rgba(224,92,92,0.3); color: var(--red); background: var(--red-bg); }
  .pay-input.partial { border-color: rgba(224,154,60,0.4); color: var(--amber); background: var(--amber-bg); }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
  .modal { background: var(--bg2); border: 1px solid var(--border2); border-radius: 16px; padding: 28px; width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow); }
  .modal-title { font-family: var(--font-display); font-size: 22px; margin-bottom: 20px; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }

  .toast-wrap { position: fixed; bottom: 24px; right: 24px; z-index: 999; display: flex; flex-direction: column; gap: 8px; }
  .toast { padding: 12px 18px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; animation: toastIn 0.2s ease; box-shadow: var(--shadow); }
  .toast-success { background: var(--green-bg); color: var(--green); border: 1px solid rgba(76,175,125,0.3); }
  .toast-error   { background: var(--red-bg); color: var(--red); border: 1px solid rgba(224,92,92,0.3); }
  .toast-info    { background: var(--blue-bg); color: var(--blue); border: 1px solid rgba(91,141,238,0.3); }
  @keyframes toastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .section-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
  .page-header { margin-bottom: 28px; }
  .page-title { font-family: var(--font-display); font-size: 32px; line-height: 1.1; }
  .page-sub { font-size: 14px; color: var(--text2); margin-top: 6px; }

  .search-wrap { position: relative; }
  .search-wrap .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--text3); pointer-events: none; }
  .search-wrap .input { padding-left: 34px; }

  .unpaid-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg3); margin-bottom: 8px; flex-wrap: wrap; }
  .unpaid-name { font-weight: 500; }
  .unpaid-meta { font-size: 12px; color: var(--text2); font-family: var(--font-mono); margin-top: 2px; }

  .confirm-dialog { background: var(--bg2); border: 1px solid var(--border2); border-radius: var(--radius); padding: 24px; width: 100%; max-width: 400px; text-align: center; }
  .confirm-dialog h3 { font-family: var(--font-display); font-size: 18px; margin-bottom: 10px; }
  .confirm-dialog p { font-size: 13px; color: var(--text2); margin-bottom: 20px; }
  .confirm-actions { display: flex; gap: 10px; justify-content: center; }

  .log-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .log-item:last-child { border-bottom: none; }
  .log-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .log-msg { font-size: 13px; }
  .log-time { font-size: 11px; color: var(--text3); font-family: var(--font-mono); margin-top: 2px; }

  .progress-bar { height: 4px; border-radius: 2px; background: var(--bg3); overflow: hidden; margin-top: 10px; }
  .progress-fill { height: 100%; border-radius: 2px; transition: width 0.4s ease; }

  .tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 4px; font-size: 11px; background: var(--bg3); color: var(--text2); border: 1px solid var(--border); font-family: var(--font-mono); }

  .month-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
  .month-pill { padding: 5px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; border: 1px solid var(--border2); color: var(--text2); background: none; font-family: var(--font-body); transition: var(--transition); }
  .month-pill:hover { border-color: var(--accent); color: var(--accent); }
  .month-pill.active { background: var(--accent); color: #0f1117; border-color: var(--accent); font-weight: 500; }

  .info-box { background: var(--blue-bg); border: 1px solid rgba(91,141,238,0.2); border-radius: var(--radius-sm); padding: 12px 16px; font-size: 13px; color: var(--blue); }

  .month-bars { display: grid; grid-template-columns: repeat(12, 1fr); gap: 4px; align-items: flex-end; height: 80px; }
  .month-bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .month-bar-fill { width: 100%; border-radius: 3px 3px 0 0; background: var(--accent); opacity: 0.7; min-height: 2px; transition: height 0.4s ease, opacity 0.2s; }
  .month-bar-fill.current { opacity: 1; }
  .month-bar-label { font-size: 9px; color: var(--text3); font-family: var(--font-mono); }

  .lease-active  { color: var(--green); }
  .lease-expiring { color: var(--amber); }
  .lease-expired  { color: var(--red); }

  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 500px) { .detail-grid { grid-template-columns: 1fr; } }

  .mini-month-table { width: 100%; border-collapse: collapse; }
  .mini-month-table td, .mini-month-table th { padding: 7px 10px; font-size: 12px; border-bottom: 1px solid var(--border); }
  .mini-month-table th { color: var(--text3); font-family: var(--font-mono); font-weight: 400; }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
`;

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = generateId();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => {
      setToasts((p) => p.filter((t) => t.id !== id));
    }, 3000);
  }, []);
  return {
    toasts,
    success: (m) => add(m, "success"),
    error: (m) => add(m, "error"),
    info: (m) => add(m, "info"),
  };
}

function Toasts({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="confirm-dialog">
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="confirm-actions">
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onConfirm}>
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── Tenant Modal ─────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "",
  unit: "",
  phone: "",
  email: "",
  leaseStart: "",
  leaseEnd: "",
  monthlyRent: "",
  securityDeposit: "",
  emergencyContact: "",
  notes: "",
  paymentMethod: "Cash",
};

function TenantModal({ tenant, onSave, onClose }) {
  const isEdit = !!tenant;
  const [form, setForm] = useState(
    isEdit
      ? {
          name: tenant.name,
          unit: tenant.unit,
          phone: tenant.phone,
          email: tenant.email,
          leaseStart: tenant.leaseStart,
          leaseEnd: tenant.leaseEnd,
          monthlyRent: String(tenant.monthlyRent),
          securityDeposit: String(tenant.securityDeposit),
          emergencyContact: tenant.emergencyContact,
          notes: tenant.notes,
          paymentMethod: tenant.paymentMethod || "Cash",
        }
      : { ...EMPTY_FORM }
  );

  const [errors, setErrors] = useState({});

  const setField = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.unit.trim()) e.unit = "Required";
    if (!form.monthlyRent || isNaN(Number(form.monthlyRent)) || Number(form.monthlyRent) < 0) {
      e.monthlyRent = "Enter a valid amount";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Invalid email";
    }
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    const data = {
      name: sanitize(form.name),
      unit: sanitize(form.unit),
      phone: sanitize(form.phone),
      email: sanitize(form.email),
      leaseStart: form.leaseStart,
      leaseEnd: form.leaseEnd,
      monthlyRent: Math.max(0, Number(form.monthlyRent) || 0),
      securityDeposit: Math.max(0, Number(form.securityDeposit) || 0),
      emergencyContact: sanitize(form.emergencyContact),
      notes: sanitize(form.notes),
      paymentMethod: form.paymentMethod,
    };
    onSave(data);
  };

  const F = ({ label, k, type = "text", placeholder = "" }) => (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        className={`input${errors[k] ? " input-error" : ""}`}
        type={type}
        placeholder={placeholder}
        value={form[k]}
        onChange={(e) => setField(k, e.target.value)}
      />
      {errors[k] && <span className="error-msg">{errors[k]}</span>}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{isEdit ? "Edit Tenant" : "Add New Tenant"}</div>
        <div className="form-grid">
          <F label="Full Name *" k="name" />
          <F label="Unit / Room *" k="unit" />
          <F label="Phone" k="phone" type="tel" />
          <F label="Email" k="email" type="email" />
          <F label="Lease Start" k="leaseStart" type="date" />
          <F label="Lease End" k="leaseEnd" type="date" />
          <F label="Monthly Rent ($) *" k="monthlyRent" type="number" placeholder="0" />
          <F label="Security Deposit ($)" k="securityDeposit" type="number" placeholder="0" />
          <F label="Emergency Contact" k="emergencyContact" />
          <div className="input-group">
            <label className="input-label">Payment Method</label>
            <select
              className="input"
              value={form.paymentMethod}
              onChange={(e) => setField("paymentMethod", e.target.value)}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="input-group" style={{ gridColumn: "1 / -1" }}>
            <label className="input-label">Notes</label>
            <input
              className="input"
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Any notes about this tenant..."
            />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {isEdit ? "Save Changes" : "Add Tenant"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tenant Detail Modal ──────────────────────────────────────────────────────
function TenantDetail({ tenant, selectedMonth, onClose, onEdit, onMarkPaid }) {
  const paid = tenant.payments[selectedMonth] || 0;
  const balance = tenant.monthlyRent - paid;
  const yearTotal = MONTHS.reduce((s, m) => s + (tenant.payments[m] || 0), 0);
  const status = leaseStatus(tenant.leaseEnd);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <div className="modal-title" style={{ marginBottom: 4 }}>
              {tenant.name}
            </div>
            <span className="tag">{tenant.unit}</span>{" "}
            <span
              className={`badge badge-${
                status === "active" ? "green" : status === "expiring" ? "amber" : "red"
              }`}
            >
              {status === "active"
                ? "Active"
                : status === "expiring"
                ? "Expiring soon"
                : "Expired"}
            </span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        <div
          className="detail-grid"
          style={{ marginBottom: 20 }}
        >
          {[
            ["Phone", tenant.phone || "—"],
            ["Email", tenant.email || "—"],
            ["Monthly Rent", currency(tenant.monthlyRent)],
            ["Security Deposit", currency(tenant.securityDeposit)],
            ["Lease Start", tenant.leaseStart || "—"],
            ["Lease End", tenant.leaseEnd || "—"],
            ["Payment Method", tenant.paymentMethod || "—"],
            ["Emergency Contact", tenant.emergencyContact || "—"],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
                {label}
              </div>
              <div>{value}</div>
            </div>
          ))}
          {tenant.notes && (
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
                Notes
              </div>
              <div>{tenant.notes}</div>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div className="stat-card card-sm">
            <div className="stat-label">{selectedMonth} Paid</div>
            <div style={{ fontSize: 20, fontFamily: "var(--font-display)", color: paid >= tenant.monthlyRent ? "var(--green)" : "var(--red)" }}>
              {currency(paid)}
            </div>
          </div>
          <div className="stat-card card-sm">
            <div className="stat-label">Balance</div>
            <div style={{ fontSize: 20, fontFamily: "var(--font-display)", color: balance > 0 ? "var(--red)" : "var(--green)" }}>
              {currency(balance)}
            </div>
          </div>
          <div className="stat-card card-sm">
            <div className="stat-label">Year Total</div>
            <div style={{ fontSize: 20, fontFamily: "var(--font-display)" }}>
              {currency(yearTotal)}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8, fontFamily: "var(--font-mono)" }}>
            MONTHLY PAYMENTS — {CURRENT_YEAR}
          </div>
          <table className="mini-month-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((m) => {
                const p = tenant.payments[m] || 0;
                const b = tenant.monthlyRent - p;
                const s = p >= tenant.monthlyRent ? "paid" : p > 0 ? "partial" : "unpaid";
                return (
                  <tr key={m}>
                    <td style={{ color: m === selectedMonth ? "var(--accent)" : "var(--text)" }}>{m}</td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>{currency(p)}</td>
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: b > 0 ? "var(--red)" : "var(--green)",
                      }}
                    >
                      {currency(b)}
                    </td>
                    <td>
                      <span className={`badge badge-${s === "paid" ? "green" : s === "partial" ? "amber" : "gray"}`}>
                        {s}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="modal-actions">
          {balance > 0 && (
            <button
              className="btn btn-success"
              onClick={() => {
                onMarkPaid(tenant.id);
                onClose();
              }}
            >
              Mark {selectedMonth} Paid
            </button>
          )}
          <button
            className="btn btn-ghost"
            onClick={() => {
              onEdit(tenant);
              onClose();
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const toast = useToast();

  const [tenants, setTenants] = useState(() => storage.load() || DEFAULT_TENANTS.map(normalizeTenant));
  const [view, setView] = useState("dashboard");
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTenant, setEditTenant] = useState(null);
  const [viewTenant, setViewTenant] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const saveTimer = useRef(null);

  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => storage.save(tenants), 600);
    return () => clearTimeout(saveTimer.current);
  }, [tenants]);

  const logActivity = useCallback((msg, color = "var(--accent)") => {
    setActivityLog((p) => [
      { id: generateId(), msg, color, time: new Date().toLocaleTimeString() },
      ...p,
    ].slice(0, 50));
  }, []);

  const stats = useMemo(() => {
    const totalExpected = tenants.reduce((s, t) => s + t.monthlyRent, 0);
    const monthCollected = tenants.reduce((s, t) => s + (t.payments[selectedMonth] || 0), 0);
    const yearCollected = tenants.reduce(
      (s, t) => s + MONTHS.reduce((ms, m) => ms + (t.payments[m] || 0), 0),
      0
    );
    const unpaid = tenants.filter((t) => (t.payments[selectedMonth] || 0) < t.monthlyRent);
    const occupancy = tenants.length
      ? Math.round(
          (tenants.filter((t) => leaseStatus(t.leaseEnd) === "active").length / tenants.length) * 100
        )
      : 0;
    const monthByMonth = MONTHS.map((m) =>
      tenants.reduce((s, t) => s + (t.payments[m] || 0), 0)
    );
    const maxMonth = Math.max(...monthByMonth, 1);
    return { totalExpected, monthCollected, yearCollected, unpaid, occupancy, monthByMonth, maxMonth };
  }, [tenants, selectedMonth]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tenants;
    return tenants.filter((t) =>
      [t.name, t.unit, t.phone, t.email, t.notes, t.paymentMethod]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [tenants, search]);

  const addTenant = useCallback(
    (data) => {
      const t = normalizeTenant({ id: generateId(), ...data, payments: emptyPayments() });
      setTenants((p) => [...p, t]);
      setShowAddModal(false);
      logActivity(`Added tenant: ${t.name} (${t.unit})`, "var(--green)");
      toast.success(`${t.name} added`);
    },
    [logActivity, toast]
  );

  const updateTenant = useCallback(
    (data) => {
      setTenants((p) =>
        p.map((t) => (t.id === editTenant.id ? normalizeTenant({ ...t, ...data }) : t))
      );
      logActivity(`Updated: ${editTenant.name}`, "var(--blue)");
      toast.success("Tenant updated");
      setEditTenant(null);
    },
    [editTenant, logActivity, toast]
  );

  const deleteTenant = useCallback(
    (id) => {
      const t = tenants.find((x) => x.id === id);
      setTenants((p) => p.filter((x) => x.id !== id));
      setConfirmDelete(null);
      logActivity(`Removed: ${t?.name}`, "var(--red)");
      toast.info(`${t?.name} removed`);
    },
    [tenants, logActivity, toast]
  );

  const updatePayment = useCallback((id, month, rawValue) => {
    const value = Math.max(0, Number(rawValue) || 0);
    setTenants((p) =>
      p.map((t) => {
        if (t.id !== id) return t;
        return { ...t, payments: { ...t.payments, [month]: value } };
      })
    );
  }, []);

  const markPaid = useCallback(
    (id) => {
      setTenants((p) =>
        p.map((t) => {
          if (t.id !== id) return t;
          return {
            ...t,
            payments: { ...t.payments, [selectedMonth]: t.monthlyRent },
          };
        })
      );
      const t = tenants.find((x) => x.id === id);
      logActivity(`${t?.name} marked paid for ${selectedMonth}`, "var(--green)");
      toast.success(`Marked paid for ${selectedMonth}`);
    },
    [tenants, selectedMonth, logActivity, toast]
  );

  const markAllPaid = useCallback(() => {
    setTenants((p) =>
      p.map((t) => ({
        ...t,
        payments: { ...t.payments, [selectedMonth]: t.monthlyRent },
      }))
    );
    logActivity(`All tenants marked paid for ${selectedMonth}`, "var(--green)");
    toast.success(`All marked paid for ${selectedMonth}`);
  }, [selectedMonth, logActivity, toast]);

  const exportCSV = useCallback(() => {
    const headers = [
      "Name",
      "Unit",
      "Phone",
      "Email",
      "Monthly Rent",
      "Security Deposit",
      "Lease Start",
      "Lease End",
      "Payment Method",
      ...MONTHS,
      "Year Total",
    ];
    const rows = tenants.map((t) => {
      const yearTotal = MONTHS.reduce((s, m) => s + (t.payments[m] || 0), 0);
      return [
        t.name,
        t.unit,
        t.phone,
        t.email,
        t.monthlyRent,
        t.securityDeposit,
        t.leaseStart,
        t.leaseEnd,
        t.paymentMethod,
        ...MONTHS.map((m) => t.payments[m] || 0),
        yearTotal,
      ];
    });
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `KT_Rental_${CURRENT_YEAR}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  }, [tenants, toast]);

  const NAV = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "tenants", icon: "◉", label: "Tenants" },
    { id: "payments", icon: "◎", label: "Payments" },
    { id: "activity", icon: "◌", label: "Activity Log" },
    { id: "info", icon: "◫", label: "Payment Info" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-title">KT Rentals</div>
            <div className="sidebar-logo-sub">{COMPANY.name}</div>
          </div>
          <nav className="sidebar-nav">
            {NAV.map((n) => (
              <button
                key={n.id}
                className={`nav-item${view === n.id ? " active" : ""}`}
                onClick={() => setView(n.id)}
              >
                <span className="nav-icon">{n.icon}</span> {n.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">{COMPANY.address}</div>
        </aside>

        <main className="main">
          {view === "dashboard" && (
            <Dashboard
              stats={stats}
              tenants={tenants}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              onMarkPaid={markPaid}
              onMarkAllPaid={markAllPaid}
            />
          )}
          {view === "tenants" && (
            <TenantsView
              filtered={filtered}
              search={search}
              setSearch={setSearch}
              selectedMonth={selectedMonth}
              onAdd={() => setShowAddModal(true)}
              onEdit={(t) => setEditTenant(t)}
              onDelete={(id) => setConfirmDelete(id)}
              onView={(t) => setViewTenant(t)}
              onMarkPaid={markPaid}
            />
          )}
          {view === "payments" && (
            <PaymentsView
              tenants={tenants}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              onUpdatePayment={updatePayment}
              onMarkPaid={markPaid}
              stats={stats}
              onExport={exportCSV}
            />
          )}
          {view === "activity" && <ActivityView log={activityLog} />}
          {view === "info" && <InfoView />}
        </main>

        {showAddModal && (
          <TenantModal onSave={addTenant} onClose={() => setShowAddModal(false)} />
        )}
        {editTenant && (
          <TenantModal
            tenant={editTenant}
            onSave={updateTenant}
            onClose={() => setEditTenant(null)}
          />
        )}
        {viewTenant && (
          <TenantDetail
            tenant={viewTenant}
            selectedMonth={selectedMonth}
            onClose={() => setViewTenant(null)}
            onEdit={(t) => setEditTenant(t)}
            onMarkPaid={markPaid}
          />
        )}
        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div onClick={(e) => e.stopPropagation()}>
              <ConfirmDialog
                title="Remove Tenant"
                message={`Are you sure you want to remove "${
                  tenants.find((t) => t.id === confirmDelete)?.name
                }"? This cannot be undone.`}
                onConfirm={() => deleteTenant(confirmDelete)}
                onCancel={() => setConfirmDelete(null)}
              />
            </div>
          </div>
        )}

        <Toasts toasts={toast.toasts} />
      </div>
    </>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────
function Dashboard({ stats, tenants, selectedMonth, setSelectedMonth, onMarkPaid, onMarkAllPaid }) {
  const expiringLeases = tenants.filter((t) => leaseStatus(t.leaseEnd) !== "active");
  const collectionRate = stats.totalExpected
    ? Math.round((stats.monthCollected / stats.totalExpected) * 100)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-sub">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Tenants</div>
          <div className="stat-value">{tenants.length}</div>
          <div className="stat-sub">{stats.occupancy}% active leases</div>
        </div>
        <div className="stat-card accent">
          <div className="stat-label">Monthly Expected</div>
          <div className="stat-value">{currency(stats.totalExpected)}</div>
          <div className="stat-sub">per month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{selectedMonth} Collected</div>
          <div
            className="stat-value"
            style={{ color: collectionRate >= 100 ? "var(--green)" : "var(--amber)" }}
          >
            {currency(stats.monthCollected)}
          </div>
          <div className="stat-sub">{collectionRate}% collected</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, collectionRate)}%`,
                background: collectionRate >= 100 ? "var(--green)" : "var(--amber)",
              }}
            />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Year {CURRENT_YEAR} Total</div>
          <div className="stat-value">{currency(stats.yearCollected)}</div>
          <div className="stat-sub">all months combined</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>
          Select Month
        </div>
        <div className="month-pills">
          {MONTHS.map((m) => (
            <button
              key={m}
              className={`month-pill${selectedMonth === m ? " active" : ""}`}
              onClick={() => setSelectedMonth(m)}
            >
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 4 }}>
          Collection by Month
        </div>
        <div className="card-sub" style={{ marginBottom: 16 }}>
          Rent collected per month — {CURRENT_YEAR}
        </div>
        <div className="month-bars">
          {MONTHS.map((m, i) => (
            <div
              key={m}
              className="month-bar-col"
              onClick={() => setSelectedMonth(m)}
              style={{ cursor: "pointer" }}
            >
              <div
                className={`month-bar-fill${m === selectedMonth ? " current" : ""}`}
                style={{
                  height: `${Math.max(
                    4,
                    Math.round((stats.monthByMonth[i] / stats.maxMonth) * 64)
                  )}px`,
                }}
              />
              <div className="month-bar-label">{m.slice(0, 1)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <div className="card-title">{selectedMonth} — Unpaid / Partial</div>
            <div className="card-sub">
              {stats.unpaid.length} tenant{stats.unpaid.length !== 1 ? "s" : ""} need attention
            </div>
          </div>
          {stats.unpaid.length > 0 && (
            <button className="btn btn-success btn-sm" onClick={onMarkAllPaid}>
              Mark All Paid
            </button>
          )}
        </div>

        {stats.unpaid.length === 0 ? (
          <div className="info-box">✓ All tenants are fully paid for {selectedMonth}.</div>
        ) : (
          stats.unpaid.map((t) => {
            const paid = t.payments[selectedMonth] || 0;
            return (
              <div className="unpaid-row" key={t.id}>
                <div>
                  <div className="unpaid-name">
                    {t.name} <span className="tag">{t.unit}</span>
                  </div>
                  <div className="unpaid-meta">
                    Paid {currency(paid)} of {currency(t.monthlyRent)} — owes{" "}
                    {currency(t.monthlyRent - paid)}
                  </div>
                </div>
                <button className="btn btn-success btn-sm" onClick={() => onMarkPaid(t.id)}>
                  Mark Paid
                </button>
              </div>
            );
          })
        )}
      </div>

      {expiringLeases.length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16, color: "var(--amber)" }}>
            ⚠ Lease Alerts
          </div>
          {expiringLeases.map((t) => {
            const s = leaseStatus(t.leaseEnd);
            return (
              <div className="unpaid-row" key={t.id}>
                <div>
                  <div className="unpaid-name">
                    {t.name} <span className="tag">{t.unit}</span>
                  </div>
                  <div className="unpaid-meta">
                    {s === "expired" ? "Lease expired" : "Expiring soon"}: {t.leaseEnd}
                  </div>
                </div>
                <span className={`badge badge-${s === "expired" ? "red" : "amber"}`}>
                  {s}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TenantsView({
  filtered,
  search,
  setSearch,
  selectedMonth,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onMarkPaid,
}) {
  return (
    <div>
      <div className="page-header">
        <div className="section-header">
          <div>
            <div className="page-title">Tenants</div>
            <div className="page-sub">
              {filtered.length} tenant{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="input"
                style={{ width: 240 }}
                placeholder="Search name, unit, phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={onAdd}>
              + Add Tenant
            </button>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Unit</th>
              <th>Phone</th>
              <th>Rent</th>
              <th>Deposit</th>
              <th>Lease End</th>
              <th>Method</th>
              <th>{selectedMonth}</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", color: "var(--text3)", padding: 32 }}>
                  No tenants found
                </td>
              </tr>
            )}
            {filtered.map((t) => {
              const paid = t.payments[selectedMonth] || 0;
              const balance = t.monthlyRent - paid;
              const s = leaseStatus(t.leaseEnd);
              return (
                <tr key={t.id}>
                  <td
                    className="td-name"
                    style={{ cursor: "pointer", color: "var(--accent)" }}
                    onClick={() => onView(t)}
                  >
                    {t.name}
                  </td>
                  <td>
                    <span className="tag">{t.unit}</span>
                  </td>
                  <td className="td-mono" style={{ color: "var(--text2)" }}>
                    {t.phone || "—"}
                  </td>
                  <td className="td-mono">{currency(t.monthlyRent)}</td>
                  <td className="td-mono" style={{ color: "var(--text2)" }}>
                    {currency(t.securityDeposit)}
                  </td>
                  <td className={`lease-${s}`}>{t.leaseEnd || "—"}</td>
                  <td>
                    <span className="badge badge-gray">{t.paymentMethod || "—"}</span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-${
                        paid >= t.monthlyRent ? "green" : paid > 0 ? "amber" : "red"
                      }`}
                    >
                      {currency(paid)}
                    </span>
                  </td>
                  <td
                    className="td-mono"
                    style={{ color: balance > 0 ? "var(--red)" : "var(--green)", fontWeight: 500 }}
                  >
                    {currency(balance)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      {balance > 0 && (
                        <button className="btn btn-success btn-sm" onClick={() => onMarkPaid(t.id)}>
                          Pay
                        </button>
                      )}
                      <button className="btn btn-ghost btn-sm" onClick={() => onEdit(t)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(t.id)}>
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentsView({
  tenants,
  selectedMonth,
  setSelectedMonth,
  onUpdatePayment,
  onMarkPaid,
  stats,
  onExport,
}) {
  const [showAllMonths, setShowAllMonths] = useState(false);
  const visibleMonths = showAllMonths ? MONTHS : [selectedMonth];

  return (
    <div>
      <div className="page-header">
        <div className="section-header">
          <div>
            <div className="page-title">Payments</div>
            <div className="page-sub">Track and update rent payments</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAllMonths((p) => !p)}>
              {showAllMonths ? "Show Selected Month" : "Show All Months"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onExport}>
              ↓ Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)", marginBottom: 10 }}>
          SELECT MONTH
        </div>
        <div className="month-pills">
          {MONTHS.map((m) => (
            <button
              key={m}
              className={`month-pill${selectedMonth === m ? " active" : ""}`}
              onClick={() => setSelectedMonth(m)}
            >
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
            EXPECTED
          </div>
          <div style={{ fontSize: 20, fontFamily: "var(--font-display)" }}>
            {currency(stats.totalExpected)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
            COLLECTED
          </div>
          <div style={{ fontSize: 20, fontFamily: "var(--font-display)", color: "var(--green)" }}>
            {currency(stats.monthCollected)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
            OUTSTANDING
          </div>
          <div style={{ fontSize: 20, fontFamily: "var(--font-display)", color: "var(--red)" }}>
            {currency(stats.totalExpected - stats.monthCollected)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
            UNPAID TENANTS
          </div>
          <div style={{ fontSize: 20, fontFamily: "var(--font-display)", color: "var(--amber)" }}>
            {stats.unpaid.length}
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Unit</th>
              <th>Rent</th>
              {visibleMonths.map((m) => (
                <th key={m}>{m.slice(0, 3)}</th>
              ))}
              {showAllMonths && <th>Year Total</th>}
              <th>Balance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => {
              const paid = t.payments[selectedMonth] || 0;
              const balance = t.monthlyRent - paid;
              const yearTotal = MONTHS.reduce((s, m) => s + (t.payments[m] || 0), 0);
              return (
                <tr key={t.id}>
                  <td className="td-name">{t.name}</td>
                  <td>
                    <span className="tag">{t.unit}</span>
                  </td>
                  <td className="td-mono">{currency(t.monthlyRent)}</td>
                  {visibleMonths.map((m) => {
                    const p = t.payments[m] || 0;
                    const cls = p >= t.monthlyRent ? "paid" : p > 0 ? "partial" : "unpaid";
                    return (
                      <td key={m}>
                        <input
                          type="number"
                          min="0"
                          className={`pay-input ${cls}`}
                          value={p}
                          onChange={(e) => onUpdatePayment(t.id, m, e.target.value)}
                        />
                      </td>
                    );
                  })}
                  {showAllMonths && (
                    <td className="td-mono" style={{ fontWeight: 500 }}>
                      {currency(yearTotal)}
                    </td>
                  )}
                  <td
                    className="td-mono"
                    style={{ color: balance > 0 ? "var(--red)" : "var(--green)", fontWeight: 600 }}
                  >
                    {currency(balance)}
                  </td>
                  <td>
                    {balance > 0 ? (
                      <button className="btn btn-success btn-sm" onClick={() => onMarkPaid(t.id)}>
                        Mark Paid
                      </button>
                    ) : (
                      <span className="badge badge-green">✓ Paid</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActivityView({ log }) {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Activity Log</div>
        <div className="page-sub">Recent changes in this session</div>
      </div>
      <div className="card">
        {log.length === 0 ? (
          <div style={{ color: "var(--text3)", textAlign: "center", padding: 40 }}>
            No activity yet this session
          </div>
        ) : (
          log.map((l) => (
            <div className="log-item" key={l.id}>
              <div className="log-dot" style={{ background: l.color }} />
              <div>
                <div className="log-msg">{l.msg}</div>
                <div className="log-time">{l.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function InfoView() {
  const [copied, setCopied] = useState("");

  const copy = (val, key) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Payment Info</div>
        <div className="page-sub">Share these details with tenants</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {[
          {
            title: "Zelle",
            fields: [
              ["Name", COMPANY.zelleName],
              ["Phone", COMPANY.zellePhone],
              ["Email", COMPANY.zelleEmail],
            ],
          },
          {
            title: "Cash App",
            fields: [
              ["Name", COMPANY.cashAppName],
              ["Handle", COMPANY.cashAppHandle],
            ],
          },
          {
            title: "Company",
            fields: [
              ["Name", COMPANY.name],
              ["Address", COMPANY.address],
              ["Phone", COMPANY.phone],
            ],
          },
        ].map(({ title, fields }) => (
          <div className="card" key={title}>
            <div className="card-title" style={{ marginBottom: 16 }}>
              {title}
            </div>
            {fields.map(([label, val]) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text3)",
                    fontFamily: "var(--font-mono)",
                    marginBottom: 3,
                  }}
                >
                  {label.toUpperCase()}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{val}</span>
                  <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={() => copy(val, label)}
                    title="Copy"
                  >
                    {copied === label ? "✓" : "⎘"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 4 }}>
        <div className="card-title" style={{ marginBottom: 8 }}>
          Data & Privacy
        </div>
        <div className="card-sub" style={{ lineHeight: 1.8 }}>
          All tenant data is stored locally on your device using your browser's localStorage. No
          data is sent to any server. To back up your data, use the CSV export in the Payments
          view. Clearing your browser data will erase all records — export regularly.
        </div>
      </div>
    </div>
  );
}

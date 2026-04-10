

const months = [
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

const createEmptyPayments = () => ({
  January: 0,
  February: 0,
  March: 0,
  April: 0,
  May: 0,
  June: 0,
  July: 0,
  August: 0,
  September: 0,
  October: 0,
  November: 0,
  December: 0,
});

const normalizeTenant = (tenant) => {
  const payments = { ...createEmptyPayments(), ...(tenant.payments || {}) };

  if (!tenant.payments && tenant.amountPaid) {
    const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
    payments[currentMonth] = Number(tenant.amountPaid || 0);
  }

  return {
    ...tenant,
    monthlyRent: Number(tenant.monthlyRent || 0),
    securityDeposit: Number(tenant.securityDeposit || 0),
    amountPaid: Number(tenant.amountPaid || 0),
    payments,
  };
};

export default function App() {
  const [tenants, setTenants] = useState(() => {
    const saved = localStorage.getItem("kt_tenants");
    const parsed = saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "AirBnb",
            unit: "Unit A Master",
            phone: "832-555-1001",
            email: "airbnb@example.com",
            leaseStart: "2026-01-01",
            leaseEnd: "2026-12-31",
            monthlyRent: 800,
            securityDeposit: 0,
            emergencyContact: "Mary Doe - 832-555-2001",
            notes: "Pays by Zelle",
            amountPaid: 800,
            paymentDate: "2026-04-01",
            paymentMethod: "Zelle",
            payments: {
              January: 800,
              February: 800,
              March: 800,
              April: 800,
              May: 0,
              June: 0,
              July: 0,
              August: 0,
              September: 0,
              October: 0,
              November: 0,
              December: 0,
            },
          },
          {
            id: 2,
            name: "Mr Nounamo de cypro",
            unit: "Unit B",
            phone: "+1 (202) 790-7461",
            email: "sarah@example.com",
            leaseStart: "2023-10-01",
            leaseEnd: "2026-09-30",
            monthlyRent: 600,
            securityDeposit: 600,
            emergencyContact: "cyprien- 713-555-2200",
            notes: "Prefers text messages",
            amountPaid: 600,
            paymentDate: "2026-04-01",
            paymentMethod: "zelle",
            payments: {
              January: 600,
              February: 600,
              March: 600,
              April: 600,
              May: 0,
              June: 0,
              July: 0,
              August: 0,
              September: 0,
              October: 0,
              November: 0,
              December: 0,
            },
          },
          {
            id: 3,
            name: "Admi Adim l ami de michen sugarland",
            unit: "Unit D",
            phone: "(201) 204-6084",
            email: "michael@example.com",
            leaseStart: "2026-02-01",
            leaseEnd: "2027-01-31",
            monthlyRent: 600,
            securityDeposit: 600,
            emergencyContact: "cyprien - 281-555-2201",
            notes: "Works night shift",
            amountPaid: 600,
            paymentDate: "2026-04-03",
            paymentMethod: "Cash",
            payments: {
              January: 0,
              February: 600,
              March: 600,
              April: 600,
              May: 0,
              June: 0,
              July: 0,
              August: 0,
              September: 0,
              October: 0,
              November: 0,
              December: 0,
            },
          },
          {
            id: 4,
            name: "Mayombo Boudila Mitch Michel",
            unit: "Unit C",
            phone: "7135189463",
            email: "angela@example.com",
            leaseStart: "2025-07-15",
            leaseEnd: "2026-07-14",
            monthlyRent: 550,
            securityDeposit: 250,
            emergencyContact: "Chris Wilson - 346-555-3004",
            notes: "no child",
            amountPaid: 550,
            paymentDate: "2026-04-04",
            paymentMethod: "zelle",
            payments: {
              January: 550,
              February: 550,
              March: 550,
              April: 550,
              May: 0,
              June: 0,
              July: 0,
              August: 0,
              September: 0,
              October: 0,
              November: 0,
              December: 0,
            },
          },
          {
            id: 5,
            name: "Ahmed Hussain",
            unit: "Unit E",
            phone: "2819030205",
            email: "daniel@example.com",
            leaseStart: "2026-02-01",
            leaseEnd: "2026-10-31",
            monthlyRent: 600,
            securityDeposit: 300,
            emergencyContact: "",
            notes: "Usually pays early",
            amountPaid: 600,
            paymentDate: "2026-03-30",
            paymentMethod: "Cash",
            payments: {
              January: 0,
              February: 600,
              March: 600,
              April: 600,
              May: 0,
              June: 0,
              July: 0,
              August: 0,
              September: 0,
              October: 0,
              November: 0,
              December: 0,
            },
          },
          {
            id: 6,
            name: "Ingrid Simo",
            unit: "Unit AB",
            phone: "+1 (346) 978-2086",
            email: "lisa@example.com",
            leaseStart: "2026-02-01",
            leaseEnd: "2027-02-28",
            monthlyRent: 600,
            securityDeposit: 0,
            emergencyContact: "Modestine Nina +1 (202) 751-5974",
            notes: "1st Floor",
            amountPaid: 600,
            paymentDate: "2026-04-01",
            paymentMethod: "cash app",
            payments: {
              January: 0,
              February: 600,
              March: 600,
              April: 600,
              May: 0,
              June: 0,
              July: 0,
              August: 0,
              September: 0,
              October: 0,
              November: 0,
              December: 0,
            },
          },
        ];

    return parsed.map(normalizeTenant);
  });

  useEffect(() => {
    localStorage.setItem("kt_tenants", JSON.stringify(tenants));
  }, [tenants]);

  const path = window.location.pathname;

  if (path === "/tenant-form") {
    return <TenantFormPage setTenants={setTenants} />;
  }

  return <MainDashboard tenants={tenants} setTenants={setTenants} />;
}

function MainDashboard({ tenants, setTenants }) {
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("en-US", { month: "long" })
  );

  const [form, setForm] = useState({
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
    amountPaid: "",
    paymentDate: "",
    paymentMethod: "",
  });

  const filteredTenants = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tenants;
    return tenants.filter((tenant) =>
      [tenant.name, tenant.unit, tenant.phone, tenant.email, tenant.notes]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [tenants, search]);

  const totalExpected = useMemo(
    () => tenants.reduce((sum, t) => sum + Number(t.monthlyRent || 0), 0),
    [tenants]
  );

  const totalCollectedThisMonth = useMemo(
    () =>
      tenants.reduce(
        (sum, t) => sum + Number(t.payments?.[selectedMonth] || 0),
        0
      ),
    [tenants, selectedMonth]
  );

  const totalCollectedYear = useMemo(
    () =>
      tenants.reduce(
        (sum, t) =>
          sum +
          months.reduce(
            (monthSum, month) => monthSum + Number(t.payments?.[month] || 0),
            0
          ),
        0
      ),
    [tenants]
  );

  const unpaidTenants = useMemo(
    () =>
      tenants.filter(
        (t) => Number(t.payments?.[selectedMonth] || 0) < Number(t.monthlyRent || 0)
      ),
    [tenants, selectedMonth]
  );

  const addTenant = () => {
    if (!form.name || !form.unit || !form.monthlyRent) {
      alert("Please fill in Name, Unit, and Monthly Rent.");
      return;
    }

    const initialPayments = createEmptyPayments();
    if (form.amountPaid) {
      initialPayments[selectedMonth] = Number(form.amountPaid || 0);
    }

    const newTenant = {
      id: Date.now(),
      name: form.name,
      unit: form.unit,
      phone: form.phone,
      email: form.email,
      leaseStart: form.leaseStart,
      leaseEnd: form.leaseEnd,
      monthlyRent: Number(form.monthlyRent || 0),
      securityDeposit: Number(form.securityDeposit || 0),
      emergencyContact: form.emergencyContact,
      notes: form.notes,
      amountPaid: Number(form.amountPaid || 0),
      paymentDate: form.paymentDate,
      paymentMethod: form.paymentMethod,
      payments: initialPayments,
    };

    setTenants((prev) => [...prev, newTenant]);

    setForm({
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
      amountPaid: "",
      paymentDate: "",
      paymentMethod: "",
    });
  };

  const updatePaymentForMonth = (id, month, value) => {
    const numericValue = Number(value || 0);

    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === id
          ? {
              ...tenant,
              payments: {
                ...createEmptyPayments(),
                ...tenant.payments,
                [month]: numericValue,
              },
              amountPaid: month === selectedMonth ? numericValue : tenant.amountPaid,
              paymentDate:
                month === selectedMonth && numericValue > 0
                  ? new Date().toISOString().slice(0, 10)
                  : tenant.paymentDate,
            }
          : tenant
      )
    );
  };

  const markAsPaid = (id) => {
    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === id
          ? {
              ...tenant,
              amountPaid: tenant.monthlyRent,
              paymentDate: new Date().toISOString().slice(0, 10),
              paymentMethod: tenant.paymentMethod || "Manual",
              payments: {
                ...createEmptyPayments(),
                ...tenant.payments,
                [selectedMonth]: tenant.monthlyRent,
              },
            }
          : tenant
      )
    );
  };

  const currency = (value) => `$${Number(value || 0).toLocaleString()}`;
  const tenantFormLink = `${window.location.origin}/tenant-form`;

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "32px" }}>Sugarland Home Rental Manager</h1>
          <p style={{ margin: "8px 0 0", color: "#4b5563" }}>
            KT Solutions LLC • 16406 Ash Point Ln, Sugar Land, TX • Phone: 346-578-1796
          </p>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <h2 style={{ marginTop: 0 }}>Tenant Intake Form Link</h2>
          <p>Share this link with tenants so they can fill out their information form:</p>
          <div
            style={{
              background: "#f3f4f6",
              padding: "12px",
              borderRadius: "10px",
              wordBreak: "break-word",
            }}
          >
            {tenantFormLink}
          </div>
          <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              style={buttonStyle}
              onClick={() => {
                navigator.clipboard.writeText(tenantFormLink);
                alert("Tenant form link copied.");
              }}
            >
              Copy Link
            </button>
            <a href="/tenant-form" style={secondaryButtonStyle}>
              Open Form Page
            </a>
          </div>
          <p style={{ marginTop: "10px", color: "#6b7280" }}>
            After you deploy the site, this becomes your real shareable tenant form URL.
          </p>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <h2 style={{ marginTop: 0 }}>Payment Information</h2>
          <div style={grid3}>
            <div style={miniCard}>
              <strong>Zelle Name</strong>
              <p>Christian Chamdet</p>
              <p>Phone: 346-578-1796</p>
              <p>Email: bafang1981@gmail.com</p>
            </div>

            <div style={miniCard}>
              <strong>Cash App Name</strong>
              <p>KT solution</p>
              <p>Cash App: $Bafang</p>
              <a href="https://cash.app/$Bafang" target="_blank" rel="noreferrer">
                Open Cash App
              </a>
            </div>

            <div style={miniCard}>
              <strong>Tenant Form URL</strong>
              <p style={{ wordBreak: "break-word" }}>{tenantFormLink}</p>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>Payment Tracking Preview</h2>
              <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
                Choose a month to see who paid and who still owes rent.
              </p>
            </div>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ ...inputStyle, maxWidth: "220px" }}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={statsGrid}>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Total Tenants</h3>
            <p style={bigNumber}>{tenants.length}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Expected Rent</h3>
            <p style={bigNumber}>{currency(totalExpected)}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>{selectedMonth} Collected</h3>
            <p style={bigNumber}>{currency(totalCollectedThisMonth)}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Year Collected</h3>
            <p style={bigNumber}>{currency(totalCollectedYear)}</p>
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px", marginTop: "20px" }}>
          <h2 style={{ marginTop: 0 }}>Add Tenant Manually</h2>
          <div style={formGrid}>
            <input
              style={inputStyle}
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Unit"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              style={inputStyle}
              type="date"
              value={form.leaseStart}
              onChange={(e) => setForm({ ...form, leaseStart: e.target.value })}
            />
            <input
              style={inputStyle}
              type="date"
              value={form.leaseEnd}
              onChange={(e) => setForm({ ...form, leaseEnd: e.target.value })}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Monthly Rent"
              value={form.monthlyRent}
              onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Security Deposit"
              value={form.securityDeposit}
              onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Emergency Contact"
              value={form.emergencyContact}
              onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder={`Amount Paid for ${selectedMonth}`}
              value={form.amountPaid}
              onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
            />
            <input
              style={inputStyle}
              type="date"
              value={form.paymentDate}
              onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Payment Method"
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            />
          </div>
          <button style={{ ...buttonStyle, marginTop: "15px" }} onClick={addTenant}>
            Add Tenant
          </button>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ margin: 0 }}>Tenant Directory</h2>
            <input
              style={{ ...inputStyle, maxWidth: "320px" }}
              placeholder="Search tenant, unit, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px", overflowX: "auto" }}>
          <h2 style={{ marginTop: 0 }}>Tenants & Payments</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "2200px" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Unit</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Monthly Rent</th>
                {months.map((month) => (
                  <th key={month} style={thStyle}>
                    {month}
                  </th>
                ))}
                <th style={thStyle}>Year Total</th>
                <th style={thStyle}>{selectedMonth} Balance</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => {
                const yearlyTotal = months.reduce(
                  (sum, month) => sum + Number(tenant.payments?.[month] || 0),
                  0
                );

                const currentMonthPaid = Number(tenant.payments?.[selectedMonth] || 0);
                const balance = Number(tenant.monthlyRent || 0) - currentMonthPaid;

                return (
                  <tr key={tenant.id}>
                    <td style={tdStyle}>{tenant.name}</td>
                    <td style={tdStyle}>{tenant.unit}</td>
                    <td style={tdStyle}>{tenant.phone}</td>
                    <td style={tdStyle}>{currency(tenant.monthlyRent)}</td>

                    {months.map((month) => {
                      const paid = Number(tenant.payments?.[month] || 0);
                      const isPaid = paid >= Number(tenant.monthlyRent || 0);

                      return (
                        <td style={tdStyle} key={month}>
                          <input
                            type="number"
                            value={paid}
                            onChange={(e) =>
                              updatePaymentForMonth(tenant.id, month, e.target.value)
                            }
                            style={{
                              width: "90px",
                              padding: "8px",
                              borderRadius: "8px",
                              border: isPaid ? "1px solid #16a34a" : "1px solid #dc2626",
                              background: isPaid ? "#f0fdf4" : "#fef2f2",
                            }}
                          />
                        </td>
                      );
                    })}

                    <td style={{ ...tdStyle, fontWeight: "700" }}>{currency(yearlyTotal)}</td>
                    <td
                      style={{
                        ...tdStyle,
                        color: balance > 0 ? "#dc2626" : "#16a34a",
                        fontWeight: "700",
                      }}
                    >
                      {currency(balance)}
                    </td>
                    <td style={tdStyle}>
                      {balance > 0 ? (
                        <button
                          style={secondaryButtonBtnStyle}
                          onClick={() => markAsPaid(tenant.id)}
                        >
                          Mark {selectedMonth} Paid
                        </button>
                      ) : (
                        <span style={{ color: "#16a34a", fontWeight: "600" }}>
                          {selectedMonth} Paid
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>
            {selectedMonth} Unpaid / Partial Preview
          </h2>
          {unpaidTenants.length === 0 ? (
            <p>Everyone is fully paid for {selectedMonth}.</p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {unpaidTenants.map((tenant) => {
                const paid = Number(tenant.payments?.[selectedMonth] || 0);
                const balance = Number(tenant.monthlyRent || 0) - paid;

                return (
                  <div
                    key={tenant.id}
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      padding: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <strong>{tenant.name}</strong> - {tenant.unit}
                      <div style={{ color: "#6b7280", marginTop: "4px" }}>
                        Paid: {currency(paid)} | Balance Due: {currency(balance)}
                      </div>
                    </div>
                    <button
                      style={secondaryButtonBtnStyle}
                      onClick={() => markAsPaid(tenant.id)}
                    >
                      Mark {selectedMonth} Paid
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TenantFormPage({ setTenants }) {
  const [form, setForm] = useState({
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
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email) {
      alert("Please fill in name, phone, and email.");
      return;
    }

    const newTenant = {
      id: Date.now(),
      name: form.name,
      unit: form.unit,
      phone: form.phone,
      email: form.email,
      leaseStart: form.leaseStart,
      leaseEnd: form.leaseEnd,
      monthlyRent: Number(form.monthlyRent || 0),
      securityDeposit: Number(form.securityDeposit || 0),
      emergencyContact: form.emergencyContact,
      notes: form.notes,
      amountPaid: 0,
      paymentDate: "",
      paymentMethod: "",
      payments: createEmptyPayments(),
    };

    setTenants((prev) => [...prev, newTenant]);
    setSubmitted(true);

    setForm({
      name: "",
      unit: "",
:%d
	    phone: "",
      email: "",
      leaseStart: "",
      leaseEnd: "",
      monthlyRent: "",
      securityDeposit: "",
      emergencyContact: "",
      notes: "",
    });
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "750px", margin: "0 auto" }}>
        <div style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Tenant information Form</h1>
          <p style={{ color: "#4b5563" }}>
            KT Solutions LLC • 16406 Ash Point Ln, Sugar Land, TX • Phone: 346-578-1796
          </p>

          {submitted && (
            <div
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "16px",
              }}
            >
              Your information has been submitted successfully.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={formGrid}>
              <input
                style={inputStyle}
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Unit / Room"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                style={inputStyle}
                type="date"
                value={form.leaseStart}
                onChange={(e) => setForm({ ...form, leaseStart: e.target.value })}
              />
              <input
                style={inputStyle}
                type="date"
                value={form.leaseEnd}
                onChange={(e) => setForm({ ...form, leaseEnd: e.target.value })}
              />
              <input
                style={inputStyle}
                type="number"
                placeholder="Monthly Rent"
                value={form.monthlyRent}
                onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })}
              />
              <input
                style={inputStyle}
                type="number"
                placeholder="Security Deposit"
                value={form.securityDeposit}
                onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Emergency Contact"
                value={form.emergencyContact}
                onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <button type="submit" style={{ ...buttonStyle, marginTop: "15px" }}>
              Submit Information
            </button>
          </form>

          <div style={{ marginTop: "20px", color: "#6b7280" }}>
            <strong>Payment Information:</strong>
            <p>Zelle: Christian Chamdet • 346-578-1796 • bafang1981@gmail.com</p>
            <p>Cash App: KT solution • $Bafang</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  background:
    "linear-gradient(rgba(15,23,42,0.72), rgba(15,23,42,0.72)), url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat fixed",
};

const cardStyle = {
  background: "rgba(255,255,255,0.95)",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb",
};

const miniCard = {
  background: "#f9fafb",
  padding: "15px",
  borderRadius: "12px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
  background: "#111827",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};

const secondaryButtonStyle = {
  display: "inline-block",
  padding: "10px 16px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "white",
  color: "#111827",
  textDecoration: "none",
  fontWeight: "600",
};

const secondaryButtonBtnStyle = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "white",
  cursor: "pointer",
  fontWeight: "600",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "15px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const bigNumber = {
  fontSize: "28px",
  fontWeight: "700",
  margin: 0,
};




const months = [
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

const createEmptyPayments = () => ({
  January: 0,
  February: 0,
  March: 0,
  April: 0,
  May: 0,
  June: 0,
  July: 0,
  August: 0,
  September: 0,
  October: 0,
  November: 0,
  December: 0,
});

const normalizeTenant = (tenant) => {
  const payments = { ...createEmptyPayments(), ...(tenant.payments || {}) };

  if (!tenant.payments && tenant.amountPaid) {
    const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
    payments[currentMonth] = Number(tenant.amountPaid || 0);
  }

  return {
    ...tenant,
    monthlyRent: Number(tenant.monthlyRent || 0),
    securityDeposit: Number(tenant.securityDeposit || 0),
    amountPaid: Number(tenant.amountPaid || 0),
    payments,
  };
};

export default function App() {
  const [tenants, setTenants] = useState(() => {
    const saved = localStorage.getItem("kt_tenants");
    const parsed = saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "AirBnb",
            unit: "Unit A Master",
            phone: "832-555-1001",
            email: "airbnb@example.com",
            leaseStart: "2026-01-01",
            leaseEnd: "2026-12-31",
            monthlyRent: 800,
            securityDeposit: 0,
            emergencyContact: "Mary Doe - 832-555-2001",
            notes: "Pays by Zelle",
            amountPaid: 800,
            paymentDate: "2026-04-01",
            paymentMethod: "Zelle",
            payments: {
              January: 800,
              February: 800,
              March: 800,
              April: 800,
              May: 0,
              June: 0,
              July: 0,
              August: 0,
              September: 0,
              October: 0,
              November: 0,
              December: 0,
            },
          },
          {
            id: 2,
            name: "Mr Nounamo de cypro",
            unit: "Unit B",
            phone: "+1 (202) 790-7461",
            email: "sarah@example.com",
            leaseStart: "2023-10-01",
            leaseEnd: "2026-09-30",
            monthlyRent: 600,
            securityDeposit: 600,
            emergencyContact: "cyprien- 713-555-2200",
            notes: "Prefers text messages",
            amountPaid: 600,
            paymentDate: "2026-04-01",
            paymentMethod: "zelle",
            payments: {
              January: 600,
              February: 600,
              March: 600,
              April: 600,
              May: 0,
              June: 0,
              July: 0,
              August: 0,
              September: 0,
              October: 0,
              November: 0,
              December: 0,
            },
          },
          {
            id: 3,
            name: "Admi Adim l ami de michen sugarland",
            unit: "Unit D",
            phone: "(201) 204-6084",
            email: "michael@example.com",
            leaseStart: "2026-02-01",
            leaseEnd: "2027-01-31",
            monthlyRent: 600,
            securityDeposit: 600,
            emergencyContact: "cyprien - 281-555-2201",
            notes: "Works night shift",
            amountPaid: 600,
            paymentDate: "2026-04-03",
            paymentMethod: "Cash",
            payments: {
              January: 0,
              February: 600,
              March: 600,
              April: 600,
              May: 0,
              June: 0,
              July: 0,
              August: 0,
              September: 0,
              October: 0,
              November: 0,
              December: 0,
            },
          },
          {
            id: 4,
            name: "Mayombo Boudila Mitch Michel",
            unit: "Unit C",
            phone: "7135189463",
            email: "angela@example.com",
            leaseStart: "2025-07-15",
            leaseEnd: "2026-07-14",
            monthlyRent: 550,
            securityDeposit: 250,
            emergencyContact: "Chris Wilson - 346-555-3004",
            notes: "no child",
            amountPaid: 550,
            paymentDate: "2026-04-04",
            paymentMethod: "zelle",
            payments: {
              January: 550,
              February: 550,
              March: 550,
              April: 550,
              May: 0,
              June: 0,
              July: 0,
              August: 0,
              September: 0,
              October: 0,
              November: 0,
              December: 0,
            },
          },
          {
            id: 5,
            name: "Ahmed Hussain",
            unit: "Unit E",
            phone: "2819030205",
            email: "daniel@example.com",
            leaseStart: "2026-02-01",
            leaseEnd: "2026-10-31",
            monthlyRent: 600,
            securityDeposit: 300,
            emergencyContact: "",
            notes: "Usually pays early",
            amountPaid: 600,
            paymentDate: "2026-03-30",
            paymentMethod: "Cash",
            payments: {
              January: 0,
              February: 600,
              March: 600,
              April: 600,
              May: 0,
              June: 0,
              July: 0,
              August: 0,
              September: 0,
              October: 0,
              November: 0,
              December: 0,
            },
          },
          {
            id: 6,
            name: "Ingrid Simo",
            unit: "Unit AB",
            phone: "+1 (346) 978-2086",
            email: "lisa@example.com",
            leaseStart: "2026-02-01",
            leaseEnd: "2027-02-28",
            monthlyRent: 600,
            securityDeposit: 0,
            emergencyContact: "Modestine Nina +1 (202) 751-5974",
            notes: "1st Floor",
            amountPaid: 600,
            paymentDate: "2026-04-01",
            paymentMethod: "cash app",
            payments: {
              January: 0,
              February: 600,
              March: 600,
              April: 600,
              May: 0,
              June: 0,
              July: 0,
              August: 0,
              September: 0,
              October: 0,
              November: 0,
              December: 0,
            },
          },
        ];

    return parsed.map(normalizeTenant);
  });

  useEffect(() => {
    localStorage.setItem("kt_tenants", JSON.stringify(tenants));
  }, [tenants]);

  const path = window.location.pathname;

  if (path === "/tenant-form") {
    return <TenantFormPage setTenants={setTenants} />;
  }

  return <MainDashboard tenants={tenants} setTenants={setTenants} />;
}

function MainDashboard({ tenants, setTenants }) {
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("en-US", { month: "long" })
  );

  const [form, setForm] = useState({
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
    amountPaid: "",
    paymentDate: "",
    paymentMethod: "",
  });

  const filteredTenants = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tenants;
    return tenants.filter((tenant) =>
      [tenant.name, tenant.unit, tenant.phone, tenant.email, tenant.notes]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [tenants, search]);

  const totalExpected = useMemo(
    () => tenants.reduce((sum, t) => sum + Number(t.monthlyRent || 0), 0),
    [tenants]
  );

  const totalCollectedThisMonth = useMemo(
    () =>
      tenants.reduce(
        (sum, t) => sum + Number(t.payments?.[selectedMonth] || 0),
        0
      ),
    [tenants, selectedMonth]
  );

  const totalCollectedYear = useMemo(
    () =>
      tenants.reduce(
        (sum, t) =>
          sum +
          months.reduce(
            (monthSum, month) => monthSum + Number(t.payments?.[month] || 0),
            0
          ),
        0
      ),
    [tenants]
  );

  const unpaidTenants = useMemo(
    () =>
      tenants.filter(
        (t) => Number(t.payments?.[selectedMonth] || 0) < Number(t.monthlyRent || 0)
      ),
    [tenants, selectedMonth]
  );

  const addTenant = () => {
    if (!form.name || !form.unit || !form.monthlyRent) {
      alert("Please fill in Name, Unit, and Monthly Rent.");
      return;
    }

    const initialPayments = createEmptyPayments();
    if (form.amountPaid) {
      initialPayments[selectedMonth] = Number(form.amountPaid || 0);
    }

    const newTenant = {
      id: Date.now(),
      name: form.name,
      unit: form.unit,
      phone: form.phone,
      email: form.email,
      leaseStart: form.leaseStart,
      leaseEnd: form.leaseEnd,
      monthlyRent: Number(form.monthlyRent || 0),
      securityDeposit: Number(form.securityDeposit || 0),
      emergencyContact: form.emergencyContact,
      notes: form.notes,
      amountPaid: Number(form.amountPaid || 0),
      paymentDate: form.paymentDate,
      paymentMethod: form.paymentMethod,
      payments: initialPayments,
    };

    setTenants((prev) => [...prev, newTenant]);

    setForm({
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
      amountPaid: "",
      paymentDate: "",
      paymentMethod: "",
    });
  };

  const updatePaymentForMonth = (id, month, value) => {
    const numericValue = Number(value || 0);

    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === id
          ? {
              ...tenant,
              payments: {
                ...createEmptyPayments(),
                ...tenant.payments,
                [month]: numericValue,
              },
              amountPaid: month === selectedMonth ? numericValue : tenant.amountPaid,
              paymentDate:
                month === selectedMonth && numericValue > 0
                  ? new Date().toISOString().slice(0, 10)
                  : tenant.paymentDate,
            }
          : tenant
      )
    );
  };

  const markAsPaid = (id) => {
    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === id
          ? {
              ...tenant,
              amountPaid: tenant.monthlyRent,
              paymentDate: new Date().toISOString().slice(0, 10),
              paymentMethod: tenant.paymentMethod || "Manual",
              payments: {
                ...createEmptyPayments(),
                ...tenant.payments,
                [selectedMonth]: tenant.monthlyRent,
              },
            }
          : tenant
      )
    );
  };

  const currency = (value) => `$${Number(value || 0).toLocaleString()}`;
  const tenantFormLink = `${window.location.origin}/tenant-form`;

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "32px" }}>Sugarland Home Rental Manager</h1>
          <p style={{ margin: "8px 0 0", color: "#4b5563" }}>
            KT Solutions LLC • 16406 Ash Point Ln, Sugar Land, TX • Phone: 346-578-1796
          </p>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <h2 style={{ marginTop: 0 }}>Tenant Intake Form Link</h2>
          <p>Share this link with tenants so they can fill out their information form:</p>
          <div
            style={{
              background: "#f3f4f6",
              padding: "12px",
              borderRadius: "10px",
              wordBreak: "break-word",
            }}
          >
            {tenantFormLink}
          </div>
          <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              style={buttonStyle}
              onClick={() => {
                navigator.clipboard.writeText(tenantFormLink);
                alert("Tenant form link copied.");
              }}
            >
              Copy Link
            </button>
            <a href="/tenant-form" style={secondaryButtonStyle}>
              Open Form Page
            </a>
          </div>
          <p style={{ marginTop: "10px", color: "#6b7280" }}>
            After you deploy the site, this becomes your real shareable tenant form URL.
          </p>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <h2 style={{ marginTop: 0 }}>Payment Information</h2>
          <div style={grid3}>
            <div style={miniCard}>
              <strong>Zelle Name</strong>
              <p>Christian Chamdet</p>
              <p>Phone: 346-578-1796</p>
              <p>Email: bafang1981@gmail.com</p>
            </div>

            <div style={miniCard}>
              <strong>Cash App Name</strong>
              <p>KT solution</p>
              <p>Cash App: $Bafang</p>
              <a href="https://cash.app/$Bafang" target="_blank" rel="noreferrer">
                Open Cash App
              </a>
            </div>

            <div style={miniCard}>
              <strong>Tenant Form URL</strong>
              <p style={{ wordBreak: "break-word" }}>{tenantFormLink}</p>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>Payment Tracking Preview</h2>
              <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
                Choose a month to see who paid and who still owes rent.
              </p>
            </div>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ ...inputStyle, maxWidth: "220px" }}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={statsGrid}>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Total Tenants</h3>
            <p style={bigNumber}>{tenants.length}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Expected Rent</h3>
            <p style={bigNumber}>{currency(totalExpected)}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>{selectedMonth} Collected</h3>
            <p style={bigNumber}>{currency(totalCollectedThisMonth)}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Year Collected</h3>
            <p style={bigNumber}>{currency(totalCollectedYear)}</p>
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px", marginTop: "20px" }}>
          <h2 style={{ marginTop: 0 }}>Add Tenant Manually</h2>
          <div style={formGrid}>
            <input
              style={inputStyle}
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Unit"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              style={inputStyle}
              type="date"
              value={form.leaseStart}
              onChange={(e) => setForm({ ...form, leaseStart: e.target.value })}
            />
            <input
              style={inputStyle}
              type="date"
              value={form.leaseEnd}
              onChange={(e) => setForm({ ...form, leaseEnd: e.target.value })}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Monthly Rent"
              value={form.monthlyRent}
              onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Security Deposit"
              value={form.securityDeposit}
              onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Emergency Contact"
              value={form.emergencyContact}
              onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder={`Amount Paid for ${selectedMonth}`}
              value={form.amountPaid}
              onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
            />
            <input
              style={inputStyle}
              type="date"
              value={form.paymentDate}
              onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Payment Method"
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            />
          </div>
          <button style={{ ...buttonStyle, marginTop: "15px" }} onClick={addTenant}>
            Add Tenant
          </button>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ margin: 0 }}>Tenant Directory</h2>
            <input
              style={{ ...inputStyle, maxWidth: "320px" }}
              placeholder="Search tenant, unit, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: "20px", overflowX: "auto" }}>
          <h2 style={{ marginTop: 0 }}>Tenants & Payments</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "2200px" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Unit</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Monthly Rent</th>
                {months.map((month) => (
                  <th key={month} style={thStyle}>
                    {month}
                  </th>
                ))}
                <th style={thStyle}>Year Total</th>
                <th style={thStyle}>{selectedMonth} Balance</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => {
                const yearlyTotal = months.reduce(
                  (sum, month) => sum + Number(tenant.payments?.[month] || 0),
                  0
                );

                const currentMonthPaid = Number(tenant.payments?.[selectedMonth] || 0);
                const balance = Number(tenant.monthlyRent || 0) - currentMonthPaid;

                return (
                  <tr key={tenant.id}>
                    <td style={tdStyle}>{tenant.name}</td>
                    <td style={tdStyle}>{tenant.unit}</td>
                    <td style={tdStyle}>{tenant.phone}</td>
                    <td style={tdStyle}>{currency(tenant.monthlyRent)}</td>

                    {months.map((month) => {
                      const paid = Number(tenant.payments?.[month] || 0);
                      const isPaid = paid >= Number(tenant.monthlyRent || 0);

                      return (
                        <td style={tdStyle} key={month}>
                          <input
                            type="number"
                            value={paid}
                            onChange={(e) =>
                              updatePaymentForMonth(tenant.id, month, e.target.value)
                            }
                            style={{
                              width: "90px",
                              padding: "8px",
                              borderRadius: "8px",
                              border: isPaid ? "1px solid #16a34a" : "1px solid #dc2626",
                              background: isPaid ? "#f0fdf4" : "#fef2f2",
                            }}
                          />
                        </td>
                      );
                    })}

                    <td style={{ ...tdStyle, fontWeight: "700" }}>{currency(yearlyTotal)}</td>
                    <td
                      style={{
                        ...tdStyle,
                        color: balance > 0 ? "#dc2626" : "#16a34a",
                        fontWeight: "700",
                      }}
                    >
                      {currency(balance)}
                    </td>
                    <td style={tdStyle}>
                      {balance > 0 ? (
                        <button
                          style={secondaryButtonBtnStyle}
                          onClick={() => markAsPaid(tenant.id)}
                        >
                          Mark {selectedMonth} Paid
                        </button>
                      ) : (
                        <span style={{ color: "#16a34a", fontWeight: "600" }}>
                          {selectedMonth} Paid
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>
            {selectedMonth} Unpaid / Partial Preview
          </h2>
          {unpaidTenants.length === 0 ? (
            <p>Everyone is fully paid for {selectedMonth}.</p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {unpaidTenants.map((tenant) => {
                const paid = Number(tenant.payments?.[selectedMonth] || 0);
                const balance = Number(tenant.monthlyRent || 0) - paid;

                return (
                  <div
                    key={tenant.id}
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      padding: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <strong>{tenant.name}</strong> - {tenant.unit}
                      <div style={{ color: "#6b7280", marginTop: "4px" }}>
                        Paid: {currency(paid)} | Balance Due: {currency(balance)}
                      </div>
                    </div>
                    <button
                      style={secondaryButtonBtnStyle}
                      onClick={() => markAsPaid(tenant.id)}
                    >
                      Mark {selectedMonth} Paid
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TenantFormPage({ setTenants }) {
  const [form, setForm] = useState({
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
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email) {
      alert("Please fill in name, phone, and email.");
      return;
    }

    const newTenant = {
      id: Date.now(),
      name: form.name,
      unit: form.unit,
      phone: form.phone,
      email: form.email,
      leaseStart: form.leaseStart,
      leaseEnd: form.leaseEnd,
      monthlyRent: Number(form.monthlyRent || 0),
      securityDeposit: Number(form.securityDeposit || 0),
      emergencyContact: form.emergencyContact,
      notes: form.notes,
      amountPaid: 0,
      paymentDate: "",
      paymentMethod: "",
      payments: createEmptyPayments(),
    };

    setTenants((prev) => [...prev, newTenant]);
    setSubmitted(true);

    setForm({
      name: "",
      unit: "",
:%d
	    phone: "",
      email: "",
      leaseStart: "",
      leaseEnd: "",
      monthlyRent: "",
      securityDeposit: "",
      emergencyContact: "",
      notes: "",
    });
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "750px", margin: "0 auto" }}>
        <div style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Tenant information Form</h1>
          <p style={{ color: "#4b5563" }}>
            KT Solutions LLC • 16406 Ash Point Ln, Sugar Land, TX • Phone: 346-578-1796
          </p>

          {submitted && (
            <div
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "16px",
              }}
            >
              Your information has been submitted successfully.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={formGrid}>
              <input
                style={inputStyle}
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Unit / Room"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                style={inputStyle}
                type="date"
                value={form.leaseStart}
                onChange={(e) => setForm({ ...form, leaseStart: e.target.value })}
              />
              <input
                style={inputStyle}
                type="date"
                value={form.leaseEnd}
                onChange={(e) => setForm({ ...form, leaseEnd: e.target.value })}
              />
              <input
                style={inputStyle}
                type="number"
                placeholder="Monthly Rent"
                value={form.monthlyRent}
                onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })}
              />
              <input
                style={inputStyle}
                type="number"
                placeholder="Security Deposit"
                value={form.securityDeposit}
                onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Emergency Contact"
                value={form.emergencyContact}
                onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <button type="submit" style={{ ...buttonStyle, marginTop: "15px" }}>
              Submit Information
            </button>
          </form>

          <div style={{ marginTop: "20px", color: "#6b7280" }}>
            <strong>Payment Information:</strong>
            <p>Zelle: Christian Chamdet • 346-578-1796 • bafang1981@gmail.com</p>
            <p>Cash App: KT solution • $Bafang</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  background:
    "linear-gradient(rgba(15,23,42,0.72), rgba(15,23,42,0.72)), url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat fixed",
};

const cardStyle = {
  background: "rgba(255,255,255,0.95)",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb",
};

const miniCard = {
  background: "#f9fafb",
  padding: "15px",
  borderRadius: "12px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
  background: "#111827",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};

const secondaryButtonStyle = {
  display: "inline-block",
  padding: "10px 16px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "white",
  color: "#111827",
  textDecoration: "none",
  fontWeight: "600",
};

const secondaryButtonBtnStyle = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "white",
  cursor: "pointer",
  fontWeight: "600",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "15px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const bigNumber = {
  fontSize: "28px",
  fontWeight: "700",
  margin: 0,
};


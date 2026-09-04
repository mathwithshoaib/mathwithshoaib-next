'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { DAY_LABELS, CATEGORY_LABELS, TA_OH_WEEKLY_CAP_HOURS } from '../../../../../lib/scheduleConfig';

/* ═════════════════════════════════════════════════════════════════
   ADMIN PANEL — /courses/calc1-fa26/schedule/admin
   Passcode-gated (server-verified, httpOnly cookie — see
   app/api/schedule/admin/login/route.js). Everything here is live:
   changes appear on the public grid within one poll cycle (~5s).
   ═════════════════════════════════════════════════════════════════ */

const FIXED_CATEGORIES = [
  ['lecture', 'Lecture'],
  ['instructor_oh', 'Instructor Office Hours'],
  ['recitation', 'TF Recitation'],
];

async function api(path, opts) {
  const res = await fetch(path, {
    method: opts?.method || 'GET',
    headers: opts?.body ? { 'Content-Type': 'application/json' } : undefined,
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Something went wrong.');
  return json;
}

function fmtHour(t) {
  const h = Math.floor(t), m = Math.round((t - h) * 60);
  const ap = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${ap}` : `${h12}:${String(m).padStart(2, '0')}${ap}`;
}

const inputStyle = { padding: '7px 10px', borderRadius: '7px', border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text)', fontFamily: 'var(--fm)', fontSize: '.8rem' };
const th = { fontFamily: 'var(--fm)', fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--border)' };
const td = { fontSize: '.82rem', color: 'var(--text)', padding: '7px 8px', borderBottom: '1px solid var(--border)' };
const smallBtn = (color) => ({ fontFamily: 'var(--fm)', fontSize: '.66rem', color, background: 'transparent', border: `1px solid ${color}`, borderRadius: '6px', padding: '3px 9px', cursor: 'pointer', marginRight: '6px' });

export default function ScheduleAdmin() {
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState(null); // { text, tone }

  const flash = (text, tone = 'error') => { setMsg({ text, tone }); setTimeout(() => setMsg(null), 6000); };

  const fetchState = useCallback(async () => {
    try { setData(await api('/api/schedule/state')); } catch { flash('Could not load schedule data.'); }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const me = await api('/api/schedule/me');
        setIsAdmin(!!me.admin);
        if (me.admin) await fetchState();
      } finally {
        setChecked(true);
      }
    })();
  }, [fetchState]);

  const login = async (e) => {
    e.preventDefault();
    setLoginBusy(true); setLoginError('');
    try {
      await api('/api/schedule/admin/login', { method: 'POST', body: { passcode } });
      setIsAdmin(true);
      setPasscode('');
      fetchState();
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginBusy(false);
    }
  };
  const logout = async () => {
    await api('/api/schedule/admin/logout', { method: 'POST' }).catch(() => {});
    setIsAdmin(false);
    setData(null);
  };

  if (!checked) {
    return (
      <>
        <Navbar activePage="courses" />
        <div style={{ padding: 'calc(var(--nav-h) + 80px) 24px', textAlign: 'center', color: 'var(--text3)' }}>Checking…</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Mobile-only (desktop untouched): iOS Safari auto-zooms on any input
          under 16px font when tapped, and the two-column team roster is too
          cramped on a phone screen. */}
      <style>{`
        @media (max-width: 820px) {
          .card input, .card select { font-size: 16px !important; }
          .tt-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Navbar activePage="courses" />
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: 'calc(var(--nav-h) + 3px + 32px) 24px 72px' }}>
        <span className="eyebrow">MATH 101 · Calculus I (Non-SSE) · FA26</span>
        <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', margin: '6px 0 10px' }}>Schedule — Admin</h1>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
          <Link href="/courses/calc1-fa26/schedule" style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', textDecoration: 'underline' }}>
            ← Back to public schedule
          </Link>
          <Link href="/courses/calc1-fa26" style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', textDecoration: 'underline' }}>
            Course home →
          </Link>
        </div>

        {msg && (
          <div style={{ marginBottom: '16px', padding: '9px 14px', borderRadius: '8px', fontSize: '.82rem', fontFamily: 'var(--fm)',
                        background: msg.tone === 'ok' ? 'rgba(56,201,176,.12)' : 'rgba(224,107,107,.12)',
                        border: `1px solid ${msg.tone === 'ok' ? 'var(--teal)' : 'var(--rose)'}`,
                        color: msg.tone === 'ok' ? 'var(--teal)' : 'var(--rose)' }}>
            {msg.text}
          </div>
        )}

        {!isAdmin ? (
          <form onSubmit={login} className="card" style={{ maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)' }}>Admin passcode</label>
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} style={inputStyle} autoFocus />
            {loginError && <span style={{ color: 'var(--rose)', fontSize: '.78rem' }}>{loginError}</span>}
            <button className="btn" type="submit" disabled={loginBusy || !passcode}>{loginBusy ? 'Checking…' : 'Sign in'}</button>
          </form>
        ) : !data ? (
          <div style={{ color: 'var(--text3)' }}>Loading…</div>
        ) : (
          <>
            <button onClick={logout} style={{ ...smallBtn('var(--text3)'), marginBottom: '24px' }}>Sign out of admin</button>
            <SettingsSection settings={data.settings} onSaved={fetchState} flash={flash} />
            <TeachingTeamSection instructors={data.instructors} tfs={data.tfs} onChanged={fetchState} flash={flash} />
            <FixedEventsSection events={data.fixedEvents} instructors={data.instructors} tfs={data.tfs} onChanged={fetchState} flash={flash} />
            <TutorialSlotsSection slots={data.tutorialSlots} onChanged={fetchState} flash={flash} />
            <TutorialVenuesSection slots={data.tutorialSlots} venues={data.tutorialVenues} onChanged={fetchState} flash={flash} />
            <TasSection tas={data.tas} onChanged={fetchState} flash={flash} />
            <TaAssignmentsSection tas={data.tas} tutorialSlots={data.tutorialSlots} taOfficeHours={data.taOfficeHours} />
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

/* ─── Grid hour range ─── */
function SettingsSection({ settings, onSaved, flash }) {
  const [start, setStart] = useState(settings.startHour);
  const [end, setEnd] = useState(settings.endHour);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await api('/api/schedule/admin/settings', { method: 'PATCH', body: { startHour: Number(start), endHour: Number(end) } });
      flash('Grid range updated.', 'ok');
      onSaved();
    } catch (err) { flash(err.message); } finally { setBusy(false); }
  };

  return (
    <section className="card" style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1.05rem', marginBottom: '10px' }}>Grid hour range</h3>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)' }}>Start</label>
        <input type="number" step="0.5" value={start} onChange={(e) => setStart(e.target.value)} style={{ ...inputStyle, width: '80px' }} />
        <label style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)' }}>End</label>
        <input type="number" step="0.5" value={end} onChange={(e) => setEnd(e.target.value)} style={{ ...inputStyle, width: '80px' }} />
        <button className="btn" onClick={save} disabled={busy} style={{ padding: '7px 16px', fontSize: '.75rem' }}>Save</button>
      </div>
    </section>
  );
}

/* ─── Teaching Team roster (instructors + TFs) ───
   Single source of truth for the course page's Teaching Team section AND
   the "Person" dropdown in the fixed-events form below — add someone here
   once, pick them everywhere else. */
function TeachingTeamSection({ instructors, tfs, onChanged, flash }) {
  return (
    <section className="card" style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Teaching team</h3>
      <p style={{ fontSize: '.76rem', color: 'var(--text3)', marginBottom: '14px' }}>
        Shown on the course page, and offered as the "Person" choices when adding a lecture / office-hour / recitation entry below.
      </p>
      <div className="tt-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <StaffList role="instructor" label="Instructors" list={instructors} onChanged={onChanged} flash={flash} />
        <StaffList role="tf" label="TFs" list={tfs} onChanged={onChanged} flash={flash} />
      </div>
    </section>
  );
}

function StaffList({ role, label, list, onChanged, flash }) {
  const blank = { name: '', email: '', office: '' };
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const startEdit = (p) => { setEditingId(p.id); setForm({ name: p.name, email: p.email || '', office: p.office || '' }); };
  const cancelEdit = () => { setEditingId(null); setForm(blank); };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingId) await api(`/api/schedule/admin/staff/${editingId}`, { method: 'PATCH', body: form });
      else await api('/api/schedule/admin/staff', { method: 'POST', body: { role, ...form } });
      flash(editingId ? 'Updated.' : 'Added.', 'ok');
      cancelEdit();
      onChanged();
    } catch (err) { flash(err.message); } finally { setBusy(false); }
  };
  const remove = async (id) => {
    try { await api(`/api/schedule/admin/staff/${id}`, { method: 'DELETE' }); flash('Removed.', 'ok'); onChanged(); }
    catch (err) { flash(err.message); }
  };

  return (
    <div>
      <h4 style={{ fontFamily: 'var(--fm)', fontSize: '.68rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text3)', margin: '0 0 8px' }}>{label}</h4>
      <div style={{ marginBottom: '10px' }}>
        {list.map((p) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '.82rem' }}>
            <span style={{ flex: 1, color: 'var(--text)' }}>{p.name}{p.office ? <span style={{ color: 'var(--text3)' }}> · {p.office}</span> : null}</span>
            <button onClick={() => startEdit(p)} style={smallBtn('var(--amber)')}>edit</button>
            <button onClick={() => remove(p.id)} style={smallBtn('var(--rose)')}>delete</button>
          </div>
        ))}
        {list.length === 0 && <div style={{ fontSize: '.8rem', color: 'var(--text3)', padding: '6px 0' }}>None yet.</div>}
      </div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Name" style={inputStyle} required />
        <input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="Email (optional)" style={inputStyle} />
        <input value={form.office} onChange={(e) => set('office', e.target.value)} placeholder="Office (optional)" style={inputStyle} />
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn" type="submit" disabled={busy || !form.name} style={{ padding: '6px 14px', fontSize: '.72rem' }}>{editingId ? 'Save' : 'Add'}</button>
          {editingId && <button type="button" onClick={cancelEdit} style={smallBtn('var(--text3)')}>cancel</button>}
        </div>
      </form>
    </div>
  );
}

/* ─── Lectures / Instructor OH / Recitations ─── */
function FixedEventsSection({ events, instructors, tfs, onChanged, flash }) {
  const blank = { category: 'lecture', day: 0, start: 9, end: 10, title: '', person: '', location: '' };
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [customPerson, setCustomPerson] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // "Person" is picked from the Teaching Team roster below (so a lecture and
  // an office-hour entry for the same instructor always say the same thing)
  // unless there's no match, e.g. a one-off guest — then "custom" reveals a
  // plain text box instead.
  const roster = form.category === 'recitation' ? tfs : instructors;

  const startEdit = (e) => {
    setEditingId(e.id);
    setForm({ category: e.category, day: e.day, start: e.start, end: e.end, title: e.title, person: e.person || '', location: e.location || '' });
    const r = e.category === 'recitation' ? tfs : instructors;
    setCustomPerson(!!e.person && !r.some((p) => p.name === e.person));
  };
  const cancelEdit = () => { setEditingId(null); setForm(blank); setCustomPerson(false); };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = { ...form, day: Number(form.day), start: Number(form.start), end: Number(form.end) };
      if (editingId) await api(`/api/schedule/admin/fixed-events/${editingId}`, { method: 'PATCH', body });
      else await api('/api/schedule/admin/fixed-events', { method: 'POST', body });
      flash(editingId ? 'Updated.' : 'Added.', 'ok');
      cancelEdit();
      onChanged();
    } catch (err) { flash(err.message); } finally { setBusy(false); }
  };

  const remove = async (id) => {
    try { await api(`/api/schedule/admin/fixed-events/${id}`, { method: 'DELETE' }); flash('Removed.', 'ok'); onChanged(); }
    catch (err) { flash(err.message); }
  };

  return (
    <section className="card" style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1.05rem', marginBottom: '10px' }}>Lectures · Instructor Office Hours · TF Recitations</h3>
      <div style={{ overflowX: 'auto', marginBottom: '14px' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '560px' }}>
          <thead><tr><th style={th}>Category</th><th style={th}>Day</th><th style={th}>Time</th><th style={th}>Title</th><th style={th}>Person</th><th style={th}>Location</th><th style={th} /></tr></thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td style={td}>{CATEGORY_LABELS[e.category]}</td>
                <td style={td}>{DAY_LABELS[e.day]}</td>
                <td style={td}>{e.start}–{e.end}</td>
                <td style={td}>{e.title}</td>
                <td style={td}>{e.person}</td>
                <td style={td}>{e.location}</td>
                <td style={td}>
                  <button onClick={() => startEdit(e)} style={smallBtn('var(--amber)')}>edit</button>
                  <button onClick={() => remove(e.id)} style={smallBtn('var(--rose)')}>delete</button>
                </td>
              </tr>
            ))}
            {events.length === 0 && <tr><td style={td} colSpan={7}>None yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Field label="Category"><select value={form.category} onChange={(e) => set('category', e.target.value)} style={inputStyle}>{FIXED_CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
        <Field label="Day"><select value={form.day} onChange={(e) => set('day', e.target.value)} style={inputStyle}>{DAY_LABELS.map((d, i) => <option key={d} value={i}>{d}</option>)}</select></Field>
        <Field label="Start"><input type="number" step="0.25" value={form.start} onChange={(e) => set('start', e.target.value)} style={{ ...inputStyle, width: '72px' }} /></Field>
        <Field label="End"><input type="number" step="0.25" value={form.end} onChange={(e) => set('end', e.target.value)} style={{ ...inputStyle, width: '72px' }} /></Field>
        <Field label="Title"><input value={form.title} onChange={(e) => set('title', e.target.value)} style={{ ...inputStyle, width: '150px' }} required /></Field>
        <Field label={`Person${form.category === 'recitation' ? ' (TF)' : ''}`}>
          {customPerson ? (
            <input value={form.person} onChange={(e) => set('person', e.target.value)} style={{ ...inputStyle, width: '150px' }} placeholder="Type a name" />
          ) : (
            <select value={form.person} onChange={(e) => set('person', e.target.value)} style={{ ...inputStyle, width: '150px' }}>
              <option value="">— none —</option>
              {roster.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          )}
          <button type="button" onClick={() => { setCustomPerson((c) => !c); set('person', ''); }} style={{ ...smallBtn('var(--text3)'), marginTop: '4px', marginRight: 0 }}>
            {customPerson ? 'pick from roster' : 'type custom name'}
          </button>
        </Field>
        <Field label="Location"><input value={form.location} onChange={(e) => set('location', e.target.value)} style={{ ...inputStyle, width: '110px' }} /></Field>
        <button className="btn" type="submit" disabled={busy} style={{ padding: '7px 16px', fontSize: '.75rem' }}>{editingId ? 'Save' : 'Add'}</button>
        {editingId && <button type="button" onClick={cancelEdit} style={smallBtn('var(--text3)')}>cancel</button>}
      </form>
      <p style={{ fontSize: '.72rem', color: 'var(--text3)', marginTop: '8px' }}>Hours are decimal (e.g. 14.5 = 2:30pm). An entry is rejected if it would put more than 2 items in the same hour anywhere it spans.</p>
    </section>
  );
}

/* ─── Tutorial slot definitions ─── */
function TutorialSlotsSection({ slots, onChanged, flash }) {
  const blank = { day: 0, start: 11, end: 12.5, location: '' };
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const startEdit = (s) => { setEditingId(s.id); setForm({ day: s.day, start: s.start, end: s.end, location: s.location || '' }); };
  const cancelEdit = () => { setEditingId(null); setForm(blank); };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = { day: Number(form.day), start: Number(form.start), end: Number(form.end), location: form.location };
      if (editingId) await api(`/api/schedule/admin/tutorial-slots/${editingId}`, { method: 'PATCH', body });
      else await api('/api/schedule/admin/tutorial-slots', { method: 'POST', body });
      flash(editingId ? 'Updated.' : 'Added.', 'ok');
      cancelEdit();
      onChanged();
    } catch (err) { flash(err.message); } finally { setBusy(false); }
  };
  const remove = async (id) => {
    try { await api(`/api/schedule/admin/tutorial-slots/${id}`, { method: 'DELETE' }); flash('Removed.', 'ok'); onChanged(); }
    catch (err) { flash(err.message); }
  };
  const clearSeat = async (slotId, seatNo) => {
    try { await api(`/api/schedule/admin/tutorial-slots/${slotId}/clear-seat`, { method: 'POST', body: { seatNo } }); flash('Seat cleared.', 'ok'); onChanged(); }
    catch (err) { flash(err.message); }
  };

  return (
    <section className="card" style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Tutorial slots</h3>
      <p style={{ fontSize: '.76rem', color: 'var(--text3)', marginBottom: '10px' }}>8 weekly slots recommended, 2 TA seats each. TAs pick their own seat on the public page.</p>
      <div style={{ overflowX: 'auto', marginBottom: '14px' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '560px' }}>
          <thead><tr><th style={th}>Day</th><th style={th}>Time</th><th style={th}>Location</th><th style={th}>Seat 1</th><th style={th}>Seat 2</th><th style={th} /></tr></thead>
          <tbody>
            {slots.map((s) => (
              <tr key={s.id}>
                <td style={td}>{DAY_LABELS[s.day]}</td>
                <td style={td}>{s.start}–{s.end}</td>
                <td style={td}>{s.location}</td>
                {[0, 1].map((i) => (
                  <td style={td} key={i}>
                    {s.seats[i] ? (
                      <>{s.seats[i].taName} <button onClick={() => clearSeat(s.id, i + 1)} style={smallBtn('var(--rose)')}>clear</button></>
                    ) : <span style={{ color: 'var(--text3)' }}>open</span>}
                  </td>
                ))}
                <td style={td}>
                  <button onClick={() => startEdit(s)} style={smallBtn('var(--amber)')}>edit</button>
                  <button onClick={() => remove(s.id)} style={smallBtn('var(--rose)')}>delete</button>
                </td>
              </tr>
            ))}
            {slots.length === 0 && <tr><td style={td} colSpan={6}>None yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Field label="Day"><select value={form.day} onChange={(e) => set('day', e.target.value)} style={inputStyle}>{DAY_LABELS.map((d, i) => <option key={d} value={i}>{d}</option>)}</select></Field>
        <Field label="Start"><input type="number" step="0.25" value={form.start} onChange={(e) => set('start', e.target.value)} style={{ ...inputStyle, width: '72px' }} /></Field>
        <Field label="End"><input type="number" step="0.25" value={form.end} onChange={(e) => set('end', e.target.value)} style={{ ...inputStyle, width: '72px' }} /></Field>
        <Field label="Location"><input value={form.location} onChange={(e) => set('location', e.target.value)} style={{ ...inputStyle, width: '130px' }} /></Field>
        <button className="btn" type="submit" disabled={busy} style={{ padding: '7px 16px', fontSize: '.75rem' }}>{editingId ? 'Save' : 'Add'}</button>
        {editingId && <button type="button" onClick={cancelEdit} style={smallBtn('var(--text3)')}>cancel</button>}
      </form>
    </section>
  );
}

/* ─── Per-date tutorial venues (semester booking sheet) ─── */
function TutorialVenuesSection({ slots, venues, onChanged, flash }) {
  const blank = { date: '', slotId: slots[0]?.id ?? '', hasSession: true, venue: '', notes: '' };
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const slotLabel = (slotId) => {
    const s = slots.find((x) => x.id === slotId);
    return s ? `${DAY_LABELS[s.day]} ${fmtHour(s.start)}–${fmtHour(s.end)}` : `#${slotId}`;
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const sorted = [...venues].sort((a, b) => a.date.localeCompare(b.date));
  const visible = showAll ? sorted : sorted.filter((v) => v.date >= todayStr).slice(0, 20);

  const startEdit = (v) => setForm({ date: v.date, slotId: v.slotId, hasSession: v.hasSession, venue: v.venue || '', notes: v.notes || '' });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api('/api/schedule/admin/tutorial-venues', {
        method: 'POST',
        body: { date: form.date, slotId: Number(form.slotId), hasSession: form.hasSession, venue: form.venue, notes: form.notes },
      });
      flash('Saved.', 'ok');
      setForm(blank);
      onChanged();
    } catch (err) { flash(err.message); } finally { setBusy(false); }
  };

  const remove = async (id) => {
    try { await api(`/api/schedule/admin/tutorial-venues/${id}`, { method: 'DELETE' }); flash('Removed.', 'ok'); onChanged(); }
    catch (err) { flash(err.message); }
  };

  return (
    <section className="card" style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Tutorial venues by date</h3>
      <p style={{ fontSize: '.76rem', color: 'var(--text3)', marginBottom: '10px' }}>
        The room actually booked for each specific date — this is what the "today's venue" card on the public page reads from.
        Recurring day/time above stays the same; only the room (and whether a session happens at all) varies date to date.
      </p>

      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '340px', marginBottom: '14px', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '620px' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--bg2)' }}>
            <tr><th style={th}>Date</th><th style={th}>Slot</th><th style={th}>Session?</th><th style={th}>Venue</th><th style={th}>Notes</th><th style={th} /></tr>
          </thead>
          <tbody>
            {visible.map((v) => (
              <tr key={v.id}>
                <td style={td}>{v.date}</td>
                <td style={td}>{slotLabel(v.slotId)}</td>
                <td style={td}>{v.hasSession ? 'Yes' : <span style={{ color: 'var(--rose)' }}>No session</span>}</td>
                <td style={td}>{v.venue || '—'}</td>
                <td style={{ ...td, maxWidth: '220px', fontSize: '.72rem', color: 'var(--text3)' }}>{v.notes}</td>
                <td style={td}>
                  <button onClick={() => startEdit(v)} style={smallBtn('var(--amber)')}>edit</button>
                  <button onClick={() => remove(v.id)} style={smallBtn('var(--rose)')}>delete</button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td style={td} colSpan={6}>{showAll ? 'None yet.' : 'No upcoming dates — try "show all".'}</td></tr>}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={() => setShowAll((s) => !s)} style={{ ...smallBtn('var(--text3)'), marginBottom: '14px' }}>
        {showAll ? 'Show upcoming only' : `Show all (${venues.length})`}
      </button>

      <form onSubmit={submit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Field label="Date"><input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} style={inputStyle} required /></Field>
        <Field label="Slot">
          <select value={form.slotId} onChange={(e) => set('slotId', e.target.value)} style={inputStyle}>
            {slots.map((s) => <option key={s.id} value={s.id}>{slotLabel(s.id)}</option>)}
          </select>
        </Field>
        <Field label="Session happens?">
          <select value={form.hasSession ? '1' : '0'} onChange={(e) => set('hasSession', e.target.value === '1')} style={inputStyle}>
            <option value="1">Yes</option>
            <option value="0">No session</option>
          </select>
        </Field>
        <Field label="Venue"><input value={form.venue} onChange={(e) => set('venue', e.target.value)} style={{ ...inputStyle, width: '150px' }} disabled={!form.hasSession} /></Field>
        <Field label="Notes"><input value={form.notes} onChange={(e) => set('notes', e.target.value)} style={{ ...inputStyle, width: '200px' }} /></Field>
        <button className="btn" type="submit" disabled={busy || !form.date} style={{ padding: '7px 16px', fontSize: '.75rem' }}>Save</button>
      </form>
    </section>
  );
}

/* ─── TA roster ─── */
const DUTY_TAG_SUGGESTIONS = ['Full TA', 'Half TA', 'Volunteer TA'];

function TasSection({ tas, onChanged, flash }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dutyTag, setDutyTag] = useState('');
  const [officeHoursOnly, setOfficeHoursOnly] = useState(false);
  const [ohCapHours, setOhCapHours] = useState(String(TA_OH_WEEKLY_CAP_HOURS));
  const [busy, setBusy] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [capEdits, setCapEdits] = useState({}); // { [taId]: draft string while typing }
  const [savingCapId, setSavingCapId] = useState(null);
  const [emailEdits, setEmailEdits] = useState({});
  const [savingEmailId, setSavingEmailId] = useState(null);
  const [tagEdits, setTagEdits] = useState({});
  const [savingTagId, setSavingTagId] = useState(null);
  const [passcodeBanner, setPasscodeBanner] = useState(null); // { name, passcode }

  const add = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api('/api/schedule/admin/tas', { method: 'POST', body: { name, officeHoursOnly, ohCapHours: Number(ohCapHours), email, dutyTag } });
      setPasscodeBanner({ name: res.name, passcode: res.passcode });
      setName('');
      setEmail('');
      setDutyTag('');
      setOfficeHoursOnly(false);
      setOhCapHours(String(TA_OH_WEEKLY_CAP_HOURS));
      onChanged();
    } catch (err) { flash(err.message); } finally { setBusy(false); }
  };
  const resetPasscode = async (id, taName) => {
    try {
      const res = await api(`/api/schedule/admin/tas/${id}/reset-passcode`, { method: 'POST' });
      setPasscodeBanner({ name: taName, passcode: res.passcode });
    } catch (err) { flash(err.message); }
  };
  const toggleDuty = async (t) => {
    setTogglingId(t.id);
    try {
      await api(`/api/schedule/admin/tas/${t.id}`, { method: 'PATCH', body: { officeHoursOnly: !t.officeHoursOnly } });
      flash(!t.officeHoursOnly ? `${t.name} is now office-hours only.` : `${t.name} is now eligible for a tutorial slot again.`, 'ok');
      onChanged();
    } catch (err) { flash(err.message); } finally { setTogglingId(null); }
  };
  const saveCap = async (t) => {
    const draft = capEdits[t.id];
    const cap = Number(draft);
    if (!Number.isFinite(cap) || cap < 0) { flash('Weekly OH cap must be a number ≥ 0.'); return; }
    setSavingCapId(t.id);
    try {
      await api(`/api/schedule/admin/tas/${t.id}`, { method: 'PATCH', body: { ohCapHours: cap } });
      flash(`${t.name}'s weekly office-hours cap is now ${cap}h.`, 'ok');
      setCapEdits((c) => { const n = { ...c }; delete n[t.id]; return n; });
      onChanged();
    } catch (err) { flash(err.message); } finally { setSavingCapId(null); }
  };
  const saveEmail = async (t) => {
    const draft = (emailEdits[t.id] ?? '').trim();
    setSavingEmailId(t.id);
    try {
      await api(`/api/schedule/admin/tas/${t.id}`, { method: 'PATCH', body: { email: draft || null } });
      flash(`${t.name}'s email updated.`, 'ok');
      setEmailEdits((c) => { const n = { ...c }; delete n[t.id]; return n; });
      onChanged();
    } catch (err) { flash(err.message); } finally { setSavingEmailId(null); }
  };
  const saveTag = async (t) => {
    const draft = (tagEdits[t.id] ?? '').trim();
    setSavingTagId(t.id);
    try {
      await api(`/api/schedule/admin/tas/${t.id}`, { method: 'PATCH', body: { dutyTag: draft || null } });
      flash(`${t.name}'s tag updated.`, 'ok');
      setTagEdits((c) => { const n = { ...c }; delete n[t.id]; return n; });
      onChanged();
    } catch (err) { flash(err.message); } finally { setSavingTagId(null); }
  };
  const remove = async (id) => {
    try {
      await api(`/api/schedule/admin/tas/${id}`, { method: 'DELETE' });
      flash('TA removed — their tutorial seat and office hours were freed automatically.', 'ok');
      onChanged();
    } catch (err) { flash(err.message); }
  };

  return (
    <section className="card" style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>TA roster</h3>
      <p style={{ fontSize: '.76rem', color: 'var(--text3)', marginBottom: '10px' }}>
        Each TA has two independent settings: whether they can hold a tutorial seat at all, and their own weekly office-hours cap (in hours).
        E.g. for a half TA you can pick either "office hours only, 4h/week" (check the box, cap 4) or "1 tutorial + 1h office hours" (leave unchecked, cap 1) — your call, per TA.
        The tutorial restriction is checked server-side too, not just hidden in the UI.
      </p>

      {passcodeBanner && (
        <div style={{ marginBottom: '14px', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--amber)', background: 'var(--amber-lt)' }}>
          <div style={{ fontSize: '.82rem', color: 'var(--text)' }}>
            Passcode for <b>{passcodeBanner.name}</b>: <span style={{ fontFamily: 'var(--fm)', fontSize: '1rem', color: 'var(--amber)', letterSpacing: '.1em' }}>{passcodeBanner.passcode}</span>
          </div>
          <div style={{ fontSize: '.72rem', color: 'var(--text3)', marginTop: '4px' }}>Copy this now and send it to them — it will not be shown again.</div>
          <button onClick={() => setPasscodeBanner(null)} style={{ ...smallBtn('var(--text3)'), marginTop: '8px' }}>dismiss</button>
        </div>
      )}

      <datalist id="duty-tag-suggestions">
        {DUTY_TAG_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
      </datalist>

      <div style={{ overflowX: 'auto', marginBottom: '14px' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '860px' }}>
          <thead><tr><th style={th}>Name</th><th style={th}>Tag</th><th style={th}>Email</th><th style={th}>Tutorial eligible?</th><th style={th}>Weekly OH cap (hrs)</th><th style={th} /></tr></thead>
          <tbody>
            {tas.map((t) => {
              const draft = capEdits[t.id] ?? String(t.ohCapHours);
              const dirty = capEdits[t.id] !== undefined && Number(capEdits[t.id]) !== t.ohCapHours;
              const emailDraft = emailEdits[t.id] ?? (t.email || '');
              const emailDirty = emailEdits[t.id] !== undefined && emailEdits[t.id].trim() !== (t.email || '');
              const tagDraft = tagEdits[t.id] ?? (t.dutyTag || '');
              const tagDirty = tagEdits[t.id] !== undefined && tagEdits[t.id].trim() !== (t.dutyTag || '');
              return (
                <tr key={t.id}>
                  <td style={td}>{t.name}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        list="duty-tag-suggestions"
                        placeholder="e.g. Volunteer TA"
                        value={tagDraft}
                        onChange={(e) => setTagEdits((c) => ({ ...c, [t.id]: e.target.value }))}
                        style={{ ...inputStyle, width: '120px' }}
                      />
                      {tagDirty && (
                        <button onClick={() => saveTag(t)} disabled={savingTagId === t.id} style={smallBtn('var(--teal)')}>save</button>
                      )}
                    </div>
                  </td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="email"
                        placeholder="name@lums.edu.pk"
                        value={emailDraft}
                        onChange={(e) => setEmailEdits((c) => ({ ...c, [t.id]: e.target.value }))}
                        style={{ ...inputStyle, width: '150px' }}
                      />
                      {emailDirty && (
                        <button onClick={() => saveEmail(t)} disabled={savingEmailId === t.id} style={smallBtn('var(--teal)')}>save</button>
                      )}
                    </div>
                  </td>
                  <td style={td}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '.76rem', color: t.officeHoursOnly ? 'var(--amber)' : 'var(--text2)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!t.officeHoursOnly}
                        disabled={togglingId === t.id}
                        onChange={() => toggleDuty(t)}
                      />
                      {t.officeHoursOnly ? 'Office hours only' : 'Yes'}
                    </label>
                  </td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="number" step="0.5" min="0"
                        value={draft}
                        onChange={(e) => setCapEdits((c) => ({ ...c, [t.id]: e.target.value }))}
                        style={{ ...inputStyle, width: '64px' }}
                      />
                      {dirty && (
                        <button onClick={() => saveCap(t)} disabled={savingCapId === t.id} style={smallBtn('var(--teal)')}>save</button>
                      )}
                    </div>
                  </td>
                  <td style={td}>
                    <button onClick={() => resetPasscode(t.id, t.name)} style={smallBtn('var(--amber)')}>reset passcode</button>
                    <button onClick={() => remove(t.id)} style={smallBtn('var(--rose)')}>remove (TA left)</button>
                  </td>
                </tr>
              );
            })}
            {tas.length === 0 && <tr><td style={td} colSpan={6}>None yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <form onSubmit={add} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} style={{ ...inputStyle, width: '180px' }} required /></Field>
        <Field label="Tag (optional)"><input list="duty-tag-suggestions" placeholder="e.g. Volunteer TA" value={dutyTag} onChange={(e) => setDutyTag(e.target.value)} style={{ ...inputStyle, width: '130px' }} /></Field>
        <Field label="Email (optional)"><input type="email" placeholder="name@lums.edu.pk" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle, width: '160px' }} /></Field>
        <Field label="Weekly OH cap (hrs)"><input type="number" step="0.5" min="0" value={ohCapHours} onChange={(e) => setOhCapHours(e.target.value)} style={{ ...inputStyle, width: '80px' }} /></Field>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '.78rem', color: 'var(--text2)', paddingBottom: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={officeHoursOnly} onChange={(e) => setOfficeHoursOnly(e.target.checked)} />
          Office hours only (no tutorial duty)
        </label>
        <button className="btn" type="submit" disabled={busy || !name} style={{ padding: '7px 16px', fontSize: '.75rem' }}>Add TA</button>
      </form>
    </section>
  );
}

/* ─── TA assignments overview — who has picked what, at a glance, plus a
   downloadable CSV (opens in Excel) of the same table for record-keeping. ─── */
function mergeOhByDay(ohs) {
  // ohs: this TA's rows for one day, e.g. [{hour:14},{hour:14.5},{hour:15},{hour:15.5}]
  const sorted = [...ohs].sort((a, b) => a.hour - b.hour);
  const runs = [];
  let run = null;
  for (const o of sorted) {
    if (run && Math.abs(o.hour - run.end) < 1e-6) {
      run.end = o.hour + 0.5;
    } else {
      if (run) runs.push(run);
      run = { start: o.hour, end: o.hour + 0.5 };
    }
  }
  if (run) runs.push(run);
  return runs;
}

function buildTaAssignments(tas, tutorialSlots, taOfficeHours) {
  return tas.map((t) => {
    const slot = tutorialSlots.find((s) => s.seats.some((seat) => seat?.taId === t.id));
    const mine = taOfficeHours.filter((o) => o.taId === t.id);
    const byDay = new Map();
    for (const o of mine) {
      if (!byDay.has(o.day)) byDay.set(o.day, []);
      byDay.get(o.day).push(o);
    }
    const ranges = [];
    for (const [day, ohs] of byDay) {
      for (const r of mergeOhByDay(ohs)) ranges.push({ day, ...r });
    }
    ranges.sort((a, b) => a.day - b.day || a.start - b.start);
    return { ta: t, slot, ranges, totalHours: mine.length * 0.5 };
  });
}

function csvEscape(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function TaAssignmentsSection({ tas, tutorialSlots, taOfficeHours }) {
  const assignments = buildTaAssignments(tas, tutorialSlots, taOfficeHours);
  const withSlot = assignments.filter((a) => a.slot).length;
  const withOh = assignments.filter((a) => a.ranges.length > 0).length;

  const rangeLabel = (r) => `${DAY_LABELS[r.day]} ${fmtHour(r.start)}–${fmtHour(r.end)}`;
  const slotLabel = (a) => (a.slot ? `${DAY_LABELS[a.slot.day]} ${fmtHour(a.slot.start)}–${fmtHour(a.slot.end)}${a.slot.location ? ' · ' + a.slot.location : ''}` : a.ta.officeHoursOnly ? 'n/a (office hours only)' : 'None yet');

  const downloadCsv = () => {
    const rows = [['Name', 'Tutorial Eligible?', 'Weekly OH Cap (hrs)', 'Tutorial Slot', 'Office Hours', 'OH Hours Booked']];
    for (const a of assignments) {
      rows.push([
        a.ta.name,
        a.ta.officeHoursOnly ? 'No (office hours only)' : 'Yes',
        String(a.ta.ohCapHours),
        slotLabel(a),
        a.ranges.length ? a.ranges.map(rangeLabel).join('; ') : 'None yet',
        `${a.totalHours} / ${a.ta.ohCapHours}`,
      ]);
    }
    const csv = rows.map((r) => r.map(csvEscape).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `math101-fa26-ta-assignments-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="card" style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>TA assignments overview</h3>
      <p style={{ fontSize: '.76rem', color: 'var(--text3)', marginBottom: '10px' }}>
        {withSlot} of {tas.length} TAs hold a tutorial slot · {withOh} of {tas.length} have booked at least some office hours.
      </p>
      <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '640px' }}>
          <thead><tr><th style={th}>Name</th><th style={th}>Tutorial eligible?</th><th style={th}>Tutorial slot</th><th style={th}>Office hours</th><th style={th}>Booked / cap (hrs)</th></tr></thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.ta.id}>
                <td style={td}>{a.ta.name}</td>
                <td style={{ ...td, color: a.ta.officeHoursOnly ? 'var(--amber)' : 'var(--text2)' }}>{a.ta.officeHoursOnly ? 'No — OH only' : 'Yes'}</td>
                <td style={{ ...td, color: a.slot ? 'var(--text)' : 'var(--text3)' }}>{slotLabel(a)}</td>
                <td style={{ ...td, color: a.ranges.length ? 'var(--text)' : 'var(--text3)' }}>{a.ranges.length ? a.ranges.map(rangeLabel).join(', ') : 'None yet'}</td>
                <td style={{ ...td, fontFamily: 'var(--fm)' }}>{a.totalHours} / {a.ta.ohCapHours}</td>
              </tr>
            ))}
            {assignments.length === 0 && <tr><td style={td} colSpan={5}>No TAs yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <button className="btn btn-outline" onClick={downloadCsv} disabled={assignments.length === 0} style={{ padding: '7px 16px', fontSize: '.75rem' }}>
        ⬇ Download as CSV (opens in Excel)
      </button>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontFamily: 'var(--fm)', fontSize: '.62rem', color: 'var(--text3)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}

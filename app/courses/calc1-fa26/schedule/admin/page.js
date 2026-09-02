'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { DAY_LABELS, CATEGORY_LABELS } from '../../../../../lib/scheduleConfig';

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
      <Navbar activePage="courses" />
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: 'calc(var(--nav-h) + 3px + 32px) 24px 72px' }}>
        <span className="eyebrow">MATH 101 · Calculus I (Non-SSE) · FA26</span>
        <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', margin: '6px 0 10px' }}>Schedule — Admin</h1>
        <div style={{ marginBottom: '20px' }}>
          <Link href="/courses/calc1-fa26/schedule" style={{ fontFamily: 'var(--fm)', fontSize: '.72rem', color: 'var(--text3)', textDecoration: 'underline' }}>
            ← Back to public schedule
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
            <FixedEventsSection events={data.fixedEvents} onChanged={fetchState} flash={flash} />
            <TutorialSlotsSection slots={data.tutorialSlots} onChanged={fetchState} flash={flash} />
            <TasSection tas={data.tas} onChanged={fetchState} flash={flash} />
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

/* ─── Lectures / Instructor OH / Recitations ─── */
function FixedEventsSection({ events, onChanged, flash }) {
  const blank = { category: 'lecture', day: 0, start: 9, end: 10, title: '', person: '', location: '' };
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const startEdit = (e) => { setEditingId(e.id); setForm({ category: e.category, day: e.day, start: e.start, end: e.end, title: e.title, person: e.person || '', location: e.location || '' }); };
  const cancelEdit = () => { setEditingId(null); setForm(blank); };

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
        <Field label="Person"><input value={form.person} onChange={(e) => set('person', e.target.value)} style={{ ...inputStyle, width: '130px' }} /></Field>
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

/* ─── TA roster ─── */
function TasSection({ tas, onChanged, flash }) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [passcodeBanner, setPasscodeBanner] = useState(null); // { name, passcode }

  const add = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api('/api/schedule/admin/tas', { method: 'POST', body: { name } });
      setPasscodeBanner({ name: res.name, passcode: res.passcode });
      setName('');
      onChanged();
    } catch (err) { flash(err.message); } finally { setBusy(false); }
  };
  const resetPasscode = async (id, taName) => {
    try {
      const res = await api(`/api/schedule/admin/tas/${id}/reset-passcode`, { method: 'POST' });
      setPasscodeBanner({ name: taName, passcode: res.passcode });
    } catch (err) { flash(err.message); }
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
      <h3 style={{ fontSize: '1.05rem', marginBottom: '10px' }}>TA roster</h3>

      {passcodeBanner && (
        <div style={{ marginBottom: '14px', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--amber)', background: 'var(--amber-lt)' }}>
          <div style={{ fontSize: '.82rem', color: 'var(--text)' }}>
            Passcode for <b>{passcodeBanner.name}</b>: <span style={{ fontFamily: 'var(--fm)', fontSize: '1rem', color: 'var(--amber)', letterSpacing: '.1em' }}>{passcodeBanner.passcode}</span>
          </div>
          <div style={{ fontSize: '.72rem', color: 'var(--text3)', marginTop: '4px' }}>Copy this now and send it to them — it will not be shown again.</div>
          <button onClick={() => setPasscodeBanner(null)} style={{ ...smallBtn('var(--text3)'), marginTop: '8px' }}>dismiss</button>
        </div>
      )}

      <div style={{ overflowX: 'auto', marginBottom: '14px' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '360px' }}>
          <thead><tr><th style={th}>Name</th><th style={th} /></tr></thead>
          <tbody>
            {tas.map((t) => (
              <tr key={t.id}>
                <td style={td}>{t.name}</td>
                <td style={td}>
                  <button onClick={() => resetPasscode(t.id, t.name)} style={smallBtn('var(--amber)')}>reset passcode</button>
                  <button onClick={() => remove(t.id)} style={smallBtn('var(--rose)')}>remove (TA left)</button>
                </td>
              </tr>
            ))}
            {tas.length === 0 && <tr><td style={td} colSpan={2}>None yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <form onSubmit={add} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} style={{ ...inputStyle, width: '200px' }} required /></Field>
        <button className="btn" type="submit" disabled={busy || !name} style={{ padding: '7px 16px', fontSize: '.75rem' }}>Add TA</button>
      </form>
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

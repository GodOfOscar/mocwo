import React, { useState } from "react";

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password === "mocwopage") {
      try {
        sessionStorage.setItem("mocwo_unlocked", "true");
      } catch {}
      onUnlock();
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/95 to-slate-950/95 p-6">
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-tr from-[#071126] to-[#081827] border border-white/6 p-8 shadow-2xl">
        <h2 className="text-2xl font-extrabold text-white">Enter site password</h2>
        <p className="mt-2 text-sm text-slate-300">This site is password protected. Please enter the password to continue.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            autoFocus
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Enter password"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500"
            type="password"
          />
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="flex-1 rounded-full bg-sky-500 px-4 py-3 font-bold text-slate-900">Unlock</button>
            <button type="button" onClick={() => { setPassword(""); setError(""); }} className="rounded-full border border-slate-700 px-4 py-3 text-slate-300">Clear</button>
          </div>
        </form>
        <p className="mt-4 text-xs text-slate-500">If you don’t have the password, contact site admin.</p>
      </div>
    </div>
  );
}

'use client';
export default function AdminError({ reset }: { error: Error; reset: () => void }) { return <main className="booking-panel cut-corner"><h1>Admin workspace unavailable</h1><p className="form-error">The requested data could not be loaded.</p><button className="button cut-corner" onClick={reset}>Retry</button></main>; }

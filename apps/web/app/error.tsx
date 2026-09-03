'use client';
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) { return <main className="booking-panel cut-corner"><div className="eyebrow">Something went wrong</div><h1>Unable to load</h1><p className="form-error">Please retry. If the problem continues, contact Coach Rickie.</p><button className="button cut-corner" onClick={reset}>Try again</button></main>; }

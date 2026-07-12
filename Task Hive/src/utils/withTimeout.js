// Some supabase-js auth/MFA calls can hang forever (never resolve or reject)
// under certain navigator-lock contention conditions instead of surfacing an
// error. A plain try/catch does nothing against an eternally pending
// promise, so anything touching supabase.auth.mfa.* is wrapped in this to
// guarantee the caller always gets a settled result.
export function withTimeout(promise, ms = 6000, timeoutMessage = "Request timed out. Please try again.") {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(timeoutMessage)), ms)),
    ]);
}

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"
import { withTimeout } from "../utils/withTimeout"

const AuthContext = createContext()

// Module-level (not per-render) so concurrent calls - e.g. React
// StrictMode's intentional double-invoke of effects in dev - share a single
// in-flight request instead of both hitting supabase-js's internal auth lock
// at once, which throws NavigatorLockAcquireTimeoutError and can leave the
// app stuck before isInitialized ever gets set.
let mfaStatusPromise = null
// onAuthStateChange also fires for routine events like TOKEN_REFRESHED, not
// just sign-in. Re-running the MFA check on every one of those turned into a
// feedback loop (the check's own session read could itself trigger a token
// refresh, firing another event, ad infinitum) that starved every Supabase
// call in the app of the auth lock. Only check once per signed-in user.
let mfaCheckedForUserId = null

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  // True when a session exists but hasn't cleared its second (TOTP) factor
  // yet, i.e. Supabase's assurance level is aal1 with aal2 required.
  const [mfaRequired, setMfaRequired] = useState(false)

  const GUEST_USER = { id: "guest", email: "guest@taskhive.com", isGuest: true }

  const checkMfaStatus = async () => {
    // Never let a lock-timeout or any other rejection escape this function:
    // it's awaited from the onAuthStateChange handler, and an uncaught
    // throw there would skip the setIsInitialized(true) that follows it,
    // leaving the whole app stuck on a blank screen forever.
    try {
      if (!mfaStatusPromise) {
        mfaStatusPromise = withTimeout(supabase.auth.mfa.getAuthenticatorAssuranceLevel())
          .finally(() => { mfaStatusPromise = null })
      }
      const { data, error } = await mfaStatusPromise
      if (error) {
        setMfaRequired(false)
        return
      }
      setMfaRequired(data.currentLevel === "aal1" && data.nextLevel === "aal2")
    } catch (err) {
      console.error("Failed to check MFA status:", err)
      setMfaRequired(false)
    }
  }

  useEffect(() => {
    // Restore guest session across refreshes
    if (localStorage.getItem("guestSession")) {
      setUser(GUEST_USER)
      setIsInitialized(true)
      return
    }

    // onAuthStateChange fires immediately with the current session (if any)
    // on subscribe, so this alone covers both first load and later sign-ins.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // checkMfaStatus needs the same supabase-js auth lock that every other
      // context's initial fetch needs. Resolving it before setUser() (rather
      // than firing it in parallel) means those contexts - which only start
      // fetching once `user` is truthy - don't pile onto the lock while the
      // MFA check is still mid-flight and stealing it out from under them.
      if (session?.user) {
        if (mfaCheckedForUserId !== session.user.id) {
          mfaCheckedForUserId = session.user.id
          await checkMfaStatus()
        }
      } else {
        mfaCheckedForUserId = null
        setMfaRequired(false)
      }
      setUser(session?.user ?? null)
      setIsInitialized(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  const verifyMfa = async (code) => {
    const { data: factors, error: factorsError } = await withTimeout(supabase.auth.mfa.listFactors())
    if (factorsError) throw factorsError
    const factor = factors?.totp?.find((f) => f.status === "verified")
    if (!factor) throw new Error("No two-factor method found on this account.")

    const { data: challenge, error: challengeError } = await withTimeout(supabase.auth.mfa.challenge({ factorId: factor.id }))
    if (challengeError) throw challengeError

    const { error: verifyError } = await withTimeout(supabase.auth.mfa.verify({
      factorId: factor.id,
      challengeId: challenge.id,
      code: code.trim(),
    }))
    if (verifyError) throw verifyError

    await checkMfaStatus()
  }

  const checkEmailExists = async (email) => {
    const { data, error } = await withTimeout(supabase.rpc("check_email_exists", { p_email: email }))
    if (error) throw error
    return data === true
  }

  // Passwordless signup: an OTP is emailed up front and the account is
  // created (unconfirmed password) the moment it's verified. The password
  // itself is only collected afterward, via setPassword.
  const sendSignupOtp = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
    })
    if (error) throw error
    localStorage.setItem("pendingEmail", email)
  }

  const verifySignupOtp = async (token) => {
    const email = localStorage.getItem("pendingEmail")
    if (!email) throw new Error("Session expired. Please start again.")
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" })
    if (error) throw error
  }

  // Sets the password on the session opened by verifySignupOtp, finishing
  // account creation.
  const setPassword = async (password) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    localStorage.removeItem("pendingEmail")
  }

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const requestPasswordReset = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    localStorage.setItem("pendingResetEmail", email)
  }

  const confirmPasswordReset = async (token, newPassword) => {
    const email = localStorage.getItem("pendingResetEmail")
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token, type: "recovery" })
    if (verifyError) throw verifyError

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    if (updateError) throw updateError

    localStorage.removeItem("pendingResetEmail")
  }

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }

  const loginWithApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }

  const loginAsGuest = () => {
    localStorage.setItem("guestSession", "true")
    setUser(GUEST_USER)
  }

  const logout = async () => {
    localStorage.removeItem("guestSession")
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isInitialized,
      mfaRequired,
      verifyMfa,
      checkEmailExists,
      sendSignupOtp,
      verifySignupOtp,
      setPassword,
      login,
      loginAsGuest,
      logout,
      requestPasswordReset,
      confirmPasswordReset,
      loginWithGoogle,
      loginWithApple,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

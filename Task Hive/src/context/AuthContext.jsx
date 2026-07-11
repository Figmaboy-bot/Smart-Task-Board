import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  // True when a session exists but hasn't cleared its second (TOTP) factor
  // yet, i.e. Supabase's assurance level is aal1 with aal2 required.
  const [mfaRequired, setMfaRequired] = useState(false)

  const GUEST_USER = { id: "guest", email: "guest@taskhive.com", isGuest: true }

  const checkMfaStatus = async () => {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (error) {
      setMfaRequired(false)
      return
    }
    setMfaRequired(data.currentLevel === "aal1" && data.nextLevel === "aal2")
  }

  useEffect(() => {
    // Restore guest session across refreshes
    if (localStorage.getItem("guestSession")) {
      setUser(GUEST_USER)
      setIsInitialized(true)
      return
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) await checkMfaStatus()
      setIsInitialized(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await checkMfaStatus()
      } else {
        setMfaRequired(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const verifyMfa = async (code) => {
    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
    if (factorsError) throw factorsError
    const factor = factors?.totp?.find((f) => f.status === "verified")
    if (!factor) throw new Error("No two-factor method found on this account.")

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id })
    if (challengeError) throw challengeError

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: factor.id,
      challengeId: challenge.id,
      code: code.trim(),
    })
    if (verifyError) throw verifyError

    await checkMfaStatus()
  }

  const signup = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    // Store email so VerifyOtp can access it
    localStorage.setItem("pendingEmail", email)
  }

  const completeSignup = async (email, token) => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "signup" })
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
      signup,
      completeSignup,
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

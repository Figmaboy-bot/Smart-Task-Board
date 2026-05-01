import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../utils/supabaseClient"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsInitialized(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

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

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, isInitialized, signup, completeSignup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

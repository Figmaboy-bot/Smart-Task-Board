import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Restore user from localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        console.log("🔄 User restored from localStorage:", parsedUser.email)
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
        localStorage.removeItem("user")
      }
    }
    setIsInitialized(true)
  }, [])

  const signup = (email, password) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
    const otpData = {
      email,
      password, // Store password temporarily with OTP
      otp,
      expiresAt: Date.now() + 2 * 60 * 1000 // 2 minutes
    }
  
    localStorage.setItem("otp", JSON.stringify(otpData));
  
    // 🔥 SHOW OTP IN CONSOLE
    console.log(`🔐 OTP for ${email}:`, otp);
  }

  const completeSignup = (email, password) => {
    // Create user account after OTP verification
    const newUser = { email, password }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    console.log("✅ User account created:", newUser.email)
    console.log("💾 Saved to localStorage:", JSON.stringify(newUser))
    
    // Verify it was saved
    const verify = localStorage.getItem("user")
    console.log("🔍 Verification - localStorage after save:", verify)
  }

  const login = (email, password) => {
    // Clear any error state first
    console.log("🔐 Login attempt started")
    console.log("📧 Email entered:", email)
    console.log("🔑 Password entered:", password ? "***" : "(empty)")
    
    // Get user from localStorage
    const savedUserStr = localStorage.getItem("user")
    console.log("📦 Raw localStorage value:", savedUserStr)
    
    if (!savedUserStr || savedUserStr === "null" || savedUserStr === "undefined") {
      console.log("❌ No user found in localStorage")
      return false
    }

    try {
      const savedUser = JSON.parse(savedUserStr)
      console.log("👤 Parsed user object:", savedUser)
      console.log("📧 Saved email:", savedUser?.email)
      console.log("🔑 Saved password:", savedUser?.password)
      
      // Trim whitespace from both values for comparison
      const enteredEmail = email?.trim().toLowerCase()
      const savedEmail = savedUser?.email?.trim().toLowerCase()
      const enteredPassword = password?.trim()
      const savedPassword = savedUser?.password?.trim()
      
      console.log("🔍 Comparison:", {
        emailMatch: enteredEmail === savedEmail,
        passwordMatch: enteredPassword === savedPassword,
        enteredEmail,
        savedEmail,
        enteredPasswordLength: enteredPassword?.length,
        savedPasswordLength: savedPassword?.length
      })

      if (enteredEmail === savedEmail && enteredPassword === savedPassword) {
        setUser(savedUser)
        console.log("✅ Login successful!")
        return true
      } else {
        console.log("❌ Email or password mismatch")
        if (enteredEmail !== savedEmail) {
          console.log("   - Email doesn't match")
        }
        if (enteredPassword !== savedPassword) {
          console.log("   - Password doesn't match")
        }
        return false
      }
    } catch (error) {
      console.error("❌ Error parsing user:", error)
      console.error("   - Error details:", error.message)
      return false
    }
  }

  const logout = () => {
    // Only clear the session state, keep user data in localStorage
    console.log("👋 Logging out - clearing session (keeping user data)")
    setUser(null)
    // Don't remove from localStorage - keep it for future logins
    console.log("✅ Session cleared, user data preserved in localStorage")
  }

  return (
    <AuthContext.Provider value={{ user, signup, completeSignup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
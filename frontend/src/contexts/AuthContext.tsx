import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  fetchMe,
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  type AuthUser,
} from '../services/auth'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  refresh: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string, referralCode?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { user } = await fetchMe()
      setUser(user)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    void (async () => {
      await refresh()
      setLoading(false)
    })()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await apiLogin(email, password)
    setUser(user)
  }, [])

  const signup = useCallback(
    async (email: string, password: string, name?: string, referralCode?: string) => {
      const { user } = await apiSignup(email, password, name, referralCode)
      setUser(user)
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo<AuthState>(() => ({ user, loading, refresh, login, signup, logout }), [
    user,
    loading,
    refresh,
    login,
    signup,
    logout,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useTier(): 'free' | 'basic' | 'pro' {
  const { user } = useAuth()
  return user?.tier ?? 'free'
}

export function hasTier(user: AuthUser | null, min: 'basic' | 'pro'): boolean {
  if (!user) return false
  const order = { free: 0, basic: 1, pro: 2 } as const
  const eff = user.effectiveTier ?? user.tier
  // Real paid tiers must be active. Beta-promoted free users are always allowed.
  if (eff === user.tier && user.tier !== 'free' && user.status !== 'active') return false
  return order[eff] >= order[min]
}

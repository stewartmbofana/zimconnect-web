import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../firebase'
import { getAdminClaims, isAdminOrModerator, type AdminClaims } from './claims'

interface AuthContextValue {
  user: User | null
  claims: AdminClaims
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  claims: { role: null },
  isAdmin: false,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [claims, setClaims] = useState<AdminClaims>({ role: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      const resolved = await getAdminClaims(firebaseUser)
      setClaims(resolved)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, claims, isAdmin: isAdminOrModerator(claims), loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

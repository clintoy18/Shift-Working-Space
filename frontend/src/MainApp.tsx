import { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'

export function MainApp() {
  const [clientId, setClientId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch Google Client ID from backend
    const fetchClientId = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${apiUrl}/auth/google/config`)
        const data = await response.json()
        // if response clientId missing, keep as null
        setClientId(data?.clientId || null)
      } catch (error) {
        console.error('Failed to fetch Google Client ID:', error)
        setClientId(null)
      } finally {
        setLoading(false)
      }
    }

    fetchClientId()
  }, [])

  if (loading) {
    // Render app immediately with fallback and avoid a full-screen loading lock
    return <App googleClientId={null} />
  }

  if (clientId) {
    return (
      <GoogleOAuthProvider clientId={clientId}>
        <App googleClientId={clientId} />
      </GoogleOAuthProvider>
    )
  }

  // Load app without Google provider when not configured
  return <App googleClientId={null} />
}

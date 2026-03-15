import { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'

export function MainApp() {
  const [clientId, setClientId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch Google Client ID from backend
    const fetchClientId = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${apiUrl}/auth/google/config`)
        const data = await response.json()
        setClientId(data.clientId)
      } catch (error) {
        console.error('Failed to fetch Google Client ID:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClientId()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!clientId) {
    return <div className="flex items-center justify-center h-screen">Error: Could not load Google OAuth configuration</div>
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  )
}

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function LoginForm() {
  const { signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await signIn(email, password)
    if (error) setError(error.message)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="input" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="input" />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn" disabled={loading}>Login</button>
    </form>
  )
}

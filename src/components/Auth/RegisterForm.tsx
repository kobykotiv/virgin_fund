import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import CaptchaImage from './CaptchaImage'

export default function RegisterForm() {
  const { signUp, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signUp(email, password, captcha)
    if (result.error) setError(result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="input" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="input" />
      <CaptchaImage onChange={setCaptcha} />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn" disabled={loading}>Register</button>
    </form>
  )
}

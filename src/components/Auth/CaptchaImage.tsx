import { useState, useEffect } from 'react'

export default function CaptchaImage({ onChange }: { onChange: (value: string) => void }) {
  const [captchaUrl, setCaptchaUrl] = useState('/v1/captcha')
  const [input, setInput] = useState('')

  useEffect(() => {
    setCaptchaUrl(`/v1/captcha?${Date.now()}`)
  }, [])

  return (
    <div className="space-y-2">
      <img src={captchaUrl} alt="Captcha" className="rounded border" />
      <input type="text" value={input} onChange={e => { setInput(e.target.value); onChange(e.target.value) }} placeholder="Enter captcha" required className="input" />
    </div>
  )
}

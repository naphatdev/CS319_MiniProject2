import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { LogIn, UserPlus } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { login, register } from '../api/authApi'
import { useAuthStore } from '../stores/useAuthStore'
import type { RegisterInput } from '../types/user'

type AuthMode = 'login' | 'register'

export function LoginPage() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const mutation = useMutation({
    mutationFn: (input: RegisterInput) => mode === 'login'
      ? login({ email: input.email, password: input.password })
      : register(input),
    onSuccess: (sessionUser) => {
      setUser(sessionUser)
      navigate('/collection', { replace: true })
    },
  })

  if (user) return <Navigate to="/collection" replace />

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode)
    setPassword('')
    setConfirmPassword('')
    setFormError('')
    mutation.reset()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (mode === 'register' && password !== confirmPassword) {
      setFormError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน')
      return
    }

    mutation.mutate({ email, name: name.trim(), password })
  }

  const isRegister = mode === 'register'
  const errorMessage = formError || (mutation.error instanceof Error ? mutation.error.message : '')

  return <div className="page-section login-page">
    <div className="login-card">
      <div className="login-icon">{isRegister ? <UserPlus size={28} /> : <LogIn size={28} />}</div>
      <span className="section-kicker">คอลเลกชันส่วนตัว</span>
      <h1>{isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</h1>
      <p>{isRegister
        ? 'สร้างบัญชีเพื่อเก็บไอเดียที่ชอบและกลับมาดูได้ทุกเมื่อ'
        : 'ยินดีต้อนรับกลับมา เข้าสู่ระบบเพื่อดูรายการที่คุณบันทึกไว้'}</p>

      <div className="auth-tabs" role="tablist" aria-label="เลือกรูปแบบการยืนยันตัวตน">
        <button type="button" className={!isRegister ? 'active' : ''} onClick={() => switchMode('login')}>เข้าสู่ระบบ</button>
        <button type="button" className={isRegister ? 'active' : ''} onClick={() => switchMode('register')}>สมัครสมาชิก</button>
      </div>

      <form onSubmit={handleSubmit}>
        {isRegister && <label>ชื่อที่แสดง<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="ชื่อของคุณ" /></label>}
        <label>อีเมล<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" /></label>
        <label>รหัสผ่าน<input type="password" required minLength={4} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="อย่างน้อย 4 ตัวอักษร" /></label>
        {isRegister && <label>ยืนยันรหัสผ่าน<input type="password" required minLength={4} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="กรอกรหัสผ่านอีกครั้ง" /></label>}
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        <button className="button primary full" disabled={mutation.isPending}>{mutation.isPending
          ? 'กำลังดำเนินการ...'
          : isRegister ? 'สร้างบัญชี' : 'เข้าสู่ระบบ'}</button>
      </form>
      <small>เพื่อความปลอดภัย กรุณาอย่าใช้รหัสผ่านเดียวกับบัญชีหรือบริการอื่น</small>
    </div>
  </div>
}

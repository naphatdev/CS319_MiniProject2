import { CheckCircle2, XCircle } from 'lucide-react'

interface FeedbackToastProps {
  message: string
  type?: 'success' | 'error'
}

export function FeedbackToast({ message, type = 'success' }: FeedbackToastProps) {
  return (
    <div className={`feedback-toast ${type}`} role="status">
      {type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
      {message}
    </div>
  )
}

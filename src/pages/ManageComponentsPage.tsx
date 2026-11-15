import { useEffect, useState, type FormEvent } from 'react'
import { Database, Edit3, Plus, Save, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FeedbackToast } from '../components/common/FeedbackToast'
import { ErrorState } from '../components/common/States'
import { useComponentMutations, useComponents } from '../hooks/useComponents'
import { useAuthStore } from '../stores/useAuthStore'
import { CATEGORIES, type ComponentInput, type UiComponent } from '../types/component'

const EMPTY_FORM: ComponentInput = {
  id: '',
  name: '',
  thaiName: '',
  category: 'ปุ่ม',
  framework: 'CSS',
  description: '',
  htmlCode: '<button class="demo-button">ตัวอย่างปุ่ม</button>',
  cssCode: '.demo-button { padding: 12px 24px; border: 0; border-radius: 12px; color: white; background: #7c3aed; }',
  tailwindCode: '',
  aiPrompt: '',
  accent: '#7c3aed',
}

export function ManageComponentsPage() {
  const user = useAuthStore((state) => state.user)
  const { data: components = [], isLoading, isError, refetch } = useComponents()
  const { createMutation, updateMutation, deleteMutation } = useComponentMutations()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ComponentInput>(EMPTY_FORM)
  const [feedback, setFeedback] = useState<{ message: string; type?: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!feedback) return
    const timeout = window.setTimeout(() => setFeedback(null), 2600)
    return () => window.clearTimeout(timeout)
  }, [feedback])

  const pending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  function updateField<K extends keyof ComponentInput>(key: K, value: ComponentInput[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function resetForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    createMutation.reset()
    updateMutation.reset()
  }

  function startEdit(component: UiComponent) {
    setEditingId(component.id)
    setForm({ ...component })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, input: form })
        setFeedback({ message: 'บันทึกการแก้ไขแล้ว' })
      } else {
        await createMutation.mutateAsync(form)
        setFeedback({ message: 'เพิ่มคอมโพเนนต์ใหม่แล้ว' })
      }
      resetForm()
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : 'บันทึกข้อมูลไม่สำเร็จ', type: 'error' })
    }
  }

  async function handleDelete(component: UiComponent) {
    if (!window.confirm(`ลบ “${component.name}” ออกจากคลังหรือไม่?`)) return
    try {
      await deleteMutation.mutateAsync(component.id)
      if (editingId === component.id) resetForm()
      setFeedback({ message: 'ลบคอมโพเนนต์แล้ว' })
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : 'ลบข้อมูลไม่สำเร็จ', type: 'error' })
    }
  }

  if (!user) {
    return <div className="page-section manage-page"><div className="container"><div className="manage-login-gate">
      <Database size={46} />
      <h1>เข้าสู่ระบบเพื่อจัดการคลัง</h1>
      <p>เพิ่ม แก้ไข หรือลบคอมโพเนนต์ที่แสดงบน NaTaUI ได้จากหน้านี้</p>
      <Link className="button primary" to="/login">เข้าสู่ระบบ</Link>
    </div></div></div>
  }

  const mutationError = createMutation.error ?? updateMutation.error

  return <div className="page-section manage-page">
    {feedback && <FeedbackToast message={feedback.message} type={feedback.type} />}
    <div className="container">
      <div className="manage-heading">
        <div><span className="section-kicker"><Database size={15} /> คลังคอมโพเนนต์</span><h1>จัดการคอมโพเนนต์</h1><p>เพิ่มรายการใหม่หรือปรับรายละเอียดให้พร้อมใช้งานอยู่เสมอ</p></div>
        <span className="result-count">ทั้งหมด {components.length} รายการ</span>
      </div>

      <div className="manage-layout">
        <form className="component-form" onSubmit={(event) => void handleSubmit(event)}>
          <div className="form-heading"><div>{editingId ? <Edit3 size={19} /> : <Plus size={19} />}<h2>{editingId ? 'แก้ไขคอมโพเนนต์' : 'เพิ่มคอมโพเนนต์ใหม่'}</h2></div>{editingId && <button type="button" className="form-close" onClick={resetForm} aria-label="ยกเลิกการแก้ไข"><X size={18} /></button>}</div>
          <div className="form-grid">
            <label>รหัสรายการ<input required disabled={Boolean(editingId)} pattern="[a-z0-9-]+" value={form.id} onChange={(event) => updateField('id', event.target.value.toLowerCase())} placeholder="เช่น gradient-button" /></label>
            <label>ชื่อภาษาอังกฤษ<input required value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Gradient Button" /></label>
            <label>ชื่อภาษาไทย<input required value={form.thaiName} onChange={(event) => updateField('thaiName', event.target.value)} placeholder="ปุ่มไล่สี" /></label>
            <label>หมวดหมู่<select value={form.category} onChange={(event) => updateField('category', event.target.value as ComponentInput['category'])}>{CATEGORIES.filter((item) => item !== 'ทั้งหมด').map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Framework<select value={form.framework} onChange={(event) => updateField('framework', event.target.value as ComponentInput['framework'])}><option>CSS</option><option>Tailwind CSS</option></select></label>
            <label>สีหลัก<div className="color-input"><input type="color" value={form.accent} onChange={(event) => updateField('accent', event.target.value)} /><input required value={form.accent} pattern="#[0-9a-fA-F]{6}" onChange={(event) => updateField('accent', event.target.value)} /></div></label>
          </div>
          <label>คำอธิบาย<textarea required rows={3} value={form.description} onChange={(event) => updateField('description', event.target.value)} /></label>
          <label>HTML<textarea required rows={5} value={form.htmlCode} onChange={(event) => updateField('htmlCode', event.target.value)} /></label>
          <label>CSS<textarea required rows={6} value={form.cssCode} onChange={(event) => updateField('cssCode', event.target.value)} /></label>
          <label>Tailwind CSS<textarea rows={3} value={form.tailwindCode} onChange={(event) => updateField('tailwindCode', event.target.value)} /></label>
          <label>คำอธิบายสำหรับ AI<textarea required rows={3} value={form.aiPrompt} onChange={(event) => updateField('aiPrompt', event.target.value)} /></label>
          {mutationError && <p className="form-error">{mutationError instanceof Error ? mutationError.message : 'บันทึกไม่สำเร็จ'}</p>}
          <div className="form-actions">{editingId && <button type="button" className="button ghost" onClick={resetForm}><X size={17} />ยกเลิก</button>}<button className="button primary" disabled={pending}><Save size={17} />{pending ? 'กำลังบันทึก...' : editingId ? 'บันทึกการแก้ไข' : 'เพิ่มคอมโพเนนต์'}</button></div>
        </form>

        <section className="database-list" aria-label="รายการ Component ในฐานข้อมูล">
          <div className="database-list-heading"><h2>รายการปัจจุบัน</h2><span>พร้อมใช้งาน</span></div>
          {isLoading && <p className="manage-status">กำลังโหลดข้อมูล...</p>}
          {isError && <ErrorState onRetry={() => void refetch()} />}
          {!isLoading && !isError && components.map((component) => <article className="database-row" key={component.id}>
            <span className="database-accent" style={{ background: component.accent }} />
            <div><strong>{component.name}</strong><small>{component.id} · {component.category} · {component.framework}</small></div>
            <div className="database-actions"><button type="button" onClick={() => startEdit(component)} aria-label={`แก้ไข ${component.name}`}><Edit3 size={16} /></button><button type="button" className="danger" disabled={deleteMutation.isPending} onClick={() => void handleDelete(component)} aria-label={`ลบ ${component.name}`}><Trash2 size={16} /></button></div>
          </article>)}
        </section>
      </div>
    </div>
  </div>
}

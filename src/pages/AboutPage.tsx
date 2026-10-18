import { Code2, ExternalLink, Users } from 'lucide-react'

const technologies = ['React 19', 'TypeScript', 'Vite', 'React Router', 'TanStack Query', 'Zustand', 'Tailwind CSS', 'DaisyUI', 'JSON Server']

const members = [
  { number: '01', photo: '/profile/1660700160.jpg', name: 'นายณภัทร ตั้งพาณิชกร', nickname: 'Kong', id: '1660700160', role: 'Back-end & Mock API', responsibility: 'พัฒนา Back-end และจัดเตรียม Mock API' },
  { number: '02', photo: '/profile/1660701499.jpg', name: 'นายภูรินทร์ อะมังค์', nickname: 'Pu', id: '1660701499', role: 'UI/UX & Front-end', responsibility: 'ออกแบบ UI/UX พัฒนาหน้า Front-end และทดสอบระบบ' },
  { number: '03', photo: '/profile/1660701515.jpg', name: 'นายกิตติพัฒน์ สุริยันต์', nickname: 'Mon', id: '1660701515', role: 'Front-end & Testing', responsibility: 'พัฒนาหน้า Front-end และทดสอบระบบ' },
]

export function AboutPage() {
  return <div className="about-page">
    <section className="about-section">
      <div className="container tech-section"><div><span className="section-kicker"><Code2 size={15} /> Technology Stack</span><h2>สร้างด้วยเทคโนโลยีเว็บสมัยใหม่</h2><p>แยก Server State และ Client State ชัดเจน เพื่อให้แอปดูแลรักษาง่ายและรองรับการเติบโต</p><a href="https://github.com/typicode/json-server" target="_blank" rel="noreferrer" className="text-link">ดูเอกสาร JSON Server <ExternalLink size={15} /></a></div><div className="tech-cloud">{technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div>
    </section>

    <section className="about-section team-section">
      <div className="container"><div className="section-heading"><div><span className="section-kicker"><Users size={15} /> ทีมผู้จัดทำ</span><h2></h2><p>สมาชิกผู้ร่วมออกแบบและพัฒนาโปรเจกต์ NaTaUI</p></div></div><div className="team-grid">{members.map((member) => <article key={member.number} className="member-card"><span className="member-number">{member.number}</span><div className="member-avatar"><img src={member.photo} alt={`สมาชิกทีม รหัสนักศึกษา ${member.id}`} /></div><h3>{member.name}</h3><p>{member.nickname} · {member.id}</p><strong>{member.role}</strong><small>{member.responsibility}</small></article>)}</div></div>
    </section>
  </div>
}

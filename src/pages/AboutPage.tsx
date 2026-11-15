import { Code2, ExternalLink, Users } from 'lucide-react'

const technologies = ['React 19', 'TypeScript', 'Vite', 'React Router', 'TanStack Query', 'Zustand', 'Express', 'Prisma ORM', 'PostgreSQL', 'Supabase']

const members = [
  { number: '01', photo: '/profile/1660700160.jpg', name: 'นายณภัทร ตั้งพาณิชกร', nickname: 'Kong', id: '1660700160', role: 'Back-end & Mock API', responsibility: 'พัฒนา Back-end และจัดเตรียม Mock API' },
  { number: '02', photo: '/profile/1660701499.jpg', name: 'นายภูรินทร์ อะมังค์', nickname: 'Pu', id: '1660701499', role: 'UI/UX & Front-end', responsibility: 'ออกแบบ UI/UX พัฒนาหน้า Front-end และทดสอบระบบ' },
  { number: '03', photo: '/profile/1660701515.jpg', name: 'นายกิตติพัฒน์ สุริยันต์', nickname: 'Mon', id: '1660701515', role: 'Front-end & Testing', responsibility: 'พัฒนาหน้า Front-end และทดสอบระบบ' },
]

export function AboutPage() {
  return <div className="about-page">
    <section className="about-section">
      <div className="container tech-section"><div><span className="section-kicker"><Code2 size={15} /> เบื้องหลัง NaTaUI</span><h2>ออกแบบให้ใช้ง่ายและดูแลต่อได้</h2><p>เราแยกส่วนหน้าบ้าน ระบบหลังบ้าน และฐานข้อมูลออกจากกันอย่างชัดเจน เพื่อให้ทุกฟีเจอร์ทำงานได้รวดเร็วและแก้ไขต่อได้สะดวก</p><a href="https://github.com/naphatdev/CS319_MiniProject2" target="_blank" rel="noreferrer" className="text-link">ดูซอร์สโค้ดบน GitHub <ExternalLink size={15} /></a></div><div className="tech-cloud">{technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div>
    </section>

    <section className="about-section team-section">
      <div className="container"><div className="section-heading"><div><span className="section-kicker"><Users size={15} /> ทีมผู้จัดทำ</span><h2>คนเบื้องหลัง NaTaUI</h2><p>ร่วมกันออกแบบ พัฒนา และทดสอบทุกส่วนของเว็บไซต์</p></div></div><div className="team-grid">{members.map((member) => <article key={member.number} className="member-card"><span className="member-number">{member.number}</span><div className="member-avatar"><img src={member.photo} alt={`สมาชิกทีม รหัสนักศึกษา ${member.id}`} /></div><h3>{member.name}</h3><p>{member.nickname} · {member.id}</p><strong>{member.role}</strong><small>{member.responsibility}</small></article>)}</div></div>
    </section>
  </div>
}

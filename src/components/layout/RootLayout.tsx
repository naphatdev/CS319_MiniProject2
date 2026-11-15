import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Heart, LogIn, LogOut, Menu, Search, X } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useFavorites } from '../../hooks/useFavorites'
import { useAuthStore } from '../../stores/useAuthStore'

const navItems = [
  { to: '/', label: 'หน้าหลัก', end: true },
  { to: '/', label: 'Explore Components', end: true, desktopOnly: true },
  { to: '/collection', label: 'My Collection' },
  { to: '/playground', label: 'Playground' },
  { to: '/manage', label: 'จัดการคลัง' },
  { to: '/about', label: 'About' },
]

export function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { data: favorites } = useFavorites()
  const queryClient = useQueryClient()
  const favoriteCount = favorites?.length ?? 0

  function handleLogout() {
    logout()
    queryClient.removeQueries({ queryKey: ['favorites'] })
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container site-navbar">
          <NavLink to="/" className="brand" aria-label="NaTaUI หน้าหลัก">
            <img className="brand-logo" src="/nataui-logo.svg" alt="NaTaUI" />
          </NavLink>

          <nav className="desktop-nav" aria-label="เมนูหลัก">
            {navItems.map((item, index) => (
              <NavLink
                key={`${item.to}-${index}`}
                to={item.to}
                end={item.end}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <NavLink to="/" className="icon-button" aria-label="ค้นหาคอมโพเนนต์"><Search size={19} /></NavLink>
            <NavLink to="/collection" className="favorite-counter" aria-label={`รายการโปรด ${favoriteCount} รายการ`}>
              <Heart size={18} />
              <span>{favoriteCount}</span>
            </NavLink>
            {user
              ? <button className="auth-button" onClick={handleLogout} title={user.email}><LogOut size={17} /><span>ออกจากระบบ</span></button>
              : <NavLink className="auth-button" to="/login"><LogIn size={17} /><span>เข้าสู่ระบบ</span></NavLink>}
            <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="เปิดเมนู" aria-expanded={menuOpen}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="เมนูมือถือ">
            {navItems.filter((item) => !item.desktopOnly).map((item, index) => (
              <NavLink key={`${item.to}-${index}`} to={item.to} end={item.end} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="brand"><img className="brand-logo footer-brand-logo" src="/nataui-logo.svg" alt="NaTaUI" /></div>
          <p>เลือกไอเดีย ทดลองโค้ด และนำไปต่อยอดในแบบของคุณ</p>
          <span>© 2026 NaTaUI</span>
        </div>
      </footer>
    </div>
  )
}

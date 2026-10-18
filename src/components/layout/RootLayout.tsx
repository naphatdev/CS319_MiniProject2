import { useState } from 'react'
import { Heart, Menu, Search, X } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useFavoritesStore } from '../../stores/useFavoritesStore'

const navItems = [
  { to: '/', label: 'หน้าหลัก', end: true },
  { to: '/', label: 'Explore Components', end: true, desktopOnly: true },
  { to: '/collection', label: 'My Collection' },
  { to: '/playground', label: 'Playground' },
  { to: '/about', label: 'About' },
]

export function RootLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length)

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
          <p>ชอบแบบไหน ก็สร้างเว็บแบบนั้น · โปรเจกต์เพื่อการเรียนรู้</p>
          <span>© 2026 NaTaUI</span>
        </div>
      </footer>
    </div>
  )
}

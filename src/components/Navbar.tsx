import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className={styles.navbar}>
      <div className={styles['nav-container']}>

        <div className={styles.logo}>
          <NavLink to="/" onClick={closeMenu}>
            MCA EXPOSED
          </NavLink>
        </div>

        <button
          type="button"
          className={styles.menuToggle}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span className={`${styles.bar} ${isMenuOpen ? styles.barTopOpen : ''}`}></span>
          <span className={`${styles.bar} ${isMenuOpen ? styles.barMiddleOpen : ''}`}></span>
          <span className={`${styles.bar} ${isMenuOpen ? styles.barBottomOpen : ''}`}></span>
        </button>

        <div className={`${styles['nav-menu']} ${isMenuOpen ? styles.open : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles['nav-btn']} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/records"
            className={({ isActive }) =>
              `${styles['nav-btn']} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            The Records
          </NavLink>
          <NavLink
            to="/courts"
            className={({ isActive }) =>
              `${styles['nav-btn']} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            The Courts
          </NavLink>
          <NavLink
            to="/story"
            className={({ isActive }) =>
              `${styles['nav-btn']} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            The Story
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) =>
              `${styles['nav-btn']} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            Make a Report
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `${styles['nav-btn']} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            FAQ&apos;s
          </NavLink>
          <a className={styles['nav-btn']} href="#" onClick={closeMenu}>
            Search
          </a>
          
        </div>

      </div>
    </nav>
  )
}

export default Navbar

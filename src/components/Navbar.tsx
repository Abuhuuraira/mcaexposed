import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import { defaultPosts } from '../data/posts'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  const searchResults = searchQuery.trim()
    ? defaultPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const handleSearchClick = (postSlug: string) => {
    navigate(`/post/${postSlug}`)
    setSearchQuery('')
    setShowSearchResults(false)
    closeMenu()
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowSearchResults(true)
  }

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
            to="/the-records"
            className={({ isActive }) =>
              `${styles['nav-btn']} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            The Records
          </NavLink>
          <NavLink
            to="/the-courts"
            className={({ isActive }) =>
              `${styles['nav-btn']} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            The Courts
          </NavLink>
          <NavLink
            to="/the-story"
            className={({ isActive }) =>
              `${styles['nav-btn']} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            The Story
          </NavLink>
          <NavLink
            to="/report-mca-fraud"
            className={({ isActive }) =>
              `${styles['nav-btn']} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            Make a Report
          </NavLink>
          <NavLink
            to="/mca-frequently-asked-questions-legal-guide"
            className={({ isActive }) =>
              `${styles['nav-btn']} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            FAQ&apos;s
          </NavLink>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => setShowSearchResults(true)}
              className={styles.searchInput}
            />
            {showSearchResults && searchQuery.trim() && (
              <div className={styles.searchResults}>
                {searchResults.length > 0 ? (
                  searchResults.map((post) => (
                    <button
                      key={post.id}
                      className={styles.searchResultItem}
                      onClick={() => handleSearchClick(post.slug)}
                    >
                      <div className={styles.resultTitle}>{post.title}</div>
                      <div className={styles.resultCategory}>{post.category}</div>
                    </button>
                  ))
                ) : (
                  <div className={styles.noResults}>No posts found</div>
                )}
              </div>
            )}
          </div>
          
        </div>

      </div>
    </nav>
  )
}

export default Navbar

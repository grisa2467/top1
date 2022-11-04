import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
// import Logo from "../../../assets/img/real-estate-logo-design@2x.png";
import { useTranslation } from 'react-i18next'

import { changePath } from '../../../features/breadcrumb/BreadcrumbSlice'
import { ReactComponent as MenuIcon } from '../../../assets/icons/burger-menu.svg'
import { ReactComponent as CloseMenuIcon } from '../../../assets/icons/exit-menu.svg'
import { ReactComponent as Logo } from '../../../assets/icons/Logo.svg'
// import logopng from '../../../assets/icons/logo.png'
import { ReactComponent as SearchIcon } from '../../../assets/icons/search-icon.svg'
import { ReactComponent as HeartIcon } from '../../../assets/icons/like.svg'
const navbarLinks = [
  { name: 'apartments', path: '/apartamente' },
  { name: 'houses', path: '/case' },
  { name: 'commercialSpaces', path: '/spatii-comerciale' },
  { name: 'lands', path: '/terenuri' },
  // { name: "Posturi vacante", path: "/posturi-vacante" },
  { name: 'aboutUs', path: '/despre' },
  // { name: "Blog", path: "/blog" },
  { name: 'contacts', path: '/contact' }
]
const Navbar = ({ sticky }) => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false)
  const [s, setSearch] = useState(false)
  const { t, i18n } = useTranslation()
  const logoConfig = {}
  if (sticky) {
    logoConfig.width = 40
    logoConfig.height = 40
  }

  const handleLanguageChange = e => {
    i18n.changeLanguage(e.target.value)
  }
  return (
    <nav className='position-relative'>
      <div className='container d-flex'>
        <div>
          <Link to='/'>
            <Logo {...logoConfig} />
          </Link>
        </div>
        <div className='ml-auto align-self-center'>
          <button
            className='d-lg-none dropdown-button border-0 bg-transparent'
            onClick={() => setShowMenu(true)}
          >
            <MenuIcon />
          </button>
          <div className={`d-flex menu ${showMenu ? 'active' : ''}`}>
            <button
              className='d-lg-none align-self-end border-0 bg-transparent mt-4 mr-3'
              style={{ transform: 'translatey(10px)' }}
              onClick={() => setShowMenu(false)}
            >
              <CloseMenuIcon />
            </button>
            {navbarLinks.map((link, i) => (
              <div className='ml-4' key={i}>
                <Link
                  type='link'
                  role='link'
                  className={`bg-transparent border-0 nav-link px-0 ${
                    location.pathname === link.path ? 'active' : ''
                  }`}
                  onClick={() => {
                    dispatch(changePath(link.name))
                    if (showMenu) setShowMenu(false)
                  }}
                  to={link.path}
                >
                  {t(link.name)}
                </Link>
              </div>
            ))}
            <div className=' align-self-start align-self-lg-center ml-3 search-wrap mb-3 mb-lg-0'>
              <input
                className='search-input search-container p-2'
                type='text'
                placeholder={t('search')}
                onChange={e => setSearch(e.target.value)}
              />
              <Link
                className='border-0 bg-transparent ml-2 search-button text-decoration-none'
                to={{
                  pathname: '/apartamente',
                  search: `?s=${s}`
                }}
              >
                <SearchIcon width={20} height={20} />
              </Link>
            </div>
            <div className=' align-self-start align-self-lg-center ml-3 mb-3 mb-lg-0'>
              <select
                className='search-input p-2'
                type='text'
                value={
                  ['ro', 'ru', 'en'].includes(i18n.language)
                    ? i18n.language
                    : 'ro'
                }
                onChange={handleLanguageChange}
              >
                <option value='ro'>RO</option>
                <option value='ru'>RU</option>
                <option value='en'>EN</option>
              </select>
            </div>

            <div className='align-self-start align-self-lg-center ml-3 mb-3 mb-lg-0'>
              <Link className='heart-icon active' to='/favorite'>
                <HeartIcon width={20} height={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

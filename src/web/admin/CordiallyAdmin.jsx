
import { setLocale, Translate } from 'react-i18nify'
import logo from './assets/logo.svg'
import './CordiallyAdmin.css'

function CordiallyAdmin() {
  return (
    <div className="cordially">
      <header className="header">
        <img src={logo} className="header-logo" alt="logo" />
        <nav className="header-menu">
            <a href="/people"><Translate value="menu.People" /></a>
            <a href="/properties"><Translate value="menu.Properties" /></a>
            <a href="/language"><Translate value="menu.Language" /></a>
            <a href="/settings"><Translate value="menu.Settings" /></a>
        </nav>
      </header>
    </div>
  )
}

setLocale('en')

export default CordiallyAdmin

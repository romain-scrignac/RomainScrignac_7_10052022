import { Outlet, Link, NavLink } from "react-router-dom";
import { btnLogin, btnLogout, btnSignup, btnAccount } from '../components/Buttons';
import { grpmLogo, iconLogout, iconAccount } from '../datas/images';

const Header = () => {
    document.title = 'Groupomania';
    let activeClassName = 'activeBtn';

    return (
        <main id="main">
            <div className='header'>
                <div className='grpm-logo'>
                    <div className='grpm-logo-anim'>
                        <Link to="/" title="Retour à l'accueil">
                            <img className={grpmLogo.class} src={grpmLogo.cover} alt={grpmLogo.name} />
                        </Link>
                    </div>
                </div>
            </div>
            <nav className="nav-buttons">
            {
            !localStorage.session_token ? 
            (
                <div className="">
                    <NavLink to="/login" className={({ isActive }) => isActive ? activeClassName : undefined}>
                        <button className={btnLogin.class} title={btnLogin.title}>{btnLogin.name}</button>
                    </NavLink>
                    <NavLink to="/signup" className={({ isActive }) => isActive ? activeClassName : undefined}>
                        <button className={btnSignup.class} title={btnSignup.title}>{btnSignup.name}</button>
                    </NavLink>
                </div>
            ):(
                localStorage.session_token ? 
                (
                    <div className="btn-profil">
                        <NavLink to ='/account'>
                            <button className={btnAccount.class} title={btnAccount.title}>
                                <img src={iconAccount.cover} alt={iconAccount.name} />
                            </button>
                        </NavLink>
                        <NavLink to="/logout">
                            <button className={btnLogout.class} title={btnLogout.title}>
                                <img src={iconLogout.cover} alt={iconLogout.name} />
                            </button>
                        </NavLink>
                    </div>
                ): null
            )
            }       
            </nav>
            <Outlet />
        </main>
    )
}

export default Header
import { Outlet, Link, NavLink } from "react-router-dom";
import { btnLogin, btnLogout, btnSignup, btnAccount } from '../datas/buttons';
import { grpmLogo, iconLogout, iconAccount } from '../datas/images';

const Main = () => {
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
                    <div className="btn-log">
                        <NavLink to="/login" className={({ isActive }) => isActive ? activeClassName : undefined}>
                            <span className={btnLogin.class} title={btnLogin.title}>{btnLogin.name}</span>
                        </NavLink>
                        <NavLink to="/signup" className={({ isActive }) => isActive ? activeClassName : undefined}>
                            <span className={btnSignup.class} title={btnSignup.title}>{btnSignup.name}</span>
                        </NavLink>
                    </div>
                ):(
                    <div className="nav-buttons--profil">
                        <NavLink to ='/account'>
                            <span className={btnAccount.class} title={btnAccount.title}>
                                <img src={iconAccount.cover} alt={iconAccount.name} />
                            </span>
                            {}
                        </NavLink>
                        <NavLink to="/logout">
                            <span className={btnLogout.class} title={btnLogout.title}>
                                <img src={iconLogout.cover} alt={iconLogout.name} />
                            </span>
                        </NavLink>
                    </div>
                )
            }       
            </nav>
            <Outlet />
        </main>
    )
}

export default Main
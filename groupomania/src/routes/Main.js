import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { btnLogin, btnLogout, btnSignup, btnAccount } from '../datas/buttons';
import { grpmLogo, iconLogout, iconAccount } from '../datas/images';

const Main = () => {
    document.title = 'Groupomania';
    let activeClassName = 'activeBtn';
    const navigate = useNavigate();

    const [userMessages, setUserMessages] = useState(0);
    const [isValidToken, setIsValidToken] = useState(true);

    useEffect(() => {
        
    }, [isValidToken, userMessages]);

    /**
     * @description this function checks the token validity and disconnecte user
     *              if it's invalide
     */
    const alertToken = () => {
        setIsValidToken(false);
        localStorage.clear();
        document.getElementById('root').style["opacity"] = 0;
        alert("Votre session a expiré, veuillez vous reconnecter");
        navigate('/login');
        document.getElementById('root').style["opacity"] = 1;
    };

    const getUserMessages = async () => {
        try {
            const response = await fetch(`https://localhost/api/auth/messages/${localStorage.session_id}`, {
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.session_token}`
                }
            });
            const responseJson = await response.json();
            if (response.ok) {
                setUserMessages(responseJson.count);
            } else if (responseJson.error.name && responseJson.error.name === "JsonWebTokenError") {
                alertToken();
            }
        } catch (err) {
            console.log(err);
        }
    };
    if (localStorage.session_token) {
        getUserMessages();
    }
    

    const viewMessages = () => {
        navigate(`/messages`);
    };

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
                            <button className={btnLogin.class} title={btnLogin.title}>{btnLogin.name}</button>
                        </NavLink>
                        <NavLink to="/signup" className={({ isActive }) => isActive ? activeClassName : undefined}>
                            <button className={btnSignup.class} title={btnSignup.title}>{btnSignup.name}</button>
                        </NavLink>
                    </div>
                ):(
                    <div className="nav-buttons--profil">
                        <div className="nav-buttons--profil__messages">
                            <span 
                                title={
                                    userMessages > 1 ? (`Vous avez ${userMessages} messages`) : (`Vous avez ${userMessages} message`)
                                }
                                onClick={viewMessages}
                            >
                                <i className="fas fa-envelope"></i>
                            </span>
                        </div>
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
                )
            }       
            </nav>
            <Outlet />
        </main>
    )
}

export default Main
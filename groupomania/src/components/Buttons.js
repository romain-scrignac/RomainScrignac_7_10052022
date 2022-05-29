function Buttons() {

    const url = new URL(window.location);
    const pathName = url.pathname;
    
    return (
        <div>
            {!localStorage.session_id && pathName !== '/' && pathName !== '/login' && pathName !== '/signup' ? 
                (
                    <div>
                        <p>Vous n'êtes pas connecté !</p>
                        <p>Cliquez <a href='/'>ici</a> pour revenir à l'accueil</p>
                    </div>
                ) : null
            }
            {!localStorage.session_id && pathName === '/' ?
                (
                    <div className="grpm-buttons">
                        <button className='btn btn-login' onClick={() => window.location.href='/login'}>Connexion</button>
                        <button className='btn btn-signup' onClick={() => window.location.href='/signup'}>Inscription</button>
                    </div>
                ) : null
            }
            {localStorage.session_token && pathName !== '/logout' ? 
                (<button className='btn btn-logout' onClick={() => window.location.href='/logout'}>Déconnexion</button>): null 
            }
        </div>
    )
}

export default Buttons
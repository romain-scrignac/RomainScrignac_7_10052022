function Buttons() {

    const url = new URL(window.location);
    const pathName = url.pathname;

    const historyBack = () => {
        return window.history.back()
    }
    
    return (
        <div>
            {
                pathName === '/login' || pathName === '/signup' ? 
                (<button className="btn btn-return" onClick={historyBack} title="Revenir an arrière">Retour</button>):(null)
            }
            {
                !localStorage.session_token && pathName === '/' ?
                (
                    <div className="grpm-buttons">
                        <button className='btn btn-login' onClick={() => window.location.href='/login'}>Connexion</button>
                        <button className='btn btn-signup' onClick={() => window.location.href='/signup'}>Inscription</button>
                    </div>
                ) : null
            }
            {
                localStorage.session_token && pathName !== '/logout' ? 
                (<button className='btn btn-logout' onClick={() => window.location.href='/logout'}>Déconnexion</button>): null 
            }
        </div>
    )
}

export default Buttons
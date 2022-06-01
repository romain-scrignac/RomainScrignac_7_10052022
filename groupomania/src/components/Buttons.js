export const btnReturn = {
    name: 'Retour',
    class: 'btn btn-return',
    link: '/',
    title: 'Retour à l\'acceuil',
    onClick: 'window.history.back()'
};

export const btnLogin = {
    name: 'Connexion',
    class: 'btn btn-login',
    link: '/login',
    title: 'Se connecter',
    onClick: '{() => window.location.href="/login"}'
};

export const btnLogout = {
    name: 'Déconnexion',
    class: 'btn btn-logout',
    link: '/logout',
    title: 'Se déconnecter',
    onClick: '{() => window.location.href="/logout"}'
};

export const btnSignup = {
    name: 'Inscription',
    class: 'btn btn-signup',
    link: '/signup',
    title: 'Créer un compte',
    onClick: '{() => window.location.href="/signup"}'
};

// function Buttons() {

//     const url = new URL(window.location);
//     const pathName = url.pathname;

//     const historyBack = () => {
//         return window.history.back()
//     }

//     return (
//         <div>
//             {
//                 pathName === '/login' || pathName === '/signup' || pathName === 'verification' ? 
//                 (<button className="btn btn-return" onClick={historyBack} title="Page précédente">Retour</button>):(null)
//             }
//             {
//                 !localStorage.session_token && pathName === '/' ?
//                 (
//                     <div className="grpm-buttons">
//                         <button className='btn btn-login' onClick={() => window.location.href='/login'}>Connexion</button>
//                         <button className='btn btn-signup' onClick={() => window.location.href='/signup'}>Inscription</button>
//                     </div>
//                 ) : null
//             }
//             {
//                 localStorage.session_token && pathName !== '/logout' ? 
//                 (<button className='btn btn-logout' onClick={() => window.location.href='/logout'}>Déconnexion</button>): null 
//             }
//         </div>
//     )
// }

// export default Buttons
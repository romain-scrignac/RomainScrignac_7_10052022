import Buttons from './Buttons';
import {grpmLogo} from '../datas/images';

function Header () {
    const url = new URL(window.location);
    const pathName = url.pathname;

    return (
        <div className='header'>
            <div className='grpm-logo'>
                <div className='grpm-logo-spin'>
                    <img className={grpmLogo.class} src={grpmLogo.cover} alt={grpmLogo.name} />
                </div>
            </div>
            <Buttons />
            {
                !localStorage.session_token && pathName !== '/' && pathName !== '/login' && pathName !== '/signup' 
                && (pathName === '/verification' && !localStorage.session_id) ? 
                (
                    <div>
                        <p>Vous n'êtes pas connecté !</p>
                        <p>Cliquez <u><a href='/'>ici</a></u> pour revenir à l'accueil</p>
                    </div>
                ) : null
            }
        </div>
    )
}

export default Header
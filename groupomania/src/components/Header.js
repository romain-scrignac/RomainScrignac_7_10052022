import Buttons from './Buttons';
import {grpmLogo} from '../datas/images';

function Header () {
    const url = new URL(window.location);
    const pathName = url.pathname;

    function verifPath() {
        let isValidPath = true;
        if (!localStorage.session_id && pathName === '/logout') {
            isValidPath = false;
        } else if(!localStorage.session_token) {
            if((pathName !== '/' && pathName !== '/login' && pathName !== '/signup') || pathName === '/logout') {
                isValidPath = false;
            }
        }
        return isValidPath;
    }
    verifPath();

    return (
        <div className='header'>
            <div className='grpm-logo'>
                <div className='grpm-logo-spin'>
                    <img className={grpmLogo.class} src={grpmLogo.cover} alt={grpmLogo.name} />
                </div>
            </div>
            <Buttons />
            {
                !verifPath ? 
                (
                    <div className='unconnected'>
                        <p>Vous n'êtes pas connecté !</p>
                        <p>Cliquez <u><a href='/'>ici</a></u> pour revenir à l'accueil</p>
                    </div>
                ) : null
            }
        </div>
    )
}

export default Header
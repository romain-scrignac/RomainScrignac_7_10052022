import Buttons from './Buttons';
import {grpmLogo} from '../datas/images';

function Header () {
    // const url = new URL(window.location);
    // const pathName = url.pathname;

    return (
        <div className='header'>
            <div className='grpm-logo'>
                <div className='grpm-logo-spin'>
                    <img className={grpmLogo.class} src={grpmLogo.cover} alt={grpmLogo.name} />
                </div>
            </div>
            <Buttons />
        </div>
    )
}

export default Header
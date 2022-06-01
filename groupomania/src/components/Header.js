import {grpmLogo} from '../datas/images';

function Header () {

    return (
        <div className='header'>
            <div className='grpm-logo'>
                <div className='grpm-logo-spin'>
                    <img className={grpmLogo.class} src={grpmLogo.cover} alt={grpmLogo.name} />
                </div>
            </div>
        </div>
    )
}

export default Header
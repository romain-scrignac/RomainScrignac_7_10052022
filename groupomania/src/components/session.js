/* checking the user's session */

const Session = () => {
    const url = new URL(window.location);
    const pathName = url.pathname;

    const [message, setMessage] = useState('');
    const [isValidSession, setIsValidSession] = useState(true);

    const verifSession = () => {
        if(localStorage.session_token && (pathName === '/login' || pathName === '/signup' || pathName === '/verification')) {
            setIsValidSession(false);
            setMessage('Vous êtes déjà connecté !');
        }
        else if (!localStorage.session_token && pathName !== '/' && pathName !== '/login' && pathName !== '/signup') {
            setIsValidSession(false);
            setMessage('Vous n\'êtes pas connecté !');
        }
    };
    verifSession();

    return (
        <div>
            {
                !isValidSession ? 
                (
                    <div className='unconnected'>
                        <p>{message}</p>
                        <p>Cliquez <u><a href='/'>ici</a></u> pour revenir à l'accueil</p>
                    </div>
                ): null
            }
        </div>
      )
};

export default Session
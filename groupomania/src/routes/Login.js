import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Verification from '../components/Verification';

const Login = () => {
    document.title = 'Groupomania - Login';
    const navigate = useNavigate();
    const regexEmail = /^([a-z0-9]{3,20})([.|_|-]{1}[a-z0-9]{1,20})?@{1}([a-z0-9]{2,15})\.[a-z]{2,4}$/;
    const [email, setEmailValue] = useState('');
    const [password, setPasswordValue] = useState('');
    const [confirm, setConfirm] = useState(true);
    const [message, setMessage] = useState('');
    const [alert, setAlert] = useState('');
    const [user, setUser] = useState({
        email: '',
        password: '',
        session: localStorage.session_token
    });

    const emailOnChange = (e) => {
        const email = e.target.value;
        if (!email.match(regexEmail)) {
            setUser(previousState => { return {...previousState, email: ''}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setUser(previousState => { return {...previousState, email: email}});
            e.target.style["border-color"] = "#34c924";
        }
        setEmailValue(email.toLowerCase())
    };

    const passwordOnChange = (e) => {
        const password = e.target.value;
        if (!password.match(/[A-Z]/g) || !password.match(/[a-z]/g) || !password.match(/[0-9]/g)
        || password.length < 8 || password.match[/\s|=|'|"'/]) {
            setUser(previousState => { return {...previousState, password: ''}});
            e.target.style["border-color"] = "#FD2D01";
        }
        else {
            setUser(previousState => { return {...previousState, password: password}});
            e.target.style["border-color"] = "#34c924";
        }
        setPasswordValue(password);
    };

    const onView = (e) => {
        e.preventDefault();
        const previousInput = e.target.parentNode.previousElementSibling;
        if (previousInput.type === "password") {
            previousInput.type = "text";
            e.target.style["opacity"] = "0.5";
            e.target.title = "Cacher";
        } else {
            previousInput.type = "password";
            e.target.style["opacity"] = "1";
            e.target.title = "Afficher";
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        /**
         * @description this function communicate with the API to connect the user
         */
        const fetchData = async () =>{
            try {             
                const response = await fetch('https://localhost/api/auth/login', {
                    method: "POST",
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user })
                });

                const responseJson = await response.json((err) => {
                    if (err) throw err;
                });

                if (response.ok) {
                    if (responseJson.isVerified === false) {
                        localStorage.setItem('session_id', responseJson.userId);
                        setMessage('Vérification de l\'email nécessaire, veuillez patienter...');
                        setConfirm(false);
                    } else {
                        localStorage.setItem("session_firstname", responseJson.firstname);
                        localStorage.setItem("session_id", responseJson.userId);
                        localStorage.setItem("session_token", responseJson.token);
                        setMessage('Connexion ok, redirection en cours...');
                        setTimeout(function(){ navigate("/") } , 3000);
                    }
                } else {
                    setAlert(responseJson.error);
                    setTimeout(function(){ setAlert('') } , 8000);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    };

    return (
        !confirm ? (<Verification />):
        (
            <div className="login">
                <form className='login-form'>
                <h1>Connexion</h1>
                    <fieldset>
                        <label htmlFor='email'>Email</label>
                        <input
                            id='email'
                            name='email'
                            value={email.toLowerCase()}
                            onChange={emailOnChange}
                        />
                    </fieldset>
                    <fieldset>
                        <label htmlFor='password'>Mot de passe</label>
                        <input
                            id='password'
                            name='password'
                            type='password'
                            value={password}
                            onChange={passwordOnChange}
                        />
                        <span className="icon-eye">
                            <i className="fas fa-low-vision" onClick={onView} title="Afficher"></i>
                        </span>
                    </fieldset>
                    {
                        user.email && user.password ?
                        (
                            <button className="btn btn-submit" onClick={handleSubmit} title="Connexion">
                                Valider
                            </button>
                        ) : (
                            <div className='submit'>
                                <button className='btn btn-submit' disabled>Valider</button>
                                <span className='messageValid'>* Tous les champs doivent être renseignés</span>
                            </div>
                        )
                    }
                </form>
                { message !== '' ? (<p className="message">{message}</p>): null }
                { alert ? (<p className="alert">⚠️ {alert}</p>): null }
            </div>
        )
    )
}

export default Login
import { useState } from 'react';
import Verification from '../components/Verification';

const Login = () => {
    document.title = 'Login';
    const regexEmail = /^([a-z0-9]{3,20})([.|_|-]{1}[a-z0-9]{1,20})?@{1}([a-z0-9]{2,15})\.[a-z]{2,4}$/;
    const [email, setEmailValue] = useState('');
    const [password, setPasswordValue] = useState('');
    const [isValid, setIsValid] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [confirm, setConfirm] = useState(true);
    const session = localStorage.session_token;

    function emailOnChange(e) {
        const email = e.target.value;
        if (!email.match(regexEmail)) {
            setIsValid(previousState => { return {...previousState, email: ''}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, email: email}});
            e.target.style["border-color"] = "#34c924";
        }
        setEmailValue(email.toLowerCase())
    }

    function passwordOnChange(e) {
        const password = e.target.value;
        if(!password.match(/[A-Z]/g) || !password.match(/[a-z]/g) || !password.match(/[0-9]/g) 
        || password.length < 8 || password.match[/\s|=|'|"'/]) {
            setIsValid(previousState => { return {...previousState, password: ''}});
            e.target.style["border-color"] = "#FD2D01";
        }
        else {
            setIsValid(previousState => { return {...previousState, password: password}});
            e.target.style["border-color"] = "#34c924";
        }
        setPasswordValue(password)
    }

    const handleSubmit = (event) => {
        // prevents the submit button from refreshing the page
        event.preventDefault();

        async function fetchData() {
            try {             
                const response = await fetch('https://localhost/api/auth/login', {
                    method: "POST",
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password, session })
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
                        localStorage.setItem('session_id', JSON.parse(responseJson.userId));
                        localStorage.setItem("session_token", responseJson.token);
                        setMessage('Connexion ok, redirection en cours...');
                        setTimeout(function(){ 
                            window.location.href="/" 
                        } , 5000);
                    }
                } else {
                    alert(responseJson.err);
                }
            } catch (err) {
                console.error(err);
            }
        }
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
                    </fieldset>
                    {
                        isValid.email && isValid.password ?
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
                {message !== '' ? (<p>{message}</p>): null}
            </div>
        )
        
    )
}

export default Login
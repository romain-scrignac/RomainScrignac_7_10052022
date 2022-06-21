import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    document.title = 'Groupomania - Login';
    const navigate = useNavigate();

    const [email, setEmailValue] = useState('');
    const [password, setPasswordValue] = useState('');
    const [message, setMessage] = useState('');
    const [alert, setAlert] = useState('');
    const [user, setUser] = useState({
        email: '',
        password: '',
        session: localStorage.session_token
    });

    const emailOnChange = (e) => {
        const email = e.target.value;
        const regexEmail = /^([a-z0-9]{3,20})([.|_|-]{1}[a-z0-9]{1,20})?@{1}([a-z0-9]{2,15})\.[a-z]{2,4}$/;

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

    const onViewPassword = (e) => {
        e.preventDefault();

        if (e.target.title === 'Afficher') {
            document.getElementById("password").type = 'text';
            document.getElementById('icon-low-vision').style["display"] = "none";
            document.getElementById('icon-eye').style['display'] = 'block';
        }
        if (e.target.title === 'Cacher') {
            document.getElementById("password").type = 'password';
            document.getElementById('icon-eye').style["display"] = "none";
            document.getElementById('icon-low-vision').style['display'] = 'block';
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
                const responseJson = await response.json();

                if (response.ok) {
                    localStorage.setItem("session_firstname", responseJson.firstname);
                    localStorage.setItem("session_id", responseJson.userId);
                    localStorage.setItem("session_token", responseJson.token);
                    localStorage.setItem("session_rank", responseJson.rank);
                    setMessage('Connexion ok, redirection en cours...');
                    setTimeout(function(){ navigate("/") } , 3000);
                } else {
                    setAlert(responseJson.error);
                    setTimeout(function(){ setAlert('') } , 5000);
                }
            } catch (err) {
                //console.log(err);
            }
        };
        fetchData();
    };

    return (
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
                    <span id="icon-low-vision" className="icon-low-vision" onClick={onViewPassword}>
                        <i className="fas fa-low-vision" title="Afficher"></i>
                    </span>
                    <span id="icon-eye" className ="icon-eye" onClick={onViewPassword}>
                        <i className="fas fa-eye" title="Cacher"></i>
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
}

export default Login
import { useState } from 'react';

const Signup = () => {
    document.title = 'Groupomania - Signup';
    const regexEmail = /^([a-z0-9]{3,20})([.|_|-]{1}[a-z0-9]{1,20})?@{1}([a-z0-9]{2,15})\.[a-z]{2,4}$/;
    const [firstnameValue, setFirstnameValue] = useState('');
    const [lastnameValue, setLastnameValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
    const [message, setMessage] = useState('');
    const [newAlert, setNewAlert] = useState('');
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPass: '',
        signup: true
    });

    const firstnameOnChange = (e) => {
        const firstname = e.target.value;
        if (firstname.length < 3) {
            setUser(previousState => { return {...previousState, firstname: ''}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setUser(previousState => { return {...previousState, firstname: firstname}});
            e.target.style["border-color"] = "#34c924";
        }
        setFirstnameValue(firstname);
    };

    const lastnameOnChange = (e) => {
        const lastname = e.target.value;
        if (lastname.length < 3) {
            setUser(previousState => { return {...previousState, lastname: ''}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setUser(previousState => { return {...previousState, lastname: lastname}});
            e.target.style["border-color"] = "#34c924";
        }
        setLastnameValue(lastname);
    };

    const emailOnChange = (e) => {
        const email = e.target.value;
        if (!email.match(regexEmail)) {
            setUser(previousState => { return {...previousState, email: ''}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setUser(previousState => { return {...previousState, email: email}});
            e.target.style["border-color"] = "#34c924";
        }
        setEmailValue(email.toLowerCase());
    };

    const passwordOnChange = (e) => {
        const password = e.target.value;
        if(!password.match(/[A-Z]/g) || !password.match(/[a-z]/g) || !password.match(/[0-9]/g) 
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

    const confirmPasswordOnChange = (e) => {
        const confirmPass = e.target.value;
        if(confirmPass !== passwordValue) {
            setUser(previousState => { return {...previousState, confirmPass: ''}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setUser(previousState => { return {...previousState, confirmPass: confirmPass}});
            e.target.style["border-color"] = "#34c924";
        }
        setConfirmPasswordValue(confirmPass);
    };

    const onViewPassword = (e) => {
        e.preventDefault();
        
        if (e.target.title === 'Afficher') {
            document.getElementById("password").type = 'text';
            document.getElementById("verifPassword").type = 'text';
            document.getElementById('icon-low-vision').style["display"] = "none";
            document.getElementById('icon-eye').style['display'] = 'block';
        }
        if (e.target.title === 'Cacher') {
            document.getElementById("password").type = 'password';
            document.getElementById("verifPassword").type = 'password';
            document.getElementById('icon-eye').style["display"] = "none";
            document.getElementById('icon-low-vision').style['display'] = 'block';
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        /**
         * @description this function communicates with the API to register the user
         */
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user })
                });
                const responseJson = await response.json();
                
                if (response.ok) {
                    setMessage('Bienvenue ! Un code de confirmation vient de vous être envoyé, veuillez vérifier votre boite email');
                    setTimeout(function(){ window.location.href="/login" } , 5000);
                } else {
                    setNewAlert(responseJson.error);
                    setTimeout(function(){ setNewAlert('') } , 8000);
                }
            } catch (err) {
                //console.log(err);
            }
        };
        fetchData();
    };

    return (
        <div className="signup">
            {
                message ? 
                (
                    <p className="message">{message}</p>
                ):(
                    <form className="signup-form">
                    <h1>Inscription</h1>
                        <fieldset>
                            <label htmlFor="firstname">Prénom</label>
                            <input 
                                id="firstname"
                                name="firstname"
                                type="text"
                                value={firstnameValue}
                                onChange={firstnameOnChange}
                            />
                        </fieldset>
                        <fieldset>
                            <label htmlFor="lastname">Nom</label>
                            <input 
                                id="lastname"
                                name="lastname"
                                type="text"
                                value={lastnameValue}
                                onChange={lastnameOnChange}
                            />
                        </fieldset>
                        <fieldset>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={emailValue.toLowerCase()}
                                onChange={emailOnChange}
                            />
                        </fieldset>
                        <fieldset>
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={passwordValue}
                                onChange={passwordOnChange}
                            />
                            <span id="icon-low-vision" className="icon-low-vision" onClick={onViewPassword}>
                                <i className="fas fa-low-vision" title="Afficher"></i>
                            </span>
                            <span id="icon-eye" className ="icon-eye" onClick={onViewPassword}>
                                <i className="fas fa-eye" title="Cacher"></i>
                            </span>
                            {/* <span className="icon-eye">
                                <i className="fas fa-low-vision" onClick={onView} title="Afficher"></i>
                            </span> */}
                        </fieldset>
                        <fieldset>
                            <label htmlFor="password">Confirmation du mot de passe</label>
                            <input
                                id="verifPassword"
                                name="verifPassword"
                                type="password"
                                value={confirmPasswordValue}
                                onChange={confirmPasswordOnChange}
                            />
                        </fieldset>
                        {   
                            user.firstname && user.lastname && user.email && user.password 
                            && user.confirmPass && passwordValue === confirmPasswordValue ?
                            (
                                <button className="btn btn-submit" onClick={handleSubmit} title="Inscription">
                                    Valider
                                </button>
                            ):(
                                <div className='submit'>
                                    <span className='messageValid'>* Tous les champs doivent être renseignés</span>
                                    <button className="btn btn-submit" disabled>Valider</button>
                                </div>
                            )
                        }                
                    </form>
                )
            }
            {newAlert ? (<p className="alert">⚠️ {newAlert}</p>): null}
        </div>
    )
}

export default Signup
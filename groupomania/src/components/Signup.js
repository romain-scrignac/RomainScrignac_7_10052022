import { useState } from 'react';

function Signup() {
    document.title = 'Signup';
    const regexEmail = /^([a-z0-9]{3,20})([.|_|-]{1}[a-z0-9]{1,20})?@{1}([a-z0-9]{2,15})\.[a-z]{2,4}$/;
    const [firstnameValue, setFirstnameValue] = useState('')
    const [lastnameValue, setLastnameValue] = useState('')
    const [emailValue, setEmailValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    const [verifPasswordValue, setVerifPasswordValue] = useState('')
    const [isValid, setIsValid] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        verifPass: ''
    });

    function firstnameOnChange(e) {
        const firstname = e.target.value;
        if (firstname.length < 3) {
            (setIsValid(previousState => { return {...previousState, firstname: ''}}));
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, firstname: firstname}});
            e.target.style["border-color"] = "#34c924";
        }
        setFirstnameValue(firstname);
    }

    function lastnameOnChange(e) {
        const lastname = e.target.value;
        if (lastname.length < 3) {
            setIsValid(previousState => { return {...previousState, lastname: ''}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, lastname: lastname}});
            e.target.style["border-color"] = "#34c924";
        }
        setLastnameValue(lastname);
    }

    function emailOnChange(e) {
        const email = e.target.value;
        if (!email.match(regexEmail)) {
            setIsValid(previousState => { return {...previousState, email: ''}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, email: email}});
            e.target.style["border-color"] = "#34c924";
        }
        setEmailValue(email.toLowerCase());
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
        setPasswordValue(password);
    }

    function verifPasswordOnChange(e) {
        const verifPass = e.target.value;
        if(verifPass !== passwordValue) {
            setIsValid(previousState => { return {...previousState, verifPass: ''}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, verifPass: verifPass}});
            e.target.style["border-color"] = "#34c924";
        }
        setVerifPasswordValue(verifPass);
    }

    const handleSubmit = (event) => {
        // prevents the submit button from refreshing the page
        event.preventDefault();

        async function fetchData() {
            try {
                const response = await fetch('https://localhost/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        firstname: firstnameValue, 
                        lastname: lastnameValue, 
                        email: emailValue, 
                        password: passwordValue,
                        verifPass: verifPasswordValue
                     })
                });
                const responseJson = await response.json((err) => {
                    if (err) throw err;
                });
                if (response.ok) {
                    setTimeout(function(){ window.location.href="/login" } , 5000);
                } else {
                    alert(responseJson.err)
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }

    return (
        <div className="signup">
            <h1>Inscription</h1>
            <form className="signup-form">
                <fieldset>
                    <label htmlFor="firstname">Prénom:</label>
                    <input 
                        id="firstname"
                        name="firstname"
                        type="text"
                        value={firstnameValue}
                        onChange={firstnameOnChange}
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="lastname">Nom:</label>
                    <input 
                        id="lastname"
                        name="lastname"
                        type="text"
                        value={lastnameValue}
                        onChange={lastnameOnChange}
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={emailValue.toLowerCase()}
                        onChange={emailOnChange}
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={passwordValue}
                        onChange={passwordOnChange}
                    />
                </fieldset>
                <fieldset>
                    <label htmlFor="password">Vérification:</label>
                    <input
                        id="verifPassword"
                        name="verifPassword"
                        type="password"
                        value={verifPasswordValue}
                        onChange={verifPasswordOnChange}
                    />
                </fieldset>
                {   
                    isValid.firstname && isValid.lastname && isValid.email && isValid.password 
                    && isValid.verifPass && passwordValue === verifPasswordValue ?
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
        </div>
    )
}

export default Signup
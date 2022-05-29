import {useState} from 'react';
import '../styles/Signup.css'

function Signup() {
    document.title = 'Signup';
    const regexEmail = /^([a-z0-9]{3,20})([.|_|-]{1}[a-z0-9]{1,20})?@{1}([a-z0-9]{2,15})\.[a-z]{2,4}$/;
    const [firstnameValue, setFirstnameValue] = useState('')
    const [lastnameValue, setLastnameValue] = useState('')
    const [emailValue, setEmailValue] = useState('')
    const [passwordValue, setPasswordValue] = useState('')
    const [verifPasswordValue, setVerifPasswordValue] = useState('')

    function firstnameOnChange(e) {
        if (e.target.value.length < 3) {
            document.getElementById('firstname').style.borderColor = "#ff1c05";
        } else {
            document.getElementById('firstname').style.borderColor = "#34c924";
        }
        setFirstnameValue(e.target.value);
    }

    function lastnameOnChange(e) {
        if (e.target.value.length < 3) {
            document.getElementById('lastname').style.borderColor = "red";
        } else {
            document.getElementById('lastname').style.borderColor = "#34c924";
        }
        setLastnameValue(e.target.value);
    }

    function emailOnChange(e) {
        if (!e.target.value.match(regexEmail)) {
            document.getElementById('email').style.borderColor = "red";
        } else {
            document.getElementById('email').style.borderColor = "#34c924";
        }
        setEmailValue(e.target.value);
    }

    function passwordOnChange(e) {
        if(!e.target.value.match(/[A-Z]/g) || !e.target.value.match(/[a-z]/g) || !e.target.value.match(/[0-9]/g) 
        || e.target.value.length < 8 || e.target.value.match[/\s|=|'|"'/]) {
            document.getElementById('password').style.borderColor = "red";
        } else {
            document.getElementById('password').style.borderColor = "#34c924";
        }
        setPasswordValue(e.target.value);
    }

    function verifPasswordOnChange(e) {
        if(e.target.value !== passwordValue) {
            document.getElementById('verifPassword').style.borderColor = "red";
        } else {
            document.getElementById('verifPassword').style.borderColor = "#34c924";
        }
        setVerifPasswordValue(e.target.value);
    }

    const handleSubmit = (event) => {
        // prevents the submit button from refreshing the page
        event.preventDefault();

        async function fetchData() {
            try {
                const response = await fetch('http://localhost:3000/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ firstname: firstnameValue, lastname: lastnameValue, email: emailValue, password: passwordValue })
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
            <h2>Formulaire d'inscription</h2>
            <form className="signup-form">
                <fieldset>
                    <label htmlFor="firstname">Prénom:</label>
                    <input 
                        id="firstname"
                        name="firstname"
                        type="text"
                        size="50"
                        value={firstnameValue}
                        onChange={firstnameOnChange}
                        required
                    />
                    <label htmlFor="lastname">Nom:</label>
                    <input 
                        id="lastname"
                        name="lastname"
                        type="text"
                        size="50"
                        value={lastnameValue}
                        onChange={lastnameOnChange}
                        required
                    />
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        size="50"
                        value={emailValue}
                        onChange={emailOnChange}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        size="50"
                        value={passwordValue}
                        onChange={passwordOnChange}
                        required
                    />
                    <label htmlFor="password">Vérification:</label>
                    <input
                        id="verifPassword"
                        name="verifPassword"
                        type="password"
                        size="50"
                        value={verifPasswordValue}
                        onChange={verifPasswordOnChange}
                        required
                    />
                </fieldset>
                {1 + 1 === 2 ? (
                    <button className="btn btn-submit-signup" onClick={handleSubmit} title="Valider l'inscription">Valider</button>
                ):(
                    <div>
                        <span className='messageValid'>* Tous les champs doivent être renseignés</span>
                        <button className="btn btn-submit-signup" disabled>Valider</button>
                    </div>
                )}
                
            </form>
        </div>
    )
}

export default Signup
import { useState } from 'react';
import '../styles/Login.css'

const Login = () => {
    document.title = 'Login';
    const [email, setEmailValue] = useState('');
    const [password, setPasswordValue] = useState('');

    function emailOnChange(e) {
        setEmailValue(e.target.value)
    }

    function passwordOnChange(e) {
        setPasswordValue(e.target.value)
    }

    const handleSubmit = (event) => {
        // prevents the submit button from refreshing the page
        event.preventDefault();

        async function fetchData() {
            try {             
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: "POST",
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                if (response.ok) {
                    const responseJson = await response.json();
                    localStorage.setItem("session_firstname", responseJson.firstname);
                    localStorage.setItem('session_id', responseJson.userId);
                    localStorage.setItem("session_token", responseJson.token);
                    setTimeout(function(){ window.location.href="/" } , 5000);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    };

    return (
        <div className="login-form">
             <form>
                <fieldset>
                    <label htmlFor='email'>Email</label>
                    <input
                        id='email'
                        name='email'
                        value={email}
                        onChange={emailOnChange}
                    />
                    <p id='emailErrorMsg' className='errorMsg'></p>
                    <label htmlFor='password'>Password</label>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        value={password}
                        onChange={passwordOnChange}
                    />
                    <p id='passwordErrorMsg' className='errorMsg'></p>
                </fieldset>
                {password.includes(' ') || password.trim().length < 8 || email.trim() === '' ? (
                        <div>
                            <span className='messageValid'>* Tous les champs doivent être valident</span>
                            <button className="btn btn-submit-login" disabled>Submit</button>
                        </div>
                    ) : (
                        <button className="btn btn-submit-login" onClick={handleSubmit} title="Valider">Valider</button>
                    )
                }
            </form>
        </div>
    )
}

export default Login
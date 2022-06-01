import { useState } from 'react';

const Verification = () => {

    const [userCode, setUserCode] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [message, setMessage] = useState(false);
    const [sendMail, setSendmail] = useState('');

    function codeOnChange(e) {
        const code = e.target.value;
        if (code.length !== 6 || code.trim() === "") {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
        setUserCode(code);
    };
    
    const handleSubmit = (event) => {
        // prevents the submit button from refreshing the page
        event.preventDefault();

        async function fetchData() {
            try {
                const response = await fetch('https://localhost/api/auth/verification', {
                    method: "POST",
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: localStorage.session_id, code: userCode })
                });

                const responseJson = await response.json((err) => {
                    if (err) throw err;
                });

                if (response.ok) {
                    setMessage(true);
                    localStorage.setItem("session_firstname", responseJson.firstname);
                    localStorage.setItem("session_token", responseJson.token);
                    setTimeout(function(){ window.location.href="/" } , 5000);

                } else {
                    alert(responseJson.err);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    };

    const sendCode = (event) => {
        event.preventDefault();

        async function fetchData() {
            try {
                const response = await fetch('https://localhost/api/auth/sendcode', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: localStorage.session_id })
                });

                if (response.ok) {
                    setSendmail('Le code vous a été renvoyé sur votre boite mail');
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    };

    return (
        <div>
            {
                message ? (<p>Bienvenue ! Vous allez être redirigé vers la page d'accueil</p>):
                (
                    <div className="verif">
                        <p>Veuillez saisir le code de vérification reçu dans votre boite mail</p>
                        <form className='verif-form'>
                            <fieldset>
                                <label htmlFor='userCode'>Code:</label>
                                <input
                                    id='userCode'
                                    name='userCode'
                                    value={userCode}
                                    onChange={codeOnChange}
                                />
                            </fieldset>
                            {
                                isValid ? 
                                (<button className='btn btn-submit' onClick={handleSubmit} title='Vérification'>Valider</button>):
                                (<button className='btn btn-submit' disabled>Valider</button>)
                            }
                        </form>
                        {
                            !sendMail ? (<a href="/" onClick={sendCode}>Renvoyer le code</a>):
                            (<p>{sendMail}</p>)
                            
                        }
                        
                    </div>
                )
            }
        </div>
    )
};

export default Verification
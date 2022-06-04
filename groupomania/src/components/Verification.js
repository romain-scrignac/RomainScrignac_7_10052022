import { useState } from 'react';

const Verification = () => {

    const [userCode, setUserCode] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [sendMail, setSendmail] = useState('');
    const [message, setMessage] = useState('');
    const [alert, setAlert] = useState('');

    function codeOnChange(e) {
        const code = e.target.value;
        if (code.length !== 6 || code.trim() === "" || !code.match(/^[0-9]{6}$/)) {
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
                    setMessage('Bienvenue ! Redirection vers la page d\'accueil en cours...');
                    localStorage.setItem("session_firstname", responseJson.firstname);
                    localStorage.setItem("session_token", responseJson.token);
                    setTimeout(function(){ window.location.href="/" } , 5000);

                } else {
                    setAlert(responseJson.err);
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
                message ? 
                (
                    <div className="verif">
                        <p>{message}</p>
                    </div>
                ):
                (
                    <div className="verif">
                        <form className='verif-form'>
                            <h1>Code de confirmation</h1>
                            <span 
                                className="issue"
                                title="Veuillez saisir le code de vérification à 6 chiffres reçu dans votre boite mail"
                            >
                                ❔
                            </span>
                            <fieldset>
                                <input
                                    id='userCode'
                                    name='userCode'
                                    value={userCode}
                                    onChange={codeOnChange}
                                    maxLength="6"
                                    size="6"
                                />
                            </fieldset>
                            {
                                isValid ? 
                                (<button className='btn btn-submit' onClick={handleSubmit} title='Vérification'>Valider</button>):
                                (<button className='btn btn-submit' disabled>Valider</button>)
                            }
                        </form>
                        {
                            !sendMail ? 
                            (
                                <p className='sendCode'>
                                        <a href="/" onClick={sendCode} title="Recevoir le code sur ma boite de messagerie">Renvoyer le code</a>
                                </p>
                            ):(
                                <p>{sendMail}</p>
                            )
                            
                        }
                        {alert ? (<p className="alert">⚠️ {alert}</p>): null}
                    </div>
                )
            }
        </div>
    )
};

export default Verification
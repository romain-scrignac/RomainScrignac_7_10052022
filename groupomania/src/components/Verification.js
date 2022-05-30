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
                const response = await fetch('http://localhost:3000/api/auth/verification', {
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
                const response = await fetch('http://localhost:3000/api/auth/sendcode', {
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
                message ? (<p>Bienvenue ! Vous allez être redirigé vers la page d'acueil</p>):
                (
                    <div className="verif">
                        <h3>Veuillez saisir le code de vérification envoyé sur votre boite mail</h3>
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
                            !sendMail ? (<p onClick={sendCode}>Renvoyer le code</p>):
                            (<p>{sendMail}</p>)
                            
                        }
                        
                    </div>
                )
            }
        </div>
    )
};

export default Verification
import { useState, useEffect } from 'react';
import { iconDelete, iconUpdate } from '../datas/images';
import { btnDelete, btnUpdate } from '../components/Buttons';

const Account = () => {
    document.title = 'Groupomania - Account';
    const regexName = /[0-9!-&(-,.-/:-@[-`{-~]/;
    const regexEmail = /^([a-z0-9]{3,20})([.|_|-]{1}[a-z0-9]{1,20})?@{1}([a-z0-9]{2,15})\.[a-z]{2,4}$/;
    const [userInfos, setUserInfos] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [account, setAccount] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPass: '',
        signup: false
    });
    const [newMessage, setNewMessage] = useState('');
    const [newAlert, setNewAlert] = useState('');

    useEffect(() => {
        /**
         * @description this function communicates with the API to display the user's informations
         */
        const getUserData = async () => {
            try {
                const response = await fetch(`https://localhost/api/auth/${localStorage.session_id}`, {
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.session_token}`
                    }
                });
                const responseJson = await response.json((err) => {
                    if (err) throw err;
                });
                if (response.ok) {
                    setUserInfos(responseJson.message);
                } else {
                    alert(responseJson.error);
                }
            } catch (err) {
                console.error(err);
            }
        };
        getUserData();
    }, [newMessage]);

    const avatarOnChange = (e) => {
        const file = e.target.files[0];
        if (file.size > (1024 * 1024)) {
            setNewAlert("La taille de l'image doit être inférieure à 1 Mo");
            setAvatarFile(null);
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setNewAlert("");
            setAvatarFile(file);
            e.target.style["border-color"] = "#34c924";
        }
    };

    const firstnameOnChange = (e) => {
        const firstname = e.target.value;
        if (firstname.match(regexName)) {
            setNewAlert('Caractère(s) non autorisé(s)');
            setAccount(previousState => { return {...previousState, firstname: ''}});
        } else {
            setNewAlert('');
            if (firstname.trim() === '' || firstname.length < 2 || firstname.length > 50) {
                setAccount(previousState => { return {...previousState, firstname: ''} });
                e.target.style["border-color"] = "#FD2D01";
            } 
            else {
                setAccount(previousState => { return {...previousState, firstname: firstname} });
                e.target.style["border-color"] = "#34c924";
            }
        }
    };

    const lastnameOnChange = (e) => {
        const lastname = e.target.value;
        if (lastname.match(regexName)) {
            setNewAlert('Caractères non autorisés');
            setAccount(previousState => { return {...previousState, lastname: ''}});
        } else {
            setNewAlert('');
            if (lastname.trim() === '' || lastname.length > 50) {
                setAccount(previousState => { return {...previousState, lastname: ''} });
                e.target.style["border-color"] = "#FD2D01";
            } else {
                setAccount(previousState => { return {...previousState, lastname: lastname} });
                e.target.style["border-color"] = "#34c924";
            }
        }
    };

    const emailOnChange = (e) => {
        const email = e.target.value;
        if (!email.match(regexEmail)) {
            setAccount(previousState => { return {...previousState, email: ''} });
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setAccount(previousState => { return {...previousState, email: email.toLowerCase()} });
            e.target.style["border-color"] = "#34c924";
        }
    };

    const passwordOnChange = (e) => {
        const password = e.target.value;
        if(!password.match(/[A-Z]/g) || !password.match(/[a-z]/g) || !password.match(/[0-9]/g)
        || password.length < 8 || password.match[/\s|=|'|"'/]) {
            setAccount(previousState => { return {...previousState, password: ''} });
            e.target.style["border-color"] = "#FD2D01";
        }
        else {
            setAccount(previousState => { return {...previousState, password: password} });
            e.target.style["border-color"] = "#34c924";
        }
    };

    const verifPasswordOnChange = (e) => {
        const confirmPass= e.target.value;
        if(confirmPass.trim() === "" || confirmPass !== account.password) {
            setAccount(previousState => { return {...previousState, confirmPass: ''} });
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setAccount(previousState => { return {...previousState, confirmPass: confirmPass} });
            e.target.style["border-color"] = "#34c924";
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = "Confirmez-vous la modification de votre profil ?";
        if (window.confirm(text)) {
            modifyAccount();
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        const text = "Confirmez-vous la suppression de votre compte ?";
        if (window.confirm(text)) {
            deleteAccount();
        }
    };

    /**
     * @description this function resets all entries after modification with the new values
     */
    const resetModify = () => {
        const fieldsets = document.getElementsByTagName('fieldset');
        for (let fieldset of fieldsets) {
            const input = fieldset.children[1];
            if (input.name !== 'avatar') {
                input.value = '';
                input.style["borderColor"] = '';
                input.disabled = true;
            }
        }
        document.getElementById('avatarName').innerText = '';
    };

    /**
     * @description this function checks the account modification and updates the css
     */
    const handleUpdate = (e) => {
        e.preventDefault();
        const previousInput = e.target.parentNode.previousSibling;
        const fieldsetConfim = e.target.parentNode.parentNode.nextSibling;
        
        if (previousInput.disabled) {
            previousInput.disabled = false;
            previousInput.style["borderColor"] = "#FFD7D7";
            previousInput.focus();
        } else {
            previousInput.disabled = true;
            previousInput.style["borderColor"] = "";
        }
        if (previousInput.name === "password") {
            fieldsetConfim.style["display"] = "flex";
        } 
        if (previousInput.name === "password" && previousInput.disabled === true) {
            document.getElementById('password').value = '';
            document.getElementById('verifPassword').value = '';
            document.getElementById('verifPassword').style['borderColor'] = '';
            setAccount(previousState => { return {...previousState, password: ''} });
            setAccount(previousState => { return {...previousState, confirmPass: ''} });
            fieldsetConfim.style["display"] = "none";
        }
    };

    /**
     * @description this function communicates with the API to modify the user's informations
     */
    const modifyAccount = async () => {
        const url = `https://localhost/api/auth/${localStorage.session_id}`;
        const authorization = `Bearer ${localStorage.session_token}`;

        try {
            let response;
            if (avatarFile) {
                const formData = new FormData();
                formData.append("account", JSON.stringify(account));
                formData.append("avatarFile", avatarFile);
                formData.append('fileName', avatarFile.name);

                response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Authorization': authorization
                    },
                    body: formData
                });
            } else {
                response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json',
                        'Authorization': authorization
                    },
                    body: JSON.stringify({ account })
                });
            }
            const responseJson = await response.json((err) => {
                if (err) throw err;
            });
            if (response.ok) {
                resetModify();
                setNewMessage({account: account, file: avatarFile});
                console.log(responseJson.message);
            } else {
                alert(responseJson.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * @description this function communicate with the API to delete the user's account
     */
    const deleteAccount = async () => {
        // try {
        //     const reponse = await fetch(`https://localhost/api/auth/${localStorage.session_id}`, {
        //         method: 'DELETE',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ userId : localStorage.session_id })
        //     });
        //     const responseJson = await response.json((err) => {
        //         if (err) throw err;
        //     });
        //     if (response.ok) {
        //         alert("Compte supprimé !");
        //     } else {
        //         alert(responseJson.error);
        //     }
        // } catch (err) {
        //     console.error(err);
        // }
    };

    return (
        <div className="profil">
            <form className="account-form" id="account-form">
            <h1>Profil</h1>
            <button className={btnDelete.class} title={btnDelete.title} onClick={handleDelete}>
                <img src={iconDelete.cover} alt={iconDelete.name} />
            </button>
                <fieldset>
                    <label htmlFor='avatar' className="avatarUpload">
                        <div className='avatar'>
                            <img
                                src={userInfos.user_avatar}
                                alt='avatar'
                                title="Changer d'avatar"
                            />
                        </div>
                    </label>
                    {avatarFile ? (<span id="avatarName">{avatarFile.name}</span>): null}
                    <input
                        id="avatar"
                        name="avatar"
                        type="file"
                        onChange={avatarOnChange}
                        accept="image/*"
                />
                </fieldset>
                <fieldset>
                    <label htmlFor="firstname">Prénom</label>
                    <input 
                        id="firstname"
                        name="firstname"
                        type="text"
                        placeholder={userInfos.user_firstname}
                        onChange={firstnameOnChange}
                        disabled
                    />
                    <button className={btnUpdate.class} title="Modifier le prénom" onClick={handleUpdate}>
                        <img src={iconUpdate.cover} alt={iconUpdate.name} />
                    </button>
                </fieldset>
                <fieldset>
                    <label htmlFor="lastname">Nom</label>
                    <input 
                        id="lastname"
                        name="lastname"
                        type="text"
                        placeholder={userInfos.user_lastname}
                        onChange={lastnameOnChange}
                        disabled
                    />
                    <button className={btnUpdate.class} title="Modifier le nom" onClick={handleUpdate}>
                        <img src={iconUpdate.cover} alt={iconUpdate.name} />
                    </button>
                </fieldset>
                <fieldset>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={userInfos.user_email}
                        onChange={emailOnChange}
                        disabled
                    />
                    <button className={btnUpdate.class} title="Modifier l'email" onClick={handleUpdate}>
                        <img src={iconUpdate.cover} alt={iconUpdate.name} />
                    </button>
                </fieldset>
                <fieldset>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={passwordOnChange}
                        disabled
                    />
                    <button className={btnUpdate.class} title="Modifier le mot de passe" onClick={handleUpdate}>
                        <img src={iconUpdate.cover} alt={iconUpdate.name} />
                    </button>
                </fieldset>
                <fieldset style={{display: "none"}}>
                    <label htmlFor="password">Confirmation du mot de passe</label>
                    <input
                        id="verifPassword"
                        name="verifPassword"
                        type="password"
                        onChange={verifPasswordOnChange}
                    />
                </fieldset>
                {   
                    avatarFile || account.firstname || account.lastname || account.email 
                    || (account.password && account.password === account.confirmPass) ?
                    (
                        <button className="btn btn-submit" onClick={handleSubmit} title="Modifier le profil">
                            Valider
                        </button>
                    ) : null
                }
            </form>
            {newAlert ? (<p className="alert">⚠️ {newAlert}</p>) : null}
        </div>
    )
};

export default Account
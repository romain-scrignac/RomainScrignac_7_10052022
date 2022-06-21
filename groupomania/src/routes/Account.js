import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { errorToken } from '../datas/functions';
import { iconDelete, iconUpdate } from '../datas/images';
import { btnDelete, btnUpdate } from '../datas/buttons';

const Account = () => {
    const navigate = useNavigate();
    const location = useLocation();
    if (location.search.match(/userId/)) {
        document.title = 'Groupomania - Profile';
    } else {
        document.title = 'Groupomania - Account';
    }
    const regexName = /[0-9!-&(-,.-/:-@[-`{-~]/;
    const regexEmail = /^([a-z0-9]{3,20})([.|_|-]{1}[a-z0-9]{1,20})?@{1}([a-z0-9]{2,15})\.[a-z]{2,4}$/;
    const sessionRank = Number(localStorage.session_rank);
    const sessionId = Number(localStorage.session_id);

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
    const [usersList, setUsersList] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminProfile, setIsAdminProfile] = useState(false);        
    const [newMessage, setNewMessage] = useState('');                   // used to update the web page following the activity
    const [newAlert, setNewAlert] = useState('');                       // used to alert user if there is an error

    useEffect(() => {
        /**
         * @description this function communicates with the API to display the user's informations
         */
        const getUserData = async () => {
            let userId = sessionId;
            // If admin's profile or profile consultation the userId changes
            if (location.search && sessionRank === 3) {
                userId = location.search.split('userId=')[1];
                setIsAdmin(true);
            }
            try {
                const response = await fetch(`https://localhost/api/auth/${userId}`, {
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.session_token}`
                    }
                });
                const responseJson = await response.json();
                if(responseJson.error && responseJson.error === 'Invalid token!') {
                    errorToken(navigate);
                }
                if (response.ok) {
                    setUserInfos(responseJson.user);
                    if (responseJson.user.rank === 3) {
                        setUsersList(responseJson.usersList);
                    }
                }
            } catch (err) {
                //console.log(err);
            }
        };
        getUserData();
    }, [newMessage, isAdminProfile]);

    const avatarOnChange = (e) => {
        const file = e.target.files[0];
        const MIME_TYPES = [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp'
        ];
        if (!MIME_TYPES.includes(file.type)) {
            setNewAlert("Format d'image invalide");
            setAvatarFile(null);
            e.target.style["border-color"] = "#FD2D01";
        } 
        else if (file.size > (1024 * 1024)) {
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

        if (email.match(/[A-ZÀ-ÿ]/)) {
            setNewAlert("L'email doit être en minuscules et sans accent");
        } else if (email.match(/[!-,/:-?[-^`°{-~]/)) {
            setNewAlert("Caractère(s) non autorisé(s)");
        }
        else {
            setNewAlert('');
        }

        if (!email.match(regexEmail)) {
            setAccount(previousState => { return {...previousState, email: ''} });
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setAccount(previousState => { return {...previousState, email: email.toLowerCase()} });
            e.target.style["border-color"] = "#34c924";
        }
    };

    const emailOnBlur = (e) => {
        const email = e.target.value;
        if (!email.match(regexEmail)) {
            setNewAlert("Mauvais format d'email");
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
        const textAdmin = "Confirmez-vous la suppression de ce compte ?";

        if ((!isAdmin || isAdminProfile) && window.confirm(text)) {
            deleteAccount();
        } else if (isAdmin && !isAdminProfile && window.confirm(textAdmin)) {
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
        if (avatarFile) {
            document.getElementById('avatarName').innerText = '';
        }
        setAccount({
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPass: '',
            signup: false
        });
        setAvatarFile(null);
        setNewMessage(`Reset modification ${Date()}`);
    };

    /**
     * @description this function is used to navigate to each profile if admin
     * 
     * @param {Number} userId the id of the user to view
     */
    const viewProfile = (userId) => {
        navigate(`/account?userId=${userId}`);
        setNewMessage(`Account of user ${userId}`);

        if (userId !== userInfos.id && isAdminProfile) {
            setIsAdminProfile(false);
        }
    };

    /**
     * @description this function is used to switch between user's profile and admin's profile
     */
    const viewAdminProfile = () => {
        if (!location.search && sessionRank === 3) {
            setIsAdminProfile(true);
        }
    };
    if(isAdminProfile === false) {viewAdminProfile()}
    
    /**
     * @description this function is used to change the user's privileges
     * 
     * @param {Number} rank the rank of privileges
     */
    const changePrivileges = (rank) => {
        if (sessionRank === 3) {
            modifyPrivileges(rank);
        }
    };

    /**
     * @description this function is used to count users for admin's list
     */
         const countUsers = () => {
            let count = 0;
            for (let user of usersList) {
                if (user.rank !== 3) {
                    count++;
                }
            }
            return count;
        };
        countUsers();

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
     * @description this function communicates with the API to modify the user's privileges
     */
     const modifyPrivileges = async (rank) => {
        try {
            let userId;
            if (location.search) {
                userId = location.search.split('userId=')[1];
            } else {
                userId = userInfos.id;
            }
            const url = `https://localhost/api/auth/${userId}?admin=true`;
            const authorization = `Bearer ${localStorage.session_token}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': authorization
                },
                body: JSON.stringify({ accountRank: rank })
            });
            if (response.ok) {
                setNewMessage(`Privileges updated! ${rank}`);
            }
        } catch (err) {
            //console.log(err);
        }
    };

    /**
     * @description this function communicates with the API to modify the user's informations
     */
    const modifyAccount = async () => {
        const url = `https://localhost/api/auth/${sessionId}`;
        const authorization = `Bearer ${localStorage.session_token}`;
        try {
            let response;
            if (avatarFile) {
                const formData = new FormData();
                formData.append("account", JSON.stringify(account));
                formData.append("avatar", avatarFile);

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
            if (response.ok) {
                resetModify();
            }
        } catch (err) {
            //console.log(err);
        }
    };

    /**
     * @description this function communicate with the API to delete the user's account
     */
    const deleteAccount = async () => {
        try {
            const response = await fetch(`https://localhost/api/auth/${userInfos.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.session_token}`
                },
                body: JSON.stringify({ userId : userInfos.id })
            });
            if (response.ok) {
                if (sessionRank === 3) {
                    navigate('/account');
                } else {
                    localStorage.clear();
                    navigate('/');
                }
            }
        } catch (err) {
            //console.log(err);
        }
    };

    return (
        <div className="profil">
            {
                // Display privileges' button if admin
                sessionRank === 3 ?
                (
                    <div className="profil-admin">
                        <div className="profil-admin-rank">
                            <i className="fas fa-lock"></i>
                            <div className="profil-admin-rank--privileges">
                                <ul>
                                    <li title="Nommer modérateur" onClick={() => changePrivileges(2)}>Modérateur</li>
                                    <li title="Nommer administrateur" onClick={() => changePrivileges(3)}>Administrateur</li>
                                    <li title="Supprimer le privilège" onClick={() => changePrivileges(1)}>Aucun</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : null
            }
            <form className="account-form" id="account-form">
                <h1>{`${userInfos.firstname} ${userInfos.lastname}`}</h1>
                <span className="user-rank">
                    {userInfos.rank === 2 ? 'Modérateur' : null}
                    {userInfos.rank === 3 ? 'Admin' : null}
                </span>
                <button className={btnDelete.class} title={btnDelete.title} onClick={handleDelete}>
                    <img src={iconDelete.cover} alt={iconDelete.name} />
                </button>
                {
                    sessionId === userInfos.id ?
                    (
                        <fieldset>
                            <label htmlFor='avatar' className="avatarUpload">
                                <span className='avatar'>
                                    <img
                                        src={userInfos.avatar}
                                        alt='avatar'
                                        title="Changer d'avatar"
                                    />
                                </span>
                            </label>
                            {avatarFile ? (<span id="avatarName">{avatarFile.name}</span>): null}
                            <input
                                id="avatar"
                                name="avatar"
                                type="file"
                                onChange={avatarOnChange}
                                accept=".jpg, .jpeg, .png, .gif, .webp"
                            />
                        </fieldset>
                    ) : (
                        <fieldset>
                            <label htmlFor='avatar' className="avatarUpload">
                                <span className='avatar'>
                                    <img
                                        src={userInfos.avatar}
                                        alt='avatar'
                                    />
                                </span>
                            </label>
                        </fieldset>
                    )
                }
                <fieldset>
                    <label htmlFor="firstname">Prénom</label>
                    <input 
                        id="firstname"
                        name="firstname"
                        type="text"
                        placeholder={userInfos.firstname}
                        onChange={firstnameOnChange}
                        disabled
                    />
                    {
                        sessionId === userInfos.id ?
                        (
                            <button className={btnUpdate.class} title="Modifier le prénom" onClick={handleUpdate}>
                                <img src={iconUpdate.cover} alt={iconUpdate.name} />
                            </button>
                        ) : null
                    }
                    
                </fieldset>
                <fieldset>
                    <label htmlFor="lastname">Nom</label>
                    <input 
                        id="lastname"
                        name="lastname"
                        type="text"
                        placeholder={userInfos.lastname}
                        onChange={lastnameOnChange}
                        disabled
                    />
                    {
                        sessionId === userInfos.id ?
                        (
                            <button className={btnUpdate.class} title="Modifier le nom" onClick={handleUpdate}>
                                <img src={iconUpdate.cover} alt={iconUpdate.name} />
                            </button>
                        ) : null
                    }
                </fieldset>
                <fieldset>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={userInfos.email}
                        onChange={emailOnChange}
                        onBlur={emailOnBlur}
                        disabled
                    />
                    {
                        sessionId === userInfos.id ?
                        (
                            <button className={btnUpdate.class} title="Modifier l'email" onClick={handleUpdate}>
                                <img src={iconUpdate.cover} alt={iconUpdate.name} />
                            </button>
                        ) : null
                    }
                </fieldset>
                {
                    sessionId === userInfos.id ?
                    (
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
                    ) : null
                }
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
            {
                // If it's admin's profile, display users' list
                userInfos.rank === 3 && !location.search.match(/userId/) ?
                (
                    <div className="usersList">
                        <h3>Liste des utilisateurs</h3>
                        {
                            countUsers() > 0 ?
                            (
                                usersList.map(user => (
                                    user.id !== userInfos.id ?
                                    (<div 
                                        key={user.id} 
                                        onClick={() => viewProfile(user.id)}
                                        title={`Voir le profil de ${user.firstname}`}
                                    >
                                        {`${user.firstname} ${user.lastname}`}
                                        <hr></hr>
                                    </div>) : null
                                ))
                            ) : (<span>Aucun utilisateur</span>)
                        }
                    </div>
                ) : null
            }
        </div>
    )
};

export default Account
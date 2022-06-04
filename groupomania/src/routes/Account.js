import { useState, useEffect } from 'react';
import axios from 'axios';
import { iconDelete, iconUpdate } from '../datas/images';
import { btnDelete, btnUpdate } from '../components/Buttons';

const Account = ({onFileSelect}) => {
    document.title = 'Account';
    const regexEmail = /^([a-z0-9]{3,20})([.|_|-]{1}[a-z0-9]{1,20})?@{1}([a-z0-9]{2,15})\.[a-z]{2,4}$/;
    const [userInfos, setUserInfos] = useState({});
    const [firstnameValue, setFirstnameValue] = useState('');
    const [lastnameValue, setLastnameValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [verifPasswordValue, setVerifPasswordValue] = useState('');
    const [avatarValue, setAvatarValue] = useState('');
    const [posts, setPosts] = useState({});
    const [isValid, setIsValid] = useState({
        avatar: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPass: '',
        signup: false
    });

    useEffect(() => {
        getUserData();
    }, []);

    const avatarOnChange = (e) => {
        const file = e.target.files[0];

        if (file.size > (1024 * 1024)) {
            setIsValid(previousState => { return {...previousState, avatar: ''}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, avatar: file}});
            e.target.style["border-color"] = "#34c924";
        }
        setAvatarValue(file);
    };

    const firstnameOnChange = (e) => {
        const firstname = e.target.value;
        if (firstname.length < 3 || firstname.match(/[0-9]/)) {
            setIsValid(previousState => { return {...previousState, firstname: userInfos.user_firstname}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, firstname: firstname}});
            e.target.style["border-color"] = "#34c924";
        }
        setFirstnameValue(firstname);
    };

    const lastnameOnChange = (e) => {
        const lastname = e.target.value;
        if (lastname.length < 3 || lastname.match(/[0-9]/)) {
            setIsValid(previousState => { return {...previousState, lastname: userInfos.user_lastname}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, lastname: lastname}});
            e.target.style["border-color"] = "#34c924";
        }
        setLastnameValue(lastname);
    };

    const emailOnChange = (e) => {
        const email = e.target.value;
        if (!email.match(regexEmail)) {
            setIsValid(previousState => { return {...previousState, email: userInfos.user_email}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, email: email}});
            e.target.style["border-color"] = "#34c924";
        }
        setEmailValue(email.toLowerCase());
    };

    const passwordOnChange = (e) => {
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
    };

    const verifPasswordOnChange = (e) => {
        const confirmPass= e.target.value;
        if(confirmPass !== passwordValue) {
            setIsValid(previousState => { return {...previousState, confirmPass: ''}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, confirmPass: confirmPass}});
            e.target.style["border-color"] = "#34c924";
        }
        setVerifPasswordValue(confirmPass);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        modifyAccount();
    }

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
            setPasswordValue('');
            setVerifPasswordValue('');
            fieldsetConfim.style["display"] = "none";
        }
    }

    const getUserData = async () => {
        try {
            const response = await fetch(`https://localhost/api/auth/account`, {
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.session_token}`
                }
            });
            const responseJson = await response.json();
            if (response.ok) {
                setUserInfos(responseJson.findUser);
                setPosts({nbPosts: responseJson.nbPosts.length, nbComs: responseJson.nbComs.length});
            }
        } catch (err) {
            console.error(err);
        }
    };

    const modifyAccount = () => {
        const text = "Confirmez-vous la modification de votre profil ?";
        if (window.confirm(text)) {
            console.log("Compte modifié")

            const config = { 
                headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.session_token}`
                }
            };
            const url = `https://localhost/api/auth/account/${localStorage.session_id}`;
            const formData = new FormData();
            formData.append('firstname', isValid.firstname);
            formData.append('lastName', isValid.lastname);
            formData.append('email', isValid.email);
            formData.append('password', isValid.password);
            formData.append('confirmPass', isValid.confirmPass);
            formData.append('signup', false);
            formData.append("file", isValid.avatar);
            formData.append('fileName', isValid.avatar.name);
            
            axios.put(url, formData, config).then((response) => {
            console.log(response.data);
            });


            async function fetchData() {
                try {
                    // const response = await fetch(`https://localhost/api/auth/account/${localStorage.session_id}`, {
                    //     method: 'PUT',
                    //     headers: {
                    //         'Accept': 'application/json',
                    //         'Content-Type': 'multipart/form-data',
                    //         'Authorization': `Bearer ${localStorage.session_token}`
                    //     },
                    //     body: JSON.stringify({ isValid })
                    // });

                    // const responseJson = await response.json((err) => {
                    //     if (err) throw err;
                    // });
                    // if (response.ok) {
                    //     //window.location.href="/account";
                    // } else {
                    //     alert(responseJson.err)
                    // }
                } catch (err) {
                    console.error(err);
                }
            }
            fetchData();
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        const text = "Confirmez-vous la suppression de votre compte ?";
        if (window.confirm(text)) {
           alert("Compte supprimé !");
        
        // try {
        //     await fetch(`https://localhost/api/auth/delete`, {
        //         method: 'DELETE',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ userId : localStorage.session_id })
        //     });
        // } catch (err) {
        //     console.error(err);
        // }
        }
    };

    return (
        <div className="profil">
            <form className="account-form">
            <h1>Profil</h1>
            <button className={btnDelete.class} title={btnDelete.title} onClick={handleDelete}>
                <img src={iconDelete.cover} alt={iconDelete.name} />
            </button>
                <fieldset>
                    <label htmlFor='avatar' className="avatarUpload">
                        <img
                            className='avatar'
                            src={userInfos.user_avatar}
                            alt='avatar'
                            title="Changer d'avatar"
                        />
                    </label>
                    {avatarValue ? (<span>{avatarValue.name}</span>): null}
                    <input
                        id="avatar"
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
                        value={firstnameValue}
                        onChange={firstnameOnChange}
                        disabled
                    />
                    <button className={btnUpdate.class} title={btnUpdate.title} onClick={handleUpdate}>
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
                        value={lastnameValue}
                        onChange={lastnameOnChange}
                        disabled
                    />
                    <button className={btnUpdate.class} title={btnUpdate.title} onClick={handleUpdate}>
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
                        value={emailValue}
                        onChange={emailOnChange}
                        disabled
                    />
                    <button className={btnUpdate.class} title={btnUpdate.title} onClick={handleUpdate}>
                        <img src={iconUpdate.cover} alt={iconUpdate.name} />
                    </button>
                </fieldset>
                <fieldset>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={passwordValue}
                        onChange={passwordOnChange}
                        disabled
                    />
                    <button className={btnUpdate.class} title={btnUpdate.title} onClick={handleUpdate}>
                        <img src={iconUpdate.cover} alt={iconUpdate.name} />
                    </button>
                </fieldset>
                <fieldset style={{display: "none"}}>
                    <label htmlFor="password">Confirmation du mot de passe</label>
                    <input
                        id="verifPassword"
                        name="verifPassword"
                        type="password"
                        value={verifPasswordValue}
                        onChange={verifPasswordOnChange}
                    />
                </fieldset>
                {   
                    isValid.avatar || isValid.firstname || isValid.lastname || isValid.email 
                    || (isValid.password && isValid.password === isValid.confirmPass) ?
                    (
                        <button className="btn btn-submit" onClick={handleSubmit} title="Modifier le profil">
                            Valider
                        </button>
                    ):(
                        <div className='submit'>
                            <span className='messageValid'>* Seuls les champs renseignés seront modifiés</span>
                            <button className="btn btn-submit" disabled>Valider</button>
                        </div>
                    )
                }
            </form>
        </div>
    )
};

export default Account
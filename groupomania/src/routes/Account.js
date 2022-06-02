import { useState, useEffect } from 'react';

const Account = () => {
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
    const [modifProfil, setModifProfil] = useState(false);
    const [isValid, setIsValid] = useState({});

    useEffect(() => {
        getUserData();
    }, []);

    const avatarOnChange = (e) => {
        const file = e.target.files[0];
        if (file.size > (1024 * 1024)) {
            setIsValid(previousState => { return {...previousState}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, avatar: file}});
            e.target.style["border-color"] = "#34c924";
        }
        setAvatarValue(file);
    };

    const firstnameOnChange = (e) => {
        const firstname = e.target.value;
        if (firstname.length < 3) {
            setIsValid(previousState => { return {...previousState}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, firstname: firstname}});
            e.target.style["border-color"] = "#34c924";
        }
        setFirstnameValue(firstname);
    };

    const lastnameOnChange = (e) => {
        const lastname = e.target.value;
        if (lastname.length < 3) {
            setIsValid(previousState => { return {...previousState}});
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
            setIsValid(previousState => { return {...previousState}});
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
            setIsValid(previousState => { return {...previousState}});
            e.target.style["border-color"] = "#FD2D01";
        }
        else {
            setIsValid(previousState => { return {...previousState, password: password}});
            e.target.style["border-color"] = "#34c924";
        }
        setPasswordValue(password);
    };

    const verifPasswordOnChange = (e) => {
        const verifPassword = e.target.value;
        if(verifPassword !== passwordValue) {
            setIsValid(previousState => { return {...previousState, verifPassword: ''}});
            e.target.style["border-color"] = "#FD2D01";
        } else {
            setIsValid(previousState => { return {...previousState, verifPassword: verifPassword}});
            e.target.style["border-color"] = "#34c924";
        }
        setVerifPasswordValue(verifPassword);
    };

    const handleModify = (e) => {
        e.preventDefault();
        setModifProfil(true);
    };

    const changeAvatar = (e) => {
        e.preventDefault();

        return <input type="file" accept="image/*" />;
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

    const handleModifyConfirm = async () => {
        const text = "Confirmez-vous la modification de votre profil ?";
        if (window.confirm(text)) {
           alert("Compte modifié !");

            async function fetchData() {
                try {
                    const response = await fetch(`https://localhost/api/auth/${localStorage.session_id}`, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ 
                            firstname: firstnameValue, 
                            lastname: lastnameValue, 
                            email: emailValue, 
                            password: passwordValue,
                            verifPass: verifPasswordValue,
                            avatar: avatarValue,
                            userId: localStorage.session_id
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
    };

    const firstname = userInfos.user_firstanme;

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

    console.log(isValid)

    return (
        !modifProfil ? 
        (
            <div className="profil">
                <h1>Profil</h1>
                <div className="infos">
                    <img src="" alt="Avatar" />
                    <p id='name'>{userInfos.user_firstname} {userInfos.user_lastname}</p>
                    <p id='email'>{userInfos.user_email}</p>
                    <p>Posts: {posts.nbPosts}</p>
                    <p>Commentaires: {posts.nbComs}</p>
                </div>
                <div>
                    <button className="btn btn-submit" onClick={handleModify}>Modifier</button>
                    <button className="btn btn-submit" onClick={handleDelete}>Supprimer</button>
                </div>
            </div>
        ):(
            <div className="modif-profil">
                <h1>Modification du profil</h1>
                <form className="signup-form">
                {
                            userInfos.user_avatar ?
                            (
                                <fieldset>
                                    <img src="" alt="avatar" />
                                </fieldset>
                                
                            ):(
                                <fieldset>
                                    <label htmlFor='avatar'>Avatar:</label>
                                    <input
                                        id="avatar"
                                        type="file"
                                        name="avatar"
                                        placeholder={userInfos.user_avatar}
                                        value={avatarValue}
                                        onChange={avatarOnChange}
                                        accept="image/*"
                                />
                                </fieldset>
                            )
                        }
                    <fieldset>
                        <label htmlFor="firstname">Prénom:</label>
                        <input 
                            id="firstname"
                            name="firstname"
                            type="text"
                            placeholder={userInfos.user_firstname}
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
                            placeholder={userInfos.user_lastname}
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
                            placeholder={userInfos.user_email}
                            value={emailValue}
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
                        && isValid.verifPassword && passwordValue === verifPasswordValue ?
                        (
                            <button className="btn btn-submit" onClick={handleModifyConfirm} title="Inscription">
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
    )

};

export default Account
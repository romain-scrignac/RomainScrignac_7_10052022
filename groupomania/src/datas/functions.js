/**
 * @description this function checks for token or connexion errors and disconnects the user if there are any
 * @param {Function} navigate function to redirect the user to the login page
 */
export const errorConnexion = (navigate) => {
    document.getElementById('root').style["opacity"] = 0;
    alert('Votre session a expiré, veuillez vous reconnecter')
    navigate('/logout');
    document.getElementById('root').style["opacity"] = 1;
};
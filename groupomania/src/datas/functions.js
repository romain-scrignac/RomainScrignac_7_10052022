/**
 * @description this function checks for token errors and disconnects the user if there are any
 * @param {Function} navigate function to redirect the user to the login page
 */
export const errorToken = (navigate) => {
    localStorage.clear();
    document.getElementById('root').style["opacity"] = 0;
    alert('Votre session a expiré, vous allez redirigé vers la page de connexion')
    navigate('/login');
    document.getElementById('root').style["opacity"] = 1;
};
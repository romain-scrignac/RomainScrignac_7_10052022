const Logout = () => {
    document.title = 'Logout';
    const deconnexion = async () => {
        try {
            const userId = localStorage.session_id;
            const response = await fetch('http://localhost:3000/api/auth/logout', {
                method: "PUT",
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });
            if (response.ok) {
                localStorage.clear();
                setTimeout(function(){ window.location.href="/" } , 5000);
            }
        } catch (err) {
            console.log(err);
        }
    }
    deconnexion()

    return (
        <div className="btn btn-submit-logout"><p>Déconnexion en cours...</p></div>
    )
};

export default Logout
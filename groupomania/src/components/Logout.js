const Logout = () => {
    document.title = 'Logout';
    const deconnexion = async () => {
        try {
            const userId = localStorage.session_id;
            const response = await fetch('https://localhost/api/auth/logout', {
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
        <div className="logout"><p>Déconnexion en cours...</p></div>
    )
};

export default Logout
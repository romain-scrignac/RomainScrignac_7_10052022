import { useLocation } from "react-router-dom";

const Message = () => {
    document.title = 'Envoyer un message';
    let location = useLocation();
    console.log(location)
    let userId;
    if (location.search) {
        userId = location.search.split('userId=')[1]
        
    }
    

    return (
        location.search ?
        (
            <div>User numéro {userId}</div>
        ): null
    )
};

export default Message
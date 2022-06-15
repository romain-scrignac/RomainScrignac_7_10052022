import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Messages = () => {
    document.title = 'Groupomania - Messagerie';
    let location = useLocation();
    let userId;
    let messageId;
    if (location.search) {
        userId = location.search.split('userId=')[1];
        messageId = location.search.split('id=')[1];
    }
    console.log(location.search)
    
    const [allMessages, setAllMessages] = useState([]);
    const [oneMessage, setOneMessage] = useState('');

    useEffect(() => {
        if (location.search === "") {
            /**
             * @description this function communicates with the API to display all messages
             */
            const getAllMessages = async () => {
                try {
                    const response = await fetch(`https://localhost/api/mailbox/`, {
                        headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.session_token}`
                        }
                    });
                    const responseJson = await response.json();
                    if (response.ok) {
                        setAllMessages(responseJson);
                        console.log(allMessages);
                    }
                } catch (err) {
                    console.log(err);
                }
            };
            getAllMessages();
        } else if (messageId) {
            /**
             * @description this function communicates with the API to display all messages
             */
             const getOneMessage = async () => {
                try {
                    const response = await fetch(`https://localhost/api/mailbox/${messageId}`, {
                        headers: { 
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.session_token}`
                        }
                    });
                    const responseJson = await response.json();
                    if (response.ok) {
                        setOneMessage(responseJson);
                        console.log(oneMessage);
                    }
                } catch (err) {
                    console.log(err);
                }
            };
            getOneMessage();
        } else if (userId) {
            console.log(`userId: ${userId}`)
        }
    }, []);

    return (
        location.search === "" ?
        (
            <div className="mailbox">
                <span className="mailbox-user">Messagerie de {localStorage.session_firstname}</span>
                {
                    allMessages.length > 0 ? 
                    (
                        allMessages.map(message => (
                            <div className="message" key={message.id}>
                                <span>{message.firstname + message.lastname}</span>
                                <span>{message.content}</span>
                                <span>{message.date}</span>
                            </div>
                        ))
                    ) : (
                        <div className="message">
                            <p>Vous n'avez aucun message</p>
                        </div>
                    )
                }
            </div>
        ) : (
            userId ? 
            (
                <div className="mailbox">User numéro {userId}</div>
            ) : (
                <div className="mailbox">Message numéro {messageId}</div>
            )
        )
    )
};

export default Messages
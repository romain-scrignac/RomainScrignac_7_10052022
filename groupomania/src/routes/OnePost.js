import { useLocation } from "react-router-dom";

const OnePost = () => {
    let location = useLocation();
    const postId = location.search.split('postId=')[1]
    document.title = 'Post n° '+ postId;

    return (

        <div>Post numéro {postId}</div>
    )
};

export default OnePost
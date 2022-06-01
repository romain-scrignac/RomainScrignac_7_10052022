import { useParams } from "react-router-dom";

const OnePost = () => {
    let params = useParams();
    document.title = 'Post n° '+ params.postId;

    return (
        <div>Post numéro {params.postId}</div>
    )
//     const url = new URL(window.location);
//     const getId = url.searchParams.get('postId');
//     const [onePost, setOnePost] = useState(0);

//     useEffect(() => {
//         fetchData()
//     }, [])

//     const fetchData = async () => {
//         const response = await fetch(`https://localhost/api/posts/${postId}`, {
//             headers: { 
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.session_token}`
//             }
//         });
//         if (response.ok) {
//             const responseJson = await response.json();
//             const onePost = responseJson.onePost;
//             setOnePost(onePost)
//         }
//     };
};

export default OnePost
const OnePost = () => {

    const url = new URL(window.location);
    const getId = url.searchParams.get('postId');
    const [onePost, setOnePost] = useState(0);

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.session_token}`
            }
        });
        if (response.ok) {
            const responseJson = await response.json();
            const onePost = responseJson.onePost;
            setOnePost(onePost)
        }
    };
};

export default OnePost
// import { useState, useEffect } from "react";

// const AllPosts = () => {

//     const [allPosts, setAllPosts] = useState([]);
//     const [allLikes, setAllLikes] = useState([]);
//     const [allDislikes, setAllDislikes] = useState([]);
//     const [order, setOrder] = useState(false);

//     useEffect(() => {
//         fetchPosts()
//     }, [order])

//     function changeOrder() {
//         if (order === false) {
//             setOrder(true);
//         } 
//         if (order === true) {
//             setOrder(false);
//         }
//     }

//     const fetchPosts = async () => {
//         const response = await fetch(`http://localhost:3000/api/posts/`, {
//             headers: { 
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.session_token}`,
//                 'Query': `order ${order}`
//             },
//             Query: order
//         });
//         if (response.ok) {
//             const responseJson = await response.json();
//             const allPosts = responseJson.allPosts;
//             setAllPosts(allPosts);
//         }
//     }

//     const fetchLikes = async () => {
//         const response = await fetch('http://localhost:3000/api/posts/', {
//             headers: { 
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.session_token}`
//             }
//         });
//         if (response.ok) {
//             const responseJson = await response.json();
//             const likes = responseJson.allLikes;
//             setAllLikes(allLikes);
//             setAllDislikes(allDislikes);
//         }

//         // let likes = [];
//         // post.Likes.map(like => {
//         //     likes.push({postId: post.post_id, like: like.like_value})
//         // })
//     }

//     const onLike = async (postId, like) => {      
//         setAllLikes()  
//         const response = await fetch(`http://localhost:3000/api/posts/${postId}/like`, {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.session_token}`
//             },
//             body: JSON.stringify({postId: postId, like: like})
//         });
//         if (response.ok) {
//             if (like === 1) {
//                 console.log("Like ajouté !")
//             } else {
//                 console.log("Dislike ajouté !")
//             }
//         }
//     }

//     return (
//         <div id="test">
//             <button onClick={changeOrder}>Trier par date</button>
//             {allPosts.map(post => (
//                 <div key={post.post_id} className="post">
//                     <p className="post-content">Post n° {post.post_id}: {post.post_content}</p>
//                     <span title= {post.User.user_email} className="post-name">{post.User.user_firstname}</span>
//                         {
//                             JSON.stringify(post.Likes) === "[]" ? 
//                             (<p><a >Like: 0</a></p>):
//                             (<p><a onClick={() => onLike(post.post_id)}>Like: </a>{JSON.stringify(post.Likes[0].like_value)}</p>)
//                         }
//                     <button onClick={() => onLike(post.post_id, 1)}>+</button>
//                     <button onClick={() => onLike(post.post_id, -1)}>-</button>
//                 </div>
//             ))}
//         </div>
//     )
// };

// export default AllPosts
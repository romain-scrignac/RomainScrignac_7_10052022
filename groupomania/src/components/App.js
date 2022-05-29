import Header from './Header';
import AllPosts from './AllPosts';
import Login from './Login';
import Logout from'./Logout';
import Signup from './Signup';

function App() {
  document.title = 'Groupomania';
  const url = new URL(window.location);
  const pathName = url.pathname;

  return (
    <div>
      <Header />
      {localStorage.session_token && pathName === '/' ? (<AllPosts />) : null}
      {pathName === '/login' ? (<Login />): null}
      {pathName === '/logout' ? (<Logout />): null}
      {pathName === '/signup' ? (<Signup />): null}
    </div>
  )
}

export default App;

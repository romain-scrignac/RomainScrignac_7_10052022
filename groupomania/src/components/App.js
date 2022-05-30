import Header from './Header';
import AllPosts from './AllPosts';
import Login from './Login';
import Logout from'./Logout';
import Signup from './Signup';
import Verification from './Verification';

function App() {
  document.title = 'Groupomania';
  const url = new URL(window.location);
  const pathName = url.pathname;

  return (
    <div>
      <Header />
      {localStorage.session_token && pathName === '/' ? (<AllPosts />) : null}
      {localStorage.session_token && pathName === '/logout' ? (<Logout />) : null}
      {localStorage.session_id && pathName === '/verification' ? (<Verification />) : null}
      {pathName === '/login' ? (<Login />): null}
      {pathName === '/signup' ? (<Signup />): null}
    </div>
  )
}

export default App;

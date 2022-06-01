import { Outlet, Link } from "react-router-dom";
import Header from './components/Header';
import { btnLogin, btnLogout, btnReturn, btnSignup } from './components/Buttons';
// import AllPosts from './AllPosts';
// import Login from './Login';
// import Logout from'./Logout';
// import Signup from './Signup';
// import Verification from './Verification';

const App = () => {
  document.title = 'Groupomania';

  return (
    <div>
      <Header />
      <nav className="nav-buttons">
      {!localStorage.session_token ?
        (<div>
          <Link to="/login">
            <button className={btnLogin.class} title={btnLogin.title}>{btnLogin.name}</button>
          </Link>
          <Link to="/signup">
            <button className={btnSignup.class} title={btnSignup.title}>{btnSignup.name}</button>
          </Link>
        </div>):
        (
          <Link to="/logout">
            <button className={btnLogout.class} title={btnLogout.title}>{btnLogout.name}</button>
          </Link>
        )
      }
      <Link to="/">
        <button className={btnReturn.class} title={btnReturn.title}>{btnReturn.name}</button>
      </Link>
        
      </nav>
      <Outlet />
      
      {/* {pathName === '/' ? (<AllPosts />) : null}
      {pathName === '/logout' ? (<Logout />) : null}
      {pathName === '/login' ? (<Login />): null}
      {pathName === '/signup' ? (<Signup />): null}
      {pathName === '/verification' ? (<Verification />) : null} */}
    </div>
  )
};

export default App;

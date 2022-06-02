import { Outlet, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from './components/Header';
import { btnLogin, btnLogout, btnReturn, btnSignup, btnAccount } from './components/Buttons';

const App = () => {
  document.title = 'Groupomania';
  let params = useParams();

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
          localStorage.session_token ? (
            <div className="btn-profil">
              <Link to="/logout">
                <button className={btnLogout.class} title={btnLogout.title}>{btnLogout.name}</button>
              </Link>
              <Link to ='/account'>
                <button className={btnAccount.class} title={btnAccount.title}>{btnAccount.name}</button>
              </Link>
            </div>
          ): null
          
        )
      }
      {
        params !== '/' ?
        (
          <Link to="/">
            <button className={btnReturn.class} title={btnReturn.title}>{btnReturn.name}</button>
          </Link>
        ): null
      }        
      </nav>
      <Outlet />
    </div>
  )
};

export default App;

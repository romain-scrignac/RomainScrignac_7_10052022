import { Routes, Route, useLocation } from 'react-router-dom';
import Main from './routes/Main';
import AllPosts from './routes/AllPosts';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Logout from './routes/Logout';
import Account from './routes/Account';
import Messages from './routes/Messages';
import { error404 } from './datas/images';

const App = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Routes>
    {
      localStorage.session_token ?
      (
        <Route path="/" element={<Main />}>
          <Route index element={<AllPosts />} />
          <Route path="logout" element={<Logout />} />
          <Route path="account" element={<Account />} />
          <Route path="messages" element={<Messages />}>
            <Route path=":id" />
          </Route>
        </Route>
      ) : (
        <Route path="/" element={<Main />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      )
    }       
      <Route
        path="*"
        element={
          <main id="main">
            {
              pathname === '/login' || pathname === '/signup' ?
              (
                  <div className="alreadyConnected">
                    <p>Vous êtes déjà connecté !</p>
                    <p>Cliquez <a href="/" title="Retour à l'accueil">ici</a> pour revenir à l'accueil</p>
                  </div>
              ) : (
                <div className="err404">
                  <img src={error404.cover} alt={error404.name} />
                  <p>Vous vous êtes perdu en route ?</p>
                  <p>Cliquez <a href="/" title="Retour à l'accueil">ici</a> pour revenir à l'accueil</p>
                </div>
                
              )
        }
          </main>
        }
      />
    </Routes>
  )
};

export default App;

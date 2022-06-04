import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Logout from './routes/Logout';
import Account from './routes/Account';
import AllPosts from './components/AllPosts'
import OnePost from './components/OnePost';
import { error404 } from './datas/images';

const App = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Routes>
      {localStorage.session_token ?
        (
          <Route path="/" element={<Header />}>
            {!location.search.match(/postId/) ? 
              (<Route index element={<AllPosts />} />):
              (<Route index element={<OnePost />} />)
            }
            <Route path="logout" element={<Logout />} />
            <Route path="account" element={<Account />} />
          </Route>
        ):(
          <Route path="/" element={<Header />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        )
      }
    <Route
      path="*"
      element={
        <main className="grpm-err404">
          { 
            pathname === '/login' || pathname === '/signup' ? 
            (<p>Vous êtes déjà connecté !</p>): 
            (<img src={error404.cover} alt={error404.name} />)
          }
        </main>
      }
    />
  </Routes>
  )
};

export default App;

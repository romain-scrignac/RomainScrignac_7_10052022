import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Logout from './routes/Logout';
import Account from './routes/Account';
import AllPosts from './components/AllPosts'
import OnePost from './components/OnePost';
import { error404 } from './datas/images';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        {localStorage.session_token ? (<Route index element={<AllPosts />} />) :null}
        {!localStorage.session_token ? (<Route path="login" element={<Login />} />) :null}
        {!localStorage.session_token ? (<Route path="signup" element={<Signup />} />) :null}
        {localStorage.session_token ? (<Route path="logout" element={<Logout />} />) :null}
        {localStorage.session_token ? (<Route path=":postId" element={<OnePost />} />) :null}
        {localStorage.session_token ? (<Route path="account" element={<Account />} />) :null}
      </Route>
      <Route
        path="*"
        element={
          <main className="grpm-err404">
            <img src={error404.cover} alt={error404.name} />
          </main>
        }
      />
  </Routes>
  )
};

export default App;

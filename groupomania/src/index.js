import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App';
import Login from './routes/Login';
import Logout from './routes/Logout';
import Signup from './routes/Signup';
import AllPosts from './components/AllPosts'
import OnePost from './components/OnePost';
import Account from './routes/Account';
import { error404 } from './datas/images';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        {localStorage.session_token ? (<Route index element={<AllPosts />} />) :null}
        {localStorage.session_token ? (<Route path=":postId" element={<OnePost />} />) :null}
        {localStorage.session_token ? (<Route path="account" element={<Account />} />) :null}
        {localStorage.session_token ? (<Route path="logout" element={<Logout />} />) :null}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
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
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

import Header from './Header';
import AllPosts from './AllPosts';
import '../styles/App.css';

function App() {
  document.title = 'Groupomania';
  const url = new URL(window.location);
  const pathName = url.pathname;

  return (
    <div>
      <Header />
      {localStorage.session_token && pathName === '/' ? (<AllPosts />) : null}
    </div>
  )
}

export default App;

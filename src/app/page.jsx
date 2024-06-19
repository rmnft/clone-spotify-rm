"use client";
import { useRouter } from 'next/navigation';
import './home.css'; // Certifique-se de que este caminho está correto

const Home = () => {
  const router = useRouter();

  const handleVerArtistas = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token'); // Recupera o token do localStorage

    if (token) {
      router.push('/artistas'); // Redireciona para /artistas se o token existir
    } else {
      router.push('/login'); // Redireciona para /login se o token não existir
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">CLONE SPOTIFY</h1>
      <div className="button-group">
        <a href="cadastro" className="home-button">Cadastre-se</a>
        <a href="login" className="home-button">Login</a>
      </div>
    </div>
  );
};

export default Home;

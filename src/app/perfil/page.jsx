"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import "./perfil.css"


const Perfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        

        const response = await axios.get("https://clonespotify.azurewebsites.net/usuario/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navigateToPlanos = () => {
    router.push("/planos");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="profileContainer">
      <Header user={user} onLogout={handleLogout} />
      <div className="profileContent">
        <div className="profileCardContainer">
          <h1 className="profileTitle">Perfil do Usuário</h1>
          <p className="profileCardText">Nome: {user.nome}</p>
          <p className="profileCardText">Email: {user.email}</p>
          <h2 className="profileCardSubtitle">Assinatura</h2>
          {user.assinatura &&
            user.assinatura.map((assinatura) => (
              <div key={assinatura.id}>
                <p className="profileCardText">Plano: {assinatura.plano.nome}</p>
                <p className="profileCardText">Ativo: {assinatura.ativo ? "Sim" : "Não"}</p>
              </div>
            ))}
          <button onClick={navigateToPlanos} className="profileButton">Alterar Plano de Assinatura</button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

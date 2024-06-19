"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./planos.css"; // Importando o arquivo de estilos CSS

const Planos = () => {
  const [planos, setPlanos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlano, setSelectedPlano] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const response = await axios.get("https://clonespotify.azurewebsites.net/plano");
        setPlanos(response.data);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Token não encontrado, redirecionando para login...");
          return;
        }

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
          console.log("Token inválido, redirecionando para login...");
        }
      }
    };

    fetchPlanos();
    fetchUserData();
  }, []);

  const trocarPlanoUsuario = async (planoId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Token não encontrado, redirecionando para login...");
        return;
      }

      // Verifica se o usuário tem uma assinatura ativa para buscar o id da assinatura
      const assinaturaAtiva = user?.assinatura.find((assinatura) => assinatura.ativo);
      if (!assinaturaAtiva) {
        console.error("Usuário não possui assinatura ativa.");
        return;
      }

      const idAssinatura = assinaturaAtiva.id;

      // Faz a requisição para trocar a assinatura do usuário
      await axios.post(
        `https://spotify-2.azurewebsites.net/usuario/${user.id}/TrocarAssinatura/${idAssinatura}/${planoId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedPlano(planoId);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Erro ao trocar o plano:", error);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="planosContainer">
      <Header user={user} />
      <div className="planosContent">
        <h1 className="planosTitle">Planos Disponíveis</h1>
        <div className="planosCardContainer">
          {planos.map((plano) => (
            <div key={plano.id} className="planosCard">
              <h2 className="planosCardTitle">{plano.nome}</h2>
              <p className="planosCardDescription">Preço: R$ {plano.preco.toFixed(2)}</p>
              <button className="planosButton" onClick={() => trocarPlanoUsuario(plano.id)}>
                Selecionar Plano
              </button>
            </div>
          ))}
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmationMessage">
          <p>Plano alterado com sucesso!</p>
          <button onClick={handleCloseConfirmation} className="planosButton">Fechar</button>
        </div>
      )}
    </div>
  );
};

export default Planos;

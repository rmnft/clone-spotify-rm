  "use client";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { useRouter } from "next/navigation";
  import Header from "../components/Header";
  import "./favoritas.css";

  const Favoritas = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            router.push("/login");
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
            router.push("/login");
          }
        }
      };

      fetchUserData();
    }, [router]);

    const handleDesfavoritar = async (musicaId) => {
      try {
        const token = localStorage.getItem("token");
        if (token && user && user.id) {
          await axios.post(
            `https://clonespotify.azurewebsites.net/usuario/${user.id}/desfavoritar/${musicaId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Atualiza o estado local removendo a música desfavoritada
          setUser((prevUser) => ({
            ...prevUser,
            listaDesejo: [
              {
                ...prevUser.listaDesejo[0],
                musicas: prevUser.listaDesejo[0].musicas.filter(
                  (musica) => musica.id !== musicaId
                ),
              },
            ],
          }));

          alert("Música removida dos favoritos!");
        }
      } catch (error) {
        console.error("Erro ao desfavoritar a música:", error);
        alert("Erro ao remover a música dos favoritos.");
      }
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      router.push("/login");
    };

    if (loading) {
      return <div>Carregando...</div>;
    }

    return (
      <div className="mainContainer">
        <Header user={user} onLogout={handleLogout} />
        <div className="contentContainer">
          <h1>Músicas Favoritas</h1>
          {user && user.listaDesejo && user.listaDesejo[0] ? (
            <div className="cardContainer">
              {user.listaDesejo[0].musicas.map((musica) => (
                <div key={musica.id} className="card">
                  <div className="cardContent">
                    <h2 className="cardTitle">{musica.nome}</h2>
                    <p className="cardDescription">
                      Duração: {musica.duracao} min
                    </p>
                    <button
                      className="favorite-button"
                      onClick={() => handleDesfavoritar(musica.id)}
                    >
                      Desfavoritar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Não há músicas favoritas.</p>
          )}
        </div>
      </div>
    );
  };

  export default Favoritas;

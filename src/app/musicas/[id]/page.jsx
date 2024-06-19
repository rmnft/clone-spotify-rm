"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import "./musicas.css";

export default function Musicas() {
  const [musicas, setMusicas] = useState([]);
  const [filteredMusicas, setFilteredMusicas] = useState([]); // Estado para músicas filtradas
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de pesquisa
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchMusicas = async () => {
      try {
        const response = await axios.get(
          `https://clonespotify.azurewebsites.net/banda/${params.id}/musicas`
        );
        setMusicas(response.data);
        setFilteredMusicas(response.data); // Inicializa as músicas filtradas
      } catch (error) {
        console.error("Erro ao buscar músicas:", error);
      }
    };

    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userResponse = await axios.get(
            "https://clonespotify.azurewebsites.net/usuario/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserId(userResponse.data.id);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchMusicas();
    fetchUserId();
  }, [params.id]);

  const handleFavorite = async (musicaId) => {
    try {
      const token = localStorage.getItem("token");
      if (token && userId) {
        await axios.post(
          `https://clonespotify.azurewebsites.net/usuario/${userId}/favoritar/${musicaId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Música adicionada aos favoritos!");
      }
    } catch (error) {
      console.error("Erro ao favoritar a música:", error);
      alert("Erro ao adicionar a música aos favoritos.");
    }
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredMusicas(musicas); // Mostra todas as músicas se o campo de pesquisa estiver vazio
    } else {
      const filtered = musicas.filter((musica) =>
        musica.nome.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMusicas(filtered);
    }
  };

  return (
    <div className="container">
      <button className="button-back" onClick={() => router.back()}>
        Voltar
      </button>
      <h1 className="title">Músicas</h1>
      <input
        type="text"
        placeholder="Pesquisar músicas"
        value={searchTerm}
        onChange={handleSearchChange}
        className="searchInput"
      />
      <div className="cardContainer">
        {filteredMusicas.map((musica) => (
          <div key={musica.id} className="card">
            <div className="cardContent">
              <h2 className="cardTitle">{musica.nome}</h2>
              <p className="cardDescription">Duração: {musica.duracao} min</p>
              <button
                className="favorite-button"
                onClick={() => handleFavorite(musica.id)}
              >
                Favoritar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

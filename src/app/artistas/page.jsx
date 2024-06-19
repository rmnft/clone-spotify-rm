"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";
import axios from "axios"; // Importar axios
import "./artistas.css";
import withAuth from "../withAuth";
import Header from "../components/Header";

// Movendo a configuração do SearchClient para dentro da função
const createSearchClient = () => {
  return new SearchClient(
    "https://pesquisaspotify.search.windows.net", // Endpoint do seu serviço de busca
    "index", // Nome do índice
    new AzureKeyCredential("nNorGr6wisaKe53M3yK0wWmgr2Oe8j17kzzZVXFiQBAzSeAJjz9C") // Chave de administração do serviço de busca
  );
};

const Artistas = () => {
  const [bandas, setBandas] = useState([]);
  const [filteredBandas, setFilteredBandas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://clonespotify.azurewebsites.net/usuario/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      }
    };

    const fetchBandas = async () => {
      try {
        const response = await axios.get(
          "https://clonespotify.azurewebsites.net/banda",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBandas(response.data);
        setFilteredBandas(response.data);
      } catch (error) {
        console.error("Erro ao buscar bandas:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchBandas();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleSearchChange = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredBandas(bandas);
      setSuggestions([]);
      return;
    }

    try {
      const searchClient = createSearchClient();
      const searchResults = await searchClient.search(term);
      const resultsArray = [];

      for await (const result of searchResults.results) {
        resultsArray.push(result.document); // Adapte para a estrutura dos seus dados
      }

      setSuggestions(resultsArray);
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
    }
  };

  const handleSearchSubmit = async () => {
    try {
      const searchClient = createSearchClient();
      const searchResults = await searchClient.search(searchTerm);
      const resultsArray = [];

      for await (const result of searchResults.results) {
        resultsArray.push(result.document); // Adapte para a estrutura dos seus dados
      }

      setFilteredBandas(resultsArray);
    } catch (error) {
      console.error("Erro ao buscar bandas:", error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="mainContainer">
      <Header user={user} onLogout={handleLogout} />
      <div className="contentContainer">
        <h1 className="title">Artistas</h1>
        <input
          type="text"
          placeholder="Pesquisar bandas"
          value={searchTerm}
          onChange={handleSearchChange}
          className="searchInput"
        />
        <div className="suggestionsContainer">
          {suggestions.map((suggest, index) => (
            <div
              key={index}
              className="suggestion"
              onClick={() => setSearchTerm(suggest.nome)}
            >
              {suggest.nome} {/* Adapte conforme os campos retornados */}
            </div>
          ))}
        </div>
        <button onClick={handleSearchSubmit}>Buscar</button>
        <div className="cardContainer">
          {filteredBandas.map((banda) => (
            <div key={banda.id} className="card">
              <img
                src={banda.imagem}
                alt={banda.nome}
                className="cardImage"
              />
              <div className="cardContent">
                <h2 className="cardTitle">{banda.nome}</h2>
                <p className="cardDescription">{banda.descricao}</p>
                <a href={`/musicas/${banda.id}`} className="button">
                  Ver músicas
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Artistas);

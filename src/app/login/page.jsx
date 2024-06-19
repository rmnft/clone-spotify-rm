"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import './login.css'; // Certifique-se de que este caminho está correto

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://clonespotify.azurewebsites.net/usuario/login", 
        { email, senha },
      {
          headers: {
          "Ocp-Apim-Subscription-Key": "7ce271d5-d3eb-41a0-863e-3ebffc843736",
        },
      }
      );
      localStorage.setItem("token", response.data.token); // Armazena o token no localStorage
      router.push("/artistas"); // Redireciona para /artistas após o login
    } catch (error) {
      setError("Credenciais inválidas");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha"
              required
              className="form-input"
            />
          </div>
          {error && <p className="message error">{error}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

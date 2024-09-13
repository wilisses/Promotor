import React, { useState } from "react";
import "./style.css";
import { auth, db } from "../service/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auths, setAuths] = useState([]);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      sessionStorage.removeItem("client");
      sessionStorage.removeItem("key");

      await signInWithEmailAndPassword(auth, email, password);

      const auths = await new Promise((resolve, reject) => {
        const authsRef = ref(db, "authentication");
        onValue(
          authsRef,
          (snapshot) => {
            const data = snapshot.val();
            const auths = data
              ? Object.keys(data).map((key) => ({ key: key, ...data[key] }))
              : [];
            resolve(auths);
          },
          (error) => {
            reject(error);
          }
        );
      });

      setAuths(auths);

      const emailData = auths.filter((emails) => emails.email === email);

      emailData.forEach((positions) => {
        sessionStorage.setItem("key", JSON.stringify(positions));
        if (positions.position === 0) {
          navigate("/Admin");
        } else {
          navigate("/Dashboard");
        }
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="auth">
      <div className="form">
        <form onSubmit={handleLogin}>
          <div>
            <TextField
              required
              id="outlined-required"
              label="Login"
              type="email"
              defaultValue="Campo Obrigatorio!!!"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <TextField
              required
              id="outlined-password-input"
              label="Senha"
              type="password"
              autoComplete="current-password"
              defaultValue="Campo Obrigatorio!!!"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" variant="contained">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;

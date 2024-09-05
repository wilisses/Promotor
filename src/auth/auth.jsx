import React, {useState, useEffect} from 'react'
import './style.css'
import {auth, db} from '../service/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auths, setAuths] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
            const authsRef = ref(db, 'authentication'); 
            onValue(authsRef, (snapshot) => {
            const data = snapshot.val();
            const auths = data ? Object.keys(data).map(key => ({ key: key, ...data[key] })) : [];
            setAuths(auths);
            });
      }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);

            const filteredData = auths.filter(item => item.email === email);
            filteredData.forEach(item => {

                if(item.position === 0){
                    navigate('/Admin');
                } else {
                    navigate('/Dashboard');
                }
            });
            
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    };

    return (
    <div className="auth">
        <div className="form">
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="Login">Login</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="Senha">Senha</label>
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" >Entrar</button>
            </form>
        </div>
    </div>
  )
}

export default Auth
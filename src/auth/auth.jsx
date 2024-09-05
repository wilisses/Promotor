import React from 'react'
import './style.css'
const Auth = () => {
  return (
    <div className="auth">
        <div className="form">
            <form action="">
                <div>
                    <label htmlFor="Login">Login</label>
                    <input type="text" />
                </div>
                <div>
                    <label htmlFor="Senha">Senha</label>
                    <input type="password" name="" id="" />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    </div>
  )
}

export default Auth
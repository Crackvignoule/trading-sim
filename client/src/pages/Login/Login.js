import React, { useState } from 'react';
import Home from '../Home/Home';
import { useNavigate } from 'react-router-dom';
import {useDispatch } from 'react-redux';



import { BkgDiv, FormDiv, HeaderDiv, InputDiv, ButtonDiv, SwitchDiv, Label, InputText, Button, MidDiv, AnimatedDiv, Errordiv } from './Login.styles';

function Login() {

  const navigate = useNavigate();

  const [activeState, setActiveLabel] = useState("sign-in");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const[errorMessageState,setErrorMessageState] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}:5000/api/login`, { // Assurez-vous de mettre à jour l'URL avec votre endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const result = await response.json();
      if (response.status === 200) {
        localStorage.setItem('token', result.data.user.token);
        localStorage.setItem('pseudo', result.data.user.pseudo);
        dispatch({ type: "SET_ISLOGGEDIN", value: true });
        navigate('/dashboard');
      } else if (response.status === 401){
        console.log('Identifiants incorrect');
        setErrorMessage('Identifiants incorrect');
        setErrorMessageState(true);
        
      }else {
        // Gérez les erreurs, par exemple afficher un message
        console.log('Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
    }
  };

  const handleRegister = async () => {
    if (password !== repeatPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      setErrorMessageState(true);
      return;
    }else if (username.length < 4){
      setErrorMessage('Pseudo trop court ! (Minimum 4)');
      setErrorMessageState(true);
      console.log("Pseudo trop court !");
      return;
    }

    try {
      const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}:5000/api/register`, { // Assurez-vous de mettre à jour l'URL avec votre endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.status === 201) {
        console.log('Enregistrement réussie');
        setActiveLabel("sign-in");
        navigate('/login');
      } else{
        setErrorMessage(data.message);
        setErrorMessageState(true);
        console.log('Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      activeState === "sign-in" ? handleLogin(event) : handleRegister(event);
    }
  };
    return (
      <>
      <Home>
      </Home>
      <BkgDiv>
        <FormDiv>
          <HeaderDiv>
          <SwitchDiv>
              <Label onClick={() => {setActiveLabel("sign-in"); setErrorMessageState(false);}} active={activeState === "sign-in"}>Sign in</Label>
              <Label onClick={() => {setActiveLabel("sign-up"); setErrorMessageState(false);}} active={activeState === "sign-up"}>Sign up</Label>
              <AnimatedDiv active={activeState === "sign-up"} activeError={errorMessageState}></AnimatedDiv>
            </SwitchDiv>
          </HeaderDiv>
          <MidDiv>
            <Errordiv style={{ color: 'red' }} active={errorMessageState}>{errorMessage}</Errordiv>
            <InputDiv><InputText id="outlined-basic" label="Username" variant="outlined" value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              onSelect={() => setErrorMessageState(false)}
              onKeyDown={handleKeyDown}/></InputDiv>
            <InputDiv><InputText id="outlined-basic" label="Password" variant="outlined" value={password} type="password"
              onChange={(e) => setPassword(e.target.value)} 
              onSelect={() => setErrorMessageState(false)}
              onKeyDown={handleKeyDown}/></InputDiv>
            <InputDiv active={activeState === "sign-up"} 
            className="sign-up-mode">
              <InputText id="outlined-basic" label="Repeat Password" variant="outlined" type="password"
              value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} 
              onSelect={() => setErrorMessageState(false)} 
              onKeyDown={handleKeyDown}/></InputDiv>
          </MidDiv>
          <ButtonDiv>
            <Button onClick={() => handleLogin()} active={activeState === "sign-in"} className="sign-in-mode">Login</Button>
            <Button onClick={() => handleRegister()} active={activeState === "sign-up"} className="sign-up-mode">Register</Button>
          </ButtonDiv>
        </FormDiv>
      </BkgDiv>
      </>
    );

  }
  
  export default Login;
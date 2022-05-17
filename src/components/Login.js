import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useMounted from "../hooks/useMounted";
import GoogleButton from "react-google-button";
import styled, { keyframes } from 'styled-components';
import { fadeInDown} from 'react-animations'
import Service from '../utils/service'

const service = Service.getInstance();

const fadeInUpAnimation = keyframes`${fadeInDown}`;
const FadeInUpDiv = styled.div`
animation: 3s ${fadeInUpAnimation};
`;

const Login = () => {
  const history = useHistory();
  const { signInWithGoogle, login } = useAuth();
  
  const handleRedirectToOrBack = () => {
    history.replace(location.state?.from ?? "/projects");
  }

  return (
    <GoogleButton style={{ width: 300 }}
      type="light" // can be light or dark
      onClick={() => {
        signInWithGoogle()
          .then( (res) => {
            handleRedirectToOrBack();
            service.writeUserData(res.user.uid, res.user.email, res.user.displayName, res.user.photoURL);
          })
          .catch((e) => console.log(e.message));
      }}
    />
  );
}
export default Login;

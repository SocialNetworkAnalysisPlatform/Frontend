import { chakra, useToast } from "@chakra-ui/react";

import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

import GoogleButton from "react-google-button";

import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import DividerWithText from "../components/DividerWithText";
import { useAuth } from "../contexts/AuthContext";
import useMounted from "../hooks/useMounted";

import styled, { keyframes } from 'styled-components';
import { fadeInDown} from 'react-animations'
const fadeInUpAnimation = keyframes`${fadeInDown}`;
const FadeInUpDiv = styled.div`
animation: 3s ${fadeInUpAnimation};
`;

export default function Loginpage() {
  const history = useHistory();
  const { signInWithGoogle, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const location = useLocation();

  const [next, setNext] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  
 
  // useEffect(() => {
  //   mounted.current = true
  //   return () => {
  //     mounted.current = false
  //   }
  // }, [])

  const mounted = useMounted();

  function handleRedirectToOrBack() {
    // console.log(location?.state)
    history.replace(location.state?.from ?? "/profile");
    // if (location.state) {
    //   history.replace(location.state?.from)
    // } else {
    //   history.replace('/profile')
    // }
  }

  return (
    <>
      <Typography sx={{ fontSize: "30px", fontWeight: 400, color: "#2e2e2e" }}>
        Log in to your account
      </Typography>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!email || !password) {
            toast({
              description: "Credentials not valid.",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
            return;
          }
          // your login logic here
          setIsSubmitting(true);
          login(email, password)
            .then((res) => {
              handleRedirectToOrBack();
            })
            .catch((error) => {
              console.log(error.message);
              toast({
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            })
            .finally(() => {
              // setTimeout(() => {
              //   mounted.current && setIsSubmitting(false)
              //   console.log(mounted.current)
              // }, 1000)
              mounted.current && setIsSubmitting(false);
            });
        }}
      >
        <Stack>
          <GoogleButton style={{ width: 300, marginTop: 20 }}
            type="light" // can be light or dark
            onClick={() => {
              signInWithGoogle()
                .then((user) => {
                  handleRedirectToOrBack();
                  console.log(user);
                })
                .catch((e) => console.log(e.message));
            }}
          />

          <DividerWithText>OR</DividerWithText>

          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <OutlinedInput size="small" sx={{ width: 300 }} name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
          </FormControl>

          <FadeInUpDiv>
            {next && 
              <FormControl id="password" sx={{ mt: 2 }}>
                <FormLabel>Password</FormLabel>
                    <OutlinedInput size="small" sx={{ width: 300 }} name="password" type="password" value={password} required
                      onChange={(e) => setPassword(e.target.value)} />
                  </FormControl>
            }

            {next && 
              <Stack>
                <Typography sx={{ mt: 2, ml: 23, fontFamily: "Roboto", fontSize: 14 }}>
                  <Link style={{ textDecoration: "none", color: "gray" }} to="/forgot-password"> Forgot Password? </Link>
                </Typography>
                <Stack sx={{ mt: 3 }} direction={"row"}>
                  <Button variant="contained" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, width: 100, textTransform: "none" }}
                    type="submit" isLoading={isSubmitting}>Login</Button>
                  <Typography variant="contained" sx={{ width: 300, ml: 2, mt: 1, fontFamily: "Roboto", fontSize: 14 }}>
                    Don't have an account?
                    <Link style={{ textDecoration: "none", color: "#6366f1" }} to="/register">
                      {" "} Sign Up
                    </Link>
                  </Typography>
                </Stack>
              </Stack>
              }
            </FadeInUpDiv>

          {!next && (
            <Button disabled={email ? false : true} onClick={() => { setNext(true) }} variant="contained"
              sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4e50c6" }, width: 120, textTransform: "none", mt: 4,}} >
              Next
            </Button>
          )}
        </Stack>
      </form>
    </>
  );
}

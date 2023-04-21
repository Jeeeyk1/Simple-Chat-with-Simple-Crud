import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
`;

const Title = styled.h1`
  font-size: 4rem;
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  color: #333;
  margin-bottom: 4rem;
`;

const Button = styled.button`
  background-color: #4e0eff;
  color: white;
  padding: 1.5rem 3rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1.5rem;
  text-transform: uppercase;
  &:hover {
    background-color: #3c0ca0;
  }
`;

const HomePage = () => {
  const storedData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
  const userData = JSON.parse(storedData);

  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/chat");
  };
  useEffect(() => {
    console.log(userData);
  }, []);
  return (
    <Container>
      <img
        src="https://streamlinecareers.carrd.co/assets/images/image01.jpg?v=7dbfb183"
        alt="logo"
      />
      <br />
      <h1></h1>
      <Title>Welcome to my Chat App</Title>
      <Subtitle>
        My name is Justin Jake Almariego, Applying for Full Stack Developer and
        this is my Assessment # 4
      </Subtitle>
      <Subtitle>Try my simple Chat Application</Subtitle>
      <Button onClick={handleButtonClick}>Start Chatting</Button>
    </Container>
  );
};

export default HomePage;

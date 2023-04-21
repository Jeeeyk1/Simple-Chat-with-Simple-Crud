import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [currentId, setCurrentId] = useState();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();
  const handleShowForm = () => {
    setIsFormVisible(true);
  };
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleHideForm = () => {
    setIsFormVisible(false);
  };
  const handleValidation = () => {
    const { password, username, email } = values;
    if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    const fetctData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
      setCurrentId(data._id);
    };
    fetctData();
  }, []);
  const updateSubmit = async (event) => {
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.put(
        `http://localhost:5000/api/auth/edit/${currentId}`,
        {
          username,
          email,
          password,
        }
      );

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        alert("Profile Updated Successfully");
        navigate("/chat");
        setCurrentUserName(data.users.username);
        setIsFormVisible(false);
      }
    }
  };
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:5000/api/auth/delete/${currentId}`
        );

        alert("Your account successfully deleted!");
        localStorage.clear();
        navigate("/");
      } catch (error) {
        console.log(error);
        alert("An error occurred while deleting the user.");
      }
    }
  };
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <img
              src="https://streamlinecareers.carrd.co/assets/images/image01.jpg?v=7dbfb183"
              alt="logo"
            />
            <h3>Streamline- Contact List</h3>
            <br />
          </div>

          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h3 style={{ fontSize: "25px" }}>{currentUserName}</h3>
            </div>
            <button onClick={handleShowForm} style={{ fontSize: "12px" }}>
              Edit Profile
            </button>
            {isFormVisible && (
              <div className="form-overlay">
                <div className="form-container">
                  <button onClick={handleHideForm}>Close Form</button>
                  <form>
                    {" "}
                    <input
                      type="text"
                      placeholder="Username"
                      name="username"
                      onChange={(e) => handleChange(e)}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      onChange={(e) => handleChange(e)}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={(e) => handleChange(e)}
                    />
                    <button type="submit" onClick={updateSubmit}>
                      Update Profile
                    </button>
                  </form>
                  <button
                    type="submit"
                    style={{ backgroundColor: "red" }}
                    onClick={deleteHandler}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #f5f5f5;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: #4a4a4a;
      text-transform: uppercase;
      font-weight: bold;
      font-size: 1.2rem;
      margin: 0;
    }
  }
  .form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .form-container {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    z-index: 11;
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #8f8f8f;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #fff;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.4rem;
      padding: 1rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.3s ease-in-out;
      box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
      .avatar {
        img {
          height: 4rem;
          border-radius: 50%;
        }
      }
      .username {
        h2 {
          color: #4a4a4a;
          margin: 0;
          font-weight: bold;
          font-size: 1.2rem;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
      color: #fff;
      box-shadow: none;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: white;
    border-radius: 2rem;
    padding: 3rem 5rem;
    box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
  }

  input {
    background-color: #d9e8fa;
    padding: 1rem;
    border: 0.1rem solid #bbbbbb;
    border-radius: 0.4rem;
    color: #444444;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.3rem solid #1d84ff;
      outline: none;
    }
  }

  button {
    background-color: #1d84ff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: black;
    }
  }

  span {
    color: black;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
  .current-user {
    background-color: #6d5dfc;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 1rem;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
    .avatar {
      img {
        height: 6rem;
        border-radius: 50%;
      }
    }
    .username {
      h2 {
        color: #fff;
        font-weight: bold;
        font-size: 2rem;
        margin: 0;
      }
    }
    @media screen and (max-width: 768px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1.5rem;
        }
      }
    }
  }
`;

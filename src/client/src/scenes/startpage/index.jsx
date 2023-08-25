import React from "react";
import { Link } from "react-router-dom";

const StartPage = () => {
  return (
    <div
      style={{
        background: `url(${"../assets/background.jpg"})`,
        backgroundSize: "cover", // Phủ kín khung màn hình mà không bị nhân
    backgroundPosition: "center", // Hiển thị hình ảnh ở trung tâm
    width: "100%",
    height: "100vh", // Chiều cao bằng chiều cao của màn hình
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
      }}
    >
      <img src={"../assets/logo.png"} alt="Logo" style={{ width: "250px", marginBottom: "1rem" }} />

      <div style={{ textAlign: "center" }}>
      <Link to="/login" style={{ textDecoration: "none" }}>
      <button
      style={{
        backgroundColor: "white",
        color: "black",
        border: "none",
        borderRadius: "10px",
        padding: "15px 30px",
        cursor: "pointer",
        fontSize: "1.5rem", // Tùy chỉnh kích thước chữ
        transition: "background-color 0.3s",
      }}
    >
      Switch to Login!
    </button>
  </Link>
      </div>
    </div>
  );
};

export default StartPage;

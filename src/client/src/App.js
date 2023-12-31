import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import WalletPage from "scenes/wallet";
import DepositPage from "scenes/deposit";
import WithdrawPage from "scenes/withdraw";
import StartPage from "scenes/startpage";
import AdminDepositRequestsPage from "scenes/admin";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route
              path="/login"
              element={<LoginPage />}
            />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route
              path="/wallet/:userId"
              element={isAuth ? <WalletPage /> : <Navigate to="/" />}
            />
            <Route
              path="/deposit"
              element={isAuth ? <DepositPage /> : <Navigate to="/" />}
            />
            <Route
              path="/withdraw"
              element={isAuth ? <WithdrawPage /> : <Navigate to="/" />}
            />
            <Route
              path="/admin"
              element={isAuth ? <AdminDepositRequestsPage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

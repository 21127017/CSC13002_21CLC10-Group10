import { BrowserRouter} from "react-router-dom";
import React from 'react';
import { CssBaseline, ThemeProvider } from "@mui/material";

function App() {

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={null}>
          <CssBaseline />
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

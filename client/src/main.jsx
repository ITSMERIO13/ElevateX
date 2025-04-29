import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
 
import { ThemeProvider } from "@material-tailwind/react";
import { AuthContext } from './context/authContext.jsx';
import OtherState from './context/OtherState.jsx';
// import { OtherContext } from './context/OtherContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <ThemeProvider>
   <AuthContext>
   <OtherState>
      <App />
   </OtherState>
   </AuthContext>
    </ThemeProvider>
  </StrictMode>,
)

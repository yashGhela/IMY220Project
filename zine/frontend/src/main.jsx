import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


import {BrowserRouter, Routes, Route} from "react-router-dom"


import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/700.css";


createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
   <App/>
  </BrowserRouter>
)

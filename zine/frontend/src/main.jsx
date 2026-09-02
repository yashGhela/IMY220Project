import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Splash } from './pages/Splash.jsx'
import { Home } from './pages/Home.jsx'
import { Post } from './components/Post.jsx'
import { Profile } from './components/Profile.jsx'
import { Auth } from './pages/Auth.jsx'
import { Album } from './pages/Album.jsx'

import {BrowserRouter, Routes, Route} from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Splash/>}/>
  </Routes>
  </BrowserRouter>
)

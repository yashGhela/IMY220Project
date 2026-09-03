import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Splash } from './pages/Splash.jsx'
import { Home } from './pages/Home.jsx'
import { PostPage } from './pages/PostPage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'
import { Auth } from './pages/Auth.jsx'
import { Album } from './pages/Album.jsx'

import {BrowserRouter, Routes, Route} from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Splash/>}/>
    <Route path='/home' element={<Home/>}/>
    <Route path='/profile/:id' element={<ProfilePage/>}/>
    <Route path="/post/:id"  element={<PostPage/>}/>
    <Route path='/auth' element={<Auth/>}/>
    <Route path='/album' element={<Album/>}/>
  </Routes>
  </BrowserRouter>
)

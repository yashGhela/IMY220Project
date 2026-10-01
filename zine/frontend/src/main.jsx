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
import { CreatePostPage } from './pages/CreatePostPage.jsx'
import { CreateAlbumPage } from './pages/CreateAlbumPage.jsx'

import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/700.css";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Splash/>}/>
    <Route path='/home' element={<Home/>}/>
    <Route path='/profile/:id' element={<ProfilePage/>}/>
    <Route path='/profile' element={<ProfilePage/>}/>
    <Route path="/post/:id"  element={<PostPage/>}/>
    <Route path='/auth' element={<Auth/>}/>
    <Route path='/album' element={<Album/>}/>
    <Route path='/createpost' element={<CreatePostPage/>}/>
    <Route path='/createalbum' element={<CreateAlbumPage/>}/>
  </Routes>
  </BrowserRouter>
)

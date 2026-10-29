import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { Route, Routes } from 'react-router-dom'

import { Splash } from './pages/Splash.jsx'
import { Home } from './pages/Home.jsx'
import { PostPage } from './pages/PostPage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'
import { Auth } from './pages/Auth.jsx'
import { Album } from './pages/Album.jsx'
import { CreatePostPage } from './pages/CreatePostPage.jsx'
import { CreateAlbumPage } from './pages/CreateAlbumPage.jsx'

import {Admin} from './pages/Admin.jsx'
import { useAuthGuard } from './utils/authGuard.js'
import { NotFound } from './pages/NotFound.jsx'


function App() {
  
  const allowed = useAuthGuard();

  if (!allowed) return null; // nothing flashes while the redirect happens


  return (
    <div>
      <Routes>
    <Route path="/" element={<Splash/>}/>
    <Route path='/home' element={<Home/>}/>
    <Route path='/profile/:id' element={<ProfilePage/>}/>
    <Route path='/profile' element={<ProfilePage/>}/>
    <Route path="/post/:id"  element={<PostPage/>}/>
    <Route path='/auth' element={<Auth/>}/>
    <Route path='/album/:id' element={<Album/>}/>
    <Route path='/createpost' element={<CreatePostPage/>}/>
    <Route path='/createalbum' element={<CreateAlbumPage/>}/>
    <Route path='/admin' element={<Admin/>}/>
    <Route path='/*' element={<NotFound/>}/>
  </Routes>
    </div>
  )
}

export default App

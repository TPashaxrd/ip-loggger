import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './Pages/Auth.tsx'
import WatchLogger from './Pages/WatchLogger.tsx'
import NoPage from './Pages/NoPage.tsx'
import Request from './Pages/Request.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
   <Routes>
    <Route path='/' element={<App/>}/>
    <Route path="/auth" element={<Auth/>}/>
    <Route path="/login" element={<Auth/>}/>
    <Route path='/register' element={<Auth/>}/>

    <Route path='/watch/:id' element={<WatchLogger/>}/>
    <Route path='/x/:loggerId' element={<Request/>}/>

    <Route path='*' element={<NoPage/>}/>
   </Routes>
  </BrowserRouter>
)
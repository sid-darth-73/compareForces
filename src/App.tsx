import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {EntryPage}  from './pages/EntryPage'
function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<EntryPage/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

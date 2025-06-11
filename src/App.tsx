import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {EntryPage}  from './pages/EntryPage'
import { MultipleUser } from './pages/multipleUser'
import { SingleUser } from './pages/singleUser'
import { ErrorPage } from './pages/ErrorPage'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<EntryPage/>}/>
      <Route path="/singleUser" element={<SingleUser/>}/>
      <Route path="/multipleUser" element={<MultipleUser/>}/>
      <Route path="/error" element={<ErrorPage/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

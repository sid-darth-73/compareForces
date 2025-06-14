import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {EntryPage}  from './pages/EntryPage'
import { MultipleUser } from './pages/MultipleUser'
import { SingleUser } from './pages/SingleUser'
import { ErrorPage } from './pages/ErrorPage'
import { ProblemDistributionSingle } from './pages/ProblemDistributionSingle'
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<EntryPage/>}/>
      <Route path="/singleUser" element={<SingleUser/>}/>
      <Route path="/multipleUser" element={<MultipleUser/>}/>
      <Route path="/problemdistributionsingle" element={<ProblemDistributionSingle/>}/>
      <Route path="/error" element={<ErrorPage/>}/>

    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

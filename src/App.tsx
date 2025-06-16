import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {EntryPage}  from './pages/EntryPage'
import { MultipleUser } from './pages/MultipleUser'
import { SingleUser } from './pages/SingleUser'
import { ErrorPage } from './pages/ErrorPage'
import { ProblemDistributionSingle } from './pages/ProblemDistributionSingle'
import { ProblemDistributionMultiple } from './pages/ProblemDistributionMultiple'
import { RatingDistributionSingle } from './pages/RatingDistributionSingle'
import { RatingDistributionMultiple } from './pages/RatingDistributionMultiple'
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<EntryPage/>}/>
      <Route path="/singleUser" element={<SingleUser/>}/>
      <Route path="/multipleUser" element={<MultipleUser/>}/>
      <Route path="/problemdistributionsingle" element={<ProblemDistributionSingle/>}/>
      <Route path="/problemdistributionmultiple" element={<ProblemDistributionMultiple/>}/>
      <Route path="/ratingdistributionsingle" element={<RatingDistributionSingle/>}/>
      <Route path="/ratingdistributionmultiple" element={<RatingDistributionMultiple/>}/>
      <Route path="/error" element={<ErrorPage/>}/>

    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

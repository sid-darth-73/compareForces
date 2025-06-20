import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {EntryPage}  from './pages/EntryPage.tsx'
import { MultipleUser } from './pages/MultipleUser.tsx'
import { SingleUser } from './pages/SingleUser.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'
import { ProblemDistributionSingle } from './pages/ProblemDistributionSingle.tsx'
import { ProblemDistributionMultiple } from './pages/ProblemDistributionMultiple.tsx'
import { RatingDistributionSingle } from './pages/RatingDistributionSingle.tsx'
import { RatingDistributionMultiple } from './pages/RatingDistributionMultiple.tsx'
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

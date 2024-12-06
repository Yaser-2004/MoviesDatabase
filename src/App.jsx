import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ScrollToTop from './components/ScrollToTop';
import { Suspense, lazy } from 'react';
import Loader from './components/Loader';

const MovieInfo = lazy(() => import("./pages/MovieInfo"))
const List = lazy(() => import("./pages/List"))
const Home = lazy(() => import("./pages/Home"))

function App() {

  return (
    <>
      <div className='bg-gray-800 max-w-7xl mr-auto ml-auto'>
        <Router>
          <Suspense fallback={<Loader />}>
            <ScrollToTop />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/page/:pageNum' element={<Home />} />
              <Route path='/:title' element={<List />} />
              <Route path='/movie/:id' element={<MovieInfo />} />
              <Route path='/tv/:tid' element={<MovieInfo />} />
              <Route path='/movie/:genre/:id' element={<List />} />
              <Route path='/movie/:genre/:id/page/:pageNum' element={<List />} />
              <Route path='/movie/language/:lan' element={<List />} />
              <Route path='/movie/language/:lan/page/:pageNum' element={<List />} />
              <Route path='/tv/:genre/:tid' element={<List />} />
              <Route path='/tv/:genre/:tid/page/:pageNum' element={<List />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </>
  )
}

export default App

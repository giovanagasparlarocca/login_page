import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './routes/Login'
import Register from './routes/Register'
import Dashboard from './routes/Dashboard'
import Error from './routes/Error'

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='*' element={<Error/>}></Route>
      </Routes>
      
    </Router>
  )
}

export default App

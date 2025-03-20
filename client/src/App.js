import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './views/Login/estilo';
import Registro from './views/Registro/estilo';
import Dashboard from './views/Dashboard/estilo';
import Gerenciar from './views/GerenciarPessoas/estilo';



function App() {
  return (
    <BrowserRouter>
      <Routes>      
        <Route path='/' element={<Login />} />
        <Route path='/Registro' element={<Registro />} />        
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/Gerenciar' element={<Gerenciar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
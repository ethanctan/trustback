import './App.css'
import Navbar from "./components/navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Integrate from "./pages/integrate";

function App() {

  return (
    <>
      <Navbar/>
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/integrate" element={<Integrate/>} />
        </Routes>
      </div>
    </>
  )
}

export default App

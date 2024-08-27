import {BrowserRouter, Route,Routes } from "react-router-dom"
import { Game } from "./pages/Game"
import { HomePage } from "./pages/HomePage"
import { Rules } from "./pages/Rules"
function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/game" element={<Game/>}/>
          <Route path="/rules" element={<Rules/>}/>
        </Routes>
    </BrowserRouter>      
    </>
  )
}
export default App
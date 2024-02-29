import { Route, Routes } from "react-router-dom"
import Home from "./views/Home"
import NotFound from "./views/NotFound"

function App() {
 

  return (
    <>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App

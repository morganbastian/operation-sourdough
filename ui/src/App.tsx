import { Route, Routes } from "react-router-dom"
import Home from "./views/Home"
import NotFound from "./views/NotFound"
import CheckoutPage from "./views/Checkout/CheckoutPage"

function App() {
 

  return (
    <>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path="*" element={<NotFound/>}/>
        <Route path="/checkout" element={<CheckoutPage/>}/>
      </Routes>
    </>
  )
}

export default App

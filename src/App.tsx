import { Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import LoginPage from "./components/LoginPage"
import NavBar from "./components/Navbar"
import ProductPage from "./components/ProductPage"
import RegisterPage from "./components/RegisterPage"
import UserProfile from "./components/UserProfile"

function App() {
  console.log();
  return (
    // By using the appType: 'spa' fix in Vite or the _redirects file in Cloudflare, you are telling the server: 
    // "If you get asked for /login, just send them index.html. React Router is already waiting inside that file and 
    // it will know to show the Login page based on the URL."
    <>

      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product/:idAndSlug" element={<ProductPage />} />
        <Route path="/user-profile" element={<UserProfile />} />
        {/* <Route path="/cart" element={<CartPage />} /> */}
      </Routes>

    </>
  )
}

export default App

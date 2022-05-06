import WebFont from 'webfontloader'
import Footer from './components/Layouts/Footer/Footer'
import Header from './components/Layouts/Header/Header'
import Login from './components/User/Login'
import Loginv1 from './components/User/Login_v1'
import Register from './components/User/Register'
import Registerv1 from './components/User/Register_v1'
import User from './components/User_myshop/User_myshop'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { loadUser } from './actions/userAction'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import UpdateProfile from './components/User/UpdateProfile'
import UpdatePassword from './components/User/UpdatePassword'
import ForgotPassword from './components/User/ForgotPassword'
import ResetPassword from './components/User/ResetPassword'
import Account from './components/User/Account'
import ProtectedRoute from './Routes/ProtectedRoute'
import Home from './components/Home/Home'
import ProductDetails from './components/ProductDetails/ProductDetails'
import Products from './components/Products/Products'
import Cart from './components/Cart/Cart'
import Shipping from './components/Cart/Shipping'
import OrderConfirm from './components/Cart/OrderConfirm'
import Payment from './components/Cart/Payment'
import OrderStatus from './components/Cart/OrderStatus'
import OrderSuccess from './components/Cart/OrderSuccess'
import MyOrders from './components/Order/MyOrders'
import OrderDetails from './components/Order/OrderDetails'
import Dashboard from './components/Admin/Dashboard'
import MainData from './components/Admin/MainData'
import OrderTable from './components/Admin/OrderTable'
import UpdateOrder from './components/Admin/UpdateOrder'
import ProductTable from './components/Admin/ProductTable'
import NewProduct from './components/Admin/NewProduct'
import UpdateProduct from './components/Admin/UpdateProduct'
import UserTable from './components/Admin/UserTable'
import UpdateUser from './components/Admin/UpdateUser'
import ReviewsTable from './components/Admin/ReviewsTable'
import Wishlist from './components/Wishlist/Wishlist'
import NotFound from './components/NotFound'
//

import ScrollToTop from './components/Home/Dashboard/ScrollToTop'
import { BaseOptionChartStyle } from './components/Home/Dashboard/chart/BaseOptionChart'
// theme
import ThemeProvider from './theme'
//layouts
import DashboardLayout from './components/Layouts/dashboard'
import LogoOnlyLayout from './components/Layouts/LogoOnlyLayout'
function App() {
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  // api axios 구현 추가함/--------------------------------------------
  // const [stripeApiKey, setStripeApiKey] = useState("");

  // async function getStripeApiKey() {
  //   const { data } = await axios.get('/api/v1/stripeapikey');
  //   setStripeApiKey(data.stripeApiKey);
  // }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto:300,400,500,600,700'],
      },
    })
  })

  useEffect(() => {
    dispatch(loadUser())
    // getStripeApiKey();
  }, [dispatch])

  // always scroll to top on route/path change
  //   useEffect(() => {
  //     window.scrollTo({
  //       top: 0,
  //       left: 0,
  //       behavior: 'smooth',
  //     })
  //   }, [pathname])

  // disable right click
  window.addEventListener('contextmenu', (e) => e.preventDefault())
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 123) e.preventDefault()
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) e.preventDefault()
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) e.preventDefault()
  })

  return (
    <>
      <ThemeProvider>
        <ScrollToTop />
        <BaseOptionChartStyle />
        {/* <Header /> */}
        <DashboardLayout />
        <LogoOnlyLayout />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" Navigate to={'/dashboard/app'} />
          <Route path="/user" element={<User />} />
          <Route path="/login" element={<Loginv1 />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/register" element={<Registerv1 />} />
          {/* <Route path="/register" element={<Register />} /> */}

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />

          <Route path="/cart" element={<Cart />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard activeTab={0}>
                  <MainData />
                </Dashboard>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard activeTab={1}>
                  <OrderTable />
                </Dashboard>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/admin/order/:id"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard activeTab={1}>
                  <UpdateOrder />
                </Dashboard>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard activeTab={2}>
                  <ProductTable />
                </Dashboard>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/admin/new_product"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard activeTab={3}>
                  <NewProduct />
                </Dashboard>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/admin/product/:id"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard activeTab={2}>
                  <UpdateProduct />
                </Dashboard>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard activeTab={4}>
                  <UserTable />
                </Dashboard>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/admin/user/:id"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard activeTab={4}>
                  <UpdateUser />
                </Dashboard>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard activeTab={5}>
                  <ReviewsTable />
                </Dashboard>
              </ProtectedRoute>
            }
          ></Route>
          {/* <Route path="*" element={<NotFound />}></Route> */}
          <Route path="/dashboard/app" element={<Home />} />
          <Route path="/dashboard/user" element={<User />} />
          <Route path="/dashboard/product/:id" element={<ProductDetails />} />
          <Route path="/dashboard/products" element={<Products />} />
          <Route path="/dashboard/products/:keyword" element={<Products />} />

          <Route path="/dashboard/cart" element={<Cart />} />
        </Routes>
      </ThemeProvider>
      <Footer />
    </>
  )
}

export default App

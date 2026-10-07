import {
    BrowserRouter,
    Route,
    Routes,
    To,
    useLocation,
    useNavigate,
} from 'react-router-dom'
import '../../index.scss'
import styles from './app.module.scss'

import AdminCustomers from '@components/admin/admin-customers'
import AdminFilterCustomers from '@components/admin/admin-customers-filter'
import AdminEditProduct from '@components/admin/admin-edit-product'
import AdminNewProduct from '@components/admin/admin-new-product'
import AdminOrderDetail from '@components/admin/admin-order-detail'
import AdminOrders from '@components/admin/admin-orders'
import AdminFilterOrders from '@components/admin/admin-orders-filter'
import AdminProducts from '@components/admin/admin-products'
import Basket from '@components/basket'
import CardDetails from '@components/card-details'
import Header from '@components/header'
import Modal from '@components/modal'
import Order, {
    OrderAddress,
    OrderContacts,
    OrderSuccess,
} from '@components/order'
import ProfileOrders from '@components/profile/profile-orders'
import ProtectedRoute from '@components/protected-route/protected-route'
import { AppRoute } from '@constants'
import AdminPage from '@pages/admin'
import LoginPage from '@pages/login'
import LogoutPage from '@pages/logout'
import MainPage from '@pages/main'
import ProfilePage from '@pages/profile'
import RegisterPage from '@pages/register/register-page'
import { userActions } from '@slices/user'
import { useActionCreators } from '@store/hooks'
import store, { persistor } from '@store/store'
import { PropsWithChildren, useEffect } from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PersistGate } from 'redux-persist/integration/react'
import AdminCustomerDetail from '../admin/admin-customer-detail'
import ProfileOrderDetail from '../profile/profile-order-detail'

const App = () => (
    <BrowserRouter>
        <ProviderComponent>
            <div className={styles.app}>
                <RouteComponent />
            </div>
        </ProviderComponent>
    </BrowserRouter>
)

export default App

const RouteComponent = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { authCheck, checkUserAuth } = useActionCreators(userActions)
    const handleModalClose = (path: To | number) => () => navigate(path as To)

    useEffect(() => {
        checkUserAuth()
            .unwrap()
            .finally(() => authCheck())
    }, [checkUserAuth, authCheck])

    const locationState = location.state as { background?: Location }
    const background = locationState && locationState.background

    return (
        <>
            <Header />
            <Routes location={background || location}>
                <Route path={AppRoute.Main} element={<MainPage />} />
                <Route
                    path={AppRoute.Login}
                    element={
                        <ProtectedRoute onlyUnAuth>
                            <LoginPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoute.Register}
                    element={
                        <ProtectedRoute onlyUnAuth>
                            <RegisterPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoute.Logout}
                    element={
                        <ProtectedRoute>
                            <LogoutPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={AppRoute.Admin}
                    element={
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminProducts />} />
                    <Route path='add' element={<AdminNewProduct />} />
                    <Route
                        path='edit/:editId'
                        element={<AdminEditProduct />}
                    />
                    <Route path='orders' element={<AdminOrders />} />
                    <Route path='customers' element={<AdminCustomers />} />
                </Route>
                <Route
                    path={AppRoute.Profile}
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                >
                    <Route path='orders' element={<ProfileOrders />} />
                </Route>
                <Route path={AppRoute.Basket} element={<Basket />} />
                <Route
                    path={AppRoute.Order}
                    element={
                        <ProtectedRoute>
                            <Order />
                        </ProtectedRoute>
                    }
                >
                    <Route path='address' element={<OrderAddress />} />
                    <Route path='contacts' element={<OrderContacts />} />
                    <Route path='success' element={<OrderSuccess />} />
                </Route>
                <Route path={AppRoute.Product} element={<CardDetails />} />
            </Routes>
            {background && (
                <Routes>
                    <Route
                        path={AppRoute.Logout}
                        element={
                            <ProtectedRoute>
                                <Modal onClose={handleModalClose(-1)}>
                                    <LogoutPage />
                                </Modal>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoute.Login}
                        element={
                            <ProtectedRoute>
                                <Modal onClose={handleModalClose(-1)}>
                                    <LoginPage />
                                </Modal>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoute.Register}
                        element={
                            <ProtectedRoute>
                                <Modal onClose={handleModalClose(-1)}>
                                    <RegisterPage />
                                </Modal>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={AppRoute.Product}
                        element={
                            <Modal onClose={handleModalClose(-1)}>
                                <CardDetails />
                            </Modal>
                        }
                    />
                    <Route
                        path={AppRoute.Basket}
                        element={
                            <Modal onClose={handleModalClose(-1)}>
                                <Basket />
                            </Modal>
                        }
                    />
                    <Route
                        path={AppRoute.Order}
                        element={
                            <ProtectedRoute>
                                <Order />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            path='address'
                            element={
                                <Modal
                                    title='Способ оплаты'
                                    onClose={handleModalClose({
                                        pathname: AppRoute.Main,
                                    })}
                                >
                                    <OrderAddress />
                                </Modal>
                            }
                        />
                        <Route
                            path='contacts'
                            element={
                                <Modal
                                    onClose={handleModalClose({
                                        pathname: AppRoute.Main,
                                    })}
                                >
                                    <OrderContacts />
                                </Modal>
                            }
                        />
                        <Route
                            path='success'
                            element={
                                <Modal
                                    onClose={handleModalClose({
                                        pathname: AppRoute.Main,
                                    })}
                                >
                                    <OrderSuccess />
                                </Modal>
                            }
                        />
                    </Route>
                    <Route path={AppRoute.Admin} element={<AdminPage />}>
                        <Route
                            path='add'
                            element={
                                <Modal
                                    onClose={handleModalClose({
                                        pathname: AppRoute.Admin,
                                    })}
                                >
                                    <AdminNewProduct />
                                </Modal>
                            }
                        />
                        <Route
                            path='orders/filter'
                            element={
                                <Modal onClose={handleModalClose(-1)}>
                                    <AdminFilterOrders />
                                </Modal>
                            }
                        />
                        <Route
                            path='customers/filter'
                            element={
                                <Modal onClose={handleModalClose(-1)}>
                                    <AdminFilterCustomers />
                                </Modal>
                            }
                        />
                        <Route
                            path='order/:number'
                            element={
                                <Modal onClose={handleModalClose(-1)}>
                                    <AdminOrderDetail />
                                </Modal>
                            }
                        />
                        <Route
                            path='customer/:customerId'
                            element={
                                <Modal onClose={handleModalClose(-1)}>
                                    <AdminCustomerDetail />
                                </Modal>
                            }
                        />
                        <Route
                            path='edit/:editId'
                            element={
                                <Modal
                                    onClose={handleModalClose({
                                        pathname: AppRoute.Admin,
                                    })}
                                >
                                    <AdminEditProduct />
                                </Modal>
                            }
                        />
                    </Route>
                    <Route path={AppRoute.Profile} element={<ProfilePage />}>
                        <Route
                            path='order/:number'
                            element={
                                <Modal onClose={handleModalClose(-1)}>
                                    <ProfileOrderDetail />
                                </Modal>
                            }
                        />
                    </Route>
                </Routes>
            )}
        </>
    )
}

const ProviderComponent = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
        <PersistGate persistor={persistor}>{children}</PersistGate>
        <ToastContainer
            position='top-right'
            autoClose={5e3}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            pauseOnHover
            theme='colored'
        />
    </Provider>
)

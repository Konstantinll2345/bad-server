import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useActionCreators, useSelector } from '../../services/hooks'
import { basketActions, basketSelector } from '../../services/slice/basket'
import { orderFormActions } from '../../services/slice/orderForm'
import { addSpacesToNumber } from '../../utils/product-utils'
import { IProduct } from '../../utils/types'
import BasketItem from '../basket-item/basket-item'
import Button from '../button/button'
import styles from './basket.module.scss'

export default function Basket() {
    const location = useLocation()
    const navigate = useNavigate()
    const { setItems } = useActionCreators(orderFormActions)
    const { removeProductCart } = useActionCreators(basketActions)

    const { selectBasketItems } = basketSelector
    const items = useSelector(selectBasketItems)
    const itemsIds = useMemo(() => items.map((item) => item._id), [items])

    const handleDeleteProduct = (id: string) => {
        removeProductCart(id)
    }

    const amount = useMemo(
        () => items.reduce((s: number, v: IProduct) => s + v.price!, 0),
        [items]
    )

    const handleCheckout = () => {
        setItems({ items: itemsIds, total: amount })
        navigate('/order/address', {
            state: {
                background: { ...location, pathname: '/', state: null },
            },
            replace: true,
        })
    }

    if (items.length === 0) {
        return <h2 className={styles.basket__title}>Корзина пуста</h2>
    }

    return (
        <div className={styles.basket}>
            <h2 className={styles.basket__title}>Корзина</h2>
            <ul className={styles.basket__list}>
                {items.map((product, index) => (
                    <BasketItem
                        deleteProductInBasket={handleDeleteProduct}
                        key={product._id}
                        dataProduct={product}
                        index={index + 1}
                        component='li'
                    />
                ))}
            </ul>
            <div className={styles.modal__actions}>
                <Button extraClass={styles.button} onClick={handleCheckout}>
                    Оформить
                </Button>
                <span className={styles.basket__amount}>
                    {addSpacesToNumber(amount)} синапсов
                </span>
            </div>
        </div>
    )
}
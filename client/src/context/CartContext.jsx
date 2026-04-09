import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('sanyukt_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error parsing cart from localStorage', error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('sanyukt_cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart to localStorage', error);
        }
    }, [cartItems]);

    // Returns true if product was added, false if it already exists in the cart
    const addToCart = (product, quantity = 1) => {
        const safeProduct = {
            ...product,
            price: Number(product.price) || 0
        };
        const existing = cartItems.find(item => item._id === product._id);
        if (existing) {
            // Duplicate - not allowed, caller should show a message
            return false;
        }
        setCartItems(prev => [...prev, { ...safeProduct, cartQuantity: quantity }]);
        return true;
    };

    const isInCart = (productId) => cartItems.some(item => item._id === productId);

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) return;
        setCartItems(prev => prev.map(item =>
            item._id === productId ? { ...item, cartQuantity: quantity } : item
        ));
    };

    const clearCart = () => setCartItems([]);

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.cartQuantity) || 1;
            return total + (price * quantity);
        }, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, isInCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

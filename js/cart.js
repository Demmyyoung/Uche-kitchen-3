document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updateCartCounter = () => {
        const cartCounter = document.querySelector('.cart-counter');
        if (cartCounter) {
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCounter.textContent = count;
            if (count === 0) {
                cartCounter.style.display = 'none';
            } else {
                cartCounter.style.display = 'inline-block';
            }
        }
    };

    const showNotification = (message) => {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    };

    const addToCart = (product) => {
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        showNotification('Product added to cart!');
    };

    document.querySelectorAll('.add-to-cart, .buy-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // prevent navigation for <a class="buy-button">
            const productElement = button.closest('[data-product-id]');
            if (productElement) {
                const product = {
                    id: productElement.dataset.productId,
                    name: productElement.dataset.productName,
                    price: parseFloat(productElement.dataset.productPrice),
                    image: productElement.dataset.productImage,
                };
                addToCart(product);
            }
        });
    });

    const renderCartPage = () => {
        const cartItemsContainer = document.querySelector('.cart-items');
        const totalPriceElement = document.getElementById('total-price');

        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₦${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">Quantity: ${item.quantity}</div>
                    </div>
                    <button class="remove-item-btn" data-index="${index}">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItem);
                totalPrice += item.price * item.quantity;
            });
        }

        if (totalPriceElement) {
            totalPriceElement.textContent = totalPrice.toFixed(2);
        }

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartPage();
                updateCartCounter();
                showNotification('Item removed from cart!');
            });
        });
    };

    const clearCart = () => {
        cart.length = 0;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartPage();
        updateCartCounter();
        showNotification('Cart cleared!');
    };

    const clearCartButton = document.querySelector('.clear-cart-btn');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }

    

    updateCartCounter();
    renderCartPage();
});
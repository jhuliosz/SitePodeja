

        // Cart functionality
        let cart = [];
        
        // DOM Elements
        const cartButton = document.getElementById('cart-button');
        const cartModal = document.getElementById('cart-modal');
        const closeCart = document.getElementById('close-cart');
        const cartItems = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartCount = document.getElementById('cart-count');
        const cartBadge = document.getElementById('cart-badge');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');
        const checkoutModal = document.getElementById('checkout-modal');
        const closeCheckout = document.getElementById('close-checkout');
        const checkoutForm = document.getElementById('checkout-form');
        const checkoutSummary = document.getElementById('checkout-summary');
        const checkoutTotal = document.getElementById('checkout-total');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        // Open cart modal
        cartButton.addEventListener('click', () => {
            updateCartDisplay();
            cartModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
        
        // Close cart modal
        closeCart.addEventListener('click', () => {
            cartModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
        
        // Open checkout modal
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            
            cartModal.classList.add('hidden');
            checkoutModal.classList.remove('hidden');
            updateCheckoutSummary();
        });
        
        // Close checkout modal
        closeCheckout.addEventListener('click', () => {
            checkoutModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
        
        // Add to cart functionality
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productCard = button.closest('.product-card');
                const productName = button.getAttribute('data-product');
                const productPrice = parseFloat(button.getAttribute('data-price'));
                const flavorSelector = productCard.querySelector('.flavor-selector');
                const selectedFlavor = flavorSelector.value;
                
                if (!selectedFlavor) {
                    alert('Por favor, selecione um sabor/opção antes de adicionar ao carrinho.');
                    return;
                }
                
                // Add to cart
                cart.push({
                    name: productName,
                    flavor: selectedFlavor,
                    price: productPrice,
                    quantity: 1
                });
                
                // Update UI
                updateCartCount();
                showAddToCartFeedback(button);
                
                // Reset flavor selection
                flavorSelector.selectedIndex = 0;
            });
        });
        
        // Show feedback when adding to cart
        function showAddToCartFeedback(button) {
            const originalText = button.textContent;
            button.textContent = 'Adicionado!';
            button.classList.remove('bg-amber-600', 'hover:bg-amber-700');
            button.classList.add('bg-green-600', 'hover:bg-green-700');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('bg-green-600', 'hover:bg-green-700');
                button.classList.add('bg-amber-600', 'hover:bg-amber-700');
            }, 1500);
        }
        
        // Update cart count display
        function updateCartCount() {
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = count;
            cartBadge.textContent = count;
            
            if (count > 0) {
                cartCount.classList.remove('hidden');
                cartBadge.classList.remove('hidden');
            } else {
                cartCount.classList.add('hidden');
                cartBadge.classList.add('hidden');
            }
        }
        
        // Update cart display
        function updateCartDisplay() {
            if (cart.length === 0) {
                emptyCartMessage.classList.remove('hidden');
                cartItems.innerHTML = '';
                cartSubtotal.textContent = 'R$ 0,00';
                cartTotal.textContent = 'R$ 0,00';
                return;
            }
            
            emptyCartMessage.classList.add('hidden');
            
            let itemsHTML = '';
            let subtotal = 0;
            
            cart.forEach((item, index) => {
                subtotal += item.price * item.quantity;
                
                itemsHTML += `
                    <div class="flex justify-between items-center py-4 border-b border-gray-200">
                        <div>
                            <h4 class="font-medium">${item.name} - ${item.flavor}</h4>
                            <div class="flex items-center mt-1">
                                <button class="quantity-btn text-gray-500 hover:text-amber-600" data-index="${index}" data-action="decrease">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="quantity-btn text-gray-500 hover:text-amber-600" data-index="${index}" data-action="increase">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="block font-medium">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                            <button class="remove-btn text-red-500 hover:text-red-700 text-sm mt-1" data-index="${index}">
                                <i class="fas fa-trash"></i> Remover
                            </button>
                        </div>
                    </div>
                `;
            });
            
            cartItems.innerHTML = itemsHTML;
            cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            cartTotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            
            // Add event listeners to quantity buttons
            document.querySelectorAll('.quantity-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = parseInt(button.getAttribute('data-index'));
                    const action = button.getAttribute('data-action');
                    
                    if (action === 'increase') {
                        cart[index].quantity += 1;
                    } else if (action === 'decrease') {
                        if (cart[index].quantity > 1) {
                            cart[index].quantity -= 1;
                        } else {
                            cart.splice(index, 1);
                        }
                    }
                    
                    updateCartDisplay();
                    updateCartCount();
                });
            });
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = parseInt(button.getAttribute('data-index'));
                    cart.splice(index, 1);
                    
                    updateCartDisplay();
                    updateCartCount();
                });
            });
        }
        
        // Update checkout summary
        function updateCheckoutSummary() {
            let summaryHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                total += item.price * item.quantity;
                
                summaryHTML += `
                    <div class="flex justify-between py-2 border-b border-gray-200">
                        <span>${item.quantity}x ${item.name} - ${item.flavor}</span>
                        <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                `;
            });
            
            checkoutSummary.innerHTML = summaryHTML;
            checkoutTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }
        
        // Handle checkout form submission
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const payment = document.getElementById('payment').value;
            
            // Prepare WhatsApp message
            let message = `Olá, gostaria de fazer um pedido!\n\n`;
            message += `*Nome:* ${name}\n`;
            message += `*Celular:* ${phone}\n`;
            message += `*Endereço:* ${address}\n`;
            message += `*Forma de Pagamento:* ${payment}\n\n`;
            message += `*Itens do Pedido:*\n`;
            
            cart.forEach(item => {
                message += `- ${item.quantity}x ${item.name} (${item.flavor}) - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
            });
            
            message += `\n*Total:* R$ ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2).replace('.', ',')}\n\n`;
            message += `Por favor, confirme meu pedido. Obrigado!`;
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);
            
            // Redirect to WhatsApp
            window.location.href = `https://wa.me/5511999999999?text=${encodedMessage}`;
            
            // Clear cart
            cart = [];
            updateCartCount();
            checkoutModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            checkoutForm.reset();
        });
    
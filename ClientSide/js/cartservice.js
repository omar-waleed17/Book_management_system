// cart.js - FINAL WORKING VERSION
let cartItems = [];

async function loadCartFromDatabase() {
    try {
        console.log('🛒 Loading cart...');
        
        // Check if we're logged in first
        if (!window.TokenManager || !window.TokenManager.isLoggedIn()) {
            console.log('❌ Not logged in, redirecting...');
            window.location.href = "../index.html";
            return;
        }
        
        const response = await window.TokenManager.fetchWithAuth(
            'http://localhost:8080/api/customer/cart',
            { method: 'GET' }
        );
        
        if (response && response.ok) {
            const cartData = await response.json();
            console.log('✅ Cart loaded:', cartData);
            cartItems = cartData;
            displayCartItems();
        } else if (response && response.status === 404) {
            console.log('🛒 No cart found');
            cartItems = [];
            displayCartItems();
        } else if (!response) {
            console.log('❌ No response from server');
            cartItems = [];
            displayCartItems();
        }
    } catch (error) {
        console.error('❌ Error loading cart:', error);
        
        // Check if it's an auth error
        if (error.message && error.message.includes('Session expired')) {
            alert('Session expired. Please login again.');
            window.location.href = "../index.html";
        }
        
        cartItems = [];
        displayCartItems();
    }
}

function displayCartItems() {
    const cartList = document.getElementById("cartList");
    const cartSummary = document.getElementById("cartSummary");
    const emptyCartDiv = document.getElementById("emptyCart");
    
    if (!cartList || !cartSummary || !emptyCartDiv) return;
    
    // Clear the list
    cartList.innerHTML = '';
    
    if (!cartItems || cartItems.length === 0) {
        cartList.style.display = "none";
        cartSummary.style.display = "none";
        emptyCartDiv.style.display = "block";
        return;
    }
    
    cartList.style.display = "block";
    cartSummary.style.display = "block";
    emptyCartDiv.style.display = "none";
    
    let subtotal = 0;
    let totalItems = 0;
    
    // Display each cart item
    cartItems.forEach(item => {
        totalItems += item.quantity;
        const itemTotal = (item.unitPrice || 0) * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title || 'Untitled Book'}</h3>
                <p class="cart-item-isbn">ISBN: ${item.isbn}</p>
                <p class="cart-item-price">$${(item.unitPrice || 0).toFixed(2)} each</p>
                <p class="cart-item-stock">In cart: ${item.quantity} | Available: ${item.maxQuantity || 0}</p>
            </div>
            
            <div class="cart-item-controls">
                <button onclick="updateQuantity('${item.isbn}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.isbn}', 1)" 
                        ${item.quantity >= item.maxQuantity ? 'disabled' : ''}>+</button>
                <button onclick="removeFromCart('${item.isbn}')">Remove</button>
            </div>
        `;
        
        cartList.appendChild(cartItem);
    });
    
    // Update summary
    const tax = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;
    
    document.getElementById("subtotalAmount").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("taxAmount").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("shippingAmount").textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
    document.getElementById("totalAmount").textContent = `$${total.toFixed(2)}`;
    document.getElementById("itemCount").textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
}

async function updateQuantity(isbn, change) {
    try {
        const item = cartItems.find(i => i.isbn === isbn);
        if (!item) return;
        
        const newQuantity = item.quantity + change;
        
        if (newQuantity < 1) {
            await removeFromCart(isbn);
            return;
        }
        
        if (newQuantity > item.maxQuantity) {
            alert(`Cannot exceed available stock of ${item.maxQuantity}`);
            return;
        }
        
        console.log(`Updating ${isbn} to ${newQuantity}...`);
        
        const response = await window.TokenManager.fetchWithAuth(
            `http://localhost:8080/api/customer/cart/item?isbn=${isbn}&quantity=${newQuantity}`,
            { method: 'PUT' }
        );
        
        if (response && response.ok) {
            // Update local state and refresh
            item.quantity = newQuantity;
            displayCartItems();
            alert('Quantity updated!');
        } else {
            alert('Failed to update quantity');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update quantity: ' + error.message);
    }
}

async function removeFromCart(isbn) {
    if (!confirm('Remove this item?')) return;
    
    try {
        const response = await window.TokenManager.fetchWithAuth(
            `http://localhost:8080/api/customer/cart/item?isbn=${isbn}`,
            { method: 'DELETE' }
        );
        
        if (response && response.ok) {
            // Remove from local state and refresh
            cartItems = cartItems.filter(i => i.isbn !== isbn);
            displayCartItems();
            alert('Item removed!');
        } else {
            alert('Failed to remove item');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to remove item: ' + error.message);
    }
}

async function deleteCart() {
    if (cartItems.length === 0) {
        alert('Cart is already empty!');
        return;
    }
    
    if (!confirm('Clear entire cart?')) return;
    
    try {
        const response = await window.TokenManager.fetchWithAuth(
            'http://localhost:8080/api/customer/cart',
            { method: 'DELETE' }
        );
        
        if (response && response.ok) {
            cartItems = [];
            displayCartItems();
            alert('Cart cleared!');
        } else {
            alert('Failed to clear cart');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to clear cart: ' + error.message);
    }
}

// Checkout button - does nothing for now
function checkout() {
    alert('Checkout functionality is not implemented yet.');
}

// Setup event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📦 Cart page loading...');
    
    // Check if TokenManager is available
    if (!window.TokenManager) {
        console.error('❌ TokenManager not found!');
        alert('Authentication system not loaded. Please refresh the page.');
        return;
    }
    
    // Check if logged in using TokenManager
    if (!window.TokenManager.isLoggedIn()) {
        console.log('❌ Not logged in, redirecting...');
        window.location.href = "../index.html";
        return;
    }
    
    console.log('✅ User is logged in, loading cart...');
    
    // Load cart
    loadCartFromDatabase();
    
    // Setup button listeners
    document.getElementById('checkoutBtn')?.addEventListener('click', checkout);
    document.getElementById('deleteCartBtn')?.addEventListener('click', deleteCart);
    document.getElementById('continueShoppingBtn')?.addEventListener('click', () => {
        window.location.href = 'books.html';
    });
});
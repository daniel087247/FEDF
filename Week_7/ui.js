import { calculateTotal, removeFromCart, cart } from './cart.js'; 
export function updateCartUI(cartData) { 
const cartItemsDiv = document.getElementById("cartItems"); 
const cartTotalDiv = document.getElementById("cartTotal"); 
cartItemsDiv.innerHTML = ""; 
cartData.forEach((book, index) => { 
const itemDiv = document.createElement("div"); 
itemDiv.classList.add("cart-item"); 
itemDiv.innerHTML = ` 
<span>${book.title} - ₹${book.price}</span> 
<button data-index="${index}" style="background:red;">Remove</button> 
`; 
cartItemsDiv.appendChild(itemDiv); 
}); 
// Attach remove event listeners 
cartItemsDiv.querySelectorAll("button").forEach(btn => { 
btn.addEventListener("click", (e) => { 
const idx = e.target.getAttribute("data-index"); 
removeFromCart(idx); 
updateCartUI(cart); 
}); 
}); 
// Update total 
cartTotalDiv.textContent = `Total: ₹${calculateTotal()}`; 
} 
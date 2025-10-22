export let cart = []; 
// Add book to cart 
export function addToCart(book) { 
cart.push(book); 
} 
// Remove book by index 
export function removeFromCart(index) { 
cart.splice(index, 1); 
} 
// Calculate total price 
export function calculateTotal() { 
return cart.reduce((sum, book) => sum + book.price, 0); 
}
import { books } from './data.js'; 
import { addToCart, cart } from './cart.js'; 
import { updateCartUI } from './ui.js'; 
export function displayBooks() { 
const bookList = document.getElementById("bookList"); 
bookList.innerHTML = ""; // Clear before rendering 
books.forEach((book, index) => { 
const bookDiv = document.createElement("div"); 
bookDiv.classList.add("book"); 
bookDiv.innerHTML = ` 
<div> 
<strong>${book.title}</strong> <br> 
<small>by ${book.author}</small> <br> 
<span>₹${book.price}</span> 
</div> 
<div> 
${book.availability === "in stock" 
? `<button data-index="${index}">Add to Cart</button>` 
: `<span style="color:red;">Out of Stock</span>` 
} 
</div> 
`; 
bookList.appendChild(bookDiv); 
}); 
// Attach event listeners to "Add to Cart" buttons 
bookList.querySelectorAll("button").forEach(btn => { 
btn.addEventListener("click", (e) => { 
const idx = e.target.getAttribute("data-index"); 
addToCart(books[idx]); 
updateCartUI(cart); 
}); 
}); 
} 
// Récupérer le panier à partir de localStorage, ou créer un panier vide si non existant
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Met à jour le compteur de panier
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// Ajouter un produit au panier
function addToCart(name, price) {
    console.log(`Ajout de ${name} au panier pour ${price}€`);  // Vérification dans la console
    cart.push({ name, price: parseFloat(price) });  // Conversion du prix en nombre
    localStorage.setItem('cart', JSON.stringify(cart));  // Sauvegarde le panier
    showCartNotification();
    updateCartCount(); // Mise à jour de l'affichage du nombre d'articles dans le panier
}



// Afficher une notification après l'ajout au panier
function showCartNotification() {
    const notification = document.getElementById('cartNotification');
    if (notification) {
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }
}

// Afficher les articles dans le panier sur la page Caddie.html
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');

    if (cartItemsContainer && totalPriceElement) {
        cartItemsContainer.innerHTML = '';  // Vider l'affichage actuel
        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.textContent = `${item.name} - ${item.price}€`;
            cartItemsContainer.appendChild(itemElement);
            total += parseFloat(item.price);
        });

        totalPriceElement.textContent = total.toFixed(2);  // Mise à jour du total
    }
}

// Fonction pour vider le panier
function clearCart() {
    cart = [];  // Vider le tableau du panier
    localStorage.setItem('cart', JSON.stringify(cart));  // Mettre à jour le localStorage
    updateCartCount();  // Mise à jour du compteur à 0
    displayCartItems();  // Mise à jour de l'affichage des articles dans Caddie.html
    alert('Votre panier a été vidé.');
}

// Ajouter un événement au bouton pour vider le panier dans Caddie.html
const clearCartButton = document.getElementById('clearCartButton');
if (clearCartButton) {
    clearCartButton.addEventListener('click', clearCart);
}
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter un événement sur tous les boutons "Ajouter au panier"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            addToCart(name, price);
        });
    });

    // Sélectionne l'icône du caddie et ajoute un événement click
    document.getElementById('cartIcon').addEventListener('click', () => {
        window.location.href = '/projet 3 (informashop)/Caddie.html';  // Redirige vers la page Caddie.html
    });

    // Appel de la mise à jour du nombre d'articles au chargement
    updateCartCount();
});


// Appeler cette fonction au chargement de la page Caddie.html
displayCartItems();

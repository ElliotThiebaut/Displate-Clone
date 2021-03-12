var stripe = Stripe(STRIPE_KEY);


new Vue({
	el: '#app',
	data: {
		// sert à savoir sur quelle page on est
		page: 'list',

		// la liste des produits
		all_products: [],

		// le produit qu'on consulte sur la page de détail
		currentProduct: {},

		// Array qui stock les produits dans le panier de l'utilisateur
		cart: [],

		// Total price of the cart
		cartTotal: 0,

		// Show success modal or not
		returnSucess: ""
	},
	mounted() {
		this.getData();
		this.checkUrl();
	},
	methods: {
		// sert à afficher la page d'un produit
		goToProduct(product) {
			this.currentProduct = product;
			this.page = 'detail';
		},

		// sert à ajouter un produit au panier
		addToCart(product) {

			// On vérifie si le produit est déjà dans le panier
			let positionNewItem = this.cart.map((e) => { return e.id }).indexOf(product.id);
			
			// On ajoute un à la quantitté ou on crée le produit
			if (positionNewItem >= 0) {
				this.cart[positionNewItem].quantity ++;
				this.cartTotal = 0
				this.cart.forEach((cartItem) => {
					this.cartTotal += cartItem.price * cartItem.quantity
				})
			} else {
				const newCartItem = {
					"id": product.id,
					"title": product.fields.title,
					"price": product.fields.price,
					"image": product.fields.image[0].url,
					"priceId": product.fields.priceID,
					"quantity": 1
				}
				this.cart.push(newCartItem);
				this.cartTotal = 0
				this.cart.forEach((cartItem) => {
					this.cartTotal += cartItem.price * cartItem.quantity
				})
			}


			
		},

		// sert à supprimer un produit du panier
		removeFromCart(product) {
			let index = this.cart.indexOf(product);
			this.cart.splice(index, 1);

			// Mise à jour du total du panier
			this.cartTotal = 0
			this.cart.forEach((cartItem) => {
				this.cartTotal += cartItem.price * cartItem.quantity
			})
		},

		checkout() {
			let finalCart = [];
			this.cart.forEach((product) => {
				finalCart.push({
					"price": product.priceId,
					"quantity": product.quantity

				});
			})

			stripe.redirectToCheckout({
				// on fournit ici la liste des produits dans le panier
				lineItems: finalCart,
				mode: 'payment',
				// la page de succès
				successUrl: 'https://elliot-displate.netlify.app?returnCheckout=sucess',
				// la page d'erreur
				cancelUrl: 'https://elliot-displate.netlify.app?returnCheckout=fail',
			  }).then(function (result) {
				console.error(result.error.message);
			  });
		},

		// sert à récupérer les données de l'API airtable
		async getData() {
			// L'url de l'API
			const url = `https://api.airtable.com/v0/${DB_ID}/${DB_TABLE}?api_key=${AIRTABLE_KEY}`;

			// On interroge l'URL et on récupère le texte JSON
			let response = await fetch(url);
			let data = await response.json();

			// On met les données dans la variable all_rows
			this.all_products = data.records;
		},

		// On récupère les paramètres de l'URL pour afficher un modal
		checkUrl() {
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);

			if (urlParams.has('returnCheckout')) {
				const returnCheckout = urlParams.get('returnCheckout');
				this.returnSucess = returnCheckout;
			}
		},

		closeModal() {
			modal.style.display = "none";
		},

		openModal() {
			modal.style.display = "block";
		}
	}
});

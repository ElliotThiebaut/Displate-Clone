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
		cart: []
	},
	mounted() {
		this.getData();
	},
	methods: {
		// sert à afficher la page d'un produit
		goToProduct(product) {
			this.currentProduct = product;
			this.page = 'detail';
		},

		// sert à ajouter un produit au panier
		addToCart(product) {
			const newCartItem = {
				"id": product.id,
				"title": product.fields.title,
				"price": product.fields.price,
				"image": product.fields.image[0].url
			}
			this.cart.push(newCartItem);
		},

		// sert à supprimer un produit du panier
		removeFromCart(product) {
			let index = this.cart.indexOf(product);
			this.cart.splice(index, 1);
		},

		checkout() {
			console.log('Paiement en cours');
		},

		// sert à récupérer les données de l'API airtable
		async getData() {
			// L'url de l'API
			const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_KEY}/${process.env.DB_ID}?api_key=${process.env.DB_TABLE}`;

			// On interroge l'URL et on récupère le texte JSON
			let response = await fetch(url);
			let data = await response.json();

			// On met les données dans la variable all_rows
			this.all_products = data.records;
		}
	}
});

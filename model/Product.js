class Product {
    constructor(){
        this.products = [];
    }

    getAll(){
        try{
            return this.products;
        } catch(error){
            return {error: true, message: error.message};
        }
    }

    getById(id){
        try{
            const product = this.products.find(product => product.id === id);
            if(!product){
                return {error: 'Producto no encontrado'}
            } else {
                return this.products.find(product => product.id === +id);
            }
        } catch(error){
            return error.message;
        }
    }

    save(product){
        try{
            product.id = this.products.length + 1;
            this.products.push(product);
            return product;
        } catch(error){
            return error.message;
        }
    }

    update(id, newProductData){
        try{
            const productIndex = this.products.findIndex(product => product.id === id);
            if(productIndex < 0){
                return {error: 'El producto no existe'};
            } else {
                const newProduct = {
                    ...this.products[productIndex],
                    name: newProductData.name,
                    price: newProductData.price,
                    thumbnail: newProductData.thumbnail
                };
                this.products[productIndex] = newProduct;
                return this.products[productIndex];
            }
        } catch(error){
            return error.message;
        }
    }

    delete(id){
       try{
            const productIndex = this.products.findIndex(product => product.id === id);
            if(productIndex < 0){
                return {error: 'El producto no existe'};
            } else {
                this.products.splice(productIndex, 1);
                return this.products;
            }
       } catch(error){
            return error.message;
       }
    }
}

module.exports = Product;
// describe

const request = require('supertest');
const mongoose = require('mongoose');
const app = require("../../app");
const Product = require('../../models/product.model');
const { findByIdAndUpdate } = require('../../models/product.model');

// it
describe('Api de products', () => {

    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online')
    });

    afterAll(async () => {
        await mongoose.disconnect()
    })

    describe('Get /api/products', () => {

        let response;
        beforeAll(async () => {
            response = await request(app)
                .get('/api/products')
                .send();
        });

        it('Deberia devolver status 200', () => {
            expect(response.statusCode)
                .toBe(200);
        });

        it('Deberia devolver la respuesta en formato JSON', () => {
            expect(response.headers['content-type'])
                .toContain('application/json')
        });

        it('Deberia devolver un array', () => {
            expect(response.body).toBeInstanceOf(Array);
        })


    });


    describe('POST /api/products', () => {

        let response;
        const newProduct = { name: 'Producto de prueba', description: 'Esto es para probar', price: 52, category: 'test', available: true, stock: 10, image: 'url de imagen' }
        beforeAll(async () => {
            response = await request(app)
                .post('/api/products')
                .send(newProduct)
        })

        afterAll(async () => {
            await Product.deleteMany({ category: 'test' })
        })

        it('Deberia existir la url en la aplicacion', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json')
        })

        it('El producto devuelto debería tener _id', () => {
            expect(response.body._id).toBeDefined();
        })

        it('el nombre del producto se ha  insertado correctamente', () => {
            expect(response.body.name).toBe(newProduct.name);
        })
    });

    describe('Put /api/products/productoId', () => {

        const newProduct = { name: 'Producto de prueba', description: 'Esto es para probar', price: 52, category: 'test', available: true, stock: 10, image: 'url de imagen' }
        let productToEdit;
        let response;

        beforeAll(async () => {
            productToEdit = await Product.create(newProduct);

            response = await request(app)
                .put(`/api/products/${productToEdit._id}`)
                .send({ stock: 200, price: 99 });
        });

        afterAll(async () => {
            await Product.findByIdAndDelete(productToEdit._id)
        })

        it('Deberia de existir la url', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json')
        })

        it('los datos deberian actualizarse', () => {
            expect(response.body.stock).toBe(200);
            expect(response.body.price).toBe(99);
        })

    })

    describe('Delete /api/products/productoId', () => {
        const newProduct = { name: 'Producto de prueba', description: 'Esto es para probar', price: 52, category: 'test', available: true, stock: 10, image: 'url de imagen' }
        let productToDelete;
        let response;

        beforeAll(async () => {
            productToDelete = await Product.create(newProduct)
            response = await request(app)
                .delete(`/api/products/${productToDelete._id}`)
                .send();
        })

        afterAll(async () => {
            await Product.findByIdAndDelete(productToDelete._id)
        })

        it('Deberia existir la url en la aplicacion', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json')
        })

        it('el producto deberia borrarse de la BD', async () => {
            //buscar el producto en la BD
            const p = await Product.findById(productToDelete._id)
            //compruebo si el producto es nullo
            expect(p).toBeNull()
        })
    })
});


import pytest
from app import app
from flask import request
import os
from dotenv import load_dotenv

@pytest.fixture
def client():
    return app.test_client()

def test_index(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'Hello, World!' in response.data


def test_404(client):
    response = client.get('/nonexistent')
    assert response.status_code == 404

def test_get_customers(client, app_context):
    response = client.get('/customers')
    assert response.status_code == 200

    data = response.json
    assert len(data) == 1  # One customers were inserted in the seed data

    customer1 = data[0]
    assert customer1['name'] == 'Morgan Bastian'
    assert customer1['phone_number'] == '8433459291'
    assert customer1['email'] == 'morgan@gmail.com'
    assert customer1['address'] == '800 Bastian Road'

# creates a duplicate customer when run twice and makes
# get_customers len(data) fail
# def test_create_customer(client):
#     with app.test_request_context():
#         # Prepare the data to be sent to the API
#         customer_data = {
#             "name": "John Doe",
#             "phone_number": "555-123-4567",
#             "email": "john.doe@example.com",
#             "address": "123 Main Street"
#         }

#         # Send a POST request to the API with the customer data
#         response = client.post('/create_customer', json=customer_data)

#         # Assert that the response status code is 200 (OK)
#         assert response.status_code == 200

def test_get_products(client, app_context):
    response = client.get('/products')
    assert response.status_code == 200

    data = response.json
    # 12 customers were inserted into the database
    assert len(data) == 12 
    #dictionary with product_id as keys and each value is the product data
    products_by_id = {product['product_id']: product for product in data}

    product1 = products_by_id[1]  
    assert product1['name'] == 'Plain Loaf'
    assert product1['product_type'] == 'bread'
    assert float(product1['price']) == 10.00

    product5 = products_by_id[5] 
    assert product5['name'] == '6 Chocolate Chip Cookies'
    assert product5['product_type'] == 'sweets'
    assert float(product5['price']) == 10.00

def test_get_add_ons(client, app_context):
    # Send a GET request to the API to retrieve the add-ons for a specific product
    response = client.get('/products/2/add_ons')
    # Assert that the response status code is 200 (OK)
    assert response.status_code == 200
    # Assert that the response data is a list
    assert isinstance(response.json, list)
    # Assert that the length of the response data is equal to the number of add-ons associated with the product
    assert len(response.json) == 5
    # Assert the content of the first add-on
    add_on1 = response.json[0]
    assert add_on1['name'] == 'Jalapeño and Cheddar'
    assert float(add_on1['price']) == 2.00
    # Assert the content of the second add-on
    add_on2 = response.json[1]
    assert add_on2['name'] == 'Cinnamon Sugar'
    assert float(add_on2['price']) == 2.00

def test_create_cart(client, app_context):
    # Prepare the data to be sent to the API
    cart_data = {
        'customer_id': 1
    }
    # Send a POST request to the API with the cart data
    response = client.post('/carts', json=cart_data)
    # Assert that the response status code is 200 (OK)
    assert response.status_code == 200
    # Assert the response message
    assert response.json['message'] == 'Cart created successfully!'    

def test_get_carts(client, app_context):
    response = client.get('/carts')
    assert response.status_code == 200
    data = response.json
    assert isinstance(data, list)  # Assert that the response data is a list
    # Assert the content of the first cart
    cart1 = data[0]
    assert 'customer_id' in cart1  # Assert that the cart has a 'customer_id' key
# cart get, update, delete working but will fail if run twice because cart_id 1 gets deleted
# def test_get_cart(client, app_context):
#     response = client.get('/carts/1')
#     assert response.status_code == 200
#     data = response.json
#     assert 'customer_id' in data  # Assert that the cart has a 'customer_id' key

# def test_update_cart(client, app_context):
#     # Prepare the data to be sent to the API
#     cart_data = {
#         'customer_id': 1
#     }
#     # Send a PUT request to the API with the cart data
#     response = client.put('/carts/1', json=cart_data)
#     # Assert that the response status code is 200 (OK)
#     assert response.status_code == 200
#     # Assert the response message
#     assert response.json['message'] == 'Cart updated successfully!'

# def test_delete_cart(client, app_context):
#     response = client.delete('/carts/1')
#     assert response.status_code == 200
#     # Assert the response message
#     assert response.json['message'] == 'Cart deleted successfully!'
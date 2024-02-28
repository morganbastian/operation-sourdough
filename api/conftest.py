import pytest
from app import app, db


# @pytest.fixture(scope="module")
# def init_database():
#     # Create the database tables
#     db.create_all()

#     # Insert test data
#     customer1 = Customer(name="Alice", phone_number="555-123-4567", email="alice@example.com", address="123 Main Street")
#     customer2 = Customer(name="Bob", phone_number="555-234-5678", email="bob@example.com", address="456 Elm Street")
#     db.session.add_all([customer1, customer2])

#     product1 = Product(name="Widget A", description="This is a widget", price=10.99)
#     product2 = Product(name="Widget B", description="This is another widget", price=12.99)
#     db.session.add_all([product1, product2])

#     addon1 = Addon(product_id=product1.product_id, name="Addon 1", description="This is an addon for Widget A", price=2.99)
#     addon2 = Addon(product_id=product2.product_id, name="Addon 2", description="This is an addon for Widget B", price=3.99)
#     db.session.add_all([addon1, addon2])

#     cart1 = Cart(customer_id=customer1.customer_id)
#     cart2 = Cart(customer_id=customer2.customer_id)
#     db.session.add_all([cart1, cart2])

#     cart_item1 = CartItem(cart_id=cart1.cart_id, product_id=product1.product_id, quantity=2)
#     cart_item2 = CartItem(cart_id=cart1.cart_id, product_id=product2.product_id, quantity=1)
#     cart_item3 = CartItem(cart_id=cart2.cart_id, product_id=product1.product_id, quantity=3)
#     db.session.add_all([cart_item1, cart_item2, cart_item3])

#     order1 = Order(cart_id=cart1.cart_id, customer_id=customer1.customer_id, order_date=datetime.now())
#     order2 = Order(cart_id=cart2.cart_id, customer_id=customer2.customer_id, order_date=datetime.now())
#     db.session.add_all([order1, order2])

#     # Commit the changes to the database
#     db.session.commit()


@pytest.fixture
def app_context():
    with app.app_context():
        yield


@pytest.fixture
def client():
    return app.test_client()
import os
from dotenv import load_dotenv

load_dotenv() 

from flask import Flask, request, jsonify, json
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from decimal import Decimal
import boto3
from botocore.exceptions import ClientError


app = Flask(__name__)
CORS(app)

# Use environment variables for configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_DATABASE')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# BaseModel for other models to inherit from
class BaseModel(db.Model):
    __abstract__ = True

    def to_dict(self):
        return {
            c.name: getattr(self, c.name)
            for c in self.__table__.columns
        }

# Model definitions
class Customer(BaseModel):
    __tablename__ = 'customers'
    customer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=True)
    address = db.Column(db.Text, nullable=False)

class Product(BaseModel):
    __tablename__ = 'products'
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10,2), nullable=False)
    product_type = db.Column(db.String(255), nullable=True)

class AddOn(BaseModel):
    __tablename__ = 'add_ons'
    add_on_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10,2), nullable=False)
    product = db.relationship('Product', backref=db.backref('add_ons', lazy=True))

class Cart(BaseModel):
    __tablename__ = 'carts'
    cart_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'), nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    customer = db.relationship('Customer', backref=db.backref('carts', lazy=True))

class CartItem(BaseModel):
    __tablename__ = 'cart_items'
    cart_item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.cart_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    cart = db.relationship('Cart', backref=db.backref('cart_items', lazy=True))
    product = db.relationship('Product', backref=db.backref('cart_items', lazy=True))

class Order(BaseModel):
    __tablename__ = 'orders'
    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.cart_id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'), nullable=False)
    order_date = db.Column(db.Date, nullable=False)
    cart = db.relationship('Cart', backref=db.backref('orders', lazy=True))
    customer = db.relationship('Customer', backref=db.backref('orders', lazy=True))

def send_email(subject, body_text, body_html, recipient):
    client = boto3.client('ses', region_name='us-east-1')  # Update the AWS region
    try:
        response = client.send_email(
            Destination={'ToAddresses': [recipient]},
            Message={
                'Body': {
                    'Html': {'Charset': "UTF-8", 'Data': body_html},
                    'Text': {'Charset': "UTF-8", 'Data': body_text},
                },
                'Subject': {'Charset': "UTF-8", 'Data': subject},
            },
            Source='sender@example.com'  # Verify this email in AWS SES
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
        return False
    else:
        print("Email sent! Message ID:", response['MessageId'])
        return True


@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/customers', methods=['GET'])
def get_customers():
    # Query the database for all customers
    customers = Customer.query.all()
    # Convert the list of customers to a list of dictionaries
    customer_data = [customer.to_dict() for customer in customers]
    # Return the list of customers in a JSON response
    return jsonify(customer_data)

@app.route('/create_customer', methods=['POST'])
def create_customer():
    data = request.get_json()
    # create the new customer object
    customer = Customer(name=data['name'], phone_number=data['phone_number'], email=data['email'], address=data['address'])
     # Add the customer to the database
    db.session.add(customer)
    db.session.commit()
    # Return a success message
    return jsonify({'message': 'Customer created successfully!'})

@app.route('/customers/<int:customer_id>', methods=['GET'])
def get_customer_by_id(customer_id):
    # Query the database for the customer with the specified ID
    customer = Customer.query.get(customer_id)
    # If the customer does not exist, return a 404 error
    if customer is None:
        return jsonify({'error': 'Customer not found'}), 404
    # Convert the customer object to a dictionary
    customer_data = customer.to_dict()
    # Return the customer data in a JSON response
    return jsonify(customer_data)

@app.route('/products', methods=['GET'])
def get_products():
    # Query the database for all customers
    products = Product.query.all()
    # Convert the list of customers to a list of dictionaries
    product_data = [product.to_dict() for product in products]
    # Return the list of customers in a JSON response
    return jsonify(product_data)

@app.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    product = Product.query.get(product_id)
    if product is None:
        return jsonify({'error': 'Customer not found'}), 404
    product_data = product.to_dict()
    return jsonify(product_data)

@app.route('/products/<int:product_id>/add_ons', methods=['GET'])
def get_add_ons(product_id):
    # Query the database for all add ons that are associated with the product with the specified product ID
    add_ons = AddOn.query.filter_by(product_id=product_id).all()
    # Convert the list of add ons to a list of dictionaries
    add_on_data = [add_on.to_dict() for add_on in add_ons]
    # Return the list of add ons in a JSON response
    return jsonify(add_on_data)

@app.route('/carts', methods=['GET', 'POST'])
def carts():
    if request.method == 'GET':
        # Get all carts
        carts = Cart.query.all()
        cart_data = [cart.to_dict() for cart in carts]
        return jsonify(cart_data)
    elif request.method == 'POST':
        # Create a new cart
        data = request.get_json()
        cart = Cart(customer_id=data['customer_id'])
        db.session.add(cart)
        db.session.commit()
        return jsonify({'message': 'Cart created successfully!'})


@app.route('/carts/<int:cart_id>', methods=['GET', 'PUT', 'DELETE'])
def cart(cart_id):
    # Get a cart by its ID
    cart = db.session.get(Cart, cart_id)
    if not cart:
        return jsonify({'error': 'Cart not found'}), 404

    if request.method == 'GET':
        # Return the cart data
        return jsonify(cart.to_dict())
    elif request.method == 'PUT':
        # Update the cart
        data = request.get_json()
        cart.customer_id = data['customer_id']
        db.session.commit()
        return jsonify({'message': 'Cart updated successfully!'})
    elif request.method == 'DELETE':
        # Delete the cart
        db.session.delete(cart)
        db.session.commit()
        return jsonify({'message': 'Cart deleted successfully!'})


@app.route('/carts/<int:cart_id>/items', methods=['GET', 'POST'])
def cart_items(cart_id):
    # Get a cart by its ID
    cart = Cart.query.get(cart_id)
    if not cart:
        return jsonify({'error': 'Cart not found'}), 404

    if request.method == 'GET':
        # Get all cart items for the cart
        cart_items = CartItem.query.filter_by(cart_id=cart_id).all()
        cart_item_data = [cart_item.to_dict() for cart_item in cart_items]
        return jsonify(cart_item_data)
    elif request.method == 'POST':
        # Add a new cart item to the cart
        data = request.get_json()
        cart_item = CartItem(cart_id=cart_id, product_id=data['product_id'], quantity=data['quantity'])
        db.session.add(cart_item)
        db.session.commit()
        return jsonify({'message': 'Cart item added successfully!'})


@app.route('/carts/<int:cart_id>/items/<int:cart_item_id>', methods=['GET', 'PUT', 'DELETE'])
def cart_item(cart_id, cart_item_id):
    # Get a cart item by its ID
    cart_item = CartItem.query.get(cart_item_id)
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404

    if request.method == 'GET':
        # Return the cart item data
        return jsonify(cart_item.to_dict())
    elif request.method == 'PUT':
        # Update the cart item
        data = request.get_json()
        cart_item.quantity = data['quantity']
        db.session.commit()
        return jsonify({'message': 'Cart item updated successfully!'})
    elif request.method == 'DELETE':
        # Delete the cart item
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({'message': 'Cart item deleted successfully!'})

@app.route('/orders', methods=['GET', 'POST'])
def orders():
    if request.method == 'GET':
        # Get all orders
        orders = Order.query.all()
        order_data = [order.to_dict() for order in orders]
        return jsonify(order_data)
    elif request.method == 'POST':
        # Create a new order
        data = request.get_json()
        order = Order(cart_id=data['cart_id'], customer_id=data['customer_id'], order_date=data['order_date'])
        db.session.add(order)
        db.session.commit()
        return jsonify({'message': 'Order created successfully!'})

@app.route('/orders/<int:order_id>', methods=['GET', 'PUT', 'DELETE'])
def order(order_id):
    order = Order.query.get(order_id)

    if not order:
        return jsonify({'message': 'Order not found!'}), 404

    if request.method == 'GET':
        # Get the order
        order_data = order.to_dict()
        return jsonify(order_data)
    elif request.method == 'PUT':
        # Update the order
        data = request.get_json()
        order.cart_id = data['cart_id']
        order.customer_id = data['customer_id']
        order.order_date = data['order_date']
        db.session.commit()
        return jsonify({'message': 'Order updated successfully!'})
    elif request.method == 'DELETE':
        # Delete the order
        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order deleted successfully!'})


@app.route('/submit-order', methods=['POST', 'OPTIONS'])
def submit_order():
    if request.method == 'OPTIONS':
        # Respond to the preflight request with the necessary headers
        response = app.make_response(('OK', 200))
        response.headers['Access-Control-Allow-Origin'] = '*'  # Consider specifying your frontend's domain in production
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

    # Handle POST request
    data = request.get_json()
    cart_items = data.get('cart', [])  # Default to empty list if not provided
    customer_details = data.get('customerDetails', {})

    # Formatting cart items into a readable string for the email
    cart_items_formatted = '\n'.join([
        f"Product: {item.get('name', 'Unknown Product')}, Quantity: {item.get('quantity', 0)}"
        for item in cart_items
    ])

    # Formatting customer details
    customer_details_formatted = '\n'.join([f"{key}: {value}" for key, value in customer_details.items()])

    # Compose the full text for the email
    body_text = f"Order Details:\n{cart_items_formatted}\n\nCustomer Details:\n{customer_details_formatted}"
    body_html = f"""<html>
    <head></head>
    <body>
      <h1>New Order Received</h1>
      <p>{body_text}</p>
    </body>
    </html>
    """

    # Your email address hardcoded
    your_email = "morganbastian07@gmail.com"

    if send_email("New Order Received", body_text, body_html, your_email):
        return jsonify({'message': 'Order submitted and email sent successfully'}), 200
    else:
        return jsonify({'error': 'Failed to send email'}), 500

def send_email(subject, body_text, body_html, recipient):
    client = boto3.client('ses', region_name='us-east-1')
    try:
        response = client.send_email(
            Destination={'ToAddresses': [recipient]},
            Message={
                'Body': {
                    'Html': {'Charset': "UTF-8", 'Data': body_html},
                    'Text': {'Charset': "UTF-8", 'Data': body_text},
                },
                'Subject': {'Charset': "UTF-8", 'Data': subject},
            },
            Source=recipient  # Make sure this is verified in SES
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
        return False
    else:
        print("Email sent! Message ID:", response['MessageId'])
        return True


if __name__ == '__main__':
    app.run(debug=True)
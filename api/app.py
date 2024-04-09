from flask import Flask, request, jsonify, json
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from dotenv import load_dotenv
from decimal import Decimal
import boto3
from botocore.exceptions import ClientError

# Custom JSONEncoder to handle Decimal types
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            # Convert Decimal instances to floats
            return float(obj)
        # Fallback to the default behavior for other types
        return super(CustomJSONEncoder, self).default(obj)

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.json_encoder = CustomJSONEncoder  # Use the custom JSON Encoder
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

# Flask route definitions would follow here...

if __name__ == '__main__':
    app.run(debug=True)

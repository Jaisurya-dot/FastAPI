from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Product
from database import session, engine
import database_model
from sqlalchemy.orm import Session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"]
)
0
database_model.Base.metadata.create_all(bind=engine)

@app.get("/")
def greet():
    return "Welcome to Telusko Trac"

products = [
    Product(id=1, name="Phone", description="A smartphone", price=699.99, quantity=50),
    Product(id=2, name="Laptop", description="A powerful laptop", price= 999.99, quantity=30),
    Product(id=5, name="Pen", description="A Blue ink pen", price=1.99, quantity=100),
    Product(id=6, name="Table", description="A wooden table", price=199.99, quantity=20)
]

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

def init_db():
    db = session()
    count = db.query(database_model.Product).count

    if count == 0:
       for product in products:
           db.add(database_model.Product(**product.model_dump()))

       db.commit() 

init_db()

@app.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    
    db_products = db.query(database_model.Product).all()
    return db_products

@app.get("/products/{id}")
def get_product_by_id(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_model.Product).filter(database_model.Product.id == id).first()
    if db_product:
        return db_product
    return "product not found"


@app.post("/products")
def add_product(product: Product, db: Session = Depends(get_db)):
    db.add(database_model.Product(**product.model_dump()))
    db.commit()
    return product

@app.put("/products/{id}")
def update_product(id:int, product: Product, db: Session = Depends(get_db)):
    db_product = db.query(database_model.Product).filter(database_model.Product.id == id).first()
    if db_product:
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.quantity = product.quantity
        db.commit()
        return "Product updated"
    else:
        return "No Product found"


@app.delete("/products/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_model.Product).filter(database_model.Product.id == id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
    else:
        return "Product not found"




 
    
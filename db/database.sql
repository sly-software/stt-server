DROP TABLE IF EXISTS customers, products, orders;


CREATE TABLE customers (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50),
	email VARCHAR(100) UNIQUE,
	phone VARCHAR(15),
	address VARCHAR(100)
);

CREATE TABLE products (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30),
	description VARCHAR(255),
	price REAL,
	manufacture_code VARCHAR(100),
	in_stock INTEGER
);


CREATE TABLE orders (
	customer_id INTEGER REFERENCES customers(id),
	product_id INTEGER REFERENCES products(id),
	PRIMARY KEY (customer_id, product_id)
);


-- THE CUSTOMERS TABLE

INSERT INTO customers (name, email, phone, address)
VALUES ('Silvester Charles', 'silvestaisasi@gmail.com', '0784282092', 'Mbezi Beach Bondeni, Kinondoni, Dar es Salaam, Tanzania');

INSERT INTO customers (name, email, phone, address)
VALUES ('Ruth Msuya', 'ruth.msuya@inqababiotec.africa', '0689578596', 'Msewe, Ubungo, Dar es Salaam, Tanzania');




--- THE PRODUCTS TABLE

INSERT INTO products (name, description, price, manufacture_code, in_stock)
VALUES (
	'Double filtered tips',
	'ep Dualfilter T.I.P.S.®, PCR clean and sterile, 0.1  10 µL S, 34 mm, dark gray, 960 tips (10 racks x 96 tips)',
	350897.90,
	'EP 0030078500', 78);
	
INSERT INTO products (name, description, price, manufacture_code, in_stock)
VALUES (
	'PCR strips of 8 tubes',
	'PCR Strip of 8 flat Caps clear, 125/case, CleanRoom Pure®',
	247856.90,
	'TRE 10570.9.01', 12);

INSERT INTO products (name, description, price, manufacture_code, in_stock)
VALUES (
	'Quick-Load 2X Master Mix',
	'OneTaq Quick-Load 2X Master Mix with Standard Buffer - 100 rxns; Storage Temp: -20°C; Shipping: Cool Packs; UN Code: 0000',
	125804.90,
	'NEB M0486S', 48);
	
INSERT INTO products (name, description, price, manufacture_code, in_stock)
VALUES (
	'DNA ladder',
	'Quick-Load Purple 100 bp DNA Ladder - 125 gel lanes; Storage Temp: 4°C; Shipping: Cool Packs; UN Code: 0000',
	350897.90,
	'NEB N0551S', 1);

INSERT INTO products (name, description, price, manufacture_code, in_stock)
VALUES (
	'GEL loading dye',
	'Gel Loading Dye, Purple (6X) - 4,0 ml; Storage Temp: RT/4°C/-20°C; Shipping: Cool Packs; UN Code: 0000',
	350897.90,
	'NEB B7024S', 25);
	
	
--- THE ORDERS TABLE 

INSERT INTO orders (customer_id, product_id)
VALUES (2, 4), (2, 2), (2, 3), (2, 1) , (1, 3), (1, 5);
	
-- SELECT * FROM customers;
-- SELECT * FROM products;
-- SELECT * FROM orders;


-- Find total cost of order for customer 2
WITH results AS (
	SELECT customer_id, product_id, price
	FROM orders, products
	WHERE orders.product_id = products.id AND orders.customer_id = 2
)
SELECT SUM(price) AS order_total
FROM results;

DROP TABLE IF EXISTS customers, products, orders, cart;


CREATE TABLE customers (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50),
	email VARCHAR(100) UNIQUE,
	phone VARCHAR(15),
	address VARCHAR(100)
);

CREATE TABLE products (
	manufacture_code VARCHAR(100) PRIMARY KEY,
	manufacture VARCHAR(50) NOT NULL,
	name VARCHAR(30) NOT NULL,
	description VARCHAR(255) NOT NULL,
	price REAL NOT NULL,
	in_stock INTEGER NOT NULL
);


CREATE TABLE orders (
	customer_id INTEGER REFERENCES customers(id),
	product_id VARCHAR(100) REFERENCES products(manufacture_code),
	PRIMARY KEY (customer_id, product_id)
);

CREATE TABLE cart (
	id VARCHAR(255),
	customer_id INTEGER REFERENCES customers(id),
	product_id VARCHAR(100) REFERENCES products(manufacture_code),
	quantity INTEGER,
	value REAL,
	PRIMARY KEY(customer_id, product_id)
);


-- THE CUSTOMERS TABLE

INSERT INTO customers (name, email, phone, address)
VALUES ('Silvester Charles', 'silvestaisasi@gmail.com', '0784282092', 'Mbezi Beach Bondeni, Kinondoni, Dar es Salaam, Tanzania');

INSERT INTO customers (name, email, phone, address)
VALUES ('Ruth Msuya', 'ruth.msuya@inqababiotec.africa', '0689578596', 'Msewe, Ubungo, Dar es Salaam, Tanzania');




--- THE PRODUCTS TABLE

INSERT INTO products (manufacture_code, manufacture, name, description, price, in_stock)
VALUES (
	'0030078500',
	'Eppendorf',
	'Double filtered tips',
	'ep Dualfilter T.I.P.S.®, PCR clean and sterile, 0.1  10 µL S, 34 mm, dark gray, 960 tips (10 racks x 96 tips)',
	350897.90,
	78);
	
INSERT INTO products (manufacture_code, manufacture, name, description, price, in_stock)
VALUES (
	'10570.9.01',
	'Treff Nolato',
	'PCR strips of 8 tubes',
	'PCR Strip of 8 flat Caps clear, 125/case, CleanRoom Pure®',
	247856.90,
	12);

INSERT INTO products (manufacture_code, manufacture, name, description, price, in_stock)
VALUES (
	'M0486S', 
	'New England Biolabs',
	'Quick-Load 2X Master Mix',
	'OneTaq Quick-Load 2X Master Mix with Standard Buffer - 100 rxns; Storage Temp: -20°C; Shipping: Cool Packs; UN Code: 0000',
	125804.90,
	48);
	
INSERT INTO products (manufacture_code, manufacture, name, description, price, in_stock)
VALUES (
	'N0551S', 
	'New England Biolabs',
	'DNA ladder',
	'Quick-Load Purple 100 bp DNA Ladder - 125 gel lanes; Storage Temp: 4°C; Shipping: Cool Packs; UN Code: 0000',
	350897.90,
	1);

INSERT INTO products (manufacture_code, manufacture, name, description, price, in_stock)
VALUES (
	'B7024S', 
	'New England Biolabs',
	'GEL loading dye',
	'Gel Loading Dye, Purple (6X) - 4,0 ml; Storage Temp: RT/4°C/-20°C; Shipping: Cool Packs; UN Code: 0000',
	350897.90,
	25);
	
	
--- THE ORDERS TABLE 

INSERT INTO orders (customer_id, product_id)
VALUES (2, 'B7024S'), (2, 'N0551S'), (2, '0030078500'), (2, 'M0486S') , (1, '0030078500'), (1, '10570.9.01');


--- THE CART TABLE
INSERT INTO cart (id, customer_id, product_id, quantity, value) 
VALUES 	('yfkbAKUUDBKJBkjuu783hk8qy', 2, 'B7024S', 7, 2456285.3), 
		('yfkbAKUUDBKJBkjuu783hk8qy', 2, 'N0551S', 8, 2807183.2), 
		('yfkbAKUUDBKJBkjuu783hk8qy', 2, '0030078500', 89, 31229913.1);
	
	
-- SELECT * FROM customers;
-- SELECT * FROM products;
-- SELECT * FROM orders;


-- Find total cost of order for customer 2
-- WITH results AS (
-- 	SELECT customer_id, product_id, price
-- 	FROM orders, products
-- 	WHERE orders.product_id = products.manufacture_code AND orders.customer_id = 2
-- )
-- SELECT SUM(price) AS order_total
-- FROM results;


DELETE FROM cart
WHERE product_id = '0030078500';

-- INSERT INTO cart (id, customer_id, product_id, quantity, value) 
-- VALUES ('yfkbAKUUDBKJBkjuu783hk8qy', 2, '0030078500', 89, 31229913.1);

SELECT * FROM cart;



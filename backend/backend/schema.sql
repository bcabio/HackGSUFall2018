DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
  transaction_id INTEGER UNIQUE PRIMARY KEY NOT NULL,
  customer_name TEXT NOT NULL,
  purchase_time TEXT NOT NULL
);

DROP TABLE IF EXISTS purchased_items;
CREATE TABLE purchased_items (
  transaction_id INTEGER NOT NULL,
  item_id TEXT NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);

DROP TABLE IF EXISTS prices;
CREATE TABLE prices (
  item_id TEXT UNIQUE PRIMARY KEY NOT NULL,
  price REAL NOT NULL
);
INSERT INTO prices (item_id, price) VALUES (123, 24);
INSERT INTO prices (item_id, price) VALUES (12345678, 532);
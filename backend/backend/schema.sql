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

DROP TABLE IF EXISTS aux_data;
CREATE TABLE aux_data (
  item_id TEXT UNIQUE PRIMARY KEY NOT NULL,
  price REAL NOT NULL,
  available_count INTEGER NOT NULL
);
INSERT INTO aux_data (item_id, price, available_count) VALUES (123, 24, 20);
INSERT INTO aux_data (item_id, price, available_count) VALUES (12345678, 532, 20);
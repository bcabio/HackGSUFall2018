DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
  id INTEGER UNIQUE PRIMARY KEY NOT NULL,
  customer_name TEXT NOT NULL,
  purchase_time TEXT NOT NULL
);

DROP TABLE IF EXISTS purchased_items;
CREATE TABLE purchased_items (
  id INTEGER UNIQUE PRIMARY KEY NOT NULL,
  transaction_id INTEGER NOT NULL,
  price REAL NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);
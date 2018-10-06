from datetime import datetime
import os
from typing import List, Dict

import attr
from flask import Flask, request, g, jsonify
import dateutil.parser
import sqlite3

from backend.json_encoding import MyJSONEncoder

app = Flask(__name__)
app.json_encoder = MyJSONEncoder
app.config.from_object(__name__)  # load config from this file, flaskr.py

# Load default config and override config from an environment variable
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'db.sqlite'),
    SECRET_KEY='Xgt0ahfZtg6RQjwwrjSRAeHCJReYN5JC6JCDLQEEspIavzZbDFETVEARGGgOFW3L',
    USERNAME='admin',
    PASSWORD='admin'
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)


def connect_db():
    """Connects to the specific database."""
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv


def get_db():
    """Opens a new database connection if there is none yet for the
    current application context.
    """
    if not hasattr(g, 'database'):
        g.database = connect_db()
    return g.database


@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'database'):
        g.database.close()


def init_db():
    db = get_db()
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()


@app.cli.command('initdb')
def initdb_command():
    """Initializes the database."""
    init_db()
    print('Initialized the database.')


@attr.s(frozen=True, auto_attribs=True)
class PurchasedItem:
    id: int
    name: str
    price: float


@attr.s(frozen=True, auto_attribs=True)
class Transaction:
    id: int
    customer_name: str
    purchase_time: datetime
    purchased_items: List[PurchasedItem] = attr.Factory(list)


@app.route('/transactions')
def get_transaction_list():
    db = get_db()
    cur = db.execute('SELECT * FROM transactions;')
    transactions: Dict[int, Transaction] = {}
    for transaction in cur.fetchall():
        transactions[transaction[0]] = Transaction(
            id=transaction[0],
            customer_name=transaction[1],
            purchase_time=dateutil.parser.parse(transaction[2]))

    cur = db.execute('SELECT * FROM purchased_items;')
    for trans_item in cur.fetchall():
        transactions[trans_item[1]].purchased_items.append(
            PurchasedItem(
                id=trans_item[0],
                price=trans_item[2],
                name=trans_item[3]
            ))

    transactions: List[Transaction] = sorted(transactions.values(),
                                             key=lambda trans: trans.purchase_time)

    return jsonify(transactions)


@app.route('/transaction', methods=['POST'])
def add_transaction():
    request.json

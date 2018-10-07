import time

import attr
import dateutil.parser
import json
import os
import pytz
import requests
import sqlite3
from datetime import datetime
from flask import Flask, request, g, jsonify
from typing import List, Dict

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
class CatalogEntry:
    id: str
    name: str
    description: str
    is_active: bool
    price: float
    available_count: int


@attr.s(frozen=True, auto_attribs=True)
class Transaction:
    id: int
    customer_name: str
    purchase_time: datetime
    purchased_items: List[CatalogEntry] = attr.Factory(list)


@app.route('/api/transactions', methods=['GET'])
def get_transaction_list():
    db = get_db()
    cur = db.execute('SELECT * FROM transactions;')
    transactions: Dict[int, Transaction] = {}
    for transaction in cur.fetchall():
        transactions[transaction[0]] = Transaction(
            id=transaction[0],
            customer_name=transaction[1],
            purchase_time=dateutil.parser.parse(transaction[2]))

    catalog = get_catalog()
    cur = db.execute('''
        SELECT
            purchased_items.item_id,
            purchased_items.transaction_id,
            aux_data.price
        FROM purchased_items, aux_data
        WHERE aux_data.item_id = purchased_items.item_id;''')
    for trans_item in cur.fetchall():
        transactions[trans_item[1]].purchased_items.append(catalog[trans_item[0]])

    transactions: List[Transaction] = sorted(transactions.values(),
                                             key=lambda trans: trans.purchase_time)

    return jsonify(transactions)


@app.route('/api/transaction', methods=['POST'])
def add_transaction():
    data = request.json
    db = get_db()
    cur = db.execute("""INSERT INTO transactions (customer_name, purchase_time)
                        VALUES (?, ?)""", (
        data['customer_name'], pytz.utc.localize(datetime.utcnow()).isoformat()))
    transaction_id = cur.lastrowid
    purchased_items = [(transaction_id, item_id)
                       for item_id in data['purchased_items']]
    catalog = get_catalog()
    for transaction_id, item_id in purchased_items:
        assert item_id in catalog
    db.executemany("""INSERT INTO purchased_items (transaction_id, item_id)
                      VALUES (?, ?)""", purchased_items)
    db.commit()

    return jsonify({'id': transaction_id})


GATEWAY_URL = 'https://gateway-staging.ncrcloud.com'


def request_session():
    session = requests.Session()
    session.auth = ('acct:hackgsu0@hackgsu0serviceuser', '8a0084a165d712fd0166471590190044')
    session.headers.update({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'nep-application-key': '8a0084a165d712fd0166471590190044',
    })
    return session


def get_catalog() -> Dict[str, CatalogEntry]:
    s = request_session()
    content = s.get(GATEWAY_URL + '/catalog/items?pageSize=10000').json()['pageContent']
    db = get_db()
    price_table = {str(item[0]): (item[1], item[2])
                   for item in db.execute('SELECT item_id, price, available_count FROM aux_data;').fetchall()}
    return {
        item['itemId']['itemCode']: CatalogEntry(
            id=item['itemId']['itemCode'],
            name=item['shortDescription']['value'],
            description=item['longDescription']['value'],
            is_active=item['status'] == 'ACTIVE',
            price=price_table[item['itemId']['itemCode']][0],
            available_count=price_table[item['itemId']['itemCode']][1]
        ) for item in content}


@app.route('/api/catalog', methods=['GET'])
def get_catalog_req():
    return jsonify(get_catalog())


def default_item(other_values):
    result = {
        'alternateCategories': [],
        'status': 'ACTIVE',
        'nonMerchandise': False,
        'version': time.time(),
        'merchandiseCategory': 'a',
        'departmentId': 'a',
    }
    result.update(other_values)
    return result


@app.route('/api/catalog', methods=['PUT'])
def add_item():
    """Takes a JSON {name: string, price: float, id: string, description: string}"""
    data = request.json

    description = data['description']
    name = data['name']
    price = data['price']
    item_id = data['id']
    available_count = data['available_count']
    db = get_db()
    res = request_session().put(
        GATEWAY_URL + '/catalog/items', data=json.dumps({"items": [default_item({
            "longDescription": {"values": [{"locale": "en-US", "value": description}]},
            "shortDescription": {"values": [{"locale": "en-US", "value": name}]},
            "itemId": {"itemCode": item_id},
        })]}))
    db.execute("""INSERT INTO aux_data (item_id, price, available_count)
                  VALUES (?, ?, ?)""", (item_id, price, available_count))
    if res.status_code == 200:
        db.commit()

    return res.text, res.status_code, {'Content-Type': 'application/json'}


@app.route('/api/catalog/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    """Takes a string id in the URL"""
    item_url = '{}/catalog/items/{}'.format(GATEWAY_URL, item_id)
    item_value = request_session().get(item_url).json()
    item_value.update({
        'status': 'INACTIVE',
        'version': time.time(),
    })
    for unneeded_field in ['itemId', 'auditTrail']:
        del item_value[unneeded_field]
    res = request_session().put(item_url, data=json.dumps(item_value))
    return res.text, res.status_code, {'Content-Type': 'application/json'}

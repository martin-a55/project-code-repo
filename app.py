from flask import Flask, request, jsonify, make_response, _request_ctx_stack
from bson import ObjectId
from flask_cors import CORS
import math
import qrcode
from azure.storage.blob import BlockBlobService
from azure.storage.blob.baseblobservice import BaseBlobService
from azure.storage.blob.models import BlobProperties

from pymongo import MongoClient
import os

import json
from functools import wraps
from jose import jwt
from urllib.request import urlopen


app = Flask(__name__)
CORS(app)

qr_url = "http://localhost:4200"

blob = BlockBlobService("projectqrstore", "sW3gcdD1a/JOkFYmdYhyV7tvPBCfOoW/laR0zLQJPH1vXTjHa5m/XWh6XLUUvXLv3FYq6oVKLcTbzoiILyYhHw==")
blobDelete = BaseBlobService("projectqrstore", "sW3gcdD1a/JOkFYmdYhyV7tvPBCfOoW/laR0zLQJPH1vXTjHa5m/XWh6XLUUvXLv3FYq6oVKLcTbzoiILyYhHw==")


client_connection_string = "mongodb://stockmongodb:RyuylNx9GESyqqV2j6aC0NHeWVJ5gdywQZEMwiomWF4MCXsqbqiOQNjuFamXny2GaYVOBj9znHRqBN0D9Ld3lg==@stockmongodb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@stockmongodb@"
client = MongoClient(client_connection_string)
stockDB = client["StockDatabase"]
stockCol = stockDB["StockCollection"]
detailsCol = stockDB["DetailsCollection"]

#Authorisation Code got from https://auth0.com/blog/using-python-flask-and-angular-to-build-modern-web-apps-part-2/
#Auth0 Code start
AUTH0_DOMAIN = 'dev-7zcg37ii.us.auth0.com'
ALGORITHMS = ['RS256']
API_AUDIENCE = 'https://project_api/'


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header
    """
    auth = request.headers.get('Authorization', None)
    if not auth:
        raise AuthError({
            'code': 'authorization_header_missing',
            'description': 'Authorization header is expected.'
        }, 401)

    parts = auth.split()

    if parts[0].lower() != 'bearer':
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must start with "Bearer".'
        }, 401)

    elif len(parts) == 1:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Token not found.'
        }, 401)

    elif len(parts) > 2:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must be bearer token.'
        }, 401)

    token = parts[1]
    return token


def requires_auth(f):
    """Determines if the Access Token is valid
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = urlopen(f'https://{AUTH0_DOMAIN}/.well-known/jwks.json')
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks['keys']:
            if key['kid'] == unverified_header['kid']:
                rsa_key = {
                    'kty': key['kty'],
                    'kid': key['kid'],
                    'use': key['use'],
                    'n': key['n'],
                    'e': key['e']
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer='https://' + AUTH0_DOMAIN + '/'
                )

            except jwt.ExpiredSignatureError:
                raise AuthError({
                    'code': 'token_expired',
                    'description': 'Token expired.'
                }, 401)

            except jwt.JWTClaimsError:
                raise AuthError({
                    'code': 'invalid_claims',
                    'description': 'Incorrect claims. Please, check the audience and issuer.'
                }, 401)
            except Exception:
                raise AuthError({
                    'code': 'invalid_header',
                    'description': 'Unable to parse authentication token.'
                }, 400)

            _request_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)

        raise AuthError({
            'code': 'invalid_header',
            'description': 'Unable to find the appropriate key.'
        }, 400)

    return decorated

@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response
#Auth0 code finsih

#API endpoint for getting all stock locations
@app.route("/api/v1.0/location", methods=["GET"])
@requires_auth
def get_all_stock_locations():
    all_stock_locations = []
    for location in stockCol.find():
        location['_id'] = str(location['_id'])
        for stock in location["stock"]:
            stock['_id'] = str(stock['_id'])
        all_stock_locations.append(location)
    return make_response( jsonify(all_stock_locations), 200 )

#API endpoint for getting one stock location
@app.route("/api/v1.0/location/<string:id>", methods=["GET"])
@requires_auth
def get_one_stock_location(id):

    location = stockCol.find_one({'_id': ObjectId(id)})
    if location is not None:
        location['_id'] = str(location['_id'])
        for stock in location["stock"]:
            stock['_id'] = str(stock['_id'])

        return make_response(jsonify(location), 200)
    else:
        return make_response(jsonify( {"error": "Invalid Stock Location ID, check your location exists and try again"}), 404)

#API endpoint for getting adding a new stock location
@app.route("/api/v1.0/location", methods=["POST"])
@requires_auth
def add_location():
    if "location" in request.form and  "rack_row" in request.form and "rack_column" in request.form and "stock_rack" in request.form and "warehouse" in request.form:

        new_location = { "location" : request.form["location"],
                        "rack_row" : request.form["rack_row"],
                        "rack_column": request.form["rack_column"],
                        "stock_rack": request.form["stock_rack"],
                        "warehouse" : request.form["warehouse"],
                        "stock" : []
                         }
        new_location_id = stockCol.insert_one(new_location)
        new_id = str(new_location_id.inserted_id)

        qr_path = create_qr(new_id)

        blob.create_blob_from_path("qrimagestore", new_id + ".png", qr_path)


        new_location_link = "http://localhost:5000/api/v1.0/location/" + new_id
        new_qr_link = "https://projectqrstore.blob.core.windows.net/qrimagestore/" + new_id + ".png"

        os.remove(new_id + ".png")

        respone = []
        respone.append({ "url" : new_location_link})
        respone.append({ "qr" : new_qr_link})
        return make_response( jsonify( respone ), 201)
    else:
        return make_response( jsonify( {"error":"Missing form data"} ), 404)

#API endpoint for editing a stock location
@app.route("/api/v1.0/location/<string:id>", methods=["PUT"])
@requires_auth
def edit_location(id):
    if "location" in request.form and  "rack_row" in request.form and "rack_column" in request.form and "stock_rack" in request.form and "warehouse" in request.form:
        update_location = stockCol.update_one( { "_id" : ObjectId(id) },
                                        { "$set" : {
                                            "location" : request.form["location"],
                                            "rack_row" : request.form["rack_row"],
                                            "rack_column": request.form["rack_column"],
                                            "stock_rack": request.form["stock_rack"],
                                            "warehouse" : request.form["warehouse"],
                                                } } )
        if update_location.matched_count == 1:
            edited_location_link = "http://localhost:5000/api/v1.0/location/" + id
            return make_response( jsonify( { "url":edited_location_link } ), 200)
        else:
            return make_response( jsonify( { "error": "Invalid Stock Location ID, check your location exists and try again" } ), 404)
    else:
        return make_response( jsonify( { "error" : "Missing form data" } ), 404)

@app.route("/api/v1.0/location/<string:id>", methods=["DELETE"])
@requires_auth
def delete_location(id):

    result = stockCol.delete_one( { "_id" : ObjectId(id) } )
    if result.deleted_count == 1:
        blobDelete.delete_blob("qrimagestore", id + ".png")
        return make_response( jsonify( {} ), 204)
    else:
        return make_response( jsonify( {"error": "Invalid Stock Location ID, check your location exists and try again"} ), 404)

@app.route("/api/v1.0/location/<string:id>/stock", methods=["POST"])
@requires_auth
def add_new_stock(id):
    if "details" in request.form and "quantity" in request.form:
        new_stock = { "_id" : ObjectId(), "details" : request.form["details"], "quantity" : request.form["quantity"] }
        stockCol.update_one( { "_id" : ObjectId(id) }, { "$push": { "stock" : new_stock } } )
        new_stock_link = "http://localhost:5000/api/v1.0/location/" + id + "/" + str(new_stock['_id'])
        return make_response( jsonify( { "url" : new_stock_link } ), 201 )
    else:
        return make_response( jsonify( {"error":"Missing form data"} ), 404)

@app.route("/api/v1.0/location/<string:id>/stock", methods=["GET"])
@requires_auth
def get_all_stock(id):
    stock_at_location = []
    location = stockCol.find_one( { "_id" : ObjectId(id) }, { "stock" : 1, "_id" : 0 } )
    if location is not None:
        for stock in location["stock"]:
            details = detailsCol.find_one({'_id': ObjectId(stock['details'])})
            new_stock = {
                "_id": str(stock["_id"]),
                "details": stock['details'],
                "name": details['name'],
                "quantity": stock['quantity'],
                "desc": details['desc']
            }
            stock_at_location.append(new_stock)
        return make_response( jsonify( stock_at_location ), 200 )
    else:
        return make_response(jsonify( { "error": "Invalid Stock Location ID, check your location exists and try again" }), 404)

@app.route("/api/v1.0/location/<lid>/stock/<sid>", methods=["GET"])
@requires_auth
def get_stock(lid, sid):
    location = stockCol.find_one( {"stock._id": ObjectId(sid)}, {"_id": 0, "stock": 1})
    if location is None:
        return make_response( jsonify( { "error": "Invalid Stock Location or Stock ID, check your location and stock exist and try again" } ),404)
    for stock in location['stock']:
        stock['_id'] = str(stock['_id'])
        if stock['_id'] == str(sid):
            details = detailsCol.find_one({'_id': ObjectId(stock['details'])})
            new_stock = {
                        "_id" : lid,
                        "details" : stock['details'],
                        "name": details['name'],
                        "quantity": stock['quantity'],
                        "desc": details['desc']
                        }
            return make_response( jsonify( new_stock ), 200)

@app.route("/api/v1.0/location/<lid>/stock/<sid>", methods=["PUT"])
@requires_auth
def edit_stock(lid, sid):
    if "details" in request.form and "quantity" in request.form:
        edited_stock = {"stock.$.details" : request.form["details"], "stock.$.quantity" : request.form["quantity"]}
        result = stockCol.update_one( { "stock._id" : ObjectId(sid) }, { "$set" : edited_stock } )
        edit_comment_url = "http://localhost:5000/api/v1.0/location/" + lid + "/stock/" + lid
        if result.matched_count == 1:
            return make_response( jsonify( {"url":edit_comment_url} ), 200)
        else:
            return make_response(jsonify({ "error": "Invalid Stock Location or Stock ID, check your location and stock exist and try again" }), 404)
    return make_response(jsonify({"error": "Missing form data"}), 404)

@app.route("/api/v1.0/location/<lid>/stock/<sid>", \
 methods=["DELETE"])
@requires_auth
def delete_stock(lid, sid):
    to_delete = stockCol.update_one( { "_id" : ObjectId(lid) }, { "$pull" : { "stock" : { "_id" : ObjectId(sid) } } } )
    if to_delete.matched_count == 1:
        return make_response(jsonify({}), 204)
    else:
        return make_response(jsonify({ "error": "Invalid Stock Location or Stock ID, check your location and stock exist and try again" }), 404)

@app.route("/api/v1.0/details", methods=["GET"])
@requires_auth
def get_all_stock_details():
    all_stock_details = []
    for stock_details in detailsCol.find():
        stock_details['_id'] = str(stock_details['_id'])
        all_stock_details.append(stock_details)
    return make_response( jsonify(all_stock_details), 200 )

@app.route("/api/v1.0/details/<string:id>", methods=["GET"])
@requires_auth
def get_one_stock_details(id):
    details = detailsCol.find_one({'_id': ObjectId(id)})
    if details is not None:
        details['_id'] = str(details['_id'])
        return make_response(jsonify(details), 200)
    else:
        return make_response(jsonify( {"error": "Invalid Stock Detail ID, check your details exists and try again"}), 404)

@app.route("/api/v1.0/details", methods=["POST"])
@requires_auth
def add_details():
    if "name" in request.form and "desc" in request.form and "reorder" in request.form and "img" in request.files:

        new_details = { "name" : request.form["name"],
                        "desc" : request.form["desc"],
                        "reorder": request.form["reorder"],
                         }
        new_details_id = detailsCol.insert_one(new_details)
        new_id = str(new_details_id.inserted_id)

        qr_path = create_qr(new_id)

        blob.create_blob_from_path("qrimagestore", new_id + ".png", qr_path)



        if "image/" in request.files["img"].content_type:
            blob.create_blob_from_stream("stockimagestore", new_id + ".png", request.files["img"])
        else:
            blob.create_blob_from_path("stockimagestore", new_id + ".png", "./placeholder.png")

        new_location_link = "http://localhost:5000/api/v1.0/details/" + new_id
        new_qr_link = "https://projectqrstore.blob.core.windows.net/qrimagestore/" + new_id + ".png"
        new_img_link = "https://projectqrstore.blob.core.windows.net/stockimagestore/" + new_id + ".png"

        os.remove(new_id + ".png")

        respone = []
        respone.append({ "url" : new_location_link})
        respone.append({ "qr" : new_qr_link})
        respone.append({ "img" : new_img_link})
        return make_response( jsonify( respone ), 201)
    else:
        return make_response( jsonify( {"error":"Missing form data"} ), 404)

@app.route("/api/v1.0/details/<string:id>", methods=["PUT"])
@requires_auth
def edit_details(id):
    if "name" in request.form and "desc" in request.form and "reorder" in request.form and "img" in request.files:
        update_details = detailsCol.update_one( { "_id" : ObjectId(id) },
                                        { "$set" : { "name" : request.form["name"],
                                                    "desc" : request.form["desc"],
                                                    "reorder": request.form["reorder"],
                                        } } )
        if update_details.matched_count == 1:
            if "image/" in request.files["img"].content_type:
                blob.create_blob_from_stream("stockimagestore", id + ".png", request.files["img"])
            edited_details_link = "http://localhost:5000/api/v1.0/details/" + id
            return make_response( jsonify( { "url":edited_details_link } ), 200)
        else:
            return make_response( jsonify( { "error": "Invalid Stock Details ID, check your Details exists and try again" } ), 404)
    else:
        return make_response( jsonify( { "error" : "Missing form data" } ), 404)

@app.route("/api/v1.0/details/<string:id>", methods=["DELETE"])
@requires_auth
def delete_details(id):
    result = detailsCol.delete_one( { "_id" : ObjectId(id) } )
    if result.deleted_count == 1:
        blobDelete.delete_blob("qrimagestore", id + ".png")
        blobDelete.delete_blob("stockimagestore", id + ".png")
        for location in stockCol.find():
            location['_id'] = str(location['_id'])
            for stock in location["stock"]:
                if stock["details"] == id:
                    stock['_id'] = str(stock['_id'])
                    stockCol.update_one( { "_id" : ObjectId(location['_id']) }, { "$pull" : { "stock" : { "details" : id  } } } )
        return make_response( jsonify( {} ), 204)
    else:
        return make_response( jsonify( {"error": "Invalid Stock Details ID, check your location exists and try again"} ), 404)

@app.route("/api/v1.0/details/<string:id>/stock", methods=["GET"])
@requires_auth
def get_all_stock_by_details(id):
    all_stock_details = []
    for location in stockCol.find():
        location['_id'] = str(location['_id'])
        for stock in location["stock"]:
            if stock["details"] == id:
                stock['_id'] = str(stock['_id'])
                new_stock = {
                        "_id" : stock['_id'],
                        "details" : stock['details'],
                        "location" : location['_id'],
                        "quantity": stock['quantity']
                        }

                all_stock_details.append(new_stock)
    return make_response( jsonify(all_stock_details), 200 )

@app.route("/api/v1.0/stock/search", methods=["GET"])
def search_stock():
    field, value = "", "";

    col = stockCol;

    if request.args.get('field'):
        field = str(request.args.get('field'))
    if request.args.get('val'):
        value = str(request.args.get('val'))

    data_to_return = []
    if field == 'all':
        for location in stockCol.find({"$or": [
            {'location': {"$regex": value}},
            {'warehouse': {"$regex": value}},
            {'stock_rack': {"$regex": value}},
            {'rack_row': {"$regex": value}},
            {'rack_column': {"$regex": value}}
        ]}):
            for stock in location['stock']:
                stock['_id'] = str(stock['_id'])
            new_location = {"_id": str(location['_id']),
                            "location": location["location"],
                            "rack_row": location["rack_row"],
                            "rack_column": location["rack_column"],
                            "stock_rack": location["stock_rack"],
                            "warehouse": location["warehouse"],
                            "stock": location["stock"],
                            "type": "location"
                            }
            data_to_return.append(new_location)

        for details in detailsCol.find({"$or": [
            {'name': {"$regex": value}},
            {'desc': {"$regex": value}},
            {'reorder': {"$regex": value}}
        ]}):
            new_details = { "_id":  str(details['_id']),
                            "name":  details["name"],
                           "desc":  details["desc"],
                           "reorder":  details["reorder"],
                           "type": "details"
                           }
            data_to_return.append(new_details)
        return make_response(jsonify(data_to_return), 200)
    elif field == "location" or field == "warehouse" or field == "rack" or field == "row" or field == "column":
        for location in stockCol.find({field: {"$regex": value}}):
            location['_id'] = str(location['_id'])
            for stock in location['stock']:
                stock['_id'] = str(stock['_id'])
            new_location = {"_id": str(location['_id']),
                            "location": location["location"],
                            "rack_row": location["rack_row"],
                            "rack_column": location["rack_column"],
                            "stock_rack": location["stock_rack"],
                            "warehouse": location["warehouse"],
                            "stock": location["stock"],
                            "type": "location"
                            }
            data_to_return.append(new_location)
        return make_response(jsonify(data_to_return), 200)
    elif field == "name" or field == "desc" or field == "reorder":
        for details in detailsCol.find({field: {"$regex": value}}):
            new_details = {"_id": str(details['_id']),
                           "name": details["name"],
                           "desc": details["desc"],
                           "reorder": details["reorder"],
                           "type": "details"
                           }
            data_to_return.append(new_details)
        return make_response(jsonify(data_to_return), 200)
    else:
        return make_response(jsonify({"error": "Invalid field value"}), 404)


def create_qr(id):
    input_data = qr_url + "/location/" + id
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(input_data)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')
    image_name = id + ".png"
    img.save(image_name)
    return "./" + image_name

if __name__ == "__main__":
    app.run(debug=True)


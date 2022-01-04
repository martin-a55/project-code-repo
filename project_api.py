from flask import Flask, request, jsonify, make_response
from bson import ObjectId
from flask_cors import CORS
import math
import qrcode
from azure.storage.blob import BlockBlobService
from azure.storage.blob.baseblobservice import BaseBlobService
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

blob = BlockBlobService("projectqrstore", "sW3gcdD1a/JOkFYmdYhyV7tvPBCfOoW/laR0zLQJPH1vXTjHa5m/XWh6XLUUvXLv3FYq6oVKLcTbzoiILyYhHw==")
blobDelete = BaseBlobService("projectqrstore", "sW3gcdD1a/JOkFYmdYhyV7tvPBCfOoW/laR0zLQJPH1vXTjHa5m/XWh6XLUUvXLv3FYq6oVKLcTbzoiILyYhHw==")

client_connection_string = "mongodb://stockmongodb:RyuylNx9GESyqqV2j6aC0NHeWVJ5gdywQZEMwiomWF4MCXsqbqiOQNjuFamXny2GaYVOBj9znHRqBN0D9Ld3lg==@stockmongodb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@stockmongodb@"
client = MongoClient(client_connection_string)
stockDB = client["StockDatabase"]
stockCol = stockDB["StockCollection"]

@app.route("/api/v1.0/location", methods=["GET"])
def get_all_stock_locations():
    all_stock_locations = []
    for location in stockCol.find():
        location['_id'] = str(location['_id'])
        for stock in location["stock"]:
            stock['_id'] = str(stock['_id'])
        all_stock_locations.append(location)
    return make_response( jsonify(all_stock_locations), 200 )

@app.route("/api/v1.0/location/<string:id>", methods=["GET"])
def get_one_stock_location(id):

    location = stockCol.find_one({'_id': ObjectId(id)})
    if location is not None:
        location['_id'] = str(location['_id'])
        for stock in location["stock"]:
            stock['_id'] = str(stock['_id'])

        return make_response(jsonify(location), 200)
    else:
        return make_response(jsonify( {"error": "Invalid Stock Location ID, check your location exists and try again"}), 404)

@app.route("/api/v1.0/location", methods=["POST"])
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


@app.route("/api/v1.0/location/<string:id>", methods=["PUT"])
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
def delete_location(id):

    result = stockCol.delete_one( { "_id" : ObjectId(id) } )
    if result.deleted_count == 1:
        blobDelete.delete_blob("qrimagestore", id + ".png")
        return make_response( jsonify( {} ), 204)
    else:
        return make_response( jsonify( {"error": "Invalid Stock Location ID, check your location exists and try again"} ), 404)

@app.route("/api/v1.0/location/<string:id>/stock", methods=["POST"])
def add_new_stock(id):
    if "name" in request.form and "quantity" in request.form and "desc" in request.form:
        new_stock = {"_id" : ObjectId(), "name" : request.form["name"], "quantity" : request.form["quantity"], "desc" : request.form["quantity"] }
        stockCol.update_one( { "_id" : ObjectId(id) }, { "$push": { "stock" : new_stock } } )
        new_stock_link = "http://localhost:5000/api/v1.0/location/" + id + "/" + str(new_stock['_id'])
        return make_response( jsonify( { "url" : new_stock_link } ), 201 )
    else:
        return make_response( jsonify( {"error":"Missing form data"} ), 404)

@app.route("/api/v1.0/location/<string:id>/stock", methods=["GET"])
def get_all_stock(id):
    stock_at_location = []
    location = stockCol.find_one( { "_id" : ObjectId(id) }, { "stock" : 1, "_id" : 0 } )
    if location is not None:
        for stock in location["stock"]:
            stock["_id"] = str(stock["_id"])
            stock_at_location.append(stock)
        return make_response( jsonify( stock_at_location ), 200 )
    else:
        return make_response(jsonify( { "error": "Invalid Stock Location ID, check your location exists and try again" }), 404)

@app.route("/api/v1.0/location/<lid>/stock/<sid>", methods=["GET"])
def get_stock(lid, sid):
    location = stockCol.find_one( {"stock._id": ObjectId(sid)}, {"_id": 0, "stock": 1})
    if location is None:
        return make_response( jsonify( { "error": "Invalid Stock Location or Stock ID, check your location and stock exist and try again" } ),404)
    for stock in location['stock']:
        stock['_id'] = str(stock['_id'])
        if stock['_id'] == str(sid):
            return make_response( jsonify( stock ), 200)

@app.route("/api/v1.0/location/<lid>/stock/<sid>", methods=["PUT"])
def edit_stock(lid, sid):
    if "name" in request.form and "quantity" in request.form and "desc" in request.form:
        edited_stock = {"stock.$.name" : request.form["name"],"stock.$.quantity" : request.form["quantity"], "stock.$.desc" : request.form["desc"],}
        result = stockCol.update_one( { "stock._id" : ObjectId(sid) }, { "$set" : edited_stock } )
        edit_comment_url = "http://localhost:5000/api/v1.0/location/" + lid + "/stock/" + lid
        if result.matched_count == 1:
            return make_response( jsonify( {"url":edit_comment_url} ), 200)
        else:
            return make_response(jsonify({ "error": "Invalid Stock Location or Stock ID, check your location and stock exist and try again" }), 404)
    return make_response(jsonify({"error": "Missing form data"}), 404)

@app.route("/api/v1.0/location/<lid>/stock/<sid>", \
 methods=["DELETE"])
def delete_stock(lid, sid):
    to_delete = stockCol.update_one( { "_id" : ObjectId(lid) }, { "$pull" : { "stock" : { "_id" : ObjectId(sid) } } } )
    if to_delete.matched_count == 1:
        return make_response(jsonify({}), 204)
    else:
        return make_response(jsonify({ "error": "Invalid Stock Location or Stock ID, check your location and stock exist and try again" }), 404)


def create_qr(id):
    input_data = "http://localhost:4200/location/" + id
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(input_data)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')
    image_name = id + ".png"
    img.save(image_name)
    return "./" + image_name



if __name__ == "__main__":
    app.run(debug=True)


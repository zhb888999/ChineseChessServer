from flask import Flask
from flask import request, render_template, make_response
from manager import Manager
from user import User
import json

manager = Manager()
# manager.add_player(123)
# manager.add_player(456)
# manager.add_player(789)
# manager.add_player(14)
# manager.add_player(999)
app = Flask(__name__)

@app.route("/", methods=['GET'])
def index():
    id = request.cookies.get("ID")
    name = request.cookies.get("Name")
    set_cookie = False
    if id is None:
        user = User()
        id, name = user()
        set_cookie = True
    resp = make_response(render_template("login.html", userId=id, userName = name))
    if set_cookie:
        resp.set_cookie("ID", str(id))
        resp.set_cookie("Name", name)
    return resp

@app.route("/play", methods=["GET"])
def play():
    id = request.cookies.get("ID")
    if id is None:
        return '', 400
    res = manager.add_player(int(id))
    if res:
        return res, 200
    return '', 400

@app.route("/start", methods=["GET"])
def start():
    id = request.cookies.get("ID")
    if id is None:
        return '', 400
    if manager.start(int(id)):
        return 'ready', 200
    return 'not ready', 400
    

@app.route("/getmessage", methods=["GET"])
def get_message():
    id = request.cookies.get("ID")
    if id is None:
        return '', 400
    resp = manager.get_message(int(id))
    if resp:
        return resp, 200
    return '', 400

@app.route("/addmessage", methods=["POST"])
def add_message():
    id = request.cookies.get("ID")
    if id is None:
        return '', 400
    gameover = request.form['gameover']
    message = request.form['message']
    if manager.add_message(int(id), {'gameover': gameover, 'message': message}):
        return '', 200
    return '', 400

@app.route("/houses", methods=["GET"])
def get_houses():
    id = request.cookies.get("ID")
    if id is None:
        return '', 400
    return manager.get_houses(), 200

@app.route("/quickstart", methods=['GET'])
def quick_start():
    id = request.cookies.get("ID")
    if id is None:
        return '', 400
    return render_template('chess.html', jsName='static/quickstart.js'), 200

@app.route("/offline", methods=["GET"])
def offline():
    return render_template('chess.html', jsName='static/offline.js'), 200


@app.route("/createhouse", methods=["GET"])
def create_house():
    id = request.cookies.get("ID")
    if id is None:
        return '', 400
    return render_template('chess.html', jsName='static/createhouse.js'), 200

@app.route("/gethouse", methods=["GET"])
def get_house():
    id = request.cookies.get("ID")
    if id is None:
        return '', 400
    res = manager.get_house(int(id))
    if res:
        return res, 200
    return '', 400

@app.route("/joinhouse", methods=["GET"])
def join_house():
    id = request.cookies.get("ID")
    if id is None:
        return '', 400
    house_id = request.args.get('houseId')
    if house_id:
        if manager.join_house(int(id), int(house_id)):
            return render_template('chess.html', jsName='static/joinhouse.js'), 200
    return '', 400
    
@app.route("/viewplay", methods=["GET"])
def view_play():
    id = request.cookies.get("ID")
    if id is None:
        return '', 400
    house_id = request.args.get('houseId')
    if house_id:
        if manager.view_play(int(id), int(house_id)):
            return render_template('chess.html', jsName='static/viewplay.js'), 200
    return '', 400

@app.route("/gethouserhistory", methods=["GET"])
def get_house_history():
    id = request.cookies.get("ID")
    if id is None:
        return '', 400
    return manager.get_house_history(int(id))

if __name__ == "__main__":
    app.run('0.0.0.0',80)
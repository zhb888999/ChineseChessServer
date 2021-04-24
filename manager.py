import json


class Manager:

    def __init__(self):
        self.houses = []
        self.houses_limit = 100
        self.user_house = {}
        self.viewer_house = {}
        self.users = []
        self.viewers = []
        self.history_houses = []
    
    def create_house(self):
        if len(self.houses) == self.houses_limit:
            return None
        house = House(len(self.houses))
        self.houses.append(house)
        return house
        
    def add_player(self, user_id):
        if user_id in self.users:
            return False
        for house in self.houses:
            res = house.add_player(user_id)
            self.user_house[user_id] = house
            self.users.append(user_id)
            if res:
                return res
        return self.get_house(user_id)
    
    def quit(self, user_id):
        if user_id not in self.users:
            return
        self.users.remove(user_id)
        house = self.user_house[user_id]
        self.houses.remove(house)
        house.quit(user_id)
        if house not in self.history_houses:
            self.history_houses.append(house)
        del self.user_house[user_id]
    
    def get_message(self, user_id):
        if user_id not in self.users:
            return False
        resp = {'play_exit':None , 'play_message': None, 'message':None}
        result = self.user_house[user_id].get_message(user_id)
        if result:
            play_exit, play_message, message = result
            resp['play_exit'] = 1 if play_exit else 0
            resp['play_message'] = 1 if play_message else 0
            resp['message'] = message
            return json.dumps(resp)

    def add_message(self, user_id, message):
        if user_id not in self.users:
            return False
        return self.user_house[user_id].add_message(user_id, message)
    
    def start(self, user_id):
        if user_id not in self.users:
            return False
        return self.user_house[user_id].is_start(user_id)

    def get_houses(self):
        res = {}
        for i, h in enumerate(self.houses, start=1):
            res[i] = {'imageURL':'static/test.jpg', 'houseId': h.id+1, 'redId': h.red, 'blackId': h.black, 'viewerNum': len(h.viewer), 'viewerLimit': h.viewer_limit}
        return json.dumps(res)
    
    def get_user_color(self, user_id):
        if user_id not in self.users:
            return ''
        return self.user_house[user_id].house.get_user_color(user_id)
    
    def get_house(self, user_id):
        house = self.create_house()
        if house:
            res = house.add_player(user_id)
            self.user_house[user_id] = house
            self.users.append(user_id)
            if res:
                return res
            return False
        return False

    def join_house(self, user_id, house_id):
        if house_id > len(self.houses):
            return False
        house = self.houses[house_id - 1]
        if house.add_player(user_id) == 'b':
            self.user_house[user_id] = house
            self.users.append(user_id)
            return True
        return False
    
    def view_play(self, user_id, house_id):
        if house_id > len(self.houses):
            return False
        house = self.houses[house_id - 1]
        if house.add_viewer(user_id):
            self.viewer_house[user_id] = house
            self.viewers.append(user_id)
            return True

    def get_house_history(self, user_id):
        if user_id not in self.viewers:
            return {}
        return self.viewer_house[user_id].get_history(user_id);

class House:
    def __init__(self, house_id):
        self.id = house_id
        self.black = None
        self.red = None
        self.viewer = []
        self.viewer_limit = 100
        self.current_red_black = 'r'
        self.start = False
        self.gameover = False
        self.red_message = []
        self.black_message = []
        self.history = []
        self.player_quit = []

    def add_player(self, user_id):
        if self.red == user_id or self.black == user_id:
            return False
        if self.red is None:
            self.red = user_id
            return 'r'
        if self.black is None:
            self.black = user_id
            self.start = True
            return 'b'
        return False
    
    def add_viewer(self, user_id):
        if user_id in self.viewer:
            return True
        if len(self.viewer) == self.viewer_limit:
            return False
        self.viewer.append(user_id)
        return True
    
    def add_message(self, user_id, message):
        if self.gameover or self.player_quit:
            return False
        if user_id == self.red:
            self.black_message.insert(0, message['message'])
        if user_id == self.black:
            self.red_message.insert(0, message['message'])
        self.history.append(message['message'])
        if message['gameover'] == 'true': 
            self.gameover = True
        return True
    
    def get_message(self, user_id):
        message = -1
        player_exit = True if self.player_quit else False
        player_message = True
        if user_id == self.red:
            if len(self.red_message):
                message = self.red_message.pop()
            return player_exit, player_message, message
        if user_id == self.black:
            if len(self.black_message):
                message = self.black_message.pop()
            return player_exit, player_message, message
        if user_id in self.viewer:
            player_message = False
            return player_exit, player_message, json.dumps(self.history)
        return False
    
    def is_start(self, user_id):
        if user_id != self.red and user_id != self.black:
            return False
        return self.start

    
    def quit(self, user_id):
        if user_id == self.red:
            self.player_quit.append(self.red)
            return 
        if user_id == self.black:
            self.player_quit.append(self.black)
            return 
        if user_id in self.viewer:
            self.viewer.remove(user_id)
            return 
    
    def get_user_color(self, user_id):
        if user_id == self.red:
            return '红'
        if user_id == self.black:
            return '黑'
        return ''
    
    def get_history(self, user_id):
        if user_id not in self.viewer:
            return {}
        history = {}
        history['gameover'] = 1 if self.gameover else 0
        history['play_exit'] = 1 if self.player_quit else 0
        history['history'] = self.history
        return json.dumps(history)
        
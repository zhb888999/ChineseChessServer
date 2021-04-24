import random

random_name = ['简单猫猫', '鼻涕虫', '肥宅猫', '会飞的鱼', '春天里的一朵花', '牛粪被鲜花插了', '奥特曼的小乖兽', '大灰狼爱小兔子', '毛毛虫']
id = []

def create_id():
    while True:
        new_id = random.randint(0, 1000000)
        if new_id not in id:
            id.append(new_id)
            return new_id


class User:
    def __init__(self):
        self.name = random.sample(random_name, 1)[0]
        self.id = create_id()
    def __call__(self):
        return self.id, self.name   

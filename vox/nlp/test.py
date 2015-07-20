import json
# import colander
# from pprint import pprint

# with open('dataJuly9.json') as data_file:    
#     data = json.load(data_file)

# pprint(data.headline[1])
{
    "type": "story",
    "headline": "NASA's New Horizons mission to Pluto, explained",
    "adate": "\n  Joseph Stromberg\n  July 9, 2015, 12:00 p.m. ET\n  \n\n",
    "author": "Joseph Stromberg",
    "content": "11 things to know about the historic journey.",
    "link": "http://www.vox.com/2015/7/9/8921713/pluto-mission-new-horizons-nasa-flyby"
  },

class User(object):
    def __init__(self, type,headline,adate, username):
        self.name = name
        self.username = username

import json
def object_decoder(obj):
    if '__type__' in obj and obj['__type__'] == 'User':
        return User(obj['name'], obj['username'])
    return obj

json.loads('{"__type__": "User", "name": "John Smith", "username": "jsmith"}', object_hook=object_decoder)

print type(User)
>>>> <class '__restricted__.User'>
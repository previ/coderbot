"""
"""

from flask import jsonify
import json
from coderbot import CoderBot
from program import ProgramEngine, Program
from config import Config
import connexion
import time
import sqlite3
from tinydb import TinyDB, Query
from tinydb.operations import delete
import os

bot_config = Config.get()
bot = CoderBot.get_instance(
    servo=(bot_config.get("move_motor_mode") == "servo"),
    motor_trim_factor=float(bot_config.get("move_motor_trim", 1.0)),
)

prog = None
prog_engine = ProgramEngine.get_instance()

programs = TinyDB("data/programs.json")
activities = TinyDB("data/activities.json")


def stop():
    bot.stop()
    return 200


def move(data):
    print(data)
    bot.move(speed=data["speed"], elapse=data["elapse"])
    return 200


def turn(data):
    print(data)
    bot.turn(speed=data["speed"], elapse=data["elapse"])
    return 200


# Bot status (STUB)
def status():
    return {
        "status": "ok",
        "internetConnectivity": True,
        "temp": "40",
        "uptime": "5h",
        "status": "ok",
        "internetConnectivity": True,
        "temp": "40",
        "uptime": "5h",
    }


# Hardware and software information (STUB)
def info():
    return {
        "model": 1,
        "serial": 2,
        "cbVersion": 3,
        "backendVersion": 4,
        "vueVersion": 5,
        "kernel": 6,
    }


def exec(data):
    prog = prog_engine.create(data["name"], data["code"])
    return json.dumps(prog.execute())


def restoreSettings():
    with open("defaultConfig.json") as f:
        Config.write(json.loads(f.read()))
    bot_config = Config.get()
    return "ok"


## Programs


def saveProgram(data):
    if programs.search(query.name == data["name"]) == []:
        programs.insert(data)
        return 200
    else:
        if programs.search((query.name == data["name"]) & (query.default == "True")):
            return "defaultOverwrite", 400
        else:
            programs.update(data, query.name == data["name"])
            return 200


def loadProgram(name):
    return programs.search(query.name == name)[0], 200


def deleteProgram(data):
    programs.remove(query.name == data["name"]), 200


def listPrograms():
    return programs.all()


# Delete everything but the defaults programs
def resetDefaultPrograms():
    programs.purge()
    for filename in os.listdir("data"):
        if filename.endswith(".data"):
            with open("data/" + filename) as p:
                q = p.read()
                programs.insert(json.loads(q))

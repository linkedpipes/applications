import os
from threading import Thread
import subprocess
from slackclient import SlackClient
from flask import Flask
from flask import request
from flask import jsonify 
import requests

app = Flask(__name__)


slack_token = "xoxp-366117520291-367109331318-558263684080-0b852271b3f5611a77e8d3824d0816c0"
sc = SlackClient(slack_token)

def deploy(x):
    print("running deployment...")
    process = subprocess.call(["/bin/bash", "home/project/deploy/deploy.sh"])
    sc.api_call("chat.postMessage", channel="CGGD5F3FY", text="The deployent has been completed!")


@app.route('/webhooks/lpa', methods=["POST"])
def listen_webhook():
    data = request.get_json()
    branch = data["pull_request"]["base"]["ref"]
    action = data["action"]
    merged = data["pull_request"]["merged"]
    if branch and "master" in branch and action == "closed" and merged:
        #Spawn thread to process the data
        sc.api_call("chat.postMessage", channel="CGGD5F3FY", text="A deployment to https://applications.linkedpipes.com has started...")
        t = Thread(target=deploy, args=(data,))
        t.start()
        return jsonify({"message": "deployment will be made"}), 200
    return jsonify({"message": "No deployment made."}), 200

if __name__ == '__main__':
      app.run(host='0.0.0.0', port=8085)

from flask import Flask, json
from watcher_getL2Transactions import watcher_getL2Transactions
api = Flask(__name__)

@api.route('/get.l2.transactions', methods=['POST'])
def watcher_getL2Transactions(event, context):
  return watcher_getL2Transactions(event, context)

if __name__ == '__main__':
    from waitress import serve
    api.run(host="127.0.0.1", port="8013")
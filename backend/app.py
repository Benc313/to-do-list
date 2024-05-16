# Filename - server.py
 
# Import flask and datetime module for showing date and time
from flask import Flask, jsonify, request
import datetime
import sqlite3


x = datetime.datetime.now()

DATABASE = 'todo.db'

# Initializing flask app
app = Flask(__name__)
 
def get_db_connection(): #Connect to db.
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def get_db(): #Read Everything in DB and return in JSON
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM ToDos")
    todos = c.fetchall()
    conn.close()
    return jsonify([{'id': todo[0], 'name': todo[1]} for todo in todos])

def addTo_db(msg): #Inserts msg into the db
    conn = get_db_connection()
    print('Connected')
    conn.execute('INSERT INTO ToDos (what) VALUES(?);', (msg,))
    print('Inserted')
    conn.commit() 
    conn.close()
 
@app.route('/getToDos')
def getToDos():
    return get_db()
 
@app.route('/addToDo', methods=['POST'])
def add_todo_item():
    todo_text = request.get_json()['text']
    print(todo_text)
    addTo_db(todo_text)
    return jsonify({'message': 'Todo item added successfully'})

@app.route('/deleteToDo/<int:todo_id>', methods=['DELETE'])
def delete_todo_item(todo_id):
    print(todo_id)
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM ToDos WHERE id='?';", (todo_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Todo item deleted successfully'})


# Running app
if __name__ == '__main__':
    app.run(debug=True)
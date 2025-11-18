from flask import Flask, request, jsonify
from flask_cors import CORS 
import pyodbc

# --- Configurare Flask și CORS ---
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

CONNECTION_STRING = (
    r'DRIVER={ODBC Driver 18 for SQL Server};'
    r'SERVER=DESKTOP-HP4VQC6\SQLEXPRESS;'
    r'DATABASE=Stand-Up-Database;'
    r'Trusted_Connection=yes;'
    r'TrustServerCertificate=yes'
)

def get_db_connection():
    """Funcție helper pentru a stabili conexiunea la SQL Server."""
    try:
        cnxn = pyodbc.connect(CONNECTION_STRING)
        return cnxn
    except pyodbc.Error as ex:
        print(f"Eroare SQL la conectare: {ex}")
        return None

# --- Endpoint-ul de Login (http://localhost:5000/api/login) ---
@app.route('/api/login', methods=['POST'])
def login():
    # 1. Extrage datele trimise de React
    data = request.get_json()
    username = data.get('username')
    password = data.get('password') # Parola este text simplu

    if not username or not password:
        return jsonify({"message": "Nume de utilizator si parola sunt necesare."}), 400

    cnxn = get_db_connection()
    if not cnxn:
        return jsonify({"message": "Eroare de server la baza de date."}), 500
        
    try:
        cursor = cnxn.cursor()
        
        # 2. Interogare: Extrage inregistrarea in functie de Numele de utilizator SI Parola
        sql_query = "SELECT Nume FROM Clienti WHERE Username = ? AND Parola = ?"
        
        cursor.execute(sql_query, (username, password))
        
        user_record = cursor.fetchone()
        
        if user_record:
            return jsonify({
                "message": "Autentificare reusita!",
                "username": user_record[0],
                "token": "token_placeholder" # Placeholder pentru un token de sesiune
            }), 200 # OK
        else:
            return jsonify({"message": "Nume de utilizator sau parola incorecta."}), 401 # Unauthorized

    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        print(f"Eroare SQL la interogare: {ex}")
        return jsonify({"message": f"Eroare la baza de date ({sqlstate})."}), 500

    finally:
        if cnxn:
            cnxn.close()

if __name__ == '__main__':
    print("Serverul Flask ruleaza pe http://localhost:5000")
    app.run(debug=True, port=5000)
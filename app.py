from flask import Flask, request, jsonify
import pyodbc
import mysql.connector
from datetime import datetime
from config import DB_CONFIG
app = Flask(__name__)

# Database connection setup using values from config.py
conn = mysql.connector.connect(
    host=DB_CONFIG['host'],
    database=DB_CONFIG['database'],
    user=DB_CONFIG['user'],
    password=DB_CONFIG['password']
)
# Test
@app.route('/api/test', methods=['GET'])
def test_connection():
    cursor = conn.cursor()
    cursor.execute("SELECT 1")  # Simple query to test the connection
    result = cursor.fetchone()
    return jsonify({"success": result[0] == 1})

# Endpoint to fetch students for a specific supervisor
@app.route('/api/students', methods=['GET'])
def get_students():
    supervisor_id = request.args.get('supervisor_id')  # Supervisor ID for authorization
    if not supervisor_id:
        return jsonify({"error": "Supervisor ID is required"}), 400

    cursor = conn.cursor()
    query = "SELECT UniqueID, StudentName, NumSkillBadges, ArcadeDone, Remarks, Timestamp FROM EventData WHERE SupervisorID = ?"
    cursor.execute(query, (supervisor_id,))
    students = cursor.fetchall()

    # Formatting results as a list of dictionaries
    students_data = [
        {
            "UniqueID": student.UniqueID,
            "StudentName": student.StudentName,
            "NumSkillBadges": student.NumSkillBadges,
            "ArcadeDone": student.ArcadeDone,
            "Remarks": student.Remarks,
            "Timestamp": student.Timestamp
        } for student in students
    ]

    return jsonify(students_data)

# Endpoint to add or update student data by supervisor
@app.route('/api/add_data', methods=['POST'])
def add_data():
    data = request.json
    supervisor_id = data.get('supervisor_id')
    unique_id = data.get('unique_id')
    num_skill_badges = data.get('num_skill_badges')
    arcade_done = data.get('arcade_done')
    remarks = data.get('remarks')
    timestamp = datetime.now()

    # Validation to ensure supervisor is authorized
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(1) FROM EventData WHERE UniqueID = ? AND SupervisorID = ?", (unique_id, supervisor_id))
    if cursor.fetchone()[0] == 0:
        return jsonify({"error": "Unauthorized access or invalid student ID"}), 403

    # Insert or update data without modifying supervisor_id and unique_id
    query = """
        UPDATE EventData
        SET NumSkillBadges = ?, ArcadeDone = ?, Remarks = ?, Timestamp = ?
        WHERE UniqueID = ? AND SupervisorID = ?
    """
    cursor.execute(query, (num_skill_badges, arcade_done, remarks, timestamp, unique_id, supervisor_id))

    # If no rows were updated, it means the record doesn’t exist, so insert it.
    if cursor.rowcount == 0:
        insert_query = """
            INSERT INTO EventData (UniqueID, StudentName, SupervisorID, NumSkillBadges, ArcadeDone, Remarks, Timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        cursor.execute(insert_query, (unique_id, data.get('student_name'), supervisor_id, num_skill_badges, arcade_done, remarks, timestamp))

    conn.commit()

    return jsonify({"message": "Data added or updated successfully!"})

if __name__ == '__main__':
    app.run(debug=True)

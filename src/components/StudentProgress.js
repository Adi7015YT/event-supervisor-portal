import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import LoadingSpinner from "./LoadingSpinner";

const StudentProgress = () => {
    const [students, setStudents] = useState([]);
    const [changes, setChanges] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token) {
            const decodedToken = jwtDecode(token);
            const supervisorId = decodedToken.user_id;
            setLoading(true);
            fetch(`https://genai-supervisor-ticketing-system.onrender.com/v1/student/single-list/${supervisorId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setStudents(data);
                } else {
                    console.error('Expected array but received:', data);
                    setStudents([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                setLoading(false);
                setStudents([]);
            });
        }
    }, []);

    const handleInputChange = (e, id, field) => {
        const value = e.target.value;
        setChanges(prevChanges => ({
            ...prevChanges,
            [id]: {
                ...prevChanges[id],
                [field]: value,
            },
        }));
    };

    const handleUpdate = async (id) => {
        if (!changes[id]) {
            console.log('No changes detected for student:', id);
            return;
        }

        const currentStudent = students.find(s => s.student_id === id);
        
        // Prepare the update data
        const updatedData = {
            no_of_skill_badge: changes[id].skillBadges 
                ? parseInt(changes[id].skillBadges, 10) 
                : currentStudent.no_of_skill_badge,
            arcade_done: changes[id].arcadeDone !== undefined 
                ? (changes[id].arcadeDone === 'Yes' ? 1 : 0)  // Convert Yes/No to 1/0
                : (currentStudent.arcade_done === 'Yes' ? 1 : 0),
            remarks: changes[id].remarks !== undefined 
                ? changes[id].remarks 
                : currentStudent.remarks
        };

        try {
            setLoading(true);
            const response = await fetch(`https://genai-supervisor-ticketing-system.onrender.com/v1/student/manage/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const responseData = await response.json();
            console.log('Server response:', responseData);

            if (response.ok) {
                setStudents(prevStudents =>
                    prevStudents.map(student =>
                        student.student_id === id
                            ? { 
                                ...student,
                                no_of_skill_badge: updatedData.no_of_skill_badge,
                                arcade_done: updatedData.arcade_done === 1 ? 'Yes' : 'No',  // Convert back to Yes/No for display
                                remarks: updatedData.remarks
                            }
                            : student
                    )
                );
                setChanges(prevChanges => {
                    const updatedChanges = { ...prevChanges };
                    delete updatedChanges[id];
                    return updatedChanges;
                });
                alert('Update successful');
            } else {
                console.error('Failed to update student:', responseData);
                alert('Failed to update student. Please check the console for details.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h2 className="text-xl font-bold mb-4 text-center md:text-2xl">Students under Supervisor</h2>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border px-2 py-2 bg-blue-500 text-white text-xs md:text-sm lg:px-4">Student ID</th>
                                <th className="border px-2 py-2 bg-blue-500 text-white text-xs md:text-sm lg:px-4">Student Name</th>
                                <th className="border px-2 py-2 bg-blue-500 text-white text-xs md:text-sm lg:px-4">Supervisor</th>
                                <th className="border px-2 py-2 bg-blue-500 text-white text-xs md:text-sm lg:px-4">Skill Badges</th>
                                <th className="border px-2 py-2 bg-blue-500 text-white text-xs md:text-sm lg:px-4">Arcade Done</th>
                                <th className="border px-2 py-2 bg-blue-500 text-white text-xs md:text-sm lg:px-4">Remarks</th>
                                <th className="border px-2 py-2 bg-blue-500 text-white text-xs md:text-sm lg:px-4">Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map(student => (
                                    <tr key={student.student_id}>
                                        <td className="border px-2 py-2 text-xs md:text-sm">{student.student_id}</td>
                                        <td className="border px-2 py-2 text-xs md:text-sm">{student.name}</td>
                                        <td className="border px-2 py-2 text-xs md:text-sm">{student.supervisor}</td>
                                        <td className="border px-2 py-2 text-xs md:text-sm">
                                            <input
                                                type="number"
                                                defaultValue={student.no_of_skill_badge}
                                                onChange={(e) => handleInputChange(e, student.student_id, 'skillBadges')}
                                                className="border p-1 w-full"
                                            />
                                        </td>
                                        <td className="border px-2 py-2 text-xs md:text-sm">
                                            <select
                                                defaultValue={student.arcade_done}
                                                onChange={(e) => handleInputChange(e, student.student_id, 'arcadeDone')}
                                                className="border p-1 w-full"
                                            >
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </td>
                                        <td className="border px-2 py-2 text-xs md:text-sm">
                                            <input
                                                type="text"
                                                defaultValue={student.remarks}
                                                onChange={(e) => handleInputChange(e, student.student_id, 'remarks')}
                                                className="border p-1 w-full"
                                            />
                                        </td>
                                        <td className="border px-2 py-2 text-xs md:text-sm">
                                            <button
                                                onClick={() => handleUpdate(student.student_id)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded w-full md:w-auto"
                                                disabled={loading}
                                            >
                                                {loading ? 'Updating...' : 'Update'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="border px-4 py-2 text-center">No students found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StudentProgress;
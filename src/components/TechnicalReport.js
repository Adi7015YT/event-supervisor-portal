import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import LoadingSpinner from "./LoadingSpinner";

const TechnicalReport = () => {
    const [reports, setReports] = useState([]);
    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const defaultReport = {
        state: 1,
        priority: 5,
        lab_name: '',
        lab_number: '',
        task_number: '',
        short_description: '',
        full_description: '',
        remarks: '',
        student: '',
        supervisor: 0
    };
    const [newReport, setNewReport] = useState(defaultReport);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([fetchReports(), fetchStudents()]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('access');
            const response = await fetch('https://genai-supervisor-ticketing-system.onrender.com/v1/technical/supervisor-list', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setReports(data);
            } else {
                console.error('Failed to fetch reports:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('access');
            if (token) {
                const decodedToken = jwtDecode(token);
                const supervisorId = decodedToken.user_id;

                const response = await fetch(`https://genai-supervisor-ticketing-system.onrender.com/v1/student/single-list/${supervisorId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setStudents(data);
                    } else {
                        console.error('Expected array but received:', data);
                        setStudents([]);
                    }
                } else {
                    console.error('Failed to fetch students:', await response.text());
                }
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReport(prevReport => ({
            ...prevReport,
            [name]: value,
        }));
    };

    const handleAddTicket = () => {
        const token = localStorage.getItem('access');
        if (token) {
            const decodedToken = jwtDecode(token);
            setNewReport({
                ...defaultReport,
                supervisor: decodedToken.user_id
            });
        }
        setShowForm(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate required fields
        if (!newReport.lab_name.trim() || !newReport.lab_number.trim() || !newReport.task_number.trim() || !newReport.student) {
            alert('All required fields must be filled out (Lab Name, Lab Number, Task Number, and Student)');
            setIsSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('access');
            const decodedToken = jwtDecode(token);

            const payload = {
                state: 1,
                priority: parseInt(newReport.priority) || 5,
                lab_name: newReport.lab_name.trim(),
                lab_number: newReport.lab_number.trim(),
                task_number: newReport.task_number.trim(),
                short_description: newReport.short_description.trim(),
                full_description: newReport.full_description.trim(),
                student: parseInt(newReport.student),
                supervisor: decodedToken.user_id
            };

            const response = await fetch('https://genai-supervisor-ticketing-system.onrender.com/v1/technical/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                await fetchReports();
                setNewReport(defaultReport);
                setShowForm(false);
                alert('Report created successfully');
            } else {
                const errorData = await response.json();
                console.error('Failed to create report:', errorData);
                alert(`Failed to create report: ${errorData.message || JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error('Error creating report:', error);
            alert('Error creating report');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Technical Report</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            {['State', 'Priority', 'Lab Name', 'Lab No.', 'Task No.', 'Short Description', 'Full Description', 'Remarks', 'Student Name'].map(header => (
                                <th key={header} className="border px-4 py-2 bg-blue-500 text-white text-xs md:text-sm">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length > 0 ? (
                            reports.map((report, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2 text-xs md:text-sm">{report.state}</td>
                                    <td className="border px-4 py-2 text-xs md:text-sm">{report.priority}</td>
                                    <td className="border px-4 py-2 text-xs md:text-sm">{report.lab_name}</td>
                                    <td className="border px-4 py-2 text-xs md:text-sm">{report.lab_number}</td>
                                    <td className="border px-4 py-2 text-xs md:text-sm">{report.task_number}</td>
                                    <td className="border px-4 py-2 text-xs md:text-sm">{report.short_description}</td>
                                    <td className="border px-4 py-2 text-xs md:text-sm">{report.full_description}</td>
                                    <td className="border px-4 py-2 text-xs md:text-sm">{report.remarks || '-'}</td>
                                    <td className="border px-4 py-2 text-xs md:text-sm">{report.student}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="border px-4 py-2 text-center text-gray-500">
                                    No reports found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <button
                onClick={handleAddTicket}
                className="mt-4 mb-10 bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-green-600 transition-colors"
                disabled={isSubmitting}
            >
                Add Ticket
            </button>

            {showForm && (
                <form onSubmit={handleFormSubmit} className="mt-4 bg-white p-4 border border-gray-300 rounded shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Lab Name: *</label>
                            <input
                                type="text"
                                name="lab_name"
                                value={newReport.lab_name}
                                onChange={handleInputChange}
                                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Lab No.: *</label>
                            <input
                                type="text"
                                name="lab_number"
                                value={newReport.lab_number}
                                onChange={handleInputChange}
                                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Task No.: *</label>
                            <input
                                type="text"
                                name="task_number"
                                value={newReport.task_number}
                                onChange={handleInputChange}
                                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Short Description:</label>
                            <input
                                type="text"
                                name="short_description"
                                value={newReport.short_description}
                                onChange={handleInputChange}
                                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Full Description:</label>
                            <textarea
                                name="full_description"
                                value={newReport.full_description}
                                onChange={handleInputChange}
                                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Student: *</label>
                            <select
                                name="student"
                                value={newReport.student}
                                onChange={handleInputChange}
                                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">Select Student</option>
                                {students.map(student => (
                                    <option key={student.student_id} value={student.student_id}>
                                        {student.name} (ID: {student.student_id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Priority:</label>
                            <select
                                name="priority"
                                value={newReport.priority}
                                onChange={handleInputChange}
                                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isSubmitting}
                            >
                                {[1, 2, 3, 4, 5].map(value => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-4 mb-10 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner size="small" />
                                    <span className="ml-2">Submitting...</span>
                                </>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default TechnicalReport;
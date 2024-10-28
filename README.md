# Event Supervisor Portal

An event management portal built with Python Flask, where supervisors can track and update information for assigned students. This project uses SQL Server to store data on students and their progress, with each supervisor having access only to their assigned students.

## Features

- **Authentication** based on `supervisor_id`, allowing supervisors to manage only their students’ data.
- **Data Viewing and Adding**: Supervisors can view and update student information (skill badges, arcade status, remarks, timestamp).
- **RESTful API Endpoints** for seamless data interaction.

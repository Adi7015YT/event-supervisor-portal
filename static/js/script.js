let supervisorId = '';

async function fetchStudents() {
  supervisorId = document.getElementById('supervisor_id').value;
  if (!supervisorId) {
    alert('Please enter Supervisor ID');
    return;
  }

  try {
    const response = await fetch(`/api/students?supervisor_id=${supervisorId}`);
    const students = await response.json();
    if (students.error) {
      alert(students.error);
      return;
    }
    displayStudents(students);
  } catch (error) {
    alert('Failed to fetch student data.');
  }
}

function displayStudents(students) {
  const tableBody = document.getElementById('student_data_body');
  tableBody.innerHTML = '';

  students.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.UniqueID}</td>
      <td>${student.StudentName}</td>
      <td><input type="number" value="${student.NumSkillBadges}" id="skill_${student.UniqueID}"></td>
      <td>
        <select id="arcade_${student.UniqueID}">
          <option value="Yes" ${student.ArcadeDone === 'Yes' ? 'selected' : ''}>Yes</option>
          <option value="No" ${student.ArcadeDone === 'No' ? 'selected' : ''}>No</option>
        </select>
      </td>
      <td><input type="text" value="${student.Remarks}" id="remarks_${student.UniqueID}"></td>
      <td><button class="update-btn" onclick="updateStudent(${student.UniqueID})">Update</button></td>
    `;
    tableBody.appendChild(row);
  });

  document.getElementById('student_data_section').style.display = 'block';
}

async function updateStudent(uniqueId) {
  const numSkillBadges = document.getElementById(`skill_${uniqueId}`).value;
  const arcadeDone = document.getElementById(`arcade_${uniqueId}`).value;
  const remarks = document.getElementById(`remarks_${uniqueId}`).value;

  const data = {
    supervisor_id: supervisorId,
    unique_id: uniqueId,
    num_skill_badges: numSkillBadges,
    arcade_done: arcadeDone,
    remarks: remarks
  };

  try {
    const response = await fetch('/api/add_data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    alert(result.message);

    fetchStudents();
  } catch (error) {
    alert('Failed to update student data.');
  }
}

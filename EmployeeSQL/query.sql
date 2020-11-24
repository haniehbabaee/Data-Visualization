--1.List the following details of each employee: employee number, last name, first name, sex, and salary.
SELECT e.emp_no, e.last_name, e.first_name, e.sex, s.salary
FROM employees AS e
INNER JOIN salaries AS s 
ON e.emp_no= s.emp_no;

--2.List first name, last name, and hire date for employees who were hired in 1986.
SELECT first_name, last_name, hire_date
FROM employees
WHERE hire_date like '%1986' ;

--3.List the manager of each department with the following information:
--department number, department name, the manager's employee number, last name, first name.
SELECT m.dept_no, d.dept_name, m.dept_no, e.last_name, e.first_name
FROM dept_manager AS m
INNER JOIN departments AS d
ON m.dept_no=d.dept_no
INNER JOIN employees AS e
ON m.emp_no=e.emp_no;

--4.List the department of each employee with the following information: 
--employee number, last name, first name, and department name.
SELECT e.emp_no, e.last_name, e.first_name, d.dept_name
FROM employees as e
INNER JOIN dept_emp as dm 
ON e.emp_no=dm.emp_no
INNER JOIN departments as d
ON dm.dept_no=d.dept_no;

--5. List first name, last name, and sex for employees whose first name is "Hercules" and last names begin with "B."
SELECT first_name, last_name, sex
FROM employees
WHERE first_name = 'Hercules' AND last_name like 'B%';

--6.List all employees in the Sales department, including their employee number, last name, first name, and department name.
SELECT e.emp_no, e.last_name, e.first_name, d.dept_name
FROM employees as e
INNER JOIN dept_emp as dm
ON e.emp_no=dm.emp_no
INNER JOIN departments as d
ON dm.dept_no=d.dept_no
WHERE d.dept_name= 'Sales';

--7.List all employees in the Sales and Development departments, including their employee number, 
--last name, first name, and department name.
SELECT e.emp_no, e.last_name, e.first_name, d.dept_name
FROM employees as e
INNER JOIN dept_emp as dm
ON e.emp_no=dm.emp_no
INNER JOIN departments as d
ON dm.dept_no=d.dept_no
WHERE d.dept_name= 'Sales' OR d.dept_name= 'Development';

--8.In descending order, list the frequency count of employee last names, i.e., how many employees share each last name.
SELECT COUNT(last_name) AS Frequency, last_name
FROM employees
GROUP BY last_name
ORDER BY Frequency DESC;


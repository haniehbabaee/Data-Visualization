DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS dept_emp;
DROP TABLE IF EXISTS dept_manager;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS salaries;
DROP TABLE IF EXISTS titles;
--PRIMARY KEY (id),
--FOREIGN KEY (customer_id) REFERENCES customer(id)

CREATE TABLE departments (
	dept_no varchar(10) NOT NULL,
    dept_name varchar(50) NOT NULL, 
	PRIMARY KEY(dept_no)
);

CREATE TABLE titles (
    title_id varchar(10) NOT NULL ,
    title varchar(50) NOT NULL,
	PRIMARY KEY (title_id)
);


CREATE TABLE employees (
    emp_no int NOT NULL ,
    emp_title_id varchar(10) NOT NULL,
    birth_date varchar(10) NOT NULL,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    sex char(5) NOT NULL,
    hire_date varchar(10) NOT NULL,
	PRIMARY KEY (emp_no),
	FOREIGN KEY(emp_title_id) 
	REFERENCES titles(title_id)
);

CREATE TABLE dept_emp (
    emp_no int NOT NULL,
    dept_no varchar(10) NOT NULL,
	PRIMARY KEY (emp_no, dept_no),
    FOREIGN KEY(dept_no) 
	REFERENCES departments(dept_no),
	FOREIGN KEY(emp_no) 
	REFERENCES employees(emp_no)
);

CREATE TABLE dept_manager (
    dept_no varchar(10) NOT NULL,
    emp_no int NOT NULL,
	PRIMARY KEY (emp_no),
	FOREIGN KEY(dept_no) 
	REFERENCES departments(dept_no), 
	FOREIGN KEY(emp_no) 
	REFERENCES employees(emp_no)
);



CREATE TABLE salaries (
    emp_no int NOT NULL,
    salary int NOT NULL,
	PRIMARY KEY (emp_no),
	FOREIGN KEY(emp_no) 
	REFERENCES employees(emp_no)
);


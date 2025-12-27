-- EXPERIENCE & EDUCATION
CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    company VARCHAR(255),
    date_range VARCHAR(255),
    summary TEXT,
    details TEXT[], -- Array of strings for bullet points
    type VARCHAR(50) -- 'industry', 'education', 'other'
);

INSERT INTO experience (title, company, date_range, summary, details, type) VALUES
('Data Science Intern', 'OCTAVE - John Keells Group', 'Oct 2025 - Present', 'Colombo · On-site', 
 ARRAY['Developing machine learning models and analyzing large datasets to drive business insights.', 'Tech Stack: Python, Power BI, Data Visualization.', 'Collaborating with cross-functional teams to deploy data solutions.'], 'industry'),

('Data Engineering Intern', 'London Success Academy', 'Sep 2025 - Oct 2025', 'UK · Remote', 
 ARRAY['Implemented ETL pipelines using Google Cloud Platform (GCP) and Airflow.', ' worked with Apache Spark and BigQuery for large-scale data processing.', 'Optimized data warehousing strategies for better query performance.'], 'industry'),

('Analytics Delivery Intern', 'OCTAVE - John Keells Group', 'Mar 2023 - May 2023', 'Sri Lanka', 
 ARRAY['Assisted in the delivery of analytics projects.', 'Conducted data quality checks and preliminary analysis.', 'Supported senior data scientists in model validation.'], 'industry'),

('Data Science Intern', 'OCTAVE - John Keells Group', 'Mar 2022 - Jun 2022', 'Sri Lanka', 
 ARRAY['Gained initial exposure to real-world data science workflows.', 'Learned Python for data analysis and visualization.', 'Participated in agile team meetings and sprints.'], 'industry'),

('Customer Advisor', 'UNIQLO', 'Aug 2025 - Oct 2025', 'London · Visual Merchandising, Customer Service', 
 ARRAY['Provided exceptional customer service in a high-paced environment.', 'Managed visual merchandising standards.', 'Collaborated with team to meet sales targets.'], 'other'),

('Customer Service Associate', 'EG On The Move', 'Jan 2025 - Sep 2025', 'Enfield · Customer Service, Cashiering', 
 ARRAY['Handled cash transactions and customer inquiries.', 'Maintained store cleanliness and organization.'], 'other'),

('Support Worker', 'Clear Links Support Ltd.', 'Oct 2024 - Apr 2025', 'London · Interpersonal Communication', 
 ARRAY['Provided support to individuals with diverse needs.', 'Developed strong interpersonal and time management skills.'], 'other'),

('BSc (Hons) Computer Science', 'University of Westminster', 'Sep 2022 - Jun 2025', 'Grade: First Class Honours', 
 ARRAY['Key Modules: Machine Learning, Algorithms, Data Structures, AI.', 'Dissertation: PCOS Care (3rd Place in Showcase).', 'Member of Computer Science Society.'], 'education'),

('Certificate in Business Accounting', 'CIMA', 'Aug 2024', 'Financial & Management Accounting', 
 ARRAY['Fundamentals of Business Economics.', 'Fundamentals of Management Accounting.', 'Fundamentals of Financial Accounting.', 'Ethics, Corporate Governance and Business Law.'], 'education'),

('Student & Prefect', 'St. Bridget''s Convent', 'Jan 2008 - Feb 2022', 'Head Prefect (2020)', 
 ARRAY['Head Prefect (2020), Assistant Prefect (2019).', 'Member of Interact Club, Swimming Team, Technical Crew.', 'Developed leadership and team management skills.'], 'education');

-- SKILLS
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255),
    items TEXT[]
);

INSERT INTO skills (category, items) VALUES
('Programming Languages', ARRAY['Python', 'SQL', 'Java', 'HTML/CSS', 'JavaScript', 'Dart']),
('Frameworks & Tools', ARRAY['Flutter', 'React', 'Node.js', 'Express', 'Streamlit', 'Git']),
('Data Science & ML', ARRAY['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'Matplotlib', 'Power BI']),
('Cloud & Databases', ARRAY['Google Cloud Platform (GCP)', 'PostgreSQL', 'MySQL', 'MongoDB', 'BigQuery']),
('Soft Skills', ARRAY['Problem Solving', 'Communication', 'Team Leadership', 'Project Management']);

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    tech TEXT[],
    link VARCHAR(255)
);

INSERT INTO projects (title, description, tech, link) VALUES
('PCOS Care', 'A web-based machine learning system for early diagnosis of Polycystic Ovary Syndrome (PCOS). Awarded 3rd Place at the Westminster Final Year Project Showcase.', ARRAY['Python', 'Machine Learning', 'Flask', 'Streamlit', 'Render'], 'https://github.com/rachelcooray'),
('CarbonQuest', '1st Place Winner - Project utilizing carbon tracking algorithms.', ARRAY['Computer Science', 'Sustainability'], NULL);

-- PUBLICATIONS
CREATE TABLE IF NOT EXISTS publications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    conference VARCHAR(255),
    link VARCHAR(255)
);

INSERT INTO publications (title, conference, link) VALUES
('PCOS Care: A Machine Learning-Based Web Application for Early Risk Prediction of Polycystic Ovary Syndrome', 'IEEE ICAHS 2025, Tunisia', NULL);

-- VOLUNTERING
CREATE TABLE IF NOT EXISTS volunteering (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

INSERT INTO volunteering (name) VALUES
('Rotaract Club'),
('IEEE Club'),
('Sri Lankan Society UoW'),
('CIMA Student'),
('BCS Member');

-- FEATURED
CREATE TABLE IF NOT EXISTS featured (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    source VARCHAR(255),
    description TEXT,
    link VARCHAR(255)
);

INSERT INTO featured (title, source, description, link) VALUES
('Westminster CS Students Receive Prizes', 'University of Westminster', 'Rachel Cooray awarded 3rd Place for ''PCOS Care'' project.', 'https://www.westminster.ac.uk/news/westminster-computer-science-and-engineering-students-receive-prizes-from-netcompany-at-annual-final-year-project-showcase'),
('LMD Youth Forum Interview', 'LMD', 'Featured interview discussing youth in tech.', 'https://lmd.lk/');

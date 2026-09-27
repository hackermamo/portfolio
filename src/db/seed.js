const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// We need to import the schema, but since this is a JS file running in Node, 
// we'll just define the table objects here or use the raw pool if necessary.
// Better to use the schema from the project, but it's in TS.
// Let's just use raw SQL for seeding to avoid TS/JS interop issues in a simple script.

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool);

  console.log('Seeding database...');

  // Admin User
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  await pool.query(`
    INSERT INTO users (email, password, name, role)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email) DO NOTHING
  `, [process.env.ADMIN_EMAIL, hashedPassword, 'Maman Das', 'admin']);

  // Hero Content
  await pool.query(`
    INSERT INTO hero_content (availability_status, name, subtitle, description, profile_photo, cv_url, floating_badges, decorative_text, is_published)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `, [
    'Open to Software & AI Opportunities',
    'Maman Das',
    'Computer Science Graduate • M.Tech (Pursuing)',
    'Full-stack developer with experience in Generative AI, Machine Learning, and real-world web applications. I build scalable solutions that solve real problems.',
    '/images/profile.jpg',
    '#',
    JSON.stringify([
      { icon: 'Code', text: 'Full-Stack Developer' },
      { icon: 'Brain', text: 'GenAI / ML Enthusiast' },
      { icon: 'Zap', text: 'Problem Solver' }
    ]),
    'Build, Learn, Improve, Repeat',
    true
  ]);

  // Skill Categories & Skills
  const categories = [
    { name: 'Languages', skills: ['Python', 'JavaScript', 'SQL'] },
    { name: 'Web Technologies', skills: ['HTML & CSS', 'React', 'Node.js', 'Streamlit'] },
    { name: 'Databases', skills: ['MongoDB', 'MySQL', 'PostgreSQL', 'SQLite'] },
    { name: 'Developer Tools', skills: ['VS Code', 'PyCharm', 'IntelliJ IDEA', 'Git & GitHub', 'Canva'] }
  ];

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const res = await pool.query(`
      INSERT INTO skill_categories (name, "order", is_published)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [cat.name, i, true]);
    const catId = res.rows[0].id;

    for (let j = 0; j < cat.skills.length; j++) {
      await pool.query(`
        INSERT INTO skills (category_id, name, "order")
        VALUES ($1, $2, $3)
      `, [catId, cat.skills[j], j]);
    }
  }

  // Projects
  const projects = [
    { title: 'ApnaHome – Rental Platform', desc: 'A full-stack home rental platform with property search, listings, and user management.', techs: ['React', 'Node.js', 'MongoDB'] },
    { title: 'Stock Price Forecasting', desc: 'Python/Streamlit app to forecast next-month stock prices using multiple models and fuzzy logic.', techs: ['Python', 'Streamlit', 'Machine Learning'] },
    { title: 'AI Price Comparison', desc: 'Smart price-comparison tool covering Amazon, Flipkart, Meesho, and IndiaMART using Python.', techs: ['Python', 'HTML', 'CSS', 'JavaScript'] }
  ];

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    await pool.query(`
      INSERT INTO projects (title, description, technologies, is_featured, is_published, "order")
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [p.title, p.desc, JSON.stringify(p.techs), true, true, i]);
  }

  // Experience
  const experiences = [
    { role: 'GenAI Full-Stack Developer Intern', company: 'Yupcha Software Pvt. Ltd.', location: 'Remote', start: 'Jun 2025', end: 'Jul 2025', current: false, resp: ['Worked with Python, HTML, CSS, and JavaScript.', 'Implemented authentication and search functionality.', 'Managed database layer and built responsive front end.'] },
    { role: 'IT Teacher', company: 'Sudhayana Debbarma Memorial HS School', location: 'Tripura', start: '2026', end: '2026', current: false, resp: ['Taught foundational IT concepts to high school students.', 'Prepared lesson plans and practical exercises.', 'Guided students through hands-on computer lab sessions.'] },
    { role: 'Machine Learning Trainee', company: 'NIELIT', location: 'Tripura', start: 'Jul 2023', end: 'Aug 2023', current: false, resp: ['Completed hands-on training in machine learning using Python.', 'Applied core ML methodologies to practical exercises.'] }
  ];

  for (let i = 0; i < experiences.length; i++) {
    const e = experiences[i];
    await pool.query(`
      INSERT INTO experiences (role, company, location, start_date, end_date, is_current, responsibilities, "order", is_published)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [e.role, e.company, e.location, e.start, e.end, e.current, JSON.stringify(e.resp), i, true]);
  }

  // Education
  const education = [
    { qual: 'B.Tech in Computer Science and Engineering', inst: 'Techno College of Engineering, Agartala', loc: 'Agartala', start: '2022', end: '2026' },
    { qual: 'Higher Secondary (+2 Stage)', inst: 'Jalefa HS School, Sabroom', loc: 'Sabroom', start: '2020', end: '2022' },
    { qual: 'Madhyamik (Secondary)', inst: 'Jalefa HS School, Sabroom', loc: 'Sabroom', start: '2018', end: '2020' }
  ];

  for (let i = 0; i < education.length; i++) {
    const edu = education[i];
    await pool.query(`
      INSERT INTO education (qualification, institution, location, start_year, end_year, "order", is_published)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [edu.qual, edu.inst, edu.loc, edu.start, edu.end, i, true]);
  }

  // Certifications
  const certs = [
    { name: 'GenAI Full-Stack Developer Internship', org: 'Yupcha Software Pvt. Ltd.', date: '2025' },
    { name: 'Training Certificate', org: 'CTTC Bhubaneswar', date: '2024' },
    { name: 'Machine Learning Training', org: 'NIELIT', date: '2023' }
  ];

  for (let i = 0; i < certs.length; i++) {
    const c = certs[i];
    await pool.query(`
      INSERT INTO certifications (name, organization, issue_date, "order", is_published)
      VALUES ($1, $2, $3, $4, $5)
    `, [c.name, c.org, c.date, i, true]);
  }

  // Social Links
  const socials = [
    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
    { platform: 'GitHub', url: 'https://github.com', icon: 'Github' },
    { platform: 'YouTube', url: 'https://youtube.com', icon: 'Youtube' },
    { platform: 'Email', url: 'mailto:maman.cse.tcea.2026@gmail.com', icon: 'Mail' }
  ];

  for (let i = 0; i < socials.length; i++) {
    const s = socials[i];
    await pool.query(`
      INSERT INTO social_links (platform, url, icon, "order", is_enabled)
      VALUES ($1, $2, $3, $4, $5)
    `, [s.platform, s.url, s.icon, i, true]);
  }

  console.log('Seeding completed!');
  await pool.end();
}

seed().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import logo from './assets/logo.png';

const allOpportunities = [
  // 4 Scholarships
  { id: 1, type: 'scholarship', title: 'HEC Need Based Scholarship', description: 'Full tuition fee coverage for financially deserving students enrolled in public sector universities.', deadline: '2025-07-30', tag: 'Fully Funded' },
  { id: 2, type: 'scholarship', title: 'MUET Merit Scholarship', description: 'Awarded to top performing students with CGPA above 3.5 at the end of each semester.', deadline: '2025-08-15', tag: 'Merit Based' },
  { id: 3, type: 'scholarship', title: 'Ehsaas Undergraduate Scholarship', description: 'Government scholarship program for financially underprivileged students across Pakistan.', deadline: '2025-09-01', tag: 'Govt. Funded' },
  { id: 4, type: 'scholarship', title: 'Sindh Educational Endowment Fund', description: 'Provincial scholarship for Sindh domicile students studying in engineering and technology fields.', deadline: '2025-09-15', tag: 'Provincial' },

  // 8 Internships
  { id: 5, type: 'internship', title: 'PTCL Summer Internship', description: 'Hands-on experience in telecom and IT departments at one of Pakistan\'s largest telecom companies.', deadline: '2025-06-20', tag: 'Paid' },
  { id: 6, type: 'internship', title: 'NESCOM Engineering Internship', description: 'Prestigious defence sector internship for engineering students with exposure to advanced technology.', deadline: '2025-07-10', tag: 'Paid' },
  { id: 7, type: 'internship', title: 'ORIC Research Internship', description: 'Work directly with MUET research faculty on live funded research projects on campus.', deadline: '2025-06-30', tag: 'On Campus' },
  { id: 8, type: 'internship', title: 'SUPARCO Space Technology Internship', description: 'Rare opportunity to work with Pakistan\'s national space agency on cutting edge projects.', deadline: '2025-07-20', tag: 'Govt.' },
  { id: 9, type: 'internship', title: 'Engro Corporation Internship', description: 'Industrial internship at one of Pakistan\'s largest conglomerates across multiple engineering fields.', deadline: '2025-08-05', tag: 'Paid' },
  { id: 10, type: 'internship', title: 'WAPDA Engineering Internship', description: 'Summer internship at Water and Power Development Authority for electrical and civil engineering students.', deadline: '2025-07-15', tag: 'Govt.' },
  { id: 11, type: 'internship', title: 'Pakistan Steel Internship', description: 'Industrial training program at Pakistan Steel Mills for mechanical and metallurgical engineering students.', deadline: '2025-08-10', tag: 'Paid' },
  { id: 12, type: 'internship', title: 'HBL Technology Internship', description: 'Technology and IT internship at Habib Bank Limited for computer science and software engineering students.', deadline: '2025-07-25', tag: 'Paid' },

  // 6 Research Grants
  { id: 13, type: 'research', title: 'HEC Research Project Grant', description: 'Competitive funding for innovative research proposals submitted by faculty and graduate students.', deadline: '2025-08-20', tag: 'Up to PKR 5M' },
  { id: 14, type: 'research', title: 'MUET Industry Collaboration Grant', description: 'Joint research projects with industry partners focused on solving real world engineering problems.', deadline: '2025-07-25', tag: 'Collaborative' },
  { id: 15, type: 'research', title: 'International Research Exchange', description: 'Fully funded research exchange program with MUET partner universities across Europe and Asia.', deadline: '2025-10-01', tag: 'International' },
  { id: 16, type: 'research', title: 'NRPU Research Grant', description: 'National Research Programme for Universities offering grants for high impact research projects.', deadline: '2025-09-10', tag: 'National' },
  { id: 17, type: 'research', title: 'ORIC Seed Money Grant', description: 'Small seed grants for new researchers and students to kickstart their first research project at MUET.', deadline: '2025-08-30', tag: 'Seed Grant' },
  { id: 18, type: 'research', title: 'Pakistan Science Foundation Grant', description: 'PSF research grants for applied science and engineering research projects at public universities.', deadline: '2025-09-20', tag: 'PSF Funded' },
];
 

const typeColors = {
  scholarship: '#2980b9',
  internship: '#27ae60',
  research: '#8e44ad',
};

const typeLabels = {
  scholarship: 'Scholarship',
  internship: 'Internship',
  research: 'Research Grant',
};

function useTypewriter(texts, speed = 60) {
  const [display, setDisplay] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (lineIndex >= texts.length) { setDone(true); return; }
    if (charIndex < texts[lineIndex].length) {
      const t = setTimeout(() => {
        setDisplay(prev => prev + texts[lineIndex][charIndex]);
        setCharIndex(c => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else if (lineIndex < texts.length - 1) {
      const t = setTimeout(() => {
        setDisplay(prev => prev + '\n');
        setLineIndex(l => l + 1);
        setCharIndex(0);
      }, 400);
      return () => clearTimeout(t);
    } else {
      setDone(true);
    }
  }, [charIndex, lineIndex, texts, speed, done]);

  return display;
}

function getNameFromEmail(email) {
  const part = email.split('@')[0];
  if (part.includes('.')) {
    return part.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return part;
}

function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem('loggedInUser') || '';
  const name = getNameFromEmail(email);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6, 1));

  const typewriterText = useTypewriter([`Hello ${name}`, 'Welcome to MUET ORIC Portal']);

  const lines = typewriterText.split('\n');

  const filtered = activeFilter === 'all'
    ? allOpportunities
    : allOpportunities.filter(o => o.type === activeFilter);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDay = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const deadlineDates = allOpportunities.map(o => {
    const d = new Date(o.deadline);
    return { day: d.getDate(), month: d.getMonth(), year: d.getFullYear(), type: o.type };
  });

  const hasDeadline = (day) => deadlineDates.filter(
    d => d.day === day && d.month === currentMonth.getMonth() && d.year === currentMonth.getFullYear()
  );

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDay(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const upcomingDeadlines = allOpportunities
    .filter(o => new Date(o.deadline) >= new Date())
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <div className="dashboard-root">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="MUET ORIC" />
          <span>MUET ORIC</span>
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-link active-link">Dashboard</button>
          <button className="sidebar-link" onClick={() => navigate('/settings')}>Settings</button>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Welcome */}
        <div className="welcome-section">
          <div className="typewriter-box">
            {lines[0] && <p className="typewriter-line1">{lines[0]}</p>}
            {lines[1] && <p className="typewriter-line2">{lines[1]}</p>}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-number">{allOpportunities.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{allOpportunities.filter(o => o.type === 'scholarship').length}</span>
            <span className="stat-label">Scholarships</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{allOpportunities.filter(o => o.type === 'internship').length}</span>
            <span className="stat-label">Internships</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{allOpportunities.filter(o => o.type === 'research').length}</span>
            <span className="stat-label">Research Grants</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">

          {/* Left — Opportunities */}
          <div className="opportunities-section">

            {/* Filter Buttons */}
            <div className="filter-row">
              {['all', 'scholarship', 'internship', 'research'].map(f => (
                <button
                  key={f}
                  className={`filter-btn ${activeFilter === f ? 'active-filter' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f === 'all' ? 'All' : typeLabels[f] + 's'}
                </button>
              ))}
            </div>

            {/* Cards */}
            <div className="cards-grid">
              {filtered.map(item => (
                <div className="opp-card" key={item.id}>
                  <div>
                    <span className="opp-tag" style={{ background: typeColors[item.type] }}>
                      {typeLabels[item.type]}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="opp-footer">
                    <span className="opp-deadline">
                      {new Date(item.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button className="apply-btn" style={{ background: typeColors[item.type] }}>
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Calendar + Deadlines */}
          <div className="right-panel">

            {/* Calendar */}
            <div className="calendar-box">
              <div className="calendar-header">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>&#8249;</button>
                <span>{monthName}</span>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>&#8250;</button>
              </div>
              <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="cal-day-name">{d}</div>
                ))}
                {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
                {Array(daysInMonth).fill(null).map((_, i) => {
                  const day = i + 1;
                  const deadlines = hasDeadline(day);
                  const today = new Date();
                  const isToday = day === today.getDate() && currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();
                  return (
                    <div key={day} className={`cal-day ${isToday ? 'today' : ''} ${deadlines.length ? 'has-deadline' : ''}`}>
                      {day}
                      {deadlines.length > 0 && (
                        <div className="deadline-dot" style={{ background: typeColors[deadlines[0].type] }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="upcoming-box">
              <h4>Upcoming Deadlines</h4>
              {upcomingDeadlines.map(item => (
                <div className="upcoming-item" key={item.id}>
                  <div className="upcoming-dot" style={{ background: typeColors[item.type] }} />
                  <div>
                    <p className="upcoming-title">{item.title}</p>
                    <p className="upcoming-date">
                      {new Date(item.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
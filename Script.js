// Auth
document.getElementById('googleSignIn').addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(() => window.location = 'dashboard.html');
});
document.getElementById('privateSignIn').addEventListener('click', () => {
  // Simple localStorage for private (not secure, for demo)
  if (document.getElementById('username').value === 'test' && document.getElementById('password').value === '123') {
    localStorage.setItem('user', 'private');
    window.location = 'dashboard.html';
  }
});
auth.onAuthStateChanged(user => { if (user) window.location = 'dashboard.html'; });

// Dashboard Logic
const userId = auth.currentUser?.uid || localStorage.getItem('user');
document.getElementById('studyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    subject: document.getElementById('subject').value,
    chapter: document.getElementById('chapter').value,
    time: parseInt(document.getElementById('timeSpent').value),
    date: new Date().toISOString(),
    uid: userId
  };
  await db.collection('studies').add(data);
  loadData();
});

// Load & AI Analysis
async function loadData() {
  const snapshot = await db.collection('studies').where('uid', '==', userId).get();
  const studies = snapshot.docs.map(doc => doc.data());
  updateDashboard(studies);
}

function updateDashboard(studies) {
  // AI Brain: Weak subjects (low time avg)
  const subjTime = {};
  studies.forEach(s => subjTime[s.subject] = (subjTime[s.subject] || 0) + s.time);
  const weak = Object.entries(subjTime).sort((a,b) => a[1] - b[1])[0][0];
  document.getElementById('aiPlan').innerHTML = `
    <h3>Today's Plan</h3>
    <p>Study ${weak} (avoiding it). Revise chapters from 7 days ago.</p>
    <p>Load: ${studies.length ? (studies[studies.length-1].time < 60 ? 'Increase tomorrow' : 'Good') : 'Start!'}</p>
  `;

  // Revision: 1-3-7-15 days (check dates)
  const today = new Date();
  const revisions = studies.filter(s => {
    const days = (today - new Date(s.date)) / (1000*60*60*24);
    return [1,3,7,15].some(d => Math.abs(days - d) < 1);
  });

  // Burnout: >3 ghost days
  const ghostDays = 0; // Calc from dates
  if (ghostDays > 3) alert('Burnout risk: Take rest');

  // Chart
  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, { type: 'line', data: { /* time vs days */ } });

  // Stats: Progress %, streak, etc.
  document.getElementById('stats').innerHTML = `
    <p>Consistency: ${Math.round(studies.length / 30 * 100)}%</p>
    <p>Streak: 5 days</p>
  `;
}
loadData(); // On load

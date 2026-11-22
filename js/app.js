/**

 * Smart Doctor - CarePoint Hospital Digital Platform

 * Application State, Routing & Interactive Controllers

 */



// Application Global State

const AppState = {

  currentUser: null, // null (guest), 'patient', or 'doctor'

  patientProfile: (typeof INITIAL_PATIENT !== 'undefined' ? { ...INITIAL_PATIENT } : { name: 'John Doe', age: 38, gender: 'Male', phone: '+91 98765 43210' }),

  doctorProfile: (typeof INITIAL_DOCTOR !== 'undefined' ? { ...INITIAL_DOCTOR } : null),

  appointments: (typeof INITIAL_APPOINTMENTS !== 'undefined' ? [ ...INITIAL_APPOINTMENTS ] : []),

  currentAssessmentIndex: 0,

  assessmentAnswers: {},

  currentEvaluation: null,

  bookingFlow: {

    selectedDoctor: null,

    selectedDate: null,

    selectedSlot: null,

    priority: null

  },

  activeDocTab: 'dashboard'

};



// Initialize State from LocalStorage or Defaults

function initAppState() {

  const storedPatient = localStorage.getItem('carepoint_patient');

  try {

    AppState.patientProfile = storedPatient ? JSON.parse(storedPatient) : null;

  } catch (e) {

    AppState.patientProfile = null;

  }

  if (!AppState.patientProfile || typeof AppState.patientProfile !== 'object' || !AppState.patientProfile.name) {

    AppState.patientProfile = null; // No demo bleed — real login/signup required

  }



  const storedDoctor = localStorage.getItem('carepoint_doctor');

  try {

    AppState.doctorProfile = storedDoctor ? JSON.parse(storedDoctor) : null;

  } catch (e) {

    AppState.doctorProfile = null;

  }

  if (!AppState.doctorProfile || typeof AppState.doctorProfile !== 'object' || !AppState.doctorProfile.name) {

    AppState.doctorProfile = { ...(typeof INITIAL_DOCTOR !== 'undefined' ? INITIAL_DOCTOR : { id: 'doc-1', name: 'Dr. Meera Iyer', specialisation: 'Cardiologist', department: 'Cardiology' }) };

  }



  const aptEmail = (AppState.patientProfile && AppState.patientProfile.email) ? AppState.patientProfile.email : 'guest';

  const aptKey = 'carepoint_appointments_' + aptEmail;

  const storedApts = localStorage.getItem(aptKey);

  try {

    AppState.appointments = storedApts ? JSON.parse(storedApts) : null;

  } catch (e) {

    AppState.appointments = null;

  }

  if (!Array.isArray(AppState.appointments)) {

    // For John Doe demo account: seed with demo appointments; for everyone else: empty array

    const isDemoUser = AppState.patientProfile && AppState.patientProfile.email === 'john.doe@example.com';

    AppState.appointments = isDemoUser ? [ ...(typeof INITIAL_APPOINTMENTS !== 'undefined' ? INITIAL_APPOINTMENTS : []) ] : [];

  }



  const storedSession = localStorage.getItem('carepoint_session');

  if (storedSession === 'patient' || storedSession === 'doctor') {

    AppState.currentUser = storedSession;

  } else {

    AppState.currentUser = null;

  }

}



function saveAppointments() {

  const aptEmail = (AppState.patientProfile && AppState.patientProfile.email) ? AppState.patientProfile.email : 'guest';

  localStorage.setItem('carepoint_appointments_' + aptEmail, JSON.stringify(AppState.appointments));

}



function savePatientProfile() {

  localStorage.setItem('carepoint_patient', JSON.stringify(AppState.patientProfile));

}



function saveDoctorProfile() {

  localStorage.setItem('carepoint_doctor', JSON.stringify(AppState.doctorProfile));

}



// Icon SVG helper

const Icons = {

  'heart-pulse': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h4.27"/></svg>`,

  'bone': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10c.7-.7 1.69-1 2.5-1a2.5 2.5 0 1 1 0 5c-.28 0-.54-.04-.79-.11L7.1 21.7a2.5 2.5 0 1 1-3.8-3.8l7.8-11.61A2.5 2.5 0 0 1 11 5.5a2.5 2.5 0 1 1 5 0c0 .81-.3 1.8-1 2.5"/></svg>`,

  'brain': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/></svg>`,

  'sparkles': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,

  'stethoscope': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`,

  'lungs': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M12 8a5 5 0 0 0-5 5v5a3 3 0 0 0 3 3h2"/><path d="M12 8a5 5 0 0 1 5 5v5a3 3 0 0 1-3 3h-2"/></svg>`,

  'eye': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,

  'ear': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"/></svg>`,

  'pill': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`,

  'activity': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,

  'check': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,

  'calendar': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,

  'clock': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,

  'user': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,

  'arrow-right': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,

  'arrow-left': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,

  'shield-alert': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,

  'logout': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`

};



// Toast notification helper

function showToast(message, type = 'info') {

  const container = document.getElementById('toast-container');

  if (!container) return;



  const toast = document.createElement('div');

  toast.className = 'toast';

  toast.innerHTML = `

    <span>${Icons['heart-pulse']}</span>

    <div>${message}</div>

  `;

  container.appendChild(toast);



  setTimeout(() => {

    toast.style.opacity = '0';

    toast.style.transform = 'translateY(10px)';

    setTimeout(() => toast.remove(), 300);

  }, 3500);

}



// Router & View Management

function navigateTo(viewId) {

  // Normalize viewId

  let cleanId = viewId.replace(/^#/, '') || 'home';



  // Protect Patient Views

  const patientProtectedViews = ['patient-dashboard', 'my-appointments', 'patient-profile', 'assessment', 'assessment-processing', 'assessment-result', 'doctor-select', 'appointment-datetime', 'confirmation'];

  if (patientProtectedViews.includes(cleanId) && AppState.currentUser !== 'patient') {

    // If not logged in as patient, default auto-sign-in as demo patient for a friction-free prototype experience!

    AppState.currentUser = 'patient';

    localStorage.setItem('carepoint_session', 'patient');

    showToast('Signed in as demo patient: John Doe');

  }



  // Protect Doctor Views

  const doctorProtectedViews = ['doctor-dashboard', 'doctor-appointments', 'doctor-availability', 'doctor-profile'];

  if (doctorProtectedViews.includes(cleanId) && AppState.currentUser !== 'doctor') {

    AppState.currentUser = 'doctor';

    localStorage.setItem('carepoint_session', 'doctor');

    showToast('Signed in as demo doctor: Dr. Rahul Sharma');

  }



  // Hide all views

  const views = document.querySelectorAll('.spa-view');

  views.forEach(v => v.classList.remove('active'));



  const targetView = document.getElementById(`view-${cleanId}`);

  if (targetView) {

    targetView.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

  } else {

    // Fallback to home

    const homeView = document.getElementById('view-home');

    if (homeView) homeView.classList.add('active');

    cleanId = 'home';

  }



  // Update URL hash without causing recursive loop

  if (window.location.hash !== `#${cleanId}`) {

    window.history.pushState(null, '', `#${cleanId}`);

  }



  updateNavState(cleanId);

  updateDemoBarState(cleanId);



  // Trigger view-specific renderers

  handleViewMount(cleanId);

}



function updateNavState(currentView) {

  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {

    const href = link.getAttribute('href');

    if (href === `#${currentView}`) {

      link.classList.add('active');

    } else {

      link.classList.remove('active');

    }

  });



  const patientBtn = document.getElementById('nav-patient-btn');
  const docBtn = document.getElementById('nav-doctor-btn');
  const userGreeting = document.getElementById('nav-user-indicator');

  if (patientBtn && userGreeting) {
    if (AppState.currentUser === 'patient') {
      patientBtn.style.display = 'none';
      if (docBtn) docBtn.style.display = 'none';
      userGreeting.style.display = 'inline-flex';
      const pName = (AppState.patientProfile && AppState.patientProfile.name) || (typeof INITIAL_PATIENT !== 'undefined' && INITIAL_PATIENT.name) || 'Patient';
      userGreeting.innerHTML = '<span>👤</span> ' + pName.split(' ')[0];
    } else if (AppState.currentUser === 'doctor') {
      patientBtn.style.display = 'none';
      if (docBtn) docBtn.style.display = 'none';
      userGreeting.style.display = 'inline-flex';
      const docName = (AppState.doctorProfile && AppState.doctorProfile.name) || (typeof INITIAL_DOCTOR !== 'undefined' && INITIAL_DOCTOR.name) || 'Dr. Iyer';
      userGreeting.innerHTML = '<span>🩺</span> ' + (docName.split(' ')[0] || 'Dr. Iyer');
    } else {
      patientBtn.style.display = '';
      if (docBtn) docBtn.style.display = '';
      userGreeting.style.display = 'none';
    }
  }



  // Hide main header and footer when in doctor portal for a dedicated full-portal feel

  const isDoctorPortal = currentView.startsWith('doctor-') && currentView !== 'doctor-login';

  const mainHeader = document.querySelector('.main-header');

  const mainFooter = document.querySelector('.main-footer');

  if (mainHeader) mainHeader.style.display = isDoctorPortal ? 'none' : 'block';

  if (mainFooter) mainFooter.style.display = isDoctorPortal ? 'none' : 'block';

}



function updateDemoBarState(currentView) {

  // Prototype demo bar removed per user customization

}



function handleViewMount(viewId) {

  switch (viewId) {

    case 'home':

      renderDepartments();

      renderHomeDoctors();

      break;

    case 'departments':

      renderDepartments();

      break;

    case 'doctors':

      renderHomeDoctors();

      break;

    case 'patient-dashboard':

      renderPatientDashboard();

      break;

    case 'assessment':

      renderAssessmentQuestion();

      break;

    case 'assessment-processing':

      startAssessmentProcessing();

      break;

    case 'assessment-result':

      renderAssessmentResult();

      break;



    case 'my-appointments':

      renderMyAppointmentsView();

      break;

    case 'patient-profile':

      renderPatientProfileView();

      break;

    case 'doctor-dashboard':

      renderDoctorDashboard();

      break;

    case 'doctor-appointments':

      renderDoctorAppointmentsView();

      break;

    case 'doctor-availability':

      renderDoctorAvailabilityView();

      break;

    case 'doctor-profile':

      renderDoctorProfileView();

      break;

  }

}



// -------------------------------------------------------------

// Component Renderers

// -------------------------------------------------------------



// Departments

function renderDepartments() {

  const container = document.getElementById('departments-list');

  if (!container) return;



  container.innerHTML = DEPARTMENTS.map(dept => `

    <div class="dept-card">

      <div>

        <div class="dept-icon-box">

          ${Icons[dept.icon] || Icons['stethoscope']}

        </div>

        <h3>${dept.name}</h3>

        <p>${dept.description}</p>

      </div>

      <div>

        <div class="dept-meta">

          <span>${dept.specialistsCount} Specialists</span>

          <span>${dept.floor}</span>

        </div>

        <a href="#doctors" onclick="navigateTo('doctors')" class="dept-link">

          View Specialists <span>→</span>

        </a>

      </div>

    </div>

  `).join('');

}



// Home Doctors Grid

function renderHomeDoctors() {

  const container = document.getElementById('doctors-list');

  if (!container) return;



  const displayDoctors = DOCTORS.slice(0, 6);

  container.innerHTML = displayDoctors.map(doc => `

    <div class="doc-card">

      <div class="doc-card-top">

        <span class="doc-avail-badge">

          <span class="badge-dot" style="background-color: #059669"></span>

          ${doc.availableStatus}

        </span>

        <img src="${doc.avatar}" alt="${doc.name}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80';">

      </div>

      <div class="doc-card-body">

        <h3 class="doc-name">${doc.name}</h3>

        <p class="doc-specialty">${doc.specialisation}</p>

        <div class="doc-qual-exp">

          <span>🎓 ${doc.qualification}</span>

          <span>⏳ ${doc.experienceYears} yrs exp</span>

        </div>

        <p class="doc-bio">${doc.bio}</p>

        <div class="doc-card-footer">

          <button class="btn btn-secondary btn-sm btn-block" onclick="openDoctorModal('${doc.id}')">

            View Profile

          </button>

        </div>

      </div>

    </div>

  `).join('');

}



// Patient Dashboard Renderer

function renderPatientDashboard() {

  const greetingEl = document.getElementById('patient-greeting-name');

  if (greetingEl) {

    greetingEl.textContent = (AppState.patientProfile && AppState.patientProfile.name) ? AppState.patientProfile.name.split(' ')[0] : 'Patient';

  }



  // Find latest upcoming appointment

  const upcomingApt = AppState.appointments.find(a => a.status === 'Confirmed' || a.status === 'Upcoming');

  const container = document.getElementById('dash-upcoming-slot');



  if (container) {

    if (upcomingApt) {

      container.innerHTML = `

        <div class="apt-highlight-box">

          <div class="apt-highlight-doc">

            <img src="${getDoctorAvatar(upcomingApt.doctorId)}" alt="${upcomingApt.doctorName}" class="apt-doc-img">

            <div class="apt-doc-details">

              <h4>${upcomingApt.doctorName}</h4>

              <p>${upcomingApt.doctorSpecialisation} • ${upcomingApt.department}</p>

              <div style="margin-top: 0.35rem;">

                <span class="badge ${upcomingApt.priorityColor}">

                  <span class="badge-dot"></span>

                  ${upcomingApt.priority}

                </span>

                <span class="badge ice" style="margin-left: 0.35rem;">Confirmed</span>

              </div>

            </div>

          </div>

          <div class="apt-time-badge">

            <div class="date">${upcomingApt.date}</div>

            <div class="time">${upcomingApt.time}</div>

            <button class="btn btn-secondary btn-sm" style="margin-top: 0.5rem;" onclick="viewAppointmentDetail('${upcomingApt.id}')">

              View Details

            </button>

          </div>

        </div>

      `;

    } else {

      container.innerHTML = `

        <div style="text-align: center; padding: 2rem; background: var(--c-snow); border-radius: var(--radius-md);">

          <p style="color: var(--text-muted); margin-bottom: 1rem;">You have no upcoming appointments scheduled.</p>

          <button class="btn btn-primary btn-sm" onclick="navigateTo('assessment')">

            Book an Appointment Now

          </button>

        </div>

      `;

    }

  }

}



function getDoctorAvatar(docId) {

  const doc = DOCTORS.find(d => d.id === docId);

  return doc ? doc.avatar : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';

}



// -------------------------------------------------------------

// Health Assessment Questionnaire Flow

// -------------------------------------------------------------

function renderAssessmentQuestion() {

  const qIndex = AppState.currentAssessmentIndex;

  const question = ASSESSMENT_QUESTIONS[qIndex];

  if (!question) return;



  const total = ASSESSMENT_QUESTIONS.length;

  const currentStep = qIndex + 1;

  const progressPercent = Math.round((currentStep / total) * 100);



  // Update progress headers

  const stepText = document.getElementById('assessment-step-display');

  if (stepText) stepText.textContent = `Question ${currentStep} of ${total}`;



  const progressFill = document.getElementById('assessment-progress-bar');

  if (progressFill) progressFill.style.width = `${progressPercent}%`;



  const questionTitle = document.getElementById('assessment-question-title');

  if (questionTitle) questionTitle.textContent = question.title;



  const questionSubtext = document.getElementById('assessment-question-subtext');

  if (questionSubtext) questionSubtext.textContent = question.subtitle;



  // Options / Input Container

  const optionsContainer = document.getElementById('assessment-options-list');

  if (optionsContainer) {

    if (question.type === 'number') {

      const currentVal = AppState.assessmentAnswers[question.id]?.value !== undefined

        ? AppState.assessmentAnswers[question.id].value

        : (AppState.patientProfile?.age || '');



      // Ensure initial answer is pre-populated if patient profile has age

      if (currentVal && !AppState.assessmentAnswers[question.id]) {

        AppState.assessmentAnswers[question.id] = {

          id: `num-${currentVal}`,

          value: parseInt(currentVal, 10),

          label: `${currentVal} years old`

        };

      }



      optionsContainer.innerHTML = `

        <div style="background: #ffffff; border: 2px solid var(--c-light-blue); border-radius: var(--radius-md); padding: 2rem; max-width: 460px; margin: 0 auto; text-align: center;">

          <label for="assessment-age-input" style="display: block; font-weight: 700; color: var(--c-navy); margin-bottom: 0.75rem; font-size: 1.125rem;">

            Enter Patient Age

          </label>

          <div style="display: flex; gap: 0.75rem; align-items: center; justify-content: center; margin-bottom: 1.25rem;">

            <input

              type="number"

              id="assessment-age-input"

              class="form-control"

              style="font-size: 1.75rem; font-weight: 700; text-align: center; width: 120px; height: 3.5rem; color: var(--c-navy); border: 2px solid var(--c-light-blue); border-radius: var(--radius-md);"

              placeholder="45"

              min="1"

              max="120"

              value="${currentVal}"

              oninput="handleAssessmentNumberInput(${question.id}, this.value)"

              autofocus

            />

            <span style="font-weight: 700; color: var(--c-steel); font-size: 1.125rem;">Years Old</span>

          </div>

          <div style="border-top: 1px solid var(--surface-border-subtle); padding-top: 1rem;">

            <div style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 600;">Quick Select Bracket:</div>

            <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">

              ${[18, 28, 42, 58, 68].map(a => `

                <button type="button" class="btn btn-secondary btn-sm" onclick="setQuickAge(${question.id}, ${a})">${a} yrs</button>

              `).join('')}

            </div>

          </div>

        </div>

      `;

    } else if (question.options) {

      const availableOptions = question.options;

      const selectedAnswerId = AppState.assessmentAnswers[question.id]?.id;



      optionsContainer.innerHTML = availableOptions.map(opt => `

        <div class="option-card ${selectedAnswerId === opt.id ? 'selected' : ''}" onclick="selectAssessmentOption(${question.id}, '${opt.id}')">

          <div class="option-radio"></div>

          <div class="option-content">

            <div class="option-label">

              ${opt.label}

              ${opt.badge ? `<span class="badge urgent" style="margin-left: 0.5rem; font-size: 0.6875rem;">${opt.badge}</span>` : ''}

            </div>

            ${opt.description ? `<div class="option-description">${opt.description}</div>` : ''}

          </div>

        </div>

      `).join('');

    }

  }



  // Update navigation buttons

  const prevBtn = document.getElementById('assessment-prev-btn');

  if (prevBtn) {

    prevBtn.style.visibility = qIndex === 0 ? 'hidden' : 'visible';

  }



  const nextBtn = document.getElementById('assessment-next-btn');

  if (nextBtn) {

    if (currentStep === total) {

      nextBtn.innerHTML = `Submit for AI Triage ${Icons['arrow-right']}`;

      nextBtn.className = 'btn btn-primary';

    } else {

      nextBtn.innerHTML = `Next ${Icons['arrow-right']}`;

      nextBtn.className = 'btn btn-primary';

    }

  }

}



// =========================================================================

// M1 (ML Dept) & M3 (Backend Dept) Service Adapters

// =========================================================================



// Set this to your deployed Render service URL
const RENDER_BACKEND_URL = 'https://smart-doctor-tz81.onrender.com';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = (isLocal || !RENDER_BACKEND_URL) 
  ? 'http://localhost:5000/api' 
  : `${RENDER_BACKEND_URL.replace(/\/+$/, '')}/api`;

const CONFIG = {
  USE_LIVE_BACKEND: true,
  M3_API_BASE: API_BASE_URL,
  M1_ML_ENDPOINT: `${API_BASE_URL}/triage/evaluate`
};



/**

 * M1 - Machine Learning Department Adapter

 * Handles clinical triage prediction based on M1's trained classification model.

 * Input features strictly matching M1 dataset: age, gender, comorbidities, symptom_1, symptom_2, symptom_3.

 */

const M1_ML_Service = {

  buildPayload(answersList, patientProfile) {

    const answersMap = {};

    if (Array.isArray(answersList)) {

      answersList.forEach(item => {

        answersMap[item.questionId] = item.option || {};

      });

    }



    // 1. Age (must strictly be a Number)

    let age = (patientProfile && patientProfile.age) ? Number(patientProfile.age) : 38;

    if (answersMap[10] && answersMap[10].ageNum) {

      age = Number(answersMap[10].ageNum);

    }



    // 2. Gender ('Female' or 'Male')

    const gender = (patientProfile && patientProfile.gender === 'Female') ? 'Female' : 'Male';



    // 3. Comorbidities strictly from Ishika\'s permitted set

    let comorbidities = 'None';

    const q8 = answersMap[8]?.id || '';

    if (q8 === 'q8-1') comorbidities = 'Heart Disease';

    else if (q8 === 'q8-2') comorbidities = 'Diabetes, Hypertension';

    else if (q8 === 'q8-3') comorbidities = 'Hypertension';



    // 4. Map the 10 questions to one of Ishika\'s 10 trained symptom triplets

    let s1 = 'fever';

    let s2 = 'body pain';

    let s3 = 'cough';



    const q1Flag = answersMap[1]?.flag || '';

    const q4Id = answersMap[4]?.id || '';

    const q5Id = answersMap[5]?.id || '';

    const q7Id = answersMap[7]?.id || '';

    const q9Id = answersMap[9]?.id || '';



    if (q4Id === 'q4-1' || q1Flag === 'cardiac' || q1Flag === 'respiratory') {

      s1 = 'breathing difficulty';

      s2 = 'wheezing';

      s3 = 'chest tightness';

    } else if (q7Id === 'q7-1' || q7Id === 'q7-2') {

      s1 = 'headache';

      s2 = 'dizziness';

      s3 = 'blurred vision';

    } else if (q9Id === 'q9-1' || q1Flag === 'ortho') {

      s1 = 'high fever';

      s2 = 'joint pain';

      s3 = 'headache';

    } else if (q5Id === 'q5-1') {

      s1 = 'fever';

      s2 = 'chills';

      s3 = 'sweating';

    } else if (q1Flag === 'general') {

      s1 = 'fever';

      s2 = 'body pain';

      s3 = 'cough';

    } else if (q1Flag === 'derm') {

      s1 = 'cough';

      s2 = 'runny nose';

      s3 = 'sneezing';

    } else {

      s1 = 'thirst';

      s2 = 'fatigue';

      s3 = 'frequent urination';

    }



    return {

      age,

      gender,

      comorbidities,

      symptom_1: s1,

      symptom_2: s2,

      symptom_3: s3

    };

  },



  async evaluateTriage(answersList, patientProfile) {

    const payload = this.buildPayload(answersList, patientProfile);



    if (CONFIG.USE_LIVE_BACKEND) {

      try {

        const response = await fetch(CONFIG.M1_ML_ENDPOINT, {

          method: 'POST',

          headers: { 'Content-Type': 'application/json' },

          body: JSON.stringify(payload)

        });

        if (response.ok) {

          const result = await response.json();

          return this.formatM1Output(result, payload);

        }

      } catch (err) {

        console.warn('Live ML triage endpoint unreachable, falling back to local model:', err);

      }

    }

    // Fallback: Local simulated clinical triage evaluator (js/data.js)

    return evaluateAssessmentPriority(payload);

  },



  formatM1Output(m1Response, payload) {

    const rawPriority = m1Response.urgency || m1Response.priority || m1Response.prediction || 'Moderate';

    if (rawPriority === 'High' || rawPriority === 'Very Urgent') {
      return {
        level: 'Very Urgent',
        badgeClass: 'urgent',
        color: '#DC2626',
        bgTint: '#FEE2E2',
        headline: 'High-priority appointment',
        recommendedWindow: 'Today',
        description: 'Symptoms require immediate review today. Consultation is scheduled strictly for today without delay.',
        urgencyCode: 'High',
        features: payload
      };
    } else if (rawPriority === 'Medium' || rawPriority === 'Moderate') {
      return {
        level: 'Moderate',
        badgeClass: 'moderate',
        color: '#D97706',
        bgTint: '#FEF3C7',
        headline: 'Medium-priority appointment',
        recommendedWindow: 'Today or Tomorrow',
        description: 'Symptoms should be examined promptly. Choose between a consultation today or tomorrow.',
        urgencyCode: 'Medium',
        features: payload
      };
    } else {
      return {
        level: 'Not Urgent',
        badgeClass: 'not-urgent',
        color: '#059669',
        bgTint: '#D1FAE5',
        headline: 'Lower-priority appointment',
        recommendedWindow: 'Day after tomorrow or later this week',
        description: 'Non-acute condition. Choose day after tomorrow or select your preferred date later this week.',
        urgencyCode: 'Low',
        features: payload
      };

    }

  }

};



/**

 * M3 - Backend Department Adapter

 * Handles database persistence and REST API operations.

 */

const M3_Backend_Service = {

  async saveAppointment(newAppointment) {

    // Always save locally first — never block the UI on backend response
    AppState.appointments.unshift(newAppointment);

    saveAppointments();

    // Fire-and-forget to backend (don't await — Render cold start would freeze the page)
    if (CONFIG.USE_LIVE_BACKEND) {

      fetch(`${CONFIG.M3_API_BASE}/appointments`, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(newAppointment)

      }).catch(err => console.warn('Backend appointment sync failed:', err));

    }

    return newAppointment;

  }

};



function selectAssessmentOption(questionId, optionId) {

  const question = ASSESSMENT_QUESTIONS.find(q => q.id === questionId);

  if (!question || !question.options) return;

  const option = question.options.find(o => o.id === optionId);

  AppState.assessmentAnswers[questionId] = option;



  // Reset downstream selections if an upstream symptom changes to keep triplets valid

  if (questionId === 4) {

    delete AppState.assessmentAnswers[5];

    delete AppState.assessmentAnswers[6];

  } else if (questionId === 5) {

    delete AppState.assessmentAnswers[6];

  }



  renderAssessmentQuestion();

}



function handleAssessmentNumberInput(questionId, val) {

  const num = parseInt(val, 10);

  if (!isNaN(num) && num > 0) {

    AppState.assessmentAnswers[questionId] = {

      id: `num-${num}`,

      value: num,

      label: `${num} years old`

    };

  } else {

    delete AppState.assessmentAnswers[questionId];

  }

}



function setQuickAge(questionId, val) {

  AppState.assessmentAnswers[questionId] = {

    id: `num-${val}`,

    value: val,

    label: `${val} years old`

  };

  renderAssessmentQuestion();

}



function assessmentNext() {

  const currentQ = ASSESSMENT_QUESTIONS[AppState.currentAssessmentIndex];

  if (!AppState.assessmentAnswers[currentQ.id]) {

    showToast(currentQ.type === 'number' ? 'Please enter a valid age before continuing.' : 'Please select an option before continuing.');

    return;

  }



  if (AppState.currentAssessmentIndex < ASSESSMENT_QUESTIONS.length - 1) {

    AppState.currentAssessmentIndex++;

    renderAssessmentQuestion();

  } else {

    // Submit Assessment -> Route to processing

    navigateTo('assessment-processing');

  }

}



function assessmentPrev() {

  if (AppState.currentAssessmentIndex > 0) {

    AppState.currentAssessmentIndex--;

    renderAssessmentQuestion();

  }

}



// Intelligent doctor & slot assignment engine based on ML urgency + clinical department

function assignDoctorAndSlot(evaluation, features) {

  const s1 = (features?.symptom_1 || '').toLowerCase();

  const s2 = (features?.symptom_2 || '').toLowerCase();

  const s3 = (features?.symptom_3 || '').toLowerCase();



  const answers = AppState.assessmentAnswers || {};

  const q1Flag = answers[1]?.flag || '';

  const q4Id = answers[4]?.id || '';



  // Match medical department based on clinical symptoms + department flags
  let targetDepartment = 'General Medicine';

  if (q1Flag === 'cardiac' || q4Id === 'q4-1') {
    targetDepartment = 'Cardiology';
  } else if (q1Flag === 'respiratory' || s1.includes('breathing') || s2.includes('wheezing')) {
    targetDepartment = 'Pulmonology';
  } else if (q1Flag === 'general' || s1 === 'fever' || s2 === 'chills' || s2 === 'sweating' || s2 === 'body pain') {
    targetDepartment = 'General Medicine';
  } else if (q1Flag === 'ortho' || s2.includes('joint pain')) {
    targetDepartment = 'Orthopaedics';
  } else if (q1Flag === 'derm') {
    targetDepartment = 'Dermatology';
  } else if (s1.includes('headache') || s2.includes('dizziness') || s3.includes('blurred vision') || s3.includes('light sensitivity')) {
    targetDepartment = 'Neurology';
  } else if (s2.includes('stomach pain')) {
    targetDepartment = 'Gastroenterology';
  } else if (s1.includes('cough') || s2.includes('runny nose') || s3.includes('sneezing')) {
    targetDepartment = 'ENT';
  }



  // Find matching specialist from hospital directory safely

  const docsList = (typeof DOCTORS !== 'undefined' && Array.isArray(DOCTORS)) ? DOCTORS : [];

  let matchedDoc = docsList.find(d => {

    const dept = (d.department || d.departmentId || '').toLowerCase();

    const spec = (d.specialisation || '').toLowerCase();

    const target = targetDepartment.toLowerCase();

    return dept.includes(target) || spec.includes(target);

  })

  || docsList.find(d => (d.specialisation || '').toLowerCase().includes('general physician'))

  || docsList[0]

  || {

    id: 'doc-1',

    name: 'Dr. Meera Iyer',

    specialisation: 'Cardiologist',

    department: 'Cardiology',

    qualification: 'MD (Cardiology), FACC',

    experienceYears: 15,

    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'

  };



  // Build priority-based slot options
  const today = new Date();

  function fmtDate(d) {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function fmtISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  const todayDate    = new Date(today);
  const tomorrowDate = new Date(today); tomorrowDate.setDate(today.getDate() + 1);
  const dayAfterDate = new Date(today); dayAfterDate.setDate(today.getDate() + 2);
  const laterDate    = new Date(today); laterDate.setDate(today.getDate() + 4);

  // Pick available time slots from matched doctor, or sensible defaults
  const docSlots = (matchedDoc && Array.isArray(matchedDoc.slots) && matchedDoc.slots.length >= 2)
    ? matchedDoc.slots : ['10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM'];

  const todaySlot    = docSlots[0] || '10:00 AM';
  const tomorrowSlot = docSlots[1] || '02:30 PM';
  const laterSlot    = docSlots[2] || docSlots[0] || '04:00 PM';

  const priorityLevel = evaluation ? (evaluation.level || evaluation.urgencyCode) : 'Moderate';
  const isHighPriority = priorityLevel === 'Very Urgent' || priorityLevel === 'High';
  const isMedPriority  = priorityLevel === 'Moderate' || priorityLevel === 'Medium';

  let windowBadge = 'Today';
  let scheduledDate = fmtDate(todayDate);
  let scheduledTime = todaySlot;
  let slotOptions = {};

  if (isHighPriority) {
    windowBadge = 'Today Only (High Priority)';
    scheduledDate = fmtDate(todayDate);
    scheduledTime = todaySlot;
    slotOptions = {
      today: { label: 'Today Only', date: fmtDate(todayDate), time: todaySlot, iso: fmtISO(todayDate) }
    };
  } else if (isMedPriority) {
    windowBadge = 'Today or Tomorrow';
    scheduledDate = fmtDate(todayDate);
    scheduledTime = todaySlot;
    slotOptions = {
      today:    { label: 'Today',    date: fmtDate(todayDate),    time: todaySlot,    iso: fmtISO(todayDate) },
      tomorrow: { label: 'Tomorrow', date: fmtDate(tomorrowDate), time: tomorrowSlot, iso: fmtISO(tomorrowDate) }
    };
  } else {
    windowBadge = 'Day After Tomorrow or Later';
    scheduledDate = fmtDate(dayAfterDate);
    scheduledTime = laterSlot;
    slotOptions = {
      dayAfter: { label: 'Day After Tomorrow', date: fmtDate(dayAfterDate), time: laterSlot,    iso: fmtISO(dayAfterDate) },
      custom:   { label: 'Later Date',         date: fmtDate(laterDate),    time: tomorrowSlot, iso: fmtISO(laterDate) }
    };
  }

  const aptId = `APT${Math.floor(10000 + Math.random() * 90000)}`;

  const patient = AppState.patientProfile || (typeof INITIAL_PATIENT !== 'undefined' ? INITIAL_PATIENT : {});

  const newAppointment = {
    id: aptId,
    patientName: patient.name || 'John Doe',
    patientAge: features.age || patient.age || 38,
    patientGender: features.gender || patient.gender || 'Male',
    patientPhone: patient.phone || '+91 98765 43210',
    doctorId: matchedDoc.id || 'doc-1',
    doctorName: matchedDoc.name || 'Dr. Meera Iyer',
    doctorSpecialisation: matchedDoc.specialisation || 'Cardiologist',
    department: matchedDoc.department || matchedDoc.specialisation || 'Cardiology',
    doctorAvatar: matchedDoc.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    doctorQualification: matchedDoc.qualification || 'MD (Cardiology), FACC',
    doctorExperience: matchedDoc.experienceYears || 15,
    date: scheduledDate,
    time: scheduledTime,
    room: `OPD Wing Room ${Math.floor(201 + Math.random() * 15)}`,
    priority: evaluation ? evaluation.level : 'Moderate',
    priorityColor: evaluation ? evaluation.badgeClass : 'moderate',
    status: 'Confirmed',
    concern: `${s1 ? s1.charAt(0).toUpperCase() + s1.slice(1) : 'Clinical triage review'} (${s2 || 'accompanying symptoms'})`,
    urgencyReason: `AI Scheduled Slot (${windowBadge})`,
    slotOptions,
    slotChosen: false
  };



  return newAppointment;

}



async function startAssessmentProcessing() {

  try {

    const answersList = Object.entries(AppState.assessmentAnswers).map(([qId, option]) => ({

      questionId: parseInt(qId),

      option

    }));



    // M1 ML Department: Predicts appointment priority ONLY (Patient Assessment -> Priority)

    const evaluation = await M1_ML_Service.evaluateTriage(answersList, AppState.patientProfile);



    AppState.currentEvaluation = evaluation;

    AppState.bookingFlow.priority = evaluation;



    // Auto-assign doctor based on priority & symptoms

    const assignedApt = assignDoctorAndSlot(evaluation, evaluation ? evaluation.features || {} : {});

    AppState.lastBookedAppointment = assignedApt;

    // Persist to localStorage so result page survives a reload

    try { localStorage.setItem('carepoint_last_apt', JSON.stringify(assignedApt)); } catch(e) {}

    try { localStorage.setItem('carepoint_last_eval', JSON.stringify(evaluation)); } catch(e) {}

    await M3_Backend_Service.saveAppointment(assignedApt);

  } catch (err) {

    console.error('Error during assessment processing:', err);

    const fallbackEval = evaluateAssessmentPriority([]);

    AppState.currentEvaluation = fallbackEval;

    AppState.bookingFlow.priority = fallbackEval;

    AppState.lastBookedAppointment = assignDoctorAndSlot(fallbackEval, {});

  } finally {
    // Display the 'Analysing your responses...' pulsing dialog for 1.8s
    setTimeout(() => {
      navigateTo('assessment-result');
    }, 1800);
  }

}



function renderAssessmentResult() {

  // Restore from localStorage if page was reloaded

  if (!AppState.lastBookedAppointment) {

    try { AppState.lastBookedAppointment = JSON.parse(localStorage.getItem('carepoint_last_apt')); } catch(e) {}

  }

  if (!AppState.currentEvaluation) {

    try { AppState.currentEvaluation = JSON.parse(localStorage.getItem('carepoint_last_eval')); } catch(e) {}

  }

  const evalResult = AppState.currentEvaluation || evaluateAssessmentPriority([]);

  const resultCard = document.getElementById('assessment-result-card');

  if (!resultCard) return;



  const apt = AppState.lastBookedAppointment;

  const headerClass = evalResult.badgeClass;



  resultCard.innerHTML = `

    <div class="result-header ${headerClass}">

      <div class="result-pill-large badge ${evalResult.badgeClass}">

        <span class="badge-dot"></span>

        ${evalResult.level} Priority

      </div>

      <h2 class="result-headline">${evalResult.headline}</h2>

      <p class="result-recommendation">Recommended consultation window: <strong>${evalResult.recommendedWindow}</strong></p>

    </div>

    <div class="result-body">

      <div class="recommend-window-box">

        <h4>Target Appointment Window</h4>

        <div class="timeframe">${evalResult.recommendedWindow}</div>

        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.5rem;">

          ${evalResult.description}

        </p>

      </div>



      <!-- AI-Assigned Doctor & Scheduled Appointment Card -->

      ${apt ? `

        <div style="background: #ffffff; border: 2px solid var(--c-navy); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; text-align: left; box-shadow: var(--shadow-md);">

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--surface-border-subtle); padding-bottom: 0.75rem;">

            <div style="display: flex; align-items: center; gap: 0.5rem;">

              <span style="display: inline-flex; align-items: center; justify-content: center; width: 1.75rem; height: 1.75rem; background: var(--c-navy); color: #ffffff; border-radius: 50%; font-size: 0.875rem; font-weight: 800;">✓</span>

              <span style="font-weight: 800; color: var(--c-navy); font-size: 1.0625rem;">AI-Assigned Specialist & Confirmed Slot</span>

            </div>

            <span style="font-size: 0.8125rem; font-weight: 700; color: var(--c-steel);">#${apt.id}</span>

          </div>



          <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.25rem;">

            <img src="${apt.doctorAvatar}" alt="${apt.doctorName}" style="width: 4rem; height: 4rem; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--c-light-blue);" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80';">

            <div>

              <h3 style="font-size: 1.125rem; font-weight: 800; color: var(--c-navy); margin-bottom: 0.25rem;">${apt.doctorName}</h3>

              <p style="font-size: 0.875rem; color: var(--c-steel); margin-bottom: 0.25rem; font-weight: 600;">${apt.doctorSpecialisation} • ${apt.department}</p>

              <p style="font-size: 0.75rem; color: var(--text-muted);">${apt.doctorQualification} (${apt.doctorExperience} yrs exp)</p>

            </div>

          </div>



          <div style="background: var(--c-snow); border: 1px solid var(--surface-border); border-radius: var(--radius-md); padding: 0.875rem 1rem; margin-bottom: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; font-size: 0.875rem;">

            <div><span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600;">Date:</span> <strong style="color: var(--c-navy);">${apt.date}</strong></div>

            <div><span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600;">Time Slot:</span> <strong style="color: var(--c-navy);">${apt.time}</strong></div>

            <div><span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600;">Location:</span> <strong style="color: var(--c-navy);">${apt.room}</strong></div>

          </div>



          <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.8125rem; color: var(--c-steel);">

            <span>💡</span> <span>Appointment automatically scheduled based on clinical triage urgency and saved to your account.</span>

          </div>

        </div>

      ` : ''}



      <div class="triage-disclaimer-note">

        <span style="color: var(--c-navy);">${Icons['shield-alert']}</span>

        <div>

          <strong>CarePoint Clinical Triage Note:</strong>

          Priority triage helps ensure patients with time-sensitive symptoms receive timely care. If you experience severe chest pain, sudden paralysis, or loss of consciousness, please call emergency services immediately.

        </div>

      </div>



      ${evalResult.features ? `

        <div style="background: var(--surface-bg-card); border: 1px solid var(--surface-border); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.5rem; text-align: left;">

          <div style="font-size: 0.75rem; font-weight: 700; color: var(--c-steel); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">

            🧬 Evaluated Clinical Profile (ML Model Features)

          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; font-size: 0.8125rem;">

            <div><span style="color: var(--text-muted);">Age & Sex:</span> <strong style="color: var(--c-navy); display: block;">${evalResult.features.age || '—'} yrs, ${evalResult.features.gender || '—'}</strong></div>

            <div><span style="color: var(--text-muted);">Condition:</span> <strong style="color: var(--c-navy); display: block;">${evalResult.features.comorbidities || 'None'}</strong></div>

            <div><span style="color: var(--text-muted);">Primary:</span> <strong style="color: var(--c-navy); display: block;">${evalResult.features.symptom_1 || '—'}</strong></div>

            <div><span style="color: var(--text-muted);">Secondary:</span> <strong style="color: var(--c-navy); display: block;">${evalResult.features.symptom_2 || '—'}</strong></div>

            <div><span style="color: var(--text-muted);">Additional:</span> <strong style="color: var(--c-navy); display: block;">${evalResult.features.symptom_3 || '—'}</strong></div>

          </div>

        </div>

      ` : ''}



      ${apt && !apt.slotChosen ? `
        <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: var(--radius-md); padding: 0.85rem 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.6rem; text-align: left;">
          <span style="font-size: 1.25rem;">⏳</span>
          <span style="font-size: 0.8125rem; color: #92400E; font-weight: 600;">
            Urgency Evaluated: Please select your preferred day &amp; timing below to lock your appointment.
          </span>
        </div>
      ` : `
        <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: var(--radius-md); padding: 0.85rem 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.6rem; text-align: left;">
          <span style="font-size: 1.25rem;">🔒</span>
          <span style="font-size: 0.8125rem; color: #166534; font-weight: 600;">
            Fixed Appointment Confirmed — This specialist consultation slot is locked based on your clinical triage assessment.
          </span>
        </div>
      `}

      <div class="result-actions" id="slot-choice-section">
        ${apt && !apt.slotChosen ? `
          <div style="background: #EFF6FF; border: 2px solid var(--c-navy); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.25rem; text-align: left;">
            <div style="font-weight: 800; color: ${isHighPriority ? '#DC2626' : 'var(--c-navy)'}; font-size: 1.05rem; margin-bottom: 0.25rem;">
              ${isHighPriority ? '🚨 Immediate Appointment Today (High Priority)' : (isMedPriority ? '📅 Choose Consultation Day: Today or Tomorrow' : '📆 Routine Consultation: Day After Tomorrow or Pick a Date')}
            </div>
            <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 1.25rem;">
              ${isHighPriority 
                ? `Clinical triage has evaluated your symptoms as <strong>High Priority</strong>. Consultations are scheduled <strong>strictly for today</strong> with <strong>${apt.doctorName}</strong> — no delayed dates permitted:`
                : (isMedPriority 
                  ? `Medium urgency assessment matched to <strong>${apt.doctorName}</strong>. Select your consultation slot between <strong>Today</strong> or <strong>Tomorrow</strong>:`
                  : `Routine review matched to <strong>${apt.doctorName}</strong>. Select <strong>Day After Tomorrow</strong> or pick a custom date later this week:`)}
            </p>

            ${isHighPriority ? `
              <div style="max-width: 380px; margin: 0 auto;">
                <button type="button" onclick="confirmSlotChoice('${apt.id}', 'today')"
                  style="width: 100%; border: 2px solid #DC2626; border-radius: var(--radius-md); padding: 1.25rem 1rem; background: #FEF2F2; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 4px 12px rgba(220,38,38,0.15);"
                  onmouseover="this.style.background='#FEE2E2';" onmouseout="this.style.background='#FEF2F2';">
                  <div style="display: inline-block; background: #DC2626; color: #fff; font-size: 0.6875rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 999px; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">🚨 Today Only — Single Priority Slot</div>
                  <div style="font-size: 1.5rem; margin-bottom: 0.35rem;">⚡</div>
                  <div style="font-weight: 800; color: #991B1B; font-size: 1.1rem;">Today</div>
                  <div style="font-size: 0.8125rem; color: #7F1D1D; margin-top: 0.25rem; font-weight: 600;">${apt.slotOptions?.today?.date || apt.date}</div>
                  <div style="font-size: 0.9375rem; font-weight: 800; color: #DC2626; margin-top: 0.35rem;">⏰ ${apt.slotOptions?.today?.time || apt.time}</div>
                  <div style="font-size: 0.75rem; color: #991B1B; margin-top: 0.35rem;">${apt.doctorName} • ${apt.room}</div>
                  <div style="margin-top: 0.75rem; background: #DC2626; color: #fff; padding: 0.55rem 0.85rem; border-radius: 4px; font-size: 0.8125rem; font-weight: 700;">Lock Today's Appointment →</div>
                </button>
              </div>
            ` : ''}

            ${isMedPriority ? `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
                <button type="button" onclick="confirmSlotChoice('${apt.id}', 'today')"
                  style="border: 2px solid var(--c-navy); border-radius: var(--radius-md); padding: 1.25rem 1rem; background: #ffffff; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,128,0.06);"
                  onmouseover="this.style.background='#EEF2FF'; this.style.borderColor='#000080';" onmouseout="this.style.background='#ffffff'; this.style.borderColor='var(--c-navy)';">
                  <div style="display: inline-block; background: #D97706; color: #fff; font-size: 0.6875rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 999px; text-transform: uppercase; margin-bottom: 0.5rem;">Earliest Slot</div>
                  <div style="font-size: 1.5rem; margin-bottom: 0.35rem;">⚡</div>
                  <div style="font-weight: 800; color: var(--c-navy); font-size: 1rem;">Today</div>
                  <div style="font-size: 0.8125rem; color: var(--c-steel); margin-top: 0.25rem;">${apt.slotOptions?.today?.date || apt.date}</div>
                  <div style="font-size: 0.9375rem; font-weight: 800; color: #059669; margin-top: 0.35rem;">⏰ ${apt.slotOptions?.today?.time || apt.time}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">${apt.doctorName} • ${apt.room}</div>
                  <div style="margin-top: 0.75rem; background: var(--c-navy); color: #fff; padding: 0.45rem 0.75rem; border-radius: 4px; font-size: 0.8125rem; font-weight: 700;">Select Today →</div>
                </button>
                <button type="button" onclick="confirmSlotChoice('${apt.id}', 'tomorrow')"
                  style="border: 2px solid var(--surface-border); border-radius: var(--radius-md); padding: 1.25rem 1rem; background: #ffffff; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.04);"
                  onmouseover="this.style.background='#F0FDF4'; this.style.borderColor='#059669';" onmouseout="this.style.background='#ffffff'; this.style.borderColor='var(--surface-border)';">
                  <div style="display: inline-block; background: #059669; color: #fff; font-size: 0.6875rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 999px; text-transform: uppercase; margin-bottom: 0.5rem;">Next Day Slot</div>
                  <div style="font-size: 1.5rem; margin-bottom: 0.35rem;">🌅</div>
                  <div style="font-weight: 800; color: var(--c-navy); font-size: 1rem;">Tomorrow</div>
                  <div style="font-size: 0.8125rem; color: var(--c-steel); margin-top: 0.25rem;">${apt.slotOptions?.tomorrow?.date || ''}</div>
                  <div style="font-size: 0.9375rem; font-weight: 800; color: #059669; margin-top: 0.35rem;">⏰ ${apt.slotOptions?.tomorrow?.time || apt.time}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">${apt.doctorName} • ${apt.room}</div>
                  <div style="margin-top: 0.75rem; background: var(--c-steel); color: #fff; padding: 0.45rem 0.75rem; border-radius: 4px; font-size: 0.8125rem; font-weight: 700;">Select Tomorrow →</div>
                </button>
              </div>
            ` : ''}

            ${isLowPriority ? `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1rem;">
                <button type="button" onclick="confirmSlotChoice('${apt.id}', 'dayAfter')"
                  style="border: 2px solid var(--c-navy); border-radius: var(--radius-md); padding: 1.25rem 1rem; background: #ffffff; cursor: pointer; text-align: center; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,128,0.06);"
                  onmouseover="this.style.background='#EEF2FF'; this.style.borderColor='#000080';" onmouseout="this.style.background='#ffffff'; this.style.borderColor='var(--c-navy)';">
                  <div style="display: inline-block; background: #059669; color: #fff; font-size: 0.6875rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 999px; text-transform: uppercase; margin-bottom: 0.5rem;">Recommended</div>
                  <div style="font-size: 1.5rem; margin-bottom: 0.35rem;">📆</div>
                  <div style="font-weight: 800; color: var(--c-navy); font-size: 1rem;">Day After Tomorrow</div>
                  <div style="font-size: 0.8125rem; color: var(--c-steel); margin-top: 0.25rem;">${apt.slotOptions?.dayAfter?.date || apt.date}</div>
                  <div style="font-size: 0.9375rem; font-weight: 800; color: #059669; margin-top: 0.35rem;">⏰ ${apt.slotOptions?.dayAfter?.time || apt.time}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">${apt.doctorName} • ${apt.room}</div>
                  <div style="margin-top: 0.75rem; background: var(--c-navy); color: #fff; padding: 0.45rem 0.75rem; border-radius: 4px; font-size: 0.8125rem; font-weight: 700;">Select Day After →</div>
                </button>
                <div style="border: 2px solid var(--surface-border); border-radius: var(--radius-md); padding: 1.25rem 1rem; background: #FAFAFA; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="display: inline-block; background: var(--c-steel); color: #fff; font-size: 0.6875rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 999px; text-transform: uppercase; margin-bottom: 0.5rem;">Flexible Option</div>
                    <div style="font-size: 1.5rem; margin-bottom: 0.35rem;">📅</div>
                    <div style="font-weight: 800; color: var(--c-navy); font-size: 1rem;">Choose Later Date</div>
                    <div style="margin: 0.6rem 0;">
                      <input type="date" id="custom-slot-date" min="${apt.slotOptions?.dayAfter?.iso || ''}" value="${apt.slotOptions?.custom?.iso || ''}"
                        style="padding: 0.45rem 0.6rem; border: 1.5px solid var(--c-navy); border-radius: 4px; font-size: 0.875rem; width: 90%; max-width: 200px; text-align: center; color: var(--c-navy); font-weight: 700; background: #ffffff;">
                    </div>
                    <div style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 0.4rem;">Slot: ⏰ ${apt.slotOptions?.dayAfter?.time || '02:30 PM'}</div>
                  </div>
                  <button type="button" onclick="confirmCustomDateChoice('${apt.id}', '${apt.slotOptions?.dayAfter?.time || '02:30 PM'}')"
                    style="margin-top: 0.5rem; background: #059669; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.8125rem; font-weight: 700; cursor: pointer; width: 100%; transition: all 0.2s;"
                    onmouseover="this.style.background='#047857';" onmouseout="this.style.background='#059669';">
                    Lock Custom Date →
                  </button>
                </div>
              </div>
            ` : ''}

          </div>
        ` : `
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-align: center;">
            <span style="font-size: 1.15rem;">✅</span>
            <div style="font-size: 0.8125rem; color: #166534; font-weight: 600;">
              Slot Confirmed: <strong>${apt ? apt.date : ''}</strong> at <strong>${apt ? apt.time : ''}</strong> with ${apt ? apt.doctorName : ''}
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
            <button class="btn btn-primary btn-sm" onclick="downloadAppointmentSlip('${apt ? apt.id : ''}')" style="background: var(--c-navy); color: #ffffff; display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem; font-weight: 700; padding: 0.55rem 1.4rem; font-size: 0.875rem; border-radius: var(--radius-md); box-shadow: 0 2px 6px rgba(0,0,128,0.2);">
              <span>📥</span> Download Appointment Slip
            </button>
            <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-top: 0.25rem;">
              <button class="btn btn-secondary btn-sm" onclick="navigateTo('my-appointments')" style="font-size: 0.8125rem; padding: 0.45rem 0.95rem;">
                My Appointments →
              </button>
              <button class="btn btn-secondary btn-sm" onclick="navigateTo('patient-dashboard')" style="font-size: 0.8125rem; padding: 0.45rem 0.95rem;">
                Dashboard
              </button>
            </div>
          </div>
        `}
      </div>

    </div>

  `;

}



function confirmSlotChoice(aptId, slotKey, customDate, customTime) {
  // Show reloading state immediately
  const container = document.getElementById('slot-choice-section');
  if (container) {
    container.innerHTML = `
      <div style="background: #EFF6FF; border: 2px solid var(--c-navy); border-radius: var(--radius-lg); padding: 2rem 1.5rem; text-align: center; box-shadow: 0 4px 12px rgba(0,0,128,0.08);">
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.6rem; margin-bottom: 0.5rem;">
          <span class="spin-loader" style="font-size: 1.5rem; color: var(--c-navy);">🔄</span>
          <span style="font-size: 1rem; font-weight: 800; color: var(--c-navy);">Confirming Slot &amp; Generating Slip...</span>
        </div>
        <p style="font-size: 0.8125rem; color: var(--c-steel); margin: 0;">Locking consultation with doctor and updating hospital schedule.</p>
      </div>
    `;
  }

  setTimeout(() => {
    // Update the appointment with the chosen slot
    const apt = AppState.appointments.find(a => a.id === aptId) || AppState.lastBookedAppointment;
    if (apt) {
      if (customDate) {
        apt.date = customDate;
        apt.time = customTime || apt.time;
      } else if (apt.slotOptions && apt.slotOptions[slotKey]) {
        apt.date = apt.slotOptions[slotKey].date;
        apt.time = apt.slotOptions[slotKey].time;
      }
      apt.slotChosen = true;
    }
    if (AppState.lastBookedAppointment && AppState.lastBookedAppointment.id === aptId) {
      if (customDate) {
        AppState.lastBookedAppointment.date = customDate;
        AppState.lastBookedAppointment.time = customTime || AppState.lastBookedAppointment.time;
      } else if (apt) {
        AppState.lastBookedAppointment.date = apt.date;
        AppState.lastBookedAppointment.time = apt.time;
      }
      AppState.lastBookedAppointment.slotChosen = true;
    }
    saveAppointments();
    // Re-render result page to show confirmed state with compact buttons
    renderAssessmentResult();
    showToast('Appointment slot confirmed! Opening slip...');
    setTimeout(() => downloadAppointmentSlip(aptId), 700);
  }, 850);
}

function confirmCustomDateChoice(aptId, defaultTime) {
  const dateInput = document.getElementById('custom-slot-date');
  const chosenIso = dateInput ? dateInput.value : '';
  let formatted = chosenIso;
  if (chosenIso) {
    const parts = chosenIso.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }
  confirmSlotChoice(aptId, 'custom', formatted, defaultTime);
}

function restartAssessment() {

  AppState.currentAssessmentIndex = 0;

  AppState.assessmentAnswers = {};

  AppState.currentEvaluation = null;

  navigateTo('assessment');

}



// -------------------------------------------------------------

// Doctor Selection & Booking Flow

// -------------------------------------------------------------

// -------------------------------------------------------------

// My Appointments Screen

// -------------------------------------------------------------

let myAppointmentsFilter = 'all';




// -------------------------------------------------------------
// Official CarePoint Appointment Slip Generator & Downloader
// -------------------------------------------------------------
function downloadAppointmentSlip(aptId) {
  let apt = null;
  if (aptId) {
    apt = AppState.appointments.find(a => a.id === aptId);
  }
  if (!apt) {
    apt = AppState.lastBookedAppointment || (AppState.appointments && AppState.appointments[0]);
  }

  if (!apt) {
    showToast('No confirmed appointment found to generate slip.');
    return;
  }

  const modal = document.getElementById('details-modal');
  const modalContent = document.getElementById('details-modal-content');
  if (!modal || !modalContent) return;

  const priorityColor = apt.priorityColor === 'urgent' ? '#DC2626' : (apt.priorityColor === 'moderate' ? '#D97706' : '#059669');
  const priorityBg = apt.priorityColor === 'urgent' ? '#FEE2E2' : (apt.priorityColor === 'moderate' ? '#FEF3C7' : '#D1FAE5');

  modalContent.innerHTML = `
    <div id="printable-appointment-slip" style="background: #ffffff; border: 2px dashed #000080; border-radius: var(--radius-md); padding: 1.75rem; text-align: left; font-family: inherit; color: #1e293b;">
      <!-- Hospital Letterhead -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000080; padding-bottom: 1rem; margin-bottom: 1.25rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span style="font-size: 1.5rem;">🏥</span>
            <span style="font-size: 1.35rem; font-weight: 800; color: #000080; letter-spacing: -0.02em;">CarePoint Hospital</span>
          </div>
          <p style="font-size: 0.75rem; color: #6D8196; margin: 0; line-height: 1.4;">
            Main OPD Campus • Plot 14, Institutional Area, Saket, New Delhi – 110017<br>
            24x7 Emergency: +91 1800-CAREPOINT • www.carepoint.hospital
          </p>
        </div>
        <div style="text-align: right;">
          <div style="background: #000080; color: #ffffff; font-size: 0.6875rem; font-weight: 800; padding: 0.25rem 0.6rem; border-radius: 4px; display: inline-block; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">
            Official OPD Slip
          </div>
          <div style="font-size: 0.8125rem; font-weight: 700; color: #000080;">Token: #${apt.id}</div>
          <div style="font-size: 0.6875rem; color: #6D8196;">Issued: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <!-- Priority Strip -->
      <div style="background: ${priorityBg}; border-left: 4px solid ${priorityColor}; padding: 0.6rem 0.85rem; border-radius: 4px; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.8125rem; font-weight: 700; color: ${priorityColor}; text-transform: uppercase; letter-spacing: 0.04em;">
          Clinical Urgency: ${apt.priority} Priority
        </span>
        <span style="font-size: 0.75rem; color: #1e293b; font-weight: 600;">Status: Confirmed & Locked</span>
      </div>

      <!-- Patient Details Box -->
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: var(--radius-sm); padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
        <div style="font-size: 0.6875rem; font-weight: 700; color: #6D8196; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
          Patient Details
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem; font-size: 0.8125rem;">
          <div><span style="color: #6D8196; display: block; font-size: 0.6875rem;">Patient Name:</span> <strong>${apt.patientName || 'John Doe'}</strong></div>
          <div><span style="color: #6D8196; display: block; font-size: 0.6875rem;">Age / Sex:</span> <strong>${apt.patientAge || '38'} Yrs / ${apt.patientGender || 'Male'}</strong></div>
          <div><span style="color: #6D8196; display: block; font-size: 0.6875rem;">Contact:</span> <strong>${apt.patientPhone || '+91 98765 43210'}</strong></div>
          <div><span style="color: #6D8196; display: block; font-size: 0.6875rem;">Triage Concern:</span> <strong style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; display: block;">${apt.concern || 'Clinical consultation'}</strong></div>
        </div>
      </div>

      <!-- Assigned Consultation Details Box -->
      <div style="background: #F0F7FF; border: 1px solid #BAE6FD; border-radius: var(--radius-sm); padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
        <div style="font-size: 0.6875rem; font-weight: 700; color: #000080; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
          Consultation & Doctor Assignment
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; font-size: 0.8125rem;">
          <div>
            <span style="color: #6D8196; display: block; font-size: 0.6875rem;">Assigned Doctor:</span>
            <strong style="color: #000080; font-size: 0.9375rem; display: block;">${apt.doctorName}</strong>
            <span style="font-size: 0.75rem; color: #475569;">${apt.doctorSpecialisation} (${apt.department})</span>
          </div>
          <div>
            <span style="color: #6D8196; display: block; font-size: 0.6875rem;">Appointment Date:</span>
            <strong style="color: #000080; font-size: 0.9375rem; display: block;">${apt.date}</strong>
            <span style="font-size: 0.75rem; color: #475569;">Slot: ${apt.time}</span>
          </div>
          <div>
            <span style="color: #6D8196; display: block; font-size: 0.6875rem;">Room / Location:</span>
            <strong style="color: #000080; font-size: 0.9375rem; display: block;">${apt.room || 'OPD Room 204'}</strong>
            <span style="font-size: 0.75rem; color: #475569;">Floor 2, West Wing</span>
          </div>
        </div>
      </div>

      <!-- Barcode Visual Placeholder -->
      <div style="text-align: center; border-top: 1px dashed #CBD5E1; padding-top: 1rem; margin-bottom: 1rem;">
        <svg style="margin: 0 auto; max-width: 220px; height: 40px; display: block;" viewBox="0 0 200 40">
          <rect x="0" y="0" width="3" height="35" fill="#000080"/>
          <rect x="5" y="0" width="2" height="35" fill="#000080"/>
          <rect x="9" y="0" width="4" height="35" fill="#000080"/>
          <rect x="15" y="0" width="2" height="35" fill="#000080"/>
          <rect x="20" y="0" width="5" height="35" fill="#000080"/>
          <rect x="28" y="0" width="2" height="35" fill="#000080"/>
          <rect x="33" y="0" width="4" height="35" fill="#000080"/>
          <rect x="40" y="0" width="2" height="35" fill="#000080"/>
          <rect x="45" y="0" width="3" height="35" fill="#000080"/>
          <rect x="52" y="0" width="6" height="35" fill="#000080"/>
          <rect x="61" y="0" width="2" height="35" fill="#000080"/>
          <rect x="66" y="0" width="4" height="35" fill="#000080"/>
          <rect x="73" y="0" width="3" height="35" fill="#000080"/>
          <rect x="80" y="0" width="5" height="35" fill="#000080"/>
          <rect x="88" y="0" width="2" height="35" fill="#000080"/>
          <rect x="94" y="0" width="4" height="35" fill="#000080"/>
          <rect x="101" y="0" width="3" height="35" fill="#000080"/>
          <rect x="108" y="0" width="5" height="35" fill="#000080"/>
          <rect x="116" y="0" width="2" height="35" fill="#000080"/>
          <rect x="122" y="0" width="4" height="35" fill="#000080"/>
          <rect x="129" y="0" width="3" height="35" fill="#000080"/>
          <rect x="135" y="0" width="5" height="35" fill="#000080"/>
          <rect x="143" y="0" width="2" height="35" fill="#000080"/>
          <rect x="150" y="0" width="4" height="35" fill="#000080"/>
          <rect x="157" y="0" width="3" height="35" fill="#000080"/>
          <rect x="165" y="0" width="5" height="35" fill="#000080"/>
          <rect x="173" y="0" width="2" height="35" fill="#000080"/>
          <rect x="180" y="0" width="4" height="35" fill="#000080"/>
          <rect x="188" y="0" width="3" height="35" fill="#000080"/>
          <rect x="194" y="0" width="4" height="35" fill="#000080"/>
        </svg>
        <span style="font-family: monospace; font-size: 0.75rem; letter-spacing: 0.15em; color: #475569;">*${apt.id}*</span>
      </div>

      <!-- Instructions -->
      <div style="font-size: 0.6875rem; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 0.75rem;">
        <strong>Instructions for Patient:</strong>
        <ol style="margin: 0.25rem 0 0 1rem; padding: 0;">
          <li>Please present this digital or printed slip at the OPD registration desk 15 minutes prior to your time slot.</li>
          <li>Bring previous diagnostic scans, prescriptions, and any government ID proof.</li>
          <li>For emergency assistance, contact the hospital helpdesk at 1800-CAREPOINT.</li>
        </ol>
      </div>
    </div>

    <div class="no-print" style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
      <button class="btn btn-secondary btn-sm" onclick="closeModal()" style="font-size: 0.8125rem; padding: 0.45rem 0.95rem;">Close</button>
      <button class="btn btn-primary btn-sm" onclick="window.print()" style="background: #000080; color: #fff; display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.8125rem; font-weight: 700; padding: 0.45rem 1.15rem;">
        <span>🖨️</span> Print / Save PDF
      </button>
    </div>
  `;

  modal.classList.add('active');
}


function renderMyAppointmentsView() {

  const listContainer = document.getElementById('my-appointments-list');

  if (!listContainer) return;



  let filtered = AppState.appointments;

  if (myAppointmentsFilter !== 'all') {

    filtered = AppState.appointments.filter(a => a.status.toLowerCase() === myAppointmentsFilter.toLowerCase());

  }



  if (filtered.length === 0) {

    listContainer.innerHTML = `

      <div style="text-align: center; padding: 3.5rem; background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--surface-border);">

        <p style="color: var(--text-muted); margin-bottom: 1.25rem;">No appointments found in this category.</p>

        <button class="btn btn-primary" onclick="navigateTo('assessment')">Book an Appointment</button>

      </div>

    `;

    return;

  }



  listContainer.innerHTML = filtered.map(apt => `

    <div class="apt-card-item">

      <div class="apt-info-block">

        <img src="${getDoctorAvatar(apt.doctorId)}" alt="${apt.doctorName}" style="width: 3.5rem; height: 3.5rem; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--c-ice);">

        <div>

          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">

            <h4 style="font-weight: 700; color: var(--c-navy);">${apt.doctorName}</h4>

            <span style="font-size: 0.75rem; color: var(--c-steel);">#${apt.id}</span>

          </div>

          <p style="font-size: 0.8125rem; color: var(--c-steel); margin-bottom: 0.35rem;">${apt.doctorSpecialisation} • ${apt.department}</p>

          <div style="display: flex; align-items: center; gap: 0.5rem;">

            <span class="badge ${apt.priorityColor}"><span class="badge-dot"></span>${apt.priority}</span>

            <span class="badge ${apt.status === 'Confirmed' ? 'ice' : 'neutral'}">${apt.status}</span>

          </div>

        </div>

      </div>

      <div style="text-align: right;">

        <div style="font-weight: 700; color: var(--c-navy);">${apt.date}</div>

        <div style="font-size: 0.8125rem; color: var(--c-steel); margin-bottom: 0.75rem;">${apt.time}</div>

        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">

          <button class="btn btn-primary btn-sm" onclick="downloadAppointmentSlip('${apt.id}')" style="background: var(--c-navy);">📄 Slip</button>
          <button class="btn btn-secondary btn-sm" onclick="viewAppointmentDetail('${apt.id}')">Details</button>

          ${apt.status === 'Confirmed' ? `<button class="btn btn-danger btn-sm" onclick="cancelAppointment('${apt.id}')">Cancel</button>` : ''}

        </div>

      </div>

    </div>

  `).join('');

}



function filterMyAppointments(filterType) {

  myAppointmentsFilter = filterType;

  const tabBtns = document.querySelectorAll('.apt-tab-btn');

  tabBtns.forEach(btn => {

    if (btn.dataset.filter === filterType) {

      btn.className = 'btn btn-primary btn-sm apt-tab-btn';

    } else {

      btn.className = 'btn btn-secondary btn-sm apt-tab-btn';

    }

  });

  renderMyAppointmentsView();

}



function cancelAppointment(aptId) {

  if (confirm(`Are you sure you want to cancel appointment #${aptId}?`)) {

    const apt = AppState.appointments.find(a => a.id === aptId);

    if (apt) {

      apt.status = 'Cancelled';

      saveAppointments();

      renderMyAppointmentsView();

      showToast(`Appointment #${aptId} was cancelled.`);

    }

  }

}



// -------------------------------------------------------------

// Patient Profile

// -------------------------------------------------------------

function renderPatientProfileView() {

  const p = AppState.patientProfile;

  document.getElementById('prof-name').value = p.name || '';

  document.getElementById('prof-email').value = p.email || '';

  document.getElementById('prof-phone').value = p.phone || '';

  document.getElementById('prof-age').value = p.age || '';

  document.getElementById('prof-gender').value = p.gender || 'Male';



  const avatarText = document.getElementById('prof-avatar-letter');

  if (avatarText) {

    avatarText.textContent = (p.name || 'J')[0].toUpperCase();

  }

}



function savePatientProfileForm(e) {

  if (e) e.preventDefault();

  AppState.patientProfile.name = document.getElementById('prof-name').value;

  AppState.patientProfile.email = document.getElementById('prof-email').value;

  AppState.patientProfile.phone = document.getElementById('prof-phone').value;

  AppState.patientProfile.age = parseInt(document.getElementById('prof-age').value) || 30;

  AppState.patientProfile.gender = document.getElementById('prof-gender').value;



  savePatientProfile();

  showToast('Patient profile updated successfully!');

}



// -------------------------------------------------------------

// Doctor Portal Views

// -------------------------------------------------------------

function switchDoctorTab(tabName) {

  AppState.activeDocTab = tabName;

  const tabs = ['dashboard', 'appointments', 'availability', 'profile'];

  tabs.forEach(t => {

    const view = document.getElementById(`doc-view-${t}`);

    const navItem = document.getElementById(`doc-nav-${t}`);

    if (t === tabName) {

      if (view) view.style.display = 'block';

      if (navItem) navItem.classList.add('active');

    } else {

      if (view) view.style.display = 'none';

      if (navItem) navItem.classList.remove('active');

    }

  });



  if (tabName === 'dashboard') renderDoctorDashboard();

  if (tabName === 'appointments') renderDoctorAppointmentsView();

  if (tabName === 'availability') renderDoctorAvailabilityView();

  if (tabName === 'profile') renderDoctorProfileView();

}



function renderDoctorDashboard() {

  const tableBody = document.getElementById('doc-today-table-body');

  if (!tableBody) return;



  // Render stats

  const todayCount = AppState.appointments.length;

  const statToday = document.getElementById('doc-stat-today');

  if (statToday) statToday.textContent = todayCount;



  tableBody.innerHTML = AppState.appointments.map(apt => `

    <tr>

      <td><strong style="color: var(--c-navy);">${apt.time}</strong></td>

      <td>

        <strong>${apt.patientName}</strong>

        <div style="font-size: 0.75rem; color: var(--c-steel);">${apt.patientAge} yrs • ${apt.patientGender}</div>

      </td>

      <td>

        <span class="badge ${apt.priorityColor}">

          <span class="badge-dot"></span>

          ${apt.priority}

        </span>

      </td>

      <td>

        <span class="badge ${apt.status === 'Confirmed' ? 'ice' : 'neutral'}">${apt.status}</span>

      </td>

      <td>

        <button class="btn btn-secondary btn-sm" onclick="openDoctorAppointmentDetails('${apt.id}')">

          View Details

        </button>

      </td>

    </tr>

  `).join('');

}



function renderDoctorAppointmentsView() {

  const container = document.getElementById('doc-all-appointments-list');

  if (!container) return;



  container.innerHTML = AppState.appointments.map(apt => `

    <div class="apt-card-item">

      <div class="apt-info-block">

        <div style="width: 3rem; height: 3rem; border-radius: var(--radius-md); background: var(--c-ice-soft); display: flex; align-items: center; justify-content: center; color: var(--c-navy); font-weight: 800;">

          ${apt.patientName[0]}

        </div>

        <div>

          <h4 style="font-weight: 700; color: var(--c-navy);">${apt.patientName}</h4>

          <p style="font-size: 0.8125rem; color: var(--c-steel);">${apt.patientAge} years, ${apt.patientGender} • Phone: ${apt.patientPhone || '+91 98765 43210'}</p>

          <div style="margin-top: 0.25rem;">

            <span class="badge ${apt.priorityColor}"><span class="badge-dot"></span>${apt.priority}</span>

          </div>

        </div>

      </div>

      <div style="text-align: right;">

        <div style="font-weight: 700; color: var(--c-navy);">${apt.date} • ${apt.time}</div>

        <div style="font-size: 0.8125rem; color: var(--c-steel); margin-bottom: 0.5rem;">${apt.concern || 'Consultation'}</div>

        <button class="btn btn-secondary btn-sm" onclick="openDoctorAppointmentDetails('${apt.id}')">

          Patient Clinical Details

        </button>

      </div>

    </div>

  `).join('');

}



function renderDoctorAvailabilityView() {

  const daysContainer = document.getElementById('doc-availability-days');

  if (!daysContainer) return;



  const weekDays = [

    { day: 'Monday', active: true, slots: '09:00 AM – 05:00 PM', count: 8 },

    { day: 'Tuesday', active: true, slots: '09:00 AM – 05:00 PM', count: 8 },

    { day: 'Wednesday', active: true, slots: '09:00 AM – 05:00 PM', count: 8 },

    { day: 'Thursday', active: true, slots: '09:00 AM – 05:00 PM', count: 8 },

    { day: 'Friday', active: true, slots: '09:00 AM – 05:00 PM', count: 8 },

    { day: 'Saturday', active: false, slots: 'Off Duty', count: 0 },

    { day: 'Sunday', active: false, slots: 'Off Duty', count: 0 }

  ];



  daysContainer.innerHTML = weekDays.map((d, index) => `

    <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: var(--c-snow); border-radius: var(--radius-md); margin-bottom: 0.75rem; border: 1px solid var(--surface-border);">

      <div>

        <strong style="color: var(--c-navy); font-size: 1rem;">${d.day}</strong>

        <div style="font-size: 0.8125rem; color: var(--c-steel);">${d.slots}</div>

      </div>

      <div style="display: flex; align-items: center; gap: 1rem;">

        <span class="badge ${d.active ? 'not-urgent' : 'neutral'}">${d.active ? 'Available' : 'Unavailable'}</span>

        <button class="btn btn-secondary btn-sm" onclick="toggleDoctorDay(${index})">Toggle</button>

      </div>

    </div>

  `).join('');

}



function toggleDoctorDay(index) {

  showToast('Availability schedule updated.');

}



function renderDoctorProfileView() {

  const d = AppState.doctorProfile;

  document.getElementById('doc-prof-name').value = d.name || '';

  document.getElementById('doc-prof-spec').value = d.specialisation || '';

  document.getElementById('doc-prof-qual').value = d.qualification || '';

  document.getElementById('doc-prof-dept').value = d.department || '';

  document.getElementById('doc-prof-phone').value = d.phone || '';

  document.getElementById('doc-prof-exp').value = d.experienceYears || 10;

}



function saveDoctorProfileForm(e) {

  if (e) e.preventDefault();

  AppState.doctorProfile.name = document.getElementById('doc-prof-name').value;

  AppState.doctorProfile.specialisation = document.getElementById('doc-prof-spec').value;

  AppState.doctorProfile.qualification = document.getElementById('doc-prof-qual').value;

  AppState.doctorProfile.department = document.getElementById('doc-prof-dept').value;

  AppState.doctorProfile.phone = document.getElementById('doc-prof-phone').value;

  AppState.doctorProfile.experienceYears = parseInt(document.getElementById('doc-prof-exp').value) || 12;



  saveDoctorProfile();

  showToast('Doctor profile settings updated!');

}



// -------------------------------------------------------------

// Modals & Details Drawers

// -------------------------------------------------------------

function openDoctorAppointmentDetails(aptId) {

  const apt = AppState.appointments.find(a => a.id === aptId);

  if (!apt) return;



  const modal = document.getElementById('details-modal');

  const modalContent = document.getElementById('details-modal-content');

  if (!modal || !modalContent) return;



  modalContent.innerHTML = `

    <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start;">

      <div>

        <h4 style="font-size: 1.35rem; font-weight: 800; color: var(--c-navy);">${apt.patientName}</h4>

        <p style="font-size: 0.875rem; color: var(--c-steel);">${apt.patientAge} Years Old • ${apt.patientGender}</p>

        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.25rem;">Appointment ID: #${apt.id}</p>

      </div>

      <div style="text-align: right;">

        <span class="badge ${apt.priorityColor}" style="font-size: 0.875rem;">

          <span class="badge-dot"></span>

          ${apt.priority}

        </span>

      </div>

    </div>



    <div style="background: var(--c-snow); border: 1px solid var(--surface-border); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">

      <h5 style="font-size: 0.8125rem; text-transform: uppercase; color: var(--c-steel); margin-bottom: 0.5rem; letter-spacing: 0.04em;">Schedule Information</h5>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.875rem;">

        <div><strong>Date:</strong> ${apt.date}</div>

        <div><strong>Time:</strong> ${apt.time}</div>

        <div><strong>Doctor:</strong> ${apt.doctorName}</div>

        <div><strong>Status:</strong> ${apt.status}</div>

      </div>

    </div>



    <div style="margin-bottom: 1.5rem;">

      <h5 style="font-size: 0.8125rem; text-transform: uppercase; color: var(--c-steel); margin-bottom: 0.5rem; letter-spacing: 0.04em;">Clinical Assessment Summary</h5>

      <div style="background: #fff; border-left: 3px solid var(--c-navy); padding: 0.85rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; box-shadow: var(--shadow-sm);">

        <p style="font-weight: 600; color: var(--c-navy); margin-bottom: 0.35rem;">Primary Concern:</p>

        <p style="font-size: 0.875rem; color: var(--text-muted);">${apt.concern || 'Acute consultation requested'}</p>

        <p style="font-weight: 600; color: var(--c-navy); margin-top: 0.75rem; margin-bottom: 0.25rem;">Triage Rationale:</p>

        <p style="font-size: 0.875rem; color: var(--text-muted);">${apt.urgencyReason || 'Determined by clinical triage screening'}</p>

      </div>

    </div>



    <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">

      <button class="btn btn-secondary" onclick="closeModal()">Close</button>

      <button class="btn btn-primary" onclick="markAppointmentDone('${apt.id}')">Mark Consultation Completed</button>

    </div>

  `;



  modal.classList.add('active');

}



function viewAppointmentDetail(aptId) {

  openDoctorAppointmentDetails(aptId);

}



function markAppointmentDone(aptId) {

  const apt = AppState.appointments.find(a => a.id === aptId);

  if (apt) {

    apt.status = 'Completed';

    saveAppointments();

    closeModal();

    showToast(`Appointment #${aptId} marked as Completed.`);

    if (AppState.currentUser === 'doctor') {

      renderDoctorDashboard();

    } else {

      renderMyAppointmentsView();

    }

  }

}



function openDoctorModal(docId) {

  const doc = DOCTORS.find(d => d.id === docId);

  if (!doc) return;



  const modal = document.getElementById('details-modal');

  const modalContent = document.getElementById('details-modal-content');

  if (!modal || !modalContent) return;



  modalContent.innerHTML = `

    <div style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1.5rem;">

      <img src="${doc.avatar}" alt="${doc.name}" style="width: 5.5rem; height: 5.5rem; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--c-ice);" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80';">

      <div>

        <h4 style="font-size: 1.4rem; font-weight: 800; color: var(--c-navy);">${doc.name}</h4>

        <p style="font-weight: 600; color: var(--c-steel);">${doc.specialisation}</p>

        <p style="font-size: 0.8125rem; color: var(--text-muted);">${doc.qualification}</p>

      </div>

    </div>

    <div style="margin-bottom: 1.25rem;">

      <h5 style="font-size: 0.8125rem; text-transform: uppercase; color: var(--c-steel); margin-bottom: 0.35rem;">About Doctor</h5>

      <p style="font-size: 0.9375rem; color: var(--text-muted); line-height: 1.6;">${doc.bio}</p>

    </div>

    <div style="background: var(--c-snow); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">

      <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">

        <span><strong>Experience:</strong> ${doc.experienceYears} Years</span>

        <span><strong>Rating:</strong> ★ ${doc.rating} / 5.0</span>

        <span><strong>Available:</strong> ${doc.availableStatus}</span>

      </div>

    </div>

    <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">

      <button class="btn btn-secondary" onclick="closeModal()">Close</button>

    </div>

  `;



  modal.classList.add('active');

}



function closeModal() {

  const modal = document.getElementById('details-modal');

  if (modal) modal.classList.remove('active');

}



// -------------------------------------------------------------

// Authentication Simulations

// -------------------------------------------------------------

function handlePatientLogin(e) {

  if (e) e.preventDefault();

  AppState.currentUser = 'patient';

  localStorage.setItem('carepoint_session', 'patient');

  showToast(`Welcome back, ${AppState.patientProfile ? AppState.patientProfile.name : 'Patient'}!`);

  navigateTo('patient-dashboard');

}



function handlePatientSignup(e) {

  if (e) e.preventDefault();

  const name = document.getElementById('signup-name').value || 'New Patient';

  const email = document.getElementById('signup-email').value || 'patient@example.com';

  const phone = document.getElementById('signup-phone').value || '+91 98765 00000';

  const age = parseInt(document.getElementById('signup-age').value) || 28;

  const gender = document.getElementById('signup-gender').value || 'Other';



  AppState.patientProfile = {

    ...AppState.patientProfile,

    name, email, phone, age, gender

  };

  savePatientProfile();

  // New account starts with zero appointment history

  AppState.appointments = [];

  saveAppointments();



  AppState.currentUser = 'patient';

  localStorage.setItem('carepoint_session', 'patient');

  showToast(`Account created for ${name}!`);

  navigateTo('patient-dashboard');

}



function handleDoctorLogin(e) {

  if (e) e.preventDefault();

  AppState.currentUser = 'doctor';

  localStorage.setItem('carepoint_session', 'doctor');

  showToast(`Welcome, ${AppState.doctorProfile.name}!`);

  navigateTo('doctor-dashboard');

}



function handleLogout() {

  AppState.currentUser = null;

  localStorage.removeItem('carepoint_session');

  showToast('You have been logged out.');

  navigateTo('home');

}



function resetDemoData() {

  localStorage.clear();

  initAppState();

  showToast('Demo data reset to factory state.');

  navigateTo('home');

}



// -------------------------------------------------------------

// App Initialization

// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

  initAppState();



  // Handle browser back/forward buttons & initial hash

  window.addEventListener('hashchange', () => {

    const hash = window.location.hash || '#home';

    navigateTo(hash);

  });



  const initialHash = window.location.hash || '#home';

  navigateTo(initialHash);



  // Close modal when clicking on overlay background

  const modal = document.getElementById('details-modal');

  if (modal) {

    modal.addEventListener('click', (e) => {

      if (e.target === modal) closeModal();

    });

  }

});


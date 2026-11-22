/**
 * Smart Doctor - CarePoint Hospital Mock Database & Clinical Triage Data
 */

const DEPARTMENTS = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: 'heart-pulse',
    description: 'Comprehensive cardiovascular care, ECG, echocardiography, and hypertension management.',
    specialistsCount: 4,
    floor: 'Wing B, 3rd Floor'
  },
  {
    id: 'orthopaedics',
    name: 'Orthopaedics',
    icon: 'bone',
    description: 'Advanced joint replacement, sports injury treatment, fracture care, and spine surgery.',
    specialistsCount: 3,
    floor: 'Wing A, 1st Floor'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    icon: 'brain',
    description: 'Diagnostic and therapeutic care for migraine, stroke recovery, epilepsy, and neuropathy.',
    specialistsCount: 3,
    floor: 'Wing C, 4th Floor'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    icon: 'sparkles',
    description: 'Clinical skincare, acne treatments, allergy patch tests, and minor cutaneous surgeries.',
    specialistsCount: 2,
    floor: 'Wing D, 2nd Floor'
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    icon: 'stethoscope',
    description: 'Primary care, acute viral illnesses, preventative wellness, and lifestyle disease management.',
    specialistsCount: 5,
    floor: 'Main Atrium, Ground Floor'
  },
  {
    id: 'pulmonology',
    name: 'Pulmonology',
    icon: 'lungs',
    description: 'Respiratory therapy, asthma and COPD management, allergy screenings, and lung function tests.',
    specialistsCount: 3,
    floor: 'Wing B, 2nd Floor'
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology',
    icon: 'eye',
    description: 'Vision assessments, glaucoma screening, cataract evaluations, and retinal examinations.',
    specialistsCount: 2,
    floor: 'Wing E, 1st Floor'
  },
  {
    id: 'ent',
    name: 'ENT (Ear, Nose & Throat)',
    icon: 'ear',
    description: 'Sinus conditions, hearing loss diagnostics, throat infections, and allergy treatment.',
    specialistsCount: 3,
    floor: 'Wing D, 3rd Floor'
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology',
    icon: 'pill',
    description: 'Digestive tract health, acid reflux treatment, liver screenings, and endoscopic consultations.',
    specialistsCount: 2,
    floor: 'Wing C, 2nd Floor'
  },
  {
    id: 'physiotherapy',
    name: 'Physiotherapy & Rehab',
    icon: 'activity',
    description: 'Post-operative rehabilitation, ergonomic physical therapy, mobility training, and pain relief.',
    specialistsCount: 4,
    floor: 'Wellness Center, Ground Floor'
  }
];

const DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Meera Iyer',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    specialisation: 'Cardiologist',
    departmentId: 'cardiology',
    qualification: 'MD (Cardiology), FACC',
    experienceYears: 15,
    rating: 4.9,
    reviewsCount: 184,
    phone: '9000000001',
    email: 'doctor1@hospital.com',
    availableStatus: 'Available Today',
    availableToday: true,
    bio: 'Lead Cardiologist specializing in preventative cardiology, coronary interventions, and rhythm disorders.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    slots: ['09:00 AM', '10:00 AM', '11:20 AM', '01:00 PM', '02:40 PM']
  },
  {
    id: 'doc-2',
    name: 'Dr. Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    specialisation: 'Orthopaedic',
    departmentId: 'orthopaedics',
    qualification: 'MS (Ortho), DNB',
    experienceYears: 13,
    rating: 4.8,
    reviewsCount: 156,
    phone: '9000000002',
    email: 'doctor2@hospital.com',
    availableStatus: 'Available Today',
    availableToday: true,
    bio: 'Consultant orthopaedic surgeon expert in joint reconstruction, sports trauma, and bone density management.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    slots: ['10:00 AM', '11:40 AM', '01:20 PM', '03:00 PM', '03:40 PM']
  },
  {
    id: 'doc-3',
    name: 'Dr. Arjun Nair',
    avatar: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80',
    specialisation: 'Neurologist',
    departmentId: 'neurology',
    qualification: 'DM (Neurology), MD',
    experienceYears: 11,
    rating: 4.9,
    reviewsCount: 128,
    phone: '9000000003',
    email: 'doctor3@hospital.com',
    availableStatus: 'Available Today',
    availableToday: true,
    bio: 'Specialist in neuropathic pain, migraine management, stroke recovery, and neuromuscular therapeutics.',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    slots: ['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM']
  },
  {
    id: 'doc-4',
    name: 'Dr. Neha Kapoor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    specialisation: 'Dermatologist',
    departmentId: 'dermatology',
    qualification: 'MD (Dermatology & Venereology)',
    experienceYears: 7,
    rating: 4.7,
    reviewsCount: 94,
    phone: '9000000004',
    email: 'doctor4@hospital.com',
    availableStatus: 'Available Today',
    availableToday: true,
    bio: 'Consultant dermatologist focusing on acute allergic dermatoses, eczema, acne therapeutics, and clinical skin health.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    slots: ['11:00 AM', '12:30 PM', '02:45 PM', '04:15 PM']
  },
  {
    id: 'doc-5',
    name: 'Dr. Anita Sharma',
    avatar: 'https://images.unsplash.com/photo-1594824813583-ce80ab78f7e2?auto=format&fit=crop&w=400&q=80',
    specialisation: 'General Physician',
    departmentId: 'general-medicine',
    qualification: 'MD (General Medicine), MBBS',
    experienceYears: 12,
    rating: 4.9,
    reviewsCount: 210,
    phone: '9000000005',
    email: 'doctor5@hospital.com',
    availableStatus: 'Available Today',
    availableToday: true,
    bio: 'Senior primary care physician dealing with comprehensive adult health, viral syndromes, metabolic fever, and clinical triage.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    slots: ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM', '04:30 PM']
  },
  {
    id: 'doc-6',
    name: 'Dr. Pooja Gupta',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    specialisation: 'Gastroenterologist',
    departmentId: 'gastroenterology',
    qualification: 'DM (Gastroenterology), MD',
    experienceYears: 9,
    rating: 4.8,
    reviewsCount: 115,
    phone: '9000000006',
    email: 'doctor6@hospital.com',
    availableStatus: 'Available Tomorrow',
    availableToday: false,
    bio: 'Expert in gastrointestinal disorders, acid peptic diseases, abdominal pain investigation, and hepatic health.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    slots: ['09:00 AM', '10:40 AM', '12:00 PM', '01:40 PM']
  },
  {
    id: 'doc-7',
    name: 'Dr. Rohan Desai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    specialisation: 'Ophthalmologist',
    departmentId: 'ophthalmology',
    qualification: 'MS (Ophthalmology), DNB',
    experienceYears: 10,
    rating: 4.8,
    reviewsCount: 88,
    phone: '9000000007',
    email: 'doctor7@hospital.com',
    availableStatus: 'Available Tomorrow',
    availableToday: false,
    bio: 'Ophthalmic specialist in acute eye conditions, blurred vision evaluation, retinal health, and refractive care.',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    slots: ['10:00 AM', '11:40 AM', '01:20 PM', '03:20 PM']
  },
  {
    id: 'doc-8',
    name: 'Dr. Farah Khan',
    avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
    specialisation: 'ENT Specialist',
    departmentId: 'ent',
    qualification: 'MS (ENT), DLO',
    experienceYears: 6,
    rating: 4.7,
    reviewsCount: 72,
    phone: '9000000008',
    email: 'doctor8@hospital.com',
    availableStatus: 'Available Today',
    availableToday: true,
    bio: 'Specialist in sinus inflammation, throat infections, upper respiratory tract care, and vertigo.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    slots: ['10:00 AM', '11:30 AM', '01:45 PM', '03:15 PM']
  },
  {
    id: 'doc-9',
    name: 'Dr. Sunita Rao',
    avatar: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=400&q=80',
    specialisation: 'Pulmonologist',
    departmentId: 'pulmonology',
    qualification: 'MD (Pulmonary Medicine), FCCP',
    experienceYears: 14,
    rating: 4.9,
    reviewsCount: 176,
    phone: '9000000009',
    email: 'doctor9@hospital.com',
    availableStatus: 'Available Today',
    availableToday: true,
    bio: 'Lead pulmonologist treating severe asthma, respiratory wheezing, post-viral bronchitis, and acute lung care.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    slots: ['09:30 AM', '11:10 AM', '01:30 PM', '03:10 PM']
  },
  {
    id: 'doc-10',
    name: 'Dr. Karan Malhotra',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    specialisation: 'Physiotherapist',
    departmentId: 'physiotherapy',
    qualification: 'MPT (Musculoskeletal & Sports)',
    experienceYears: 10,
    rating: 4.8,
    reviewsCount: 120,
    phone: '9000000010',
    email: 'doctor10@hospital.com',
    availableStatus: 'Available Today',
    availableToday: true,
    bio: 'Consultant physiotherapist specializing in musculoskeletal rehabilitation, mobility restoration, and ergonomic therapy.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    slots: ['08:00 AM', '09:30 AM', '11:00 AM', '01:30 PM']
  }
];

// The 10 exact symptom triplets trained in Ishika's ML model (m1-model/src/config.py)
const TRAINED_SYMPTOM_GROUPS = [
  { s1: "breathing difficulty", s2: "wheezing", s3: "chest tightness", label: "Breathing difficulty, wheezing & chest tightness", department: "Pulmonology" },
  { s1: "cough", s2: "runny nose", s3: "sneezing", label: "Cough, runny nose & sneezing", department: "ENT Specialist" },
  { s1: "fever", s2: "body pain", s3: "cough", label: "Fever, body pain & cough", department: "General Physician" },
  { s1: "fever", s2: "chills", s3: "sweating", label: "Fever, chills & sweating", department: "General Physician" },
  { s1: "fever", s2: "dry cough", s3: "loss of taste", label: "Fever, dry cough & loss of taste", department: "General Physician" },
  { s1: "fever", s2: "stomach pain", s3: "weakness", label: "Fever, stomach pain & weakness", department: "Gastroenterologist" },
  { s1: "headache", s2: "dizziness", s3: "blurred vision", label: "Headache, dizziness & blurred vision", department: "Neurologist" },
  { s1: "headache", s2: "nausea", s3: "light sensitivity", label: "Headache, nausea & light sensitivity", department: "Neurologist" },
  { s1: "high fever", s2: "joint pain", s3: "headache", label: "High fever, joint pain & severe headache", department: "Orthopaedic" },
  { s1: "thirst", s2: "fatigue", s3: "frequent urination", label: "Excessive thirst, fatigue & frequent urination", department: "General Physician" }
];

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    title: 'Primary Health Concern',
    subtitle: 'What is the main reason you are seeking medical attention today?',
    options: [
      { id: 'q1-1', label: 'Chest Discomfort or Heart Palpitations', score: 3, flag: 'cardiac', badge: 'High Attention' },
      { id: 'q1-2', label: 'Severe Breathing Trouble or Wheezing', score: 3, flag: 'respiratory', badge: 'High Attention' },
      { id: 'q1-3', label: 'Bone Fracture, Severe Joint Pain or Sprain', score: 2, flag: 'ortho' },
      { id: 'q1-4', label: 'Persistent Fever, Cough, or Viral Symptoms', score: 1, flag: 'general' },
      { id: 'q1-5', label: 'Skin Rash, Lesion or Allergic Reaction', score: 1, flag: 'derm' },
      { id: 'q1-6', label: 'Routine Health Checkup or Prescription Renewal', score: 0, flag: 'routine' }
    ]
  },
  {
    id: 2,
    title: 'Pain Severity Level',
    subtitle: 'How would you rate the intensity of your current discomfort or pain?',
    options: [
      { id: 'q2-1', label: 'Severe / Unbearable Pain (7 – 10)', description: 'Prevents moving, sleeping, or speaking normally.', score: 3, urgentFlag: true },
      { id: 'q2-2', label: 'Moderate Pain (4 – 6)', description: 'Noticeable discomfort that interferes with daily tasks.', score: 2 },
      { id: 'q2-3', label: 'Mild Pain (1 – 3)', description: 'Noticeable but easily tolerable.', score: 1 },
      { id: 'q2-4', label: 'No Pain (0)', description: 'Experiencing other symptoms without bodily pain.', score: 0 }
    ]
  },
  {
    id: 3,
    title: 'Duration of Symptoms',
    subtitle: 'How long have you been experiencing these current symptoms?',
    options: [
      { id: 'q3-1', label: 'Sudden onset within the last 24 hours', description: 'Started rapidly and feeling progressively worse.', score: 3 },
      { id: 'q3-2', label: 'Between 1 to 3 days', description: 'Recent onset with consistent symptoms.', score: 2 },
      { id: 'q3-3', label: '1 to 2 weeks', description: 'Ongoing symptoms that haven’t resolved.', score: 1 },
      { id: 'q3-4', label: 'More than a month / Chronic condition', description: 'Long-term condition needing follow-up or review.', score: 0 }
    ]
  },
  {
    id: 4,
    title: 'Breathing & Chest Signs',
    subtitle: 'Are you feeling shortness of breath, chest pressure, or irregular heartbeats?',
    options: [
      { id: 'q4-1', label: 'Yes — Noticeable chest pressure or struggle to breathe at rest', score: 3, urgentFlag: true },
      { id: 'q4-2', label: 'Yes — Mild shortness of breath only when walking or climbing stairs', score: 1 },
      { id: 'q4-3', label: 'No — Breathing normally and chest is clear', score: 0 }
    ]
  },
  {
    id: 5,
    title: 'Body Temperature & Fever',
    subtitle: 'Have you felt feverish or recorded your body temperature recently?',
    options: [
      { id: 'q5-1', label: 'High fever over 102°F (39°C) with chills/rigors', score: 2 },
      { id: 'q5-2', label: 'Low-grade fever between 99°F – 101°F (37.2°C – 38.3°C)', score: 1 },
      { id: 'q5-3', label: 'Normal temperature (No fever)', score: 0 }
    ]
  },
  {
    id: 6,
    title: 'Impact on Daily Mobility',
    subtitle: 'How does this condition impact your ability to walk, work, or care for yourself?',
    options: [
      { id: 'q6-1', label: 'Completely bedridden or unable to walk without assistance', score: 3 },
      { id: 'q6-2', label: 'Substantial difficulty performing normal duties', score: 2 },
      { id: 'q6-3', label: 'Slight slowdown, but independent', score: 1 },
      { id: 'q6-4', label: 'No limitation on mobility or activities', score: 0 }
    ]
  },
  {
    id: 7,
    title: 'Neurological Indicators',
    subtitle: 'Are you experiencing any dizziness, confusion, vision blur, or localized numbness?',
    options: [
      { id: 'q7-1', label: 'Sudden weakness in face/arm/leg or speech slurring', score: 4, urgentFlag: true },
      { id: 'q7-2', label: 'Dizziness, moderate headache, or lightheadedness', score: 1 },
      { id: 'q7-3', label: 'None of these symptoms', score: 0 }
    ]
  },
  {
    id: 8,
    title: 'Pre-existing Conditions',
    subtitle: 'Do you have any diagnosed ongoing health conditions?',
    options: [
      { id: 'q8-1', label: 'Heart disease, Stroke history, or Kidney disease', score: 2 },
      { id: 'q8-2', label: 'Diabetes, Hypertension, or Asthma', score: 1 },
      { id: 'q8-3', label: 'Other chronic conditions', score: 1 },
      { id: 'q8-4', label: 'No pre-existing medical conditions', score: 0 }
    ]
  },
  {
    id: 9,
    title: 'Bleeding or Acute Trauma',
    subtitle: 'Did you experience a sudden fall, direct trauma, or is there bleeding?',
    options: [
      { id: 'q9-1', label: 'Yes — Deep cut, severe contusion, or trauma from an accident', score: 3 },
      { id: 'q9-2', label: 'Yes — Minor scrape, bump, or mild sprain', score: 1 },
      { id: 'q9-3', label: 'No trauma or physical injury occurred', score: 0 }
    ]
  },
  {
    id: 10,
    title: 'Patient Age Category',
    subtitle: 'Which age bracket best describes the patient?',
    options: [
      { id: 'q10-1', label: 'Senior Citizen (65+ years)', score: 1, ageNum: 68 },
      { id: 'q10-2', label: 'Adult (18 – 64 years)', score: 0, ageNum: 38 },
      { id: 'q10-3', label: 'Infant / Child / Adolescent (Under 18 years)', score: 1, ageNum: 14 }
    ]
  }
];

const INITIAL_PATIENT = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 98765 43210',
  age: 38,
  dob: '1988-06-14',
  gender: 'Male',
  bloodGroup: 'O+',
  emergencyContact: 'Sarah Doe (+91 98765 43211)'
};

const INITIAL_DOCTOR = {
  id: 'doc-1',
  name: 'Dr. Meera Iyer',
  email: 'doctor1@hospital.com',
  doctorCode: 'DOC-CPH-101',
  specialisation: 'Cardiologist',
  department: 'Cardiology',
  qualification: 'MD (Cardiology), FACC',
  experienceYears: 15,
  phone: '9000000001',
  avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  stats: {
    todayAppointments: 8,
    upcoming: 14,
    completed: 26,
    avgWaitMin: 12
  }
};

const INITIAL_APPOINTMENTS = [
  {
    id: 'APT10293',
    patientName: 'John Doe',
    patientAge: 38,
    patientGender: 'Male',
    patientPhone: '+91 98765 43210',
    doctorId: 'doc-1',
    doctorName: 'Dr. Meera Iyer',
    doctorSpecialisation: 'Cardiologist',
    department: 'Cardiology',
    date: '5 September 2026',
    rawDate: '2026-09-05',
    time: '09:30 AM',
    priority: 'Very Urgent',
    priorityColor: 'urgent',
    status: 'Completed',
    concern: 'Chest tightness after exertion, sudden onset',
    urgencyReason: 'Completed consultation'
  },
  {
    id: 'APT10290',
    patientName: 'John Doe',
    patientAge: 38,
    patientGender: 'Male',
    patientPhone: '+91 98765 43210',
    doctorId: 'doc-2',
    doctorName: 'Dr. Vikram Singh',
    doctorSpecialisation: 'Orthopaedic Surgeon',
    department: 'Orthopaedics',
    date: '18 October 2026',
    rawDate: '2026-10-18',
    time: '02:00 PM',
    priority: 'Moderate',
    priorityColor: 'moderate',
    status: 'Completed',
    concern: 'Right ankle ligament rehabilitation check',
    urgencyReason: 'Completed consultation'
  },
  {
    id: 'APT10292',
    patientName: 'John Doe',
    patientAge: 38,
    patientGender: 'Male',
    patientPhone: '+91 98765 43210',
    doctorId: 'doc-3',
    doctorName: 'Dr. Anjali Nair',
    doctorSpecialisation: 'General Physician',
    department: 'General Medicine',
    date: '7 November 2026',
    rawDate: '2026-11-07',
    time: '11:00 AM',
    priority: 'Not Urgent',
    priorityColor: 'not-urgent',
    status: 'Completed',
    concern: 'Seasonal flu, mild fever, body ache',
    urgencyReason: 'Completed consultation'
  }
];

// Priority determination logic based on collected questionnaire answers
// Accepts both the 10-question responses and M1 6-feature payloads
function evaluateAssessmentPriority(input) {
  let score = 0;
  let hasUrgentFlag = false;
  let features = {};

  if (Array.isArray(input)) {
    input.forEach(item => {
      const opt = item.option || item;
      if (opt && typeof opt === 'object') {
        if (typeof opt.score === 'number') score += opt.score;
        if (opt.urgentFlag) hasUrgentFlag = true;
      }
    });
  } else if (input && typeof input === 'object') {
    features = input.features || input;
    const age = Number(features.age) || 35;
    const comorbidities = features.comorbidities || 'None';
    const s1 = features.symptom_1 || '';
    const s2 = features.symptom_2 || '';
    const s3 = features.symptom_3 || '';

    if (age >= 65) score += 2;
    else if (age >= 50 || age <= 5) score += 1;

    if (comorbidities === 'Heart Disease' || comorbidities === 'Diabetes, Hypertension') score += 3;
    else if (comorbidities === 'Asthma' || comorbidities === 'Diabetes' || comorbidities === 'Hypertension') score += 2;

    if (s1 === 'breathing difficulty' || s1 === 'high fever') score += 3;
    else if (s1 === 'fever' || s1 === 'thirst') score += 2;
    else if (s1 === 'headache' || s1 === 'cough') score += 1;

    if (s2 === 'wheezing' || s2 === 'dizziness' || s2 === 'stomach pain') score += 2;
    else if (s2 === 'chills' || s2 === 'dry cough' || s2 === 'fatigue' || s2 === 'joint pain') score += 1;

    if (s3 === 'chest tightness' || s3 === 'blurred vision') score += 3;
    else if (s3 === 'weakness' || s3 === 'loss of taste' || s3 === 'sweating') score += 2;
    else if (s3 === 'light sensitivity' || s3 === 'frequent urination') score += 1;

    if (s1 === 'breathing difficulty' && s3 === 'chest tightness') hasUrgentFlag = true;
  }

  if (hasUrgentFlag || score >= 8) {
    return {
      level: 'Very Urgent',
      badgeClass: 'urgent',
      color: '#DC2626',
      bgTint: '#FEE2E2',
      headline: 'High-priority appointment',
      recommendedWindow: 'Today',
      description: 'Your responses indicate symptoms that require prompt clinical review today. Consultation is scheduled strictly for today without delay.',
      urgencyCode: 'High',
      score: score,
      features: features
    };
  } else if (score >= 4) {
    return {
      level: 'Moderate',
      badgeClass: 'moderate',
      color: '#D97706',
      bgTint: '#FEF3C7',
      headline: 'Medium-priority appointment',
      recommendedWindow: 'Today or Tomorrow',
      description: 'Your assessment highlights noticeable symptoms that should be examined promptly. Choose between a slot today or tomorrow.',
      urgencyCode: 'Medium',
      score: score,
      features: features
    };
  } else {
    return {
      level: 'Not Urgent',
      badgeClass: 'not-urgent',
      color: '#059669',
      bgTint: '#D1FAE5',
      headline: 'Lower-priority appointment',
      recommendedWindow: 'Day after tomorrow or later this week',
      description: 'Your responses do not indicate an acute emergency. You can comfortably schedule for day after tomorrow or select your preferred date later this week.',
      urgencyCode: 'Low',
      score: score,
      features: features
    };
  }
}

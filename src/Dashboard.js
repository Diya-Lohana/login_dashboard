import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import logo from './assets/logo.png';
import mouPdf from './assets/docs/mou_template.pdf';
import bicPdf from './assets/docs/bic_criteria.pdf';
import partnershipPdf from './assets/docs/partnership_guide.pdf';
import sponsorshipPdf from './assets/docs/sponsorship_agreement.pdf';

function getNameFromEmail(email) {
  const part = email.split('@')[0];
  if (part.includes('.')) {
    return part.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return part.charAt(0).toUpperCase() + part.slice(1);
}

const listings = [
  { id:1, type:'Startup', name:'AgriSense IoT', dept:'Computer Systems Engineering', summary:'Soil-monitoring sensor network helping smallholder farms in Sindh optimize irrigation and reduce water waste by up to 30%.', stage:'Pilot', tech:'ICT', team:4 },
  { id:2, type:'FYP', name:'Low-Cost Solar Water Desalination Unit', dept:'Chemical Engineering', summary:'Solar-powered desalination prototype for coastal communities without access to clean water. Awarded seed money at ORIC FYP Showcase 2024.', stage:'Completed', tech:'Engineering', team:3 },
  { id:3, type:'Startup', name:'EduConnect', dept:'Software Engineering', summary:'Offline-first learning platform for rural school districts with unreliable internet. Currently incubated at MUET BIC with ASPIRE mentorship.', stage:'Incubation', tech:'ICT', team:3 },
  { id:4, type:'Business Idea', name:'CircuitRecycle', dept:'Electronic Engineering', summary:'E-waste collection and PCB material recovery service targeting Hyderabad and Jamshoro industrial zones.', stage:'Concept', tech:'Engineering', team:2 },
  { id:5, type:'FYP', name:'AI-Based Crack Detection in Bridges', dept:'Civil Engineering', summary:'Computer vision model detecting structural cracks in concrete bridges from drone footage using deep learning.', stage:'In Progress', tech:'ICT', team:4 },
  { id:6, type:'Startup', name:'HydroGrid', dept:'Electrical Engineering', summary:'Smart irrigation grid management for cooperative farms, reducing energy costs through automated load balancing.', stage:'Pilot', tech:'Engineering', team:5 },
  { id:7, type:'FYP', name:'Predictive Maintenance for Textile Looms', dept:'Mechatronics Engineering', summary:'Vibration-sensor system predicting loom failures before breakdown, reducing factory downtime by up to 40%.', stage:'In Progress', tech:'Robotics', team:3 },
  { id:8, type:'Business Idea', name:'LogiTrack', dept:'Telecommunication Engineering', summary:'GPS and IoT-based fleet tracking system for small logistics businesses in Sindh.', stage:'Concept', tech:'ICT', team:2 },
  { id:9, type:'Startup', name:'MedAssist Diagnostics', dept:'Biomedical Engineering', summary:'Portable diagnostic device for rural health clinics providing rapid blood-test results without full lab infrastructure.', stage:'Incubation', tech:'Biomedical', team:4 },
  { id:10, type:'STP Startup', name:'CoalTech Solutions', dept:'Mining Engineering', summary:'Advanced clean coal processing technology developed at MUET Science & Technology Park.', stage:'STP Active', tech:'Coal Research', team:6 },
  { id:11, type:'STP Startup', name:'WaterPure Technologies', dept:'Environmental Engineering', summary:'Affordable industrial water purification system developed under USPCAS-W collaboration at STP.', stage:'STP Active', tech:'Water Studies', team:4 },
  { id:12, type:'National Idea Bank', name:'SmartGrid Management System', dept:'Electrical Engineering', summary:'AI-powered smart grid management submitted to ASPIRE National Idea Bank campus competition 2025.', stage:'Competition', tech:'ICT', team:3 },
  { id:13, type:'National Idea Bank', name:'Biodegradable Packaging from Sugarcane Waste', dept:'Chemical Engineering', summary:'Eco-friendly packaging from Sindh sugarcane waste. Shortlisted for ASPIRE National Idea Bank finals 2025.', stage:'Competition', tech:'Engineering', team:3 },
  { id:14, type:'Gen-AI Project', name:'Automated Legal Document Summarizer', dept:'Computer Systems Engineering', summary:'Gen-AI powered legal document summarizer built during ASPIRE free Gen-AI Training program.', stage:'Certified', tech:'ICT', team:2 },
  { id:15, type:'Gen-AI Project', name:'AI Medical Report Analyzer', dept:'Biomedical Engineering', summary:'Large language model fine-tuned for analyzing medical reports for rural doctors.', stage:'Certified', tech:'Biomedical', team:3 },
  { id:16, type:'Startup', name:'RoboAgri', dept:'Computer Systems Engineering', summary:'Autonomous agricultural robot for crop monitoring and precision spraying. NCRA-incubated project.', stage:'Prototype', tech:'Robotics', team:5 },
  { id:17, type:'FYP', name:'Smart Flood Early Warning System', dept:'Civil Engineering', summary:'IoT sensor network along Indus River providing real-time flood risk alerts. USPCAS-W collaboration.', stage:'Completed', tech:'Water Studies', team:4 },
];

const researchProjects = [
  { id:1, title:'Machine Learning for Groundwater Quality Prediction', dept:'Computer Systems Engineering', lead:'Dr. S. Ali Shah', funding:'HEC NRPU', amount:'Rs 3.2M', status:'Active', year:'2024', desc:'Developing ML models to predict groundwater contamination across Sindh using sensor data and satellite imagery.' },
  { id:2, title:'Edge AI for Industrial Predictive Maintenance', dept:'Computer Systems Engineering', lead:'Dr. Tauha H. Ali', funding:'TDF', amount:'Rs 4.1M', status:'Active', year:'2024', desc:'Deploying edge computing AI models on industrial machinery for real-time fault detection.' },
  { id:3, title:'Blockchain for Academic Credential Verification', dept:'Computer Systems Engineering', lead:'Dr. N. Bhatti', funding:'PRICA', amount:'Rs 1.4M', status:'Active', year:'2025', desc:'Blockchain-based system for tamper-proof academic credential verification across Pakistani universities.' },
  { id:4, title:'AI-Powered Crop Disease Detection via Drone Imagery', dept:'Computer Systems Engineering', lead:'Dr. R. Shah', funding:'TDF', amount:'Rs 1.9M', status:'Active', year:'2024', desc:'Training CNNs on drone imagery to detect early-stage crop diseases in large agricultural fields.' },
  { id:5, title:'Cost-Effective Solar Water Desalination', dept:'Chemical Engineering', lead:'Dr. Rabeea Jaffari', funding:'USPCAS-W', amount:'Rs 5.8M', status:'Active', year:'2023', desc:'Designing affordable solar-powered desalination units for Sindh coastal communities.' },
  { id:6, title:'Water Quality Monitoring Using Nanosensors', dept:'Chemical Engineering', lead:'Dr. S. Memon', funding:'PSF', amount:'Rs 2.1M', status:'Active', year:'2024', desc:'Developing nanosensor arrays for real-time detection of heavy metals in Sindh water bodies.' },
  { id:7, title:'Biodegradable Polymers from Agricultural Waste', dept:'Chemical Engineering', lead:'Dr. F. Laghari', funding:'HEC NRPU', amount:'Rs 1.8M', status:'Active', year:'2024', desc:'Synthesizing biodegradable plastics from sugarcane and cotton agricultural waste.' },
  { id:8, title:'Carbon Capture from Industrial Flue Gases', dept:'Chemical Engineering', lead:'Dr. A. Tunio', funding:'TDF', amount:'Rs 2.6M', status:'Active', year:'2023', desc:'Developing chemical absorption processes for capturing CO2 from Sindh industrial facilities.' },
  { id:9, title:'Renewable Microgrid Stability under Variable Load', dept:'Electrical Engineering', lead:'Dr. K. Harejan', funding:'TDF', amount:'Rs 3.6M', status:'Active', year:'2023', desc:'Investigating stability control algorithms for solar and wind microgrids in remote Sindh communities.' },
  { id:10, title:'Wireless Power Transfer for Electric Vehicles', dept:'Electrical Engineering', lead:'Dr. K. Rajput', funding:'TDF', amount:'Rs 2.8M', status:'Active', year:'2023', desc:'Developing efficient wireless charging pads for EVs using resonant inductive coupling.' },
  { id:11, title:'Smart Solar Inverter with Grid Fault Detection', dept:'Electrical Engineering', lead:'Dr. M. Unar', funding:'PSF', amount:'Rs 1.6M', status:'Active', year:'2024', desc:'Designing intelligent solar inverters that detect and isolate grid faults automatically.' },
  { id:12, title:'Energy Harvesting from Vibration in Industrial Plants', dept:'Electrical Engineering', lead:'Dr. S. Qureshi', funding:'PRICA', amount:'Rs 1.3M', status:'Active', year:'2024', desc:'Piezoelectric energy harvesting systems converting industrial vibration into electrical power.' },
  { id:13, title:'Low-Power IoT Networks for Smart Agriculture', dept:'Telecommunication Engineering', lead:'Dr. M. Aslam Uqaili', funding:'PSF', amount:'Rs 1.8M', status:'Active', year:'2023', desc:'Developing LoRaWAN sensor networks for precision agriculture in areas with no cellular coverage.' },
  { id:14, title:'5G Network Optimization for Rural Pakistan', dept:'Telecommunication Engineering', lead:'Dr. I. Memon', funding:'HEC NRPU', amount:'Rs 2.4M', status:'Active', year:'2024', desc:'Optimizing 5G signal propagation models for rural terrain across Sindh and Balochistan.' },
  { id:15, title:'Software Defined Networking for Campus Networks', dept:'Telecommunication Engineering', lead:'Dr. Z. Shaikh', funding:'TDF', amount:'Rs 1.5M', status:'Active', year:'2024', desc:'Implementing SDN-based intelligent network management for MUET campus infrastructure.' },
  { id:16, title:'Satellite Image Processing for Flood Monitoring', dept:'Telecommunication Engineering', lead:'Dr. R. Rind', funding:'PRICA', amount:'Rs 1.2M', status:'Active', year:'2025', desc:'Processing Sentinel satellite imagery for real-time flood extent mapping.' },
  { id:17, title:'Smart Traffic Management for Urban Areas', dept:'Civil Engineering', lead:'Dr. M. Bhutto', funding:'HEC NRPU', amount:'Rs 2.2M', status:'Active', year:'2024', desc:'AI-powered traffic signal optimization for Hyderabad and Jamshoro road networks.' },
  { id:18, title:'Structural Health Monitoring of Indus River Bridges', dept:'Civil Engineering', lead:'Dr. S. Chandio', funding:'TDF', amount:'Rs 3.1M', status:'Active', year:'2023', desc:'IoT sensor network on Indus River bridges for continuous structural health monitoring.' },
  { id:19, title:'Low-Cost Housing Using Local Sindh Materials', dept:'Civil Engineering', lead:'Dr. A. Soomro', funding:'PSF', amount:'Rs 1.7M', status:'Active', year:'2024', desc:'Research into affordable housing using locally available Sindh materials for rural communities.' },
  { id:20, title:'Groundwater Recharge through Managed Aquifer Systems', dept:'Civil Engineering', lead:'Dr. N. Lashari', funding:'USPCAS-W', amount:'Rs 2.9M', status:'Active', year:'2023', desc:'Designing managed aquifer recharge systems to replenish Sindh groundwater.' },
  { id:21, title:'RFID-Based Smart Inventory Management', dept:'Electronic Engineering', lead:'Dr. Z. Ahmed', funding:'PRICA', amount:'Rs 1.5M', status:'Active', year:'2024', desc:'Low-cost RFID inventory tracking for SMEs in Sindh manufacturing sector.' },
  { id:22, title:'Flexible Electronics for Wearable Health Monitors', dept:'Electronic Engineering', lead:'Dr. H. Memon', funding:'HEC NRPU', amount:'Rs 2.3M', status:'Active', year:'2024', desc:'Flexible printed circuit boards for wearable health monitoring in rural healthcare.' },
  { id:23, title:'Solar-Powered Street Lighting with Smart Control', dept:'Electronic Engineering', lead:'Dr. F. Siddiqui', funding:'TDF', amount:'Rs 1.1M', status:'Active', year:'2024', desc:'Intelligent solar street lighting with automatic brightness adjustment and fault detection.' },
  { id:24, title:'Electronic Nose for Food Quality Detection', dept:'Electronic Engineering', lead:'Dr. A. Khand', funding:'PSF', amount:'Rs 1.4M', status:'Active', year:'2025', desc:'Array of chemical sensors mimicking olfactory system to detect food spoilage.' },
  { id:25, title:'Biomedical Signal Processing for Early Diagnosis', dept:'Biomedical Engineering', lead:'Dr. F. Memon', funding:'PRICA', amount:'Rs 2.4M', status:'Active', year:'2024', desc:'ECG and EEG signal processing for early detection of cardiac and neurological disorders.' },
  { id:26, title:'3D Bioprinting for Tissue Engineering', dept:'Biomedical Engineering', lead:'Dr. S. Brohi', funding:'HEC NRPU', amount:'Rs 3.8M', status:'Active', year:'2023', desc:'Developing biocompatible hydrogel inks for 3D printing of tissue scaffolds for wound healing.' },
  { id:27, title:'Clean Coal Gasification for Energy Production', dept:'Mining Engineering', lead:'Dr. A. Baloch', funding:'HEC NRPU', amount:'Rs 6.2M', status:'Active', year:'2022', desc:'Clean gasification of Thar coal to produce synthetic natural gas with reduced environmental impact.' },
  { id:28, title:'Autonomous Robotics for Manufacturing', dept:'Computer Systems Engineering', lead:'Dr. I. Hussain (NCRA)', funding:'HEC NRPU', amount:'Rs 4.8M', status:'Active', year:'2023', desc:'NCRA-led project developing autonomous robotic systems for automated assembly lines.' },
];

const facultyProfiles = [
  { id:1, name:'Prof. Dr. Tanweer Hussain', role:'Director ORIC', dept:'Research & Innovation Management', areas:['Research Management','Technology Transfer','IP Protection','Commercialization'], projects:8, publications:45, email:'dir.oric@admin.muet.edu.pk', available:true },
  { id:2, name:'Dr. Syed Muhammad Ali Shah', role:'Manager UILTT', dept:'Industry Liaison & Technology Transfer', areas:['Industry-Academia Linkage','Technology Transfer','Entrepreneurship','Innovation Management'], projects:5, publications:28, email:'uiltt.oric@admin.muet.edu.pk', available:true },
  { id:3, name:'Dr. Tauha H. Ali', role:'Associate Professor', dept:'Computer Systems Engineering', areas:['Artificial Intelligence','Edge Computing','IoT Systems','Machine Learning'], projects:4, publications:32, email:'tauha.ali@faculty.muet.edu.pk', available:true },
  { id:4, name:'Dr. M. Aslam Uqaili', role:'Professor', dept:'Electrical Engineering', areas:['Smart Grids','Renewable Energy','Power Systems','Energy Policy'], projects:6, publications:55, email:'aslam.uqaili@faculty.muet.edu.pk', available:false },
  { id:5, name:'Dr. Rabeea Jaffari', role:'Associate Professor', dept:'Chemical Engineering', areas:['Water Treatment','Desalination','Environmental Engineering','Green Chemistry'], projects:3, publications:22, email:'rabeea.jaffari@faculty.muet.edu.pk', available:true },
  { id:6, name:'Dr. A. Baloch', role:'Professor', dept:'Mining & Metallurgical Engineering', areas:['Coal Research','Clean Energy','Resource Engineering','Environmental Mining'], projects:5, publications:38, email:'a.baloch@faculty.muet.edu.pk', available:true },
  { id:7, name:'Dr. F. Memon', role:'Assistant Professor', dept:'Biomedical Engineering', areas:['Signal Processing','Medical Devices','Rural Health Tech','Diagnostics'], projects:3, publications:18, email:'f.memon@faculty.muet.edu.pk', available:true },
  { id:8, name:'Dr. I. Hussain', role:'Deputy Director NCRA', dept:'Computer Systems Engineering (NCRA)', areas:['Robotics','Automation','Computer Vision','Human-Robot Interaction'], projects:6, publications:42, email:'i.hussain@ncra.muet.edu.pk', available:false },
  { id:9, name:'Dr. K. Rajput', role:'Assistant Professor', dept:'Electrical Engineering', areas:['Power Electronics','Wireless Power Transfer','EV Technology'], projects:2, publications:14, email:'k.rajput@faculty.muet.edu.pk', available:true },
  { id:10, name:'Dr. Z. Ahmed', role:'Assistant Professor', dept:'Electronic Engineering', areas:['RFID Systems','Embedded Electronics','IoT Hardware'], projects:2, publications:12, email:'z.ahmed@faculty.muet.edu.pk', available:true },
];

const researchCenters = [
  { name:'National Centre of Robotics & Automation', short:'NCRA', desc:'Pakistan\'s national centre for robotics research, automation systems and AI-driven manufacturing. Incubates robotics startups and runs national competitions.', website:'https://ncra-cms.muet.edu.pk/', focus:'Robotics & Automation' },
  { name:'US-Pakistan Center for Advanced Studies in Water', short:'USPCAS-W', desc:'Advanced research centre for water security, desalination technologies and sustainable water management, funded by USAID.', website:'https://water.muet.edu.pk/', focus:'Water Studies' },
  { name:'Coal Research & Resource Centre', short:'CRRC', desc:'Dedicated facility for clean coal technology, coal gasification and energy extraction from Thar coal reserves.', website:'https://oric.muet.edu.pk/', focus:'Coal Research' },
  { name:'Sindh Innovation Research & Education Network', short:'SIREN', desc:'Regional network connecting MUET research with industry partners and innovation ecosystems across Sindh.', website:'https://oric.muet.edu.pk/', focus:'Innovation Network' },
  { name:'ORIC Smart Room', short:'Smart Room', desc:'State-of-the-art innovation space at ORIC MUET for collaborative research, prototyping and industry-academia meetings.', website:'https://oric.muet.edu.pk/', focus:'Innovation Hub' },
];

const sponsorOpportunities = [
  { id:1, title:'FYP Standard Sponsorship', detail:'Sponsor a Final Year Project team. Includes branding, priority hiring rights and IP co-ownership.', amount:'Rs 12,500', tag:'Open', type:'FYP' },
  { id:2, title:'FYP Premium Sponsorship', detail:'Premium FYP sponsorship with dedicated company mentor and first refusal on intellectual property.', amount:'Rs 25,000', tag:'Open', type:'FYP' },
  { id:3, title:'Komatsu Pakistan Mining — Active MoU Partner', detail:'Active MoU (Dec 2025) covering international internships, graduate recruitment and technical mentorship.', amount:'Active Partnership', tag:'Active', type:'Partnership' },
  { id:4, title:'ASPIRE Pakistan — Innovation & Training Partner', detail:'Active MoU (Nov 2025) for Founders\' Edge training, FYP to Startup, National Idea Bank and Gen-AI Training.', amount:'Active Partnership', tag:'Active', type:'Partnership' },
  { id:5, title:'CIRIAF – University of Perugia, Italy', detail:'Active international research MoU for joint research, PhD programs and academic exchange.', amount:'Active Partnership', tag:'Active', type:'Research' },
  { id:6, title:'Research Project Sponsorship', detail:'Fund an active NRPU, TDF or PSF research project for joint publications and technology transfer rights.', amount:'Custom', tag:'Open', type:'Research' },
  { id:7, title:'BIC Incubation Cohort Sponsorship', detail:'Sponsor the Business Incubation Centre cohort. Gain startup equity options and investment pipeline access.', amount:'Custom', tag:'Open', type:'Incubation' },
  { id:8, title:'"My FYP, My Startup" Training Sponsorship', detail:'Sponsor ASPIRE\'s flagship training for FYP Group Leaders on commercialization and startup fundamentals.', amount:'Custom', tag:'Open', type:'Training' },
  { id:9, title:'National Idea Bank Competition Sponsor', detail:'Sponsor and judge ASPIRE campus innovation competitions. Gain early pipeline access to student innovations.', amount:'Custom', tag:'Open', type:'Competition' },
  { id:10, title:'Gen-AI Training Certification Partner', detail:'Provide internationally recognized certification for MUET students completing ASPIRE Gen-AI Training.', amount:'Custom', tag:'Open', type:'Certification' },
];

const resources = [
  { id:1, cat:'Templates', name:'MoU Agreement Template', format:'PDF', size:'5.1 MB', desc:'Standard MoU template used by ORIC MUET for all industry-academia partnerships', downloads:142, file: mouPdf, local:true },
  { id:2, cat:'Templates', name:'Collaboration Request Form', format:'PDF', size:'180 KB', desc:'Official ORIC collaboration request form for new industry partners', downloads:89, url:'https://oric.muet.edu.pk/', local:false },
  { id:3, cat:'Templates', name:'Sponsorship Agreement', format:'PDF', size:'4.6 MB', desc:'Standard sponsorship agreement for FYP and research project funding with IP terms', downloads:67, file: sponsorshipPdf, local:true },
  { id:4, cat:'Templates', name:'Pitch Deck Template', format:'PPTX', size:'2.4 MB', desc:'ORIC-branded pitch deck template for student startup presentations', downloads:234, url:'https://oric.muet.edu.pk/', local:false },
  { id:5, cat:'Templates', name:'Business Model Canvas', format:'PDF', size:'410 KB', desc:'Structured business model canvas for student entrepreneurs and FYP teams', downloads:198, url:'https://oric.muet.edu.pk/', local:false },
  { id:6, cat:'Guides', name:'BIC Evaluation Criteria', format:'PDF', size:'5.2 MB', desc:'Complete evaluation criteria for Business Incubation Centre applications', downloads:156, file: bicPdf, local:true },
  { id:7, cat:'Guides', name:'Industry Partnership Process Guide', format:'PDF', size:'5.0 MB', desc:'Complete guide for industry partners on ORIC collaboration process and MoU workflow', downloads:112, file: partnershipPdf, local:true },
  { id:8, cat:'Guides', name:'IEC Application Guidelines', format:'PDF', size:'290 KB', desc:'Innovation & Entrepreneurship Centre application and participation guide', downloads:88, url:'https://oric.muet.edu.pk/', local:false },
  { id:9, cat:'Guides', name:'Pre-Incubation Registration Process', format:'PDF', size:'380 KB', desc:'Step-by-step guide for student startups applying to ORIC BIC program', downloads:201, url:'https://oric.muet.edu.pk/', local:false },
  { id:10, cat:'Reports', name:'ORIC Annual Commercialization Report', format:'PDF', size:'3.2 MB', desc:'Annual report on ORIC MUET commercialization activities and startup outcomes', downloads:445, url:'https://oric.muet.edu.pk/', local:false },
  { id:11, cat:'Reports', name:'STP Facility Information Pack', format:'PDF', size:'1.8 MB', desc:'Complete information about the Science & Technology Park facility', downloads:78, url:'https://oric.muet.edu.pk/', local:false },
  { id:12, cat:'Legal', name:'IP Protection Guidelines', format:'PDF', size:'620 KB', desc:'Intellectual property protection guidelines for faculty, students and industry partners', downloads:167, url:'https://hec.gov.pk/', local:false },
  { id:13, cat:'Legal', name:'Sponsorship Legal Framework', format:'PDF', size:'890 KB', desc:'Legal framework for all sponsorship and IP rights agreements at ORIC', downloads:94, url:'https://oric.muet.edu.pk/', local:false },
  { id:14, cat:'Training', name:'"My FYP, My Startup" Training Materials', format:'PDF', size:'1.4 MB', desc:'ASPIRE Pakistan training session content for FYP Group Leaders (Dec 2025)', downloads:312, url:'https://oric.muet.edu.pk/', local:false },
  { id:15, cat:'Training', name:'Gen-AI Training Certification Guide', format:'PDF', size:'2.1 MB', desc:'ASPIRE Gen-AI Training program guide with international certification requirements', downloads:289, url:'https://oric.muet.edu.pk/', local:false },
  { id:16, cat:'Training', name:"Founders' Edge Program Handbook", format:'PDF', size:'1.6 MB', desc:'Complete handbook for ASPIRE Founders\' Edge entrepreneurship training program', downloads:178, url:'https://oric.muet.edu.pk/', local:false },
  { id:17, cat:'Portal Guides', name:'HEC RIC Portal User Guide', format:'PDF', size:'760 KB', desc:'How to use the national HEC Triple Helix Platform for academia-industry collaboration', downloads:134, url:'https://hec.gov.pk/', local:false },
];

const announcements = [
  { id:1, title:'Komatsu Pakistan Mining MoU — Dec 2025', detail:'International internships, graduate recruitment and technical mentorship for MUET students now active.', date:'Dec 2025', color:'#27ae60',
    icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
  { id:2, title:'ASPIRE Pakistan — Innovation Programs Active', detail:'Founders\' Edge training, FYP to Startup, National Idea Bank and free Gen-AI Training now available.', date:'Nov 2025', color:'#2980b9',
    icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
  { id:3, title:'FYP Roadshow — Batch 2022', detail:'Industry partners invited to attend FYP Showcase and engage with student project teams.', date:'June 2026', color:'#8e44ad',
    icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.882V15.12a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg> },
  { id:4, title:'Help Desk Open — Batch 2023', detail:'ORIC Help Desk now open for Batch 2023 students to transform ideas into incubation-ready proposals.', date:'June 2026', color:'#e67e22',
    icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg> },
  { id:5, title:'CIRIAF-Perugia Joint Research Call', detail:'Faculty collaboration applications open for joint research and PhD programs with University of Perugia, Italy.', date:'May 2026', color:'#e74c3c',
    icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg> },
];

const pipelineStages = [
  { stage:'Idea', count:47, color:'#3498db', desc:'Registered student ideas under evaluation' },
  { stage:'Prototype', count:23, color:'#9b59b6', desc:'Ideas with working prototypes' },
  { stage:'Incubation', count:12, color:'#e67e22', desc:'Active BIC incubation cohort' },
  { stage:'Market Launch', count:8, color:'#27ae60', desc:'Graduated startups in market' },
];

const programs = [
  {
    title:'Research & Development', tag:'Core Program', desc:'Submit and track research proposals, manage ongoing projects and collaborate across departments.', color:'#2980b9',
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>,
    nav:'research'
  },
  {
    title:'Grants & Funding', tag:'Funding', desc:'Explore HEC-NRPU, PSF, TDF and international funding opportunities for research projects.', color:'#27ae60',
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    nav:'sponsor'
  },
  {
    title:'Training Programs', tag:'Training', desc:'ASPIRE Founders\' Edge, Gen-AI Training and My FYP My Startup capacity building programs.', color:'#8e44ad',
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>,
    nav:'resources'
  },
  {
    title:'Innovation & IP', tag:'IP and Patents', desc:'File patents, register intellectual property and access support for technology transfer and commercialization.', color:'#e67e22',
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>,
    nav:'resources'
  },
  {
    title:'Industry Linkages', tag:'Industry', desc:'Connect with active MoU partners including Komatsu, ASPIRE Pakistan and CIRIAF Italy.', color:'#e74c3c',
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>,
    nav:'requests'
  },
  {
    title:'Incubation & STP', tag:'Startup', desc:'Business Incubation Centre and Science & Technology Park for startups at all stages.', color:'#1abc9c',
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
    nav:'listings'
  },
];

const FORMSPREE_URL = 'https://formspree.io/f/xgojvpbl';

export default function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem('loggedInUser') || '';
  const name = getNameFromEmail(email);
  const initial = email.charAt(0).toUpperCase();

  const [section, setSection] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [researchView, setResearchView] = useState('projects');
  const [resourceCat, setResourceCat] = useState('All');
  const [reqForm, setReqForm] = useState({ company:'', type:'MoU Request', contact:'', email:'', phone:'', description:'', startDate:'', endDate:'', budget:'' });
  const [fbForm, setFbForm] = useState({ name:'', company:'', fbEmail:'', category:'Platform Feedback', rating:0, liked:'', improve:'', recommend:'' });
  const [reqSuccess, setReqSuccess] = useState(false);
  const [reqSending, setReqSending] = useState(false);
  const [fbSuccess, setFbSuccess] = useState(false);
  const [fbSending, setFbSending] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
const [showProfile, setShowProfile] = useState(false);

useEffect(() => {
  const handleClick = (e) => {
    if (!e.target.closest('.ip-notif-wrap')) setShowNotif(false);
    if (!e.target.closest('.ip-topbar-user')) setShowProfile(false);
  };
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, []);

  const handleLogout = () => { localStorage.removeItem('loggedInUser'); navigate('/'); };

  const submitRequest = async () => {
    if (!reqForm.company || !reqForm.contact || !reqForm.description) return;
    setReqSending(true);
    try {
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          type: 'Collaboration Request',
          company: reqForm.company,
          collaborationType: reqForm.type,
          contactPerson: reqForm.contact,
          email: reqForm.email,
          phone: reqForm.phone,
          budget: reqForm.budget,
          startDate: reqForm.startDate,
          endDate: reqForm.endDate,
          description: reqForm.description,
        })
      });
    } catch(e) { console.log(e); }
    setReqForm({ company:'', type:'MoU Request', contact:'', email:'', phone:'', description:'', startDate:'', endDate:'', budget:'' });
    setReqSending(false);
    setReqSuccess(true);
    setTimeout(() => setReqSuccess(false), 6000);
  };

  const submitFeedback = async () => {
    if (!fbForm.rating || !fbForm.liked || !fbForm.name) return;
    setFbSending(true);
    try {
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          type: 'Feedback',
          name: fbForm.name,
          company: fbForm.company,
          email: fbForm.fbEmail,
          category: fbForm.category,
          rating: `${fbForm.rating}/5 Stars`,
          liked: fbForm.liked,
          improve: fbForm.improve,
          recommend: fbForm.recommend,
        })
      });
    } catch(e) { console.log(e); }
    setFbForm({ name:'', company:'', fbEmail:'', category:'Platform Feedback', rating:0, liked:'', improve:'', recommend:'' });
    setHoveredStar(0);
    setFbSending(false);
    setFbSuccess(true);
    setTimeout(() => setFbSuccess(false), 6000);
  };

  const handleDownload = (r) => {
    if (r.local) {
      const a = document.createElement('a');
      a.href = r.file;
      a.download = r.name + '.pdf';
      a.click();
    } else {
      window.open(r.url, '_blank');
    }
  };

  const filteredListings = listings.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'All' || l.type === typeFilter;
    return matchSearch && matchType;
  });

  const depts = ['All', ...new Set(researchProjects.map(r => r.dept))];
  const filteredResearch = deptFilter === 'All' ? researchProjects : researchProjects.filter(r => r.dept === deptFilter);
  const resourceCats = ['All', 'Templates', 'Guides', 'Reports', 'Legal', 'Training', 'Portal Guides'];
  const filteredResources = resourceCat === 'All' ? resources : resources.filter(r => r.cat === resourceCat);

  const sectionTitles = {
    overview: 'Dashboard',
    listings: 'Browse Listings',
    requests: 'Collaboration Requests',
    research: 'Research & Faculty',
    sponsor: 'Sponsor Opportunities',
    resources: 'Resources & Downloads',
    feedback: 'Feedback',
  };

  const navItems = [
    { key:'overview', label:'Dashboard', icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { key:'listings', label:'Browse Listings', icon:'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { key:'requests', label:'Collaboration Requests', icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0' },
    { key:'research', label:'Research & Faculty', icon:'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { key:'sponsor', label:'Sponsor Opportunities', icon:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key:'resources', label:'Resources & Downloads', icon:'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
    { key:'feedback', label:'Feedback', icon:'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  ];

  return (
    <div className="ip-root">
      {/* MOBILE BAR */}
      <div className="ip-mobile-bar">
        <button className="ip-menu-btn" onClick={() => setMobileOpen(true)}>☰</button>
        <span className="ip-mobile-title">ORIC Portal — MUET</span>
      </div>
      {mobileOpen && <div className="ip-overlay" onClick={() => setMobileOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`ip-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="ip-brand">
          <img src={logo} alt="ORIC" className="ip-brand-logo" />
          <div>
            <p className="ip-brand-title">ORIC Portal</p>
            <p className="ip-brand-sub">MUET Jamshoro</p>
          </div>
        </div>
        <div className="ip-profile">
          <div className="ip-avatar">{initial}</div>
          <div>
            <p className="ip-profile-name">{name}</p>
            <p className="ip-profile-role">Industry Partner</p>
          </div>
        </div>
        <p className="ip-nav-label">Overview</p>
        <nav className="ip-nav">
          <button className={`ip-nav-item ${section === 'overview' ? 'active' : ''}`}
            onClick={() => { setSection('overview'); setMobileOpen(false); }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Dashboard
          </button>
        </nav>
        <p className="ip-nav-label">Navigation</p>
        <nav className="ip-nav">
          {navItems.slice(1).map(item => (
            <button key={item.key} className={`ip-nav-item ${section === item.key ? 'active' : ''}`}
              onClick={() => { setSection(item.key); setMobileOpen(false); }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
              </svg>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="ip-sidebar-bottom">
          <p className="ip-nav-label" style={{paddingTop:8}}>Account</p>
          <button className="ip-nav-item" onClick={() => { navigate('/settings'); setMobileOpen(false); }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Settings
          </button>
          <button className="ip-signout" onClick={handleLogout}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign Out
          </button>
        </div>
        <div className="ip-contact-box">
          <p className="ip-contact-title">ORIC Direct Contact</p>
          <p className="ip-contact-item">📞 +92 22 2772280 Ext. 6500</p>
          <p className="ip-contact-item">💬 031-68832427</p>
          <p className="ip-contact-item">✉️ dir.oric@admin.muet.edu.pk</p>
          <p className="ip-contact-item">🌐 oric.muet.edu.pk</p>
          <p className="ip-contact-item" style={{marginTop:4}}>IT Support: Ext. 6508</p>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="ip-main-wrapper">

        {/* TOP BAR */}
        <header className="ip-topbar">
          <div className="ip-topbar-left">
            <p className="ip-topbar-breadcrumb">
              ORIC <span className="ip-bc-sep">›</span>
              <span className="ip-bc-current">{sectionTitles[section]}</span>
            </p>
          </div>
          <div className="ip-topbar-right">
            <div className="ip-topbar-search">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input placeholder="Search portal..." className="ip-topbar-search-input"
                onChange={e => { if(section !== 'listings') { setSection('listings'); } setSearchTerm(e.target.value); }} />
            </div>
            <div className="ip-notif-wrap">
              <button className="ip-notif-btn" onClick={() => setShowNotif(!showNotif)}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <span className="ip-notif-badge">{announcements.length}</span>
              </button>
              {showNotif && (
                <div className="ip-notif-dropdown">
                  <div className="ip-notif-header">
                    <span>Notifications</span>
                    <button onClick={() => setShowNotif(false)} className="ip-notif-close">✕</button>
                  </div>
                  {announcements.map(a => (
                    <div key={a.id} className="ip-notif-item">
                      <div className="ip-notif-dot" style={{ background: a.color }} />
                      <div>
                        <p className="ip-notif-title">{a.title}</p>
                        <p className="ip-notif-date">{a.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
           <div className="ip-topbar-user" onClick={() => setShowProfile(!showProfile)} style={{ cursor:'pointer', position:'relative' }}>
  <div className="ip-topbar-avatar">{initial}</div>
  <span className="ip-topbar-name">{name}</span>
  {showProfile && (
    <div className="ip-profile-dropdown">
      <div className="ip-pd-top">
        <div className="ip-pd-avatar">{initial}</div>
        <div>
          <p className="ip-pd-name">{name}</p>
          <p className="ip-pd-role">Industry Partner</p>
          <p className="ip-pd-email">{email}</p>
        </div>
      </div>
      <div className="ip-pd-divider" />
      <button className="ip-pd-item" onClick={() => navigate('/settings')}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/>
        </svg>
        Settings
      </button>
      <button className="ip-pd-item ip-pd-signout" onClick={handleLogout}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Sign Out
      </button>
    </div>
  )}
</div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="ip-main">

          {/* ═══ OVERVIEW ═══ */}
          {section === 'overview' && (
            <div>
              <h1 className="ip-page-title">Industry Partner Dashboard</h1>
              <p className="ip-page-sub">Office of Research, Innovation & Commercialization — MUET Jamshoro</p>

              {/* STATS — 4 cards with SVG icons */}
              <div className="ip-stats-row">
                {[
                  {
                    num:'31', label:'Seed Money Awards', note:'FYP Showcase since 2022', color:'#2980b9', bg:'#eef4fb',
                    icon:<svg width="22" height="22" fill="none" stroke="#2980b9" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  },
                  {
                    num:'29+', label:'Industry MoUs Signed', note:'National partnerships since 2009', color:'#27ae60', bg:'#eafaf1',
                    icon:<svg width="22" height="22" fill="none" stroke="#27ae60" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></svg>
                  },
                  {
                    num:'28', label:'Research Projects', note:'NRPU · TDF · PSF · PRICA funded', color:'#8e44ad', bg:'#f5eef8',
                    icon:<svg width="22" height="22" fill="none" stroke="#8e44ad" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  },
                  {
                    num:'Rs 250M+', label:'Total Research Funding', note:'Active grants across all departments', color:'#e67e22', bg:'#fef5e7',
                    icon:<svg width="22" height="22" fill="none" stroke="#e67e22" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  },
                ].map(({ num, label, note, color, bg, icon }) => (
                  <div key={label} className="ip-stat-card" style={{ borderLeft: `4px solid ${color}` }}>
                    <div className="ip-stat-icon-wrap" style={{ background: bg }}>
                      {icon}
                    </div>
                    <div className="ip-stat-text">
                      <span className="ip-stat-num" style={{ color }}>{num}</span>
                      <span className="ip-stat-label">{label}</span>
                      <span className="ip-stat-note" style={{ color }}>{note}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* PIPELINE — full width */}
              <div className="ip-section-card" style={{ marginBottom:20 }}>
                <h3 className="ip-card-title">Startup Commercialization Pipeline</h3>
                <p className="ip-card-sub">BIC bi-annual intake — applications evaluated every 3 months</p>
                <div className="ip-pipeline-row">
                  {pipelineStages.map((p, i) => (
                    <React.Fragment key={p.stage}>
                      <div className="ip-pipeline-stage">
                        <div className="ip-pipeline-num" style={{ background: p.color }}>{p.count}</div>
                        <p className="ip-pipeline-label">{p.stage}</p>
                        <p className="ip-pipeline-desc">{p.desc}</p>
                      </div>
                      {i < pipelineStages.length - 1 && <div className="ip-pipeline-connector">→</div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* PROGRAMS + ANNOUNCEMENTS side by side */}
              <div className="ip-overview-bottom">
                <div>
                  <h2 className="ip-section-heading">Programs and Services</h2>
                  <p className="ip-section-subheading">All programs offered under ORIC, MUET Jamshoro</p>
                  <div className="ip-programs-grid">
                    {programs.map(p => (
                      <div key={p.title} className="ip-program-card">
                        <div className="ip-program-top">
                          <div className="ip-program-icon" style={{ background: p.color + '18', color: p.color }}>
                            {p.icon}
                          </div>
                          <span className="ip-program-tag">{p.tag}</span>
                        </div>
                        <h3 className="ip-program-title" style={{ color: p.color }}>{p.title}</h3>
                        <p className="ip-program-desc">{p.desc}</p>
                        <button className="ip-program-open" style={{ color: p.color }} onClick={() => setSection(p.nav)}>Open →</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ANNOUNCEMENTS */}
                <div className="ip-announce-panel">
                  <div className="ip-announce-header">
                    <h3 className="ip-card-title">Announcements</h3>
                    <button className="ip-viewall-btn">View all →</button>
                  </div>
                  {announcements.map(a => (
                    <div key={a.id} className="ip-announce-item">
                      <div className="ip-announce-icon-wrap" style={{ background: a.color + '18', color: a.color }}>
                        {a.icon}
                      </div>
                      <div>
                        <p className="ip-announce-title">{a.title}</p>
                        <p className="ip-announce-detail">{a.detail}</p>
                        <p className="ip-announce-date">{a.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ BROWSE LISTINGS ═══ */}
          {section === 'listings' && (
            <div>
              <h1 className="ip-page-title">Startups, FYPs & Business Ideas</h1>
              <p className="ip-page-sub">{filteredListings.length} of {listings.length} listings — search and filter to find relevant projects</p>
              <div className="ip-toolbar">
                <input className="ip-search" type="text" placeholder="Search by name or description..."
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <div className="ip-filter-chips">
                  {['All','Startup','FYP','Business Idea','STP Startup','National Idea Bank','Gen-AI Project'].map(t => (
                    <button key={t} className={`ip-chip ${typeFilter === t ? 'active' : ''}`}
                      onClick={() => setTypeFilter(t)}>{t}</button>
                  ))}
                </div>
              </div>
              {filteredListings.length === 0
                ? <div className="ip-empty">No listings match your search.</div>
                : <div className="ip-card-grid">
                    {filteredListings.map(item => (
                      <div className="ip-listing-card" key={item.id}>
                        <div>
                          <div className="ip-listing-header">
                            <span className="ip-type-badge">{item.type}</span>
                            <span className="ip-tech-badge">{item.tech}</span>
                          </div>
                          <h3>{item.name}</h3>
                          <p className="ip-dept">{item.dept}</p>
                          <p className="ip-summary">{item.summary}</p>
                          <p className="ip-team">Team: {item.team} members</p>
                        </div>
                        <div className="ip-card-footer">
                          <span className="ip-stage">{item.stage}</span>
                          <button className="ip-secondary-btn" onClick={() => setSection('requests')}>Express Interest</button>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {/* ═══ COLLABORATION REQUESTS ═══ */}
          {section === 'requests' && (
            <div>
              <h1 className="ip-page-title">Submit a Collaboration Request</h1>
              <p className="ip-page-sub">Reviewed by Dr. Syed Muhammad Ali Shah (Manager UILTT) within 5 business days</p>
              <div className="ip-form-card" style={{ maxWidth: 700 }}>
                {reqSuccess && <div className="ip-success-msg">✅ Request submitted successfully! The ORIC team will contact you within 5 business days.</div>}
                <div className="ip-form-grid">
                  <div className="ip-form-row">
                    <label>Company / Organization Name *</label>
                    <input type="text" placeholder="e.g. Komatsu Pakistan Mining"
                      value={reqForm.company} onChange={e => setReqForm({...reqForm, company: e.target.value})} />
                  </div>
                  <div className="ip-form-row">
                    <label>Collaboration Type *</label>
                    <select value={reqForm.type} onChange={e => setReqForm({...reqForm, type: e.target.value})}>
                      {['MoU Request','Internship Partnership','Joint Research','Recruitment Drive','Alumni Partnership','National Idea Bank Competition','Gen-AI Training Partnership','Faculty Hiring','FYP Sponsorship'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="ip-form-row">
                    <label>Contact Person *</label>
                    <input type="text" placeholder="Full name"
                      value={reqForm.contact} onChange={e => setReqForm({...reqForm, contact: e.target.value})} />
                  </div>
                  <div className="ip-form-row">
                    <label>Email Address *</label>
                    <input type="email" placeholder="contact@company.com"
                      value={reqForm.email} onChange={e => setReqForm({...reqForm, email: e.target.value})} />
                  </div>
                  <div className="ip-form-row">
                    <label>Phone Number</label>
                    <input type="text" placeholder="+92 XXX XXXXXXX"
                      value={reqForm.phone} onChange={e => setReqForm({...reqForm, phone: e.target.value})} />
                  </div>
                  <div className="ip-form-row">
                    <label>Budget (if applicable)</label>
                    <input type="text" placeholder="e.g. Rs 500,000"
                      value={reqForm.budget} onChange={e => setReqForm({...reqForm, budget: e.target.value})} />
                  </div>
                  <div className="ip-form-row">
                    <label>Proposed Start Date</label>
                    <input type="date" value={reqForm.startDate}
                      onChange={e => setReqForm({...reqForm, startDate: e.target.value})} />
                  </div>
                  <div className="ip-form-row">
                    <label>Proposed End Date</label>
                    <input type="date" value={reqForm.endDate}
                      onChange={e => setReqForm({...reqForm, endDate: e.target.value})} />
                  </div>
                </div>
                <div className="ip-form-row" style={{ marginTop:4 }}>
                  <label>Proposal / Project Description *</label>
                  <textarea rows="4" placeholder="Describe the collaboration you are proposing..."
                    value={reqForm.description} onChange={e => setReqForm({...reqForm, description: e.target.value})} />
                </div>
                <button className="ip-primary-btn" style={{ marginTop:14 }} onClick={submitRequest} disabled={reqSending}>
                  {reqSending ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          )}

          {/* ═══ RESEARCH & FACULTY ═══ */}
          {section === 'research' && (
            <div>
              <h1 className="ip-page-title">Research Projects & Faculty Profiles</h1>
              <p className="ip-page-sub">Browse {researchProjects.length} active funded research projects and {facultyProfiles.length} faculty profiles</p>
              <div className="ip-view-toggle">
                {[['projects','Research Projects'],['faculty','Faculty Profiles'],['centers','Research Centers']].map(([key, label]) => (
                  <button key={key} className={`ip-toggle-btn ${researchView === key ? 'active' : ''}`}
                    onClick={() => setResearchView(key)}>{label}</button>
                ))}
              </div>
              {researchView === 'projects' && (
                <>
                  <div className="ip-filter-chips" style={{ marginBottom:16 }}>
                    {depts.map(d => (
                      <button key={d} className={`ip-chip ${deptFilter === d ? 'active' : ''}`}
                        onClick={() => setDeptFilter(d)}>{d === 'All' ? 'All Departments' : d}</button>
                    ))}
                  </div>
                  <div className="ip-card-grid">
                    {filteredResearch.map(item => (
                      <div className="ip-listing-card" key={item.id}>
                        <div>
                          <div className="ip-listing-header">
                            <span className="ip-type-badge" style={{ background:'#27ae60' }}>{item.status}</span>
                            <span className="ip-tech-badge">{item.funding}</span>
                          </div>
                          <h3>{item.title}</h3>
                          <p className="ip-dept">{item.dept}</p>
                          <p className="ip-summary">{item.desc}</p>
                          <p className="ip-team">Lead: {item.lead} | {item.amount}</p>
                        </div>
                        <div className="ip-card-footer">
                          <span className="ip-stage">Since {item.year}</span>
                          <button className="ip-secondary-btn" onClick={() => setSection('requests')}>Collaborate</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {researchView === 'faculty' && (
                <div className="ip-faculty-grid">
                  {facultyProfiles.map(f => (
                    <div className="ip-faculty-card" key={f.id}>
                      <div className="ip-faculty-header">
                        <div className="ip-faculty-avatar">{f.name.charAt(0)}</div>
                        <div style={{ flex:1 }}>
                          <h3>{f.name}</h3>
                          <p className="ip-faculty-role">{f.role}</p>
                          <p className="ip-dept">{f.dept}</p>
                        </div>
                        <span className={`ip-avail-badge ${f.available ? 'available' : 'busy'}`}>
                          {f.available ? 'Available' : 'Busy'}
                        </span>
                      </div>
                      <div className="ip-faculty-areas">
                        {f.areas.map(a => <span key={a} className="ip-area-tag">{a}</span>)}
                      </div>
                      <div className="ip-faculty-stats">
                        <div><span className="ip-fstat-num">{f.projects}</span><span className="ip-fstat-label">Projects</span></div>
                        <div><span className="ip-fstat-num">{f.publications}</span><span className="ip-fstat-label">Publications</span></div>
                      </div>
                      <a href={`mailto:${f.email}`} className="ip-email-link">{f.email}</a>
                    </div>
                  ))}
                </div>
              )}
              {researchView === 'centers' && (
                <div className="ip-card-grid">
                  {researchCenters.map(c => (
                    <div className="ip-listing-card" key={c.short}>
                      <div>
                        <span className="ip-type-badge">{c.focus}</span>
                        <h3 style={{ marginTop:10 }}>{c.name}</h3>
                        <p className="ip-dept">{c.short}</p>
                        <p className="ip-summary">{c.desc}</p>
                      </div>
                      <div className="ip-card-footer">
                        <a href={c.website} target="_blank" rel="noreferrer"
                          className="ip-primary-btn" style={{ textDecoration:'none', fontSize:'12px' }}>
                          Visit Website →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ SPONSOR ═══ */}
          {section === 'sponsor' && (
            <div>
              <h1 className="ip-page-title">Sponsor Research & FYP Opportunities</h1>
              <p className="ip-page-sub">Active ORIC partnerships and open sponsorship — FYP funding from Rs 12,500</p>
              <div className="ip-card-grid" style={{ gridTemplateColumns:'repeat(2,1fr)' }}>
                {sponsorOpportunities.map(item => (
                  <div className="ip-listing-card" key={item.id}>
                    <div>
                      <div className="ip-listing-header">
                        <span className="ip-type-badge" style={{ background: item.tag === 'Active' ? '#27ae60' : '#2980b9' }}>{item.tag}</span>
                        <span className="ip-tech-badge">{item.type}</span>
                      </div>
                      <h3>{item.title}</h3>
                      <p className="ip-summary">{item.detail}</p>
                      <p className="ip-team">Investment: <strong>{item.amount}</strong></p>
                    </div>
                    <div className="ip-card-footer">
                      <button className="ip-primary-btn" onClick={() => setSection('requests')}>Express Interest →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ RESOURCES ═══ */}
          {section === 'resources' && (
            <div>
              <h1 className="ip-page-title">Resources & Downloads</h1>
              <p className="ip-page-sub">{resources.length} documents — templates, guides, reports and legal frameworks</p>
              <div className="ip-filter-chips" style={{ marginBottom:20 }}>
                {resourceCats.map(c => (
                  <button key={c} className={`ip-chip ${resourceCat === c ? 'active' : ''}`}
                    onClick={() => setResourceCat(c)}>{c}</button>
                ))}
              </div>
              <div className="ip-resource-list">
                {filteredResources.map(r => (
                  <div className="ip-resource-row" key={r.id}>
                    <div className="ip-resource-icon"><span>{r.format}</span></div>
                    <div className="ip-resource-info">
                      <p className="ip-resource-name">{r.name} {r.local && <span className="ip-real-badge">Real File</span>}</p>
                      <p className="ip-resource-desc">{r.desc}</p>
                      <p className="ip-resource-meta">{r.cat} · {r.size} · {r.downloads} downloads</p>
                    </div>
                    <button className="ip-secondary-btn" onClick={() => handleDownload(r)}>
                      {r.local ? 'Download' : 'Open →'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ FEEDBACK ═══ */}
          {section === 'feedback' && (
            <div>
              <h1 className="ip-page-title">Feedback System</h1>
              <p className="ip-page-sub">Your feedback goes directly to the ORIC team and is reviewed within 7 days</p>
              <div className="ip-form-card" style={{ maxWidth:600 }}>
                {fbSuccess && <div className="ip-success-msg">✅ Thank you! Your feedback has been sent to the ORIC team and will be reviewed within 7 days.</div>}
                <div className="ip-form-grid">
                  <div className="ip-form-row">
                    <label>Full Name *</label>
                    <input type="text" placeholder="Your full name"
                      value={fbForm.name} onChange={e => setFbForm({...fbForm, name: e.target.value})} />
                  </div>
                  <div className="ip-form-row">
                    <label>Company Name</label>
                    <input type="text" placeholder="Your organization"
                      value={fbForm.company} onChange={e => setFbForm({...fbForm, company: e.target.value})} />
                  </div>
                  <div className="ip-form-row">
                    <label>Email Address</label>
                    <input type="email" placeholder="your@email.com"
                      value={fbForm.fbEmail} onChange={e => setFbForm({...fbForm, fbEmail: e.target.value})} />
                  </div>
                  <div className="ip-form-row">
                    <label>Feedback Category *</label>
                    <select value={fbForm.category} onChange={e => setFbForm({...fbForm, category: e.target.value})}>
                      {['Platform Feedback','Project Feedback','Collaboration Feedback','STP Startup Feedback','ASPIRE Program Feedback','Alumni Cell Feedback','National Idea Bank Feedback','Suggestion Box'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="ip-form-row" style={{ marginTop:8 }}>
                  <label>Overall Rating *</label>
                  <div className="ip-stars">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`ip-star ${s <= (hoveredStar || fbForm.rating) ? 'active' : ''}`}
                        onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setFbForm({...fbForm, rating: s})}>★</span>
                    ))}
                    {fbForm.rating > 0 && <span className="ip-rating-label">{['','Poor','Below Average','Average','Good','Excellent'][fbForm.rating]}</span>}
                  </div>
                </div>
                <div className="ip-form-row">
                  <label>What did you like? *</label>
                  <textarea rows="3" placeholder="Tell us what worked well..."
                    value={fbForm.liked} onChange={e => setFbForm({...fbForm, liked: e.target.value})} />
                </div>
                <div className="ip-form-row">
                  <label>What could be improved?</label>
                  <textarea rows="3" placeholder="Tell us what could be better..."
                    value={fbForm.improve} onChange={e => setFbForm({...fbForm, improve: e.target.value})} />
                </div>
                <div className="ip-form-row">
                  <label>Would you recommend this portal?</label>
                  <div className="ip-recommend-row">
                    {['Yes','No','Maybe'].map(r => (
                      <button key={r} className={`ip-rec-btn ${fbForm.recommend === r ? 'active' : ''}`}
                        onClick={() => setFbForm({...fbForm, recommend: r})}>{r}</button>
                    ))}
                  </div>
                </div>
                <button className="ip-primary-btn" style={{ marginTop:12 }}
                  onClick={submitFeedback} disabled={fbSending}>
                  {fbSending ? 'Sending...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          )}

        </main>

        {/* FOOTER */}
        <footer className="ip-footer">
          <p>© 2026 ORIC — Office of Research, Innovation & Commercialization, MUET Jamshoro. All rights reserved.</p>
          <p>
            <a href="https://oric.muet.edu.pk/" target="_blank" rel="noreferrer">oric.muet.edu.pk</a>
            <span className="ip-footer-sep">·</span>
            <a href="mailto:dir.oric@admin.muet.edu.pk">dir.oric@admin.muet.edu.pk</a>
            <span className="ip-footer-sep">·</span>
            +92 22 2772280 Ext. 6500
          </p>
        </footer>
      </div>
    </div>
  );
}
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Student from '@/lib/models/Student';
import Publication from '@/lib/models/Publication';
import Event from '@/lib/models/Event';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Publication.deleteMany({});
    await Event.deleteMany({});
    
    // Create faculty users
    const faculty1 = await User.create({
      firstName: 'Ahmed',
      lastName: 'Mohammed',
      email: 'ahmed.mohammed@este.uca.ma',
      title: 'Dr.',
      position: 'Directeur du Laboratoire',
      department: 'Informatique',
      phone: '+212 524 78 90 12',
      office: 'Bâtiment A, Bureau 301',
      bio: 'Expert en intelligence artificielle et apprentissage automatique.',
      interests: ['Intelligence Artificielle', 'Machine Learning', 'Deep Learning'],
      userType: 'FACULTY',
      links: {
        googleScholar: 'https://scholar.google.com/citations?user=example',
        researchGate: 'https://www.researchgate.net/profile/example'
      }
    });

    const faculty2 = await User.create({
      firstName: 'Fatima',
      lastName: 'Zahra',
      email: 'fatima.zahra@este.uca.ma',
      title: 'Pr.',
      position: 'Co-Directrice',
      department: 'Informatique',
      phone: '+212 524 78 90 13',
      office: 'Bâtiment A, Bureau 302',
      bio: 'Spécialiste en traitement du signal et analyse d\'images.',
      interests: ['Traitement du Signal', 'Vision par Ordinateur', 'Multimédia'],
      userType: 'FACULTY',
      links: {
        googleScholar: 'https://scholar.google.com/citations?user=fatima-example',
        researchGate: 'https://www.researchgate.net/profile/fatima-example'
      }
    });

    const faculty3 = await User.create({
      firstName: 'Karim',
      lastName: 'Omar',
      email: 'karim.omar@este.uca.ma',
      title: 'Dr.',
      position: 'Chercheur Senior',
      department: 'Informatique',
      phone: '+212 524 78 90 14',
      office: 'Bâtiment A, Bureau 303',
      bio: 'Expert en modélisation mathématique et optimisation.',
      interests: ['Mathématiques', 'Optimisation', 'Modélisation'],
      userType: 'FACULTY'
    });

    // Create PhD students
    const phd1 = await Student.create({
      firstName: 'Youssef',
      lastName: 'Said',
      email: 'youssef.said@edu.uca.ma',
      studentType: 'PHD',
      program: 'Doctorat Informatique',
      specialization: 'Intelligence Artificielle',
      supervisor: faculty1._id,
      coSupervisors: [faculty2._id],
      thesisTitle: 'Deep Learning pour l\'analyse d\'images médicales',
      researchArea: 'Deep Learning et Vision par Ordinateur',
      startDate: new Date('2021-10-01'),
      expectedEndDate: new Date('2024-10-01'),
      status: 'ACTIVE',
      bio: 'Doctorant spécialisé en deep learning pour l\'analyse d\'images médicales.',
      interests: ['Deep Learning', 'Medical Imaging', 'Computer Vision']
    });

    const phd2 = await Student.create({
      firstName: 'Leila',
      lastName: 'Ali',
      email: 'leila.ali@edu.uca.ma',
      studentType: 'PHD',
      program: 'Doctorat Informatique',
      specialization: 'Traitement du Langage Naturel',
      supervisor: faculty2._id,
      coSupervisors: [faculty1._id],
      thesisTitle: 'Traitement du langage naturel pour l\'arabe',
      researchArea: 'NLP et Traitement du Langage',
      startDate: new Date('2022-10-01'),
      expectedEndDate: new Date('2025-10-01'),
      status: 'ACTIVE',
      bio: 'Doctorante spécialisée en traitement du langage naturel pour la langue arabe.',
      interests: ['NLP', 'Arabic NLP', 'Machine Learning']
    });

    const phd3 = await Student.create({
      firstName: 'Mohamed',
      lastName: 'Ben',
      email: 'mohamed.ben@edu.uca.ma',
      studentType: 'PHD',
      program: 'Doctorat Informatique',
      specialization: 'IoT',
      supervisor: faculty3._id,
      thesisTitle: 'IoT et systèmes intelligents',
      researchArea: 'Internet des Objets et Systèmes Intelligents',
      startDate: new Date('2023-10-01'),
      expectedEndDate: new Date('2026-10-01'),
      status: 'ACTIVE',
      bio: 'Doctorant spécialisé en IoT et systèmes intelligents.',
      interests: ['IoT', 'Smart Systems', 'Edge Computing']
    });

    const phd4 = await Student.create({
      firstName: 'Sara',
      lastName: 'Hassan',
      email: 'sara.hassan@edu.uca.ma',
      studentType: 'PHD',
      program: 'Doctorat Informatique',
      specialization: 'Vision par Ordinateur',
      supervisor: faculty2._id,
      thesisTitle: 'Vision par ordinateur pour l\'analyse d\'images médicales',
      researchArea: 'Computer Vision et Medical Imaging',
      startDate: new Date('2022-10-01'),
      expectedEndDate: new Date('2025-10-01'),
      status: 'ACTIVE',
      bio: 'Doctorante spécialisée en vision par ordinateur pour applications médicales.',
      interests: ['Computer Vision', 'Medical Imaging', 'Deep Learning']
    });

    // Create Master students
    const master1 = await Student.create({
      firstName: 'Adam',
      lastName: 'Kamal',
      email: 'adam.kamal@edu.uca.ma',
      studentType: 'MASTER',
      program: 'Master Informatique',
      specialization: 'Data Science',
      supervisor: faculty1._id,
      thesisTitle: 'Sécurité des systèmes IoT',
      researchArea: 'Cybersécurité et IoT',
      startDate: new Date('2023-10-01'),
      expectedEndDate: new Date('2024-10-01'),
      status: 'ACTIVE',
      bio: 'Étudiant master spécialisé en data science et big data.',
      interests: ['Data Science', 'Big Data', 'Machine Learning']
    });

    const master2 = await Student.create({
      firstName: 'Nadia',
      lastName: 'Mahmoud',
      email: 'nadia.mahmoud@edu.uca.ma',
      studentType: 'MASTER',
      program: 'Master Informatique',
      specialization: 'Cybersécurité',
      supervisor: faculty3._id,
      thesisTitle: 'Sécurité informatique et cryptographie',
      researchArea: 'Cybersécurité et Cryptographie',
      startDate: new Date('2023-10-01'),
      expectedEndDate: new Date('2024-10-01'),
      status: 'ACTIVE',
      bio: 'Étudiante master spécialisée en cybersécurité.',
      interests: ['Cybersécurité', 'Cryptographie', 'Network Security']
    });

    const master3 = await Student.create({
      firstName: 'Omar',
      lastName: 'Amir',
      email: 'omar.amir@edu.uca.ma',
      studentType: 'MASTER',
      program: 'Master Informatique',
      specialization: 'Intelligence Artificielle',
      supervisor: faculty1._id,
      researchArea: 'Intelligence Artificielle',
      startDate: new Date('2023-10-01'),
      expectedEndDate: new Date('2024-10-01'),
      status: 'ACTIVE',
      bio: 'Étudiant master spécialisé en intelligence artificielle.',
      interests: ['AI', 'Machine Learning', 'Neural Networks']
    });

    const master4 = await Student.create({
      firstName: 'Fatima',
      lastName: 'Rachid',
      email: 'fatima.rachid@edu.uca.ma',
      studentType: 'MASTER',
      program: 'Master Informatique',
      specialization: 'Multimédia',
      supervisor: faculty2._id,
      researchArea: 'Multimédia et Web',
      startDate: new Date('2023-10-01'),
      expectedEndDate: new Date('2024-10-01'),
      status: 'ACTIVE',
      bio: 'Étudiante master spécialisée en multimédia et applications web.',
      interests: ['Multimedia', 'Web Development', 'UI/UX']
    });

    // Create publications
    const pub1 = await Publication.create({
      title: 'Deep Learning Approaches for Medical Image Analysis: A Comprehensive Survey',
      abstract: 'This paper presents a comprehensive survey of deep learning approaches for medical image analysis...',
      type: 'JOURNAL_ARTICLE',
      authors: [faculty1._id, faculty2._id, faculty3._id],
      journal: 'IEEE Transactions on Medical Imaging',
      volume: '43',
      issue: '2',
      pages: '456-478',
      doi: '10.1109/TMI.2023.1234567',
      publishedAt: new Date('2024-01-15'),
      researchArea: 'Medical Image Analysis',
      tags: ['Deep Learning', 'Medical Imaging', 'Survey'],
      citations: 15
    });

    const pub2 = await Publication.create({
      title: 'Real-time Object Detection in Smart Cities using IoT and Edge Computing',
      abstract: 'This paper proposes a novel approach for real-time object detection in smart cities...',
      type: 'JOURNAL_ARTICLE',
      authors: [faculty3._id, faculty1._id, phd1._id],
      journal: 'Journal of Network and Computer Applications',
      volume: '205',
      pages: '103456',
      doi: '10.1016/j.jnca.2023.103456',
      publishedAt: new Date('2023-11-20'),
      researchArea: 'Smart Cities',
      tags: ['IoT', 'Edge Computing', 'Object Detection'],
      citations: 8
    });

    const pub3 = await Publication.create({
      title: 'Natural Language Processing for Arabic Sentiment Analysis: Challenges and Solutions',
      abstract: 'This paper explores the challenges and solutions for Arabic sentiment analysis...',
      type: 'CONFERENCE_PAPER',
      authors: [faculty2._id, phd2._id, phd4._id],
      conference: 'International Conference on Arabic Language Processing',
      pages: '123-135',
      publishedAt: new Date('2023-09-10'),
      researchArea: 'Arabic NLP',
      tags: ['NLP', 'Arabic', 'Sentiment Analysis'],
      citations: 12
    });

    const pub4 = await Publication.create({
      title: 'Mathematical Modeling of Epidemic Spread using Machine Learning Techniques',
      abstract: 'This study presents a mathematical model for epidemic spread prediction using machine learning...',
      type: 'JOURNAL_ARTICLE',
      authors: [faculty1._id, faculty3._id, phd3._id],
      journal: 'Mathematical Biosciences and Engineering',
      volume: '19',
      issue: '8',
      pages: '8234-8256',
      doi: '10.3934/mbe.2022378',
      publishedAt: new Date('2022-07-15'),
      researchArea: 'Epidemic Modeling',
      tags: ['Mathematical Modeling', 'Machine Learning', 'Epidemiology'],
      citations: 25
    });

    // Create events
    const event1 = await Event.create({
      title: 'Séminaire: Les dernières avancées en Deep Learning',
      description: 'Présentation des dernières avancées en deep learning et leurs applications dans divers domaines.',
      type: 'SEMINAR',
      startDate: new Date('2024-12-15T14:00:00'),
      endDate: new Date('2024-12-15T16:00:00'),
      location: 'Amphithéâtre A, ESTE Essaouira',
      organizer: faculty1._id,
      speakers: [faculty1._id, faculty2._id],
      maxAttendees: 100,
      isPublic: true,
      status: 'UPCOMING',
      registrationRequired: true,
      registrationDeadline: new Date('2024-12-10T23:59:59'),
      tags: ['Deep Learning', 'IA', 'Séminaire']
    });

    const event2 = await Event.create({
      title: 'Workshop: Introduction à la Vision par Ordinateur avec OpenCV',
      description: 'Atelier pratique sur l\'utilisation d\'OpenCV pour la vision par ordinateur.',
      type: 'WORKSHOP',
      startDate: new Date('2024-11-20T09:00:00'),
      endDate: new Date('2024-11-20T17:00:00'),
      location: 'Laboratoire Informatique, ESTE Essaouira',
      organizer: faculty2._id,
      speakers: [faculty2._id, phd4._id],
      maxAttendees: 30,
      isPublic: true,
      status: 'UPCOMING',
      registrationRequired: true,
      registrationDeadline: new Date('2024-11-15T23:59:59'),
      tags: ['Computer Vision', 'OpenCV', 'Workshop']
    });

    const event3 = await Event.create({
      title: 'Soutenance de thèse: Deep Learning pour l\'analyse d\'images médicales',
      description: 'Soutenance publique de thèse de doctorat de Youssef Said.',
      type: 'DEFENSE',
      startDate: new Date('2024-10-25T10:00:00'),
      endDate: new Date('2024-10-25T12:00:00'),
      location: 'Salle des thèses, ESTE Essaouira',
      organizer: faculty1._id,
      speakers: [phd1._id],
      maxAttendees: 50,
      isPublic: true,
      status: 'UPCOMING',
      registrationRequired: false,
      tags: ['Thèse', 'Deep Learning', 'Medical Imaging']
    });

    const event4 = await Event.create({
      title: 'Conférence: L\'avenir de l\'IoT dans les villes intelligentes',
      description: 'Conférence sur les perspectives futures de l\'IoT dans le développement des villes intelligentes.',
      type: 'CONFERENCE',
      startDate: new Date('2024-09-10T15:00:00'),
      endDate: new Date('2024-09-10T17:00:00'),
      location: 'Amphithéâtre B, ESTE Essaouira',
      organizer: faculty3._id,
      speakers: [faculty3._id, phd3._id],
      maxAttendees: 150,
      isPublic: true,
      status: 'UPCOMING',
      registrationRequired: true,
      registrationDeadline: new Date('2024-09-05T23:59:59'),
      tags: ['IoT', 'Smart Cities', 'Conférence']
    });

    const event5 = await Event.create({
      title: 'Journée Portes Ouvertes du Laboratoire MIMSC',
      description: 'Présentation des activités de recherche et projets du laboratoire MIMSC.',
      type: 'SOCIAL',
      startDate: new Date('2024-08-20T10:00:00'),
      endDate: new Date('2024-08-20T18:00:00'),
      location: 'Laboratoire MIMSC, ESTE Essaouira',
      organizer: faculty1._id,
      speakers: [faculty1._id, faculty2._id, faculty3._id],
      maxAttendees: 200,
      isPublic: true,
      status: 'UPCOMING',
      registrationRequired: false,
      tags: ['Open Day', 'MIMSC', 'Recherche']
    });

    return NextResponse.json({
      success: true,
      message: 'Sample data created successfully',
      data: {
        users: await User.countDocuments(),
        students: await Student.countDocuments(),
        publications: await Publication.countDocuments(),
        events: await Event.countDocuments()
      }
    });
  } catch (error) {
    console.error('Error creating sample data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sample data' },
      { status: 500 }
    );
  }
}
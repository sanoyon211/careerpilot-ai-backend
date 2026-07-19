import { User } from '../modules/user/user.model';
import { Job } from '../modules/job/job.model';
import bcrypt from 'bcrypt';

export const seedDemoUsers = async () => {
  try {
    const demoSeekerEmail = 'seeker@careerpilot.com';
    const demoEmployerEmail = 'employer@careerpilot.com';
    const defaultPassword = 'Password123!';

    // 1. Ensure clean single-hashed password for Demo Job Seeker
    const existingSeeker = await User.findOne({ email: demoSeekerEmail }).select('+password');
    let seekerUser = existingSeeker;

    if (existingSeeker) {
      const isMatch = await bcrypt.compare(defaultPassword, existingSeeker.password || '');
      if (!isMatch) {
        await User.deleteOne({ _id: existingSeeker._id });
        seekerUser = null;
      }
    }

    if (!seekerUser) {
      seekerUser = await User.create({
        name: 'Demo Job Seeker',
        email: demoSeekerEmail,
        password: defaultPassword, // pre('save') hook will hash this once
        role: 'job-seeker',
        headline: 'Senior Full Stack Developer',
        bio: 'Passionate about building AI-driven web applications and scaling modern user experiences.',
      });
      console.log('✅ Demo Job Seeker seeded: seeker@careerpilot.com');
    }

    // 2. Ensure clean single-hashed password for Demo Employer
    const existingEmployer = await User.findOne({ email: demoEmployerEmail }).select('+password');
    let employerUser = existingEmployer;

    if (existingEmployer) {
      const isMatch = await bcrypt.compare(defaultPassword, existingEmployer.password || '');
      if (!isMatch) {
        await User.deleteOne({ _id: existingEmployer._id });
        employerUser = null;
      }
    }

    if (!employerUser) {
      employerUser = await User.create({
        name: 'Demo Employer (TechCorp)',
        email: demoEmployerEmail,
        password: defaultPassword, // pre('save') hook will hash this once
        role: 'employer',
        headline: 'Lead Talent Acquisition at TechCorp',
        bio: 'Hiring world-class engineering talent for high-impact AI projects.',
      });
      console.log('✅ Demo Employer seeded: employer@careerpilot.com');
    }

    // 3. Soft-delete any legacy jobs not belonging to Demo Employer
    const cleanupResult = await Job.updateMany(
      { employerId: { $ne: employerUser._id } },
      { $set: { isDeleted: true } }
    );
    if (cleanupResult.modifiedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanupResult.modifiedCount} legacy non-employer jobs.`);
    }

    // 4. Seed 10 Realistic Jobs for Demo Employer if needed
    const existingJobsCount = await Job.countDocuments({ employerId: employerUser._id, isDeleted: false });

    if (existingJobsCount < 10) {
      const sampleJobs = [
        {
          title: 'Senior Full Stack Developer (React & Node.js)',
          category: 'Software Engineering',
          shortDescription: 'Build scalable AI-integrated web applications using React, Next.js, and Node.js.',
          fullDescription: 'We are seeking a Senior Full Stack Engineer to lead front-end architecture and backend REST/GraphQL microservices. You will work closely with AI engineering teams to deploy Llama 3.3 and DeepSeek R1 models in production.',
          location: 'Remote',
          workMode: 'Remote' as const,
          jobType: 'Full-time' as const,
          salaryRange: '$120,000 - $145,000 / year',
          status: 'Active' as const,
          employerId: employerUser._id,
        },
        {
          title: 'AI & Machine Learning Engineer (Python & Groq)',
          category: 'Artificial Intelligence',
          shortDescription: 'Design and fine-tune LLM pipelines, prompt architectures, and vector search embeddings.',
          fullDescription: 'Join TechCorp as an AI Infrastructure Engineer. Responsible for orchestrating high-throughput LLM inferences with Groq Cloud, vector databases (Pinecone/Weaviate), and automated evaluation frameworks.',
          location: 'San Francisco, CA',
          workMode: 'Hybrid' as const,
          jobType: 'Full-time' as const,
          salaryRange: '$140,000 - $175,000 / year',
          status: 'Active' as const,
          employerId: employerUser._id,
        },
        {
          title: 'Frontend Next.js & UI/UX Specialist',
          category: 'Frontend Development',
          shortDescription: 'Craft beautiful, high-performance web applications using Next.js 15 and Tailwind CSS.',
          fullDescription: 'TechCorp is looking for a UI Specialist to build responsive, accessible, and ultra-fast user interfaces. Experience with Framer Motion, RTK Query, and modern web design systems is required.',
          location: 'Remote',
          workMode: 'Remote' as const,
          jobType: 'Full-time' as const,
          salaryRange: '$105,000 - $130,000 / year',
          status: 'Active' as const,
          employerId: employerUser._id,
        },
        {
          title: 'Backend Cloud Architect (AWS & Microservices)',
          category: 'Backend Development',
          shortDescription: 'Architect resilient cloud microservices on AWS, Docker, Kubernetes, and MongoDB.',
          fullDescription: 'We are hiring a Cloud Architect to optimize backend response latency, scale database queries, and implement zero-downtime CI/CD deployment pipelines.',
          location: 'Remote',
          workMode: 'Remote' as const,
          jobType: 'Contract' as const,
          salaryRange: '$85 - $115 / hr',
          status: 'Active' as const,
          employerId: employerUser._id,
        },
        {
          title: 'DevOps & Site Reliability Engineer',
          category: 'DevOps',
          shortDescription: 'Manage infrastructure monitoring, Kubernetes clusters, and automated release cycles.',
          fullDescription: 'Maintain 99.99% uptime for TechCorp cloud services. Build infrastructure as code using Terraform, manage Prometheus/Grafana telemetry, and secure production environments.',
          location: 'Austin, TX',
          workMode: 'On-site' as const,
          jobType: 'Full-time' as const,
          salaryRange: '$115,000 - $140,000 / year',
          status: 'Active' as const,
          employerId: employerUser._id,
        },
        {
          title: 'Lead UI/UX Product Designer',
          category: 'Design',
          shortDescription: 'Define user flows, visual design languages, and interactive prototypes for SaaS tools.',
          fullDescription: 'Lead product design initiatives across mobile and web platforms. Conduct user testing, design high-fidelity Figma components, and collaborate directly with engineering leads.',
          location: 'Remote',
          workMode: 'Remote' as const,
          jobType: 'Full-time' as const,
          salaryRange: '$95,000 - $120,000 / year',
          status: 'Active' as const,
          employerId: employerUser._id,
        },
        {
          title: 'Mobile App Engineer (React Native)',
          category: 'Mobile Development',
          shortDescription: 'Develop cross-platform iOS and Android mobile apps with native module integrations.',
          fullDescription: 'Build intuitive mobile experiences using React Native, Expo, and push notifications. Optimize app startup performance and offline-first data sync.',
          location: 'New York, NY',
          workMode: 'Hybrid' as const,
          jobType: 'Full-time' as const,
          salaryRange: '$110,000 - $135,000 / year',
          status: 'Active' as const,
          employerId: employerUser._id,
        },
        {
          title: 'Cybersecurity & Application Security Lead',
          category: 'Security',
          shortDescription: 'Perform penetration testing, OWASP vulnerability assessments, and SOC2 compliance.',
          fullDescription: 'Protect TechCorp applications and user data against cyber threats. Implement OAuth2/JWT security standards, automated code scanning, and incident response protocols.',
          location: 'Washington, DC',
          workMode: 'On-site' as const,
          jobType: 'Full-time' as const,
          salaryRange: '$130,000 - $160,000 / year',
          status: 'Active' as const,
          employerId: employerUser._id,
        },
        {
          title: 'Junior Web Developer (React / TypeScript)',
          category: 'Software Engineering',
          shortDescription: 'Kickstart your tech career by building features under senior developer mentorship.',
          fullDescription: 'Great entry opportunity for ambitious web developers! Work on real customer-facing features, learn modern state management with Redux, and participate in peer code reviews.',
          location: 'Remote',
          workMode: 'Remote' as const,
          jobType: 'Internship' as const,
          salaryRange: '$35 - $45 / hr',
          status: 'Active' as const,
          employerId: employerUser._id,
        },
        {
          title: 'Agile Technical Project Manager',
          category: 'Project Management',
          shortDescription: 'Drive engineering sprint cycles, backlog prioritization, and cross-team alignment.',
          fullDescription: 'Facilitate Scrum ceremonies, sprint planning, and roadmap delivery for 3 core product teams. Bridge communication between executive stakeholders and developers.',
          location: 'Chicago, IL',
          workMode: 'Hybrid' as const,
          jobType: 'Full-time' as const,
          salaryRange: '$105,000 - $125,000 / year',
          status: 'Active' as const,
          employerId: employerUser._id,
        },
      ];

      for (const jobItem of sampleJobs) {
        await Job.create(jobItem);
      }
      console.log('✅ Seeded 10 realistic jobs for Demo Employer (TechCorp)');
    }
  } catch (error) {
    console.error('⚠️ Demo user seeding warning:', error);
  }
};

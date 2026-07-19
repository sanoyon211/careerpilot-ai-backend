import { User } from '../modules/user/user.model';
import bcrypt from 'bcrypt';

export const seedDemoUsers = async () => {
  try {
    const demoSeekerEmail = 'seeker@careerpilot.com';
    const demoEmployerEmail = 'employer@careerpilot.com';
    const defaultPassword = 'Password123!';

    // 1. Ensure clean single-hashed password for Demo Job Seeker
    const existingSeeker = await User.findOne({ email: demoSeekerEmail }).select('+password');
    let needsSeekerRecreate = !existingSeeker;
    if (existingSeeker) {
      const isMatch = await bcrypt.compare(defaultPassword, existingSeeker.password || '');
      if (!isMatch) {
        await User.deleteOne({ _id: existingSeeker._id });
        needsSeekerRecreate = true;
      }
    }

    if (needsSeekerRecreate) {
      await User.create({
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
    let needsEmployerRecreate = !existingEmployer;
    if (existingEmployer) {
      const isMatch = await bcrypt.compare(defaultPassword, existingEmployer.password || '');
      if (!isMatch) {
        await User.deleteOne({ _id: existingEmployer._id });
        needsEmployerRecreate = true;
      }
    }

    if (needsEmployerRecreate) {
      await User.create({
        name: 'Demo Employer (TechCorp)',
        email: demoEmployerEmail,
        password: defaultPassword, // pre('save') hook will hash this once
        role: 'employer',
        headline: 'Lead Talent Acquisition at TechCorp',
        bio: 'Hiring world-class engineering talent for high-impact AI projects.',
      });
      console.log('✅ Demo Employer seeded: employer@careerpilot.com');
    }
  } catch (error) {
    console.error('⚠️ Demo user seeding warning:', error);
  }
};

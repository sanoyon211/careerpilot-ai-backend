export type TUserRole = 'job-seeker' | 'employer' | 'admin';

export type TUser = {
  name: string;
  email: string;
  password?: string;
  role: TUserRole;
  phone?: string;
  avatar?: string;
  location?: string;
  isDeleted: boolean;
};

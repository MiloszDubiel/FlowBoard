type User = {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
};

type AuthStore = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

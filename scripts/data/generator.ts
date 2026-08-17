/**
 * Deterministic-ish generator for realistic demo data. Not cryptographically random —
 * just enough variety to make search, path-finding, and recommendation queries produce
 * interesting, believable results.
 */

export interface SeedSkill {
  id: string;
  name: string;
  category: string;
}

export interface SeedProject {
  id: string;
  name: string;
  description: string;
  category: string;
  year: number;
  requiredSkills: string[]; // skill ids
}

export interface SeedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  experience: number;
  skills: string[]; // skill ids
  projects: string[]; // project ids
}

export interface SeedRelationships {
  follows: Array<{ from: string; to: string }>;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function pickRandom<T>(items: T[], count: number, rng: () => number): T[] {
  const pool = [...items];
  const picked: T[] = [];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const index = Math.floor(rng() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

function randomInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Small seeded PRNG (mulberry32) so a given run is reproducible if a seed is passed. */
function createRng(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SKILL_DEFS: Array<{ name: string; category: string }> = [
  { name: 'JavaScript', category: 'Language' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Python', category: 'Language' },
  { name: 'Java', category: 'Language' },
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Vue', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'Spring Boot', category: 'Backend' },
  { name: 'GraphQL', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MySQL', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'AWS', category: 'DevOps' },
  { name: 'Kafka', category: 'Data' },
  { name: 'Git', category: 'Tooling' },
  { name: 'System Design', category: 'Concept' },
  { name: 'REST APIs', category: 'Concept' },
  { name: 'Microservices', category: 'Concept' },
];

interface ProjectSeedDef {
  name: string;
  description: string;
  category: string;
  skills: string[]; // skill names, must exist in SKILL_DEFS
}

export const PROJECT_DEFS: ProjectSeedDef[] = [
  { name: 'E-Commerce Platform', description: 'A multi-vendor online store with cart, checkout, and order tracking.', category: 'Web App', skills: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs'] },
  { name: 'Real-Time Chat Application', description: 'A messaging app with live typing indicators and read receipts.', category: 'Web App', skills: ['React', 'Node.js', 'Redis', 'System Design'] },
  { name: 'Expense Tracker', description: 'A personal finance tool for logging expenses and visualizing spending trends.', category: 'Tool', skills: ['React', 'TypeScript', 'PostgreSQL'] },
  { name: 'Learning Management System', description: 'A platform for hosting courses, quizzes, and student progress tracking.', category: 'Platform', skills: ['Next.js', 'Node.js', 'PostgreSQL', 'REST APIs'] },
  { name: 'Food Delivery Platform', description: 'An on-demand food ordering app with live order tracking.', category: 'Mobile App', skills: ['React', 'Node.js', 'MongoDB', 'AWS'] },
  { name: 'Developer Portfolio', description: 'A personal portfolio site showcasing projects and blog posts.', category: 'Web App', skills: ['Next.js', 'Tailwind CSS', 'TypeScript'] },
  { name: 'Job Recommendation Engine', description: 'A system that matches candidates to jobs using skill overlap scoring.', category: 'Platform', skills: ['Python', 'PostgreSQL', 'System Design'] },
  { name: 'Inventory Management System', description: 'A warehouse tool for tracking stock levels and reorder points.', category: 'Enterprise', skills: ['Java', 'Spring Boot', 'MySQL'] },
  { name: 'BookBazaar', description: 'An online marketplace for buying and selling new and used books.', category: 'Web App', skills: ['React', 'Node.js', 'Express', 'MongoDB'] },
  { name: 'Social Media Analytics Dashboard', description: 'A dashboard visualizing engagement metrics across social platforms.', category: 'Platform', skills: ['React', 'GraphQL', 'PostgreSQL'] },
  { name: 'Video Streaming Platform', description: 'A platform for uploading and streaming video content at scale.', category: 'Platform', skills: ['Node.js', 'AWS', 'Kafka', 'System Design'] },
  { name: 'Fitness Tracking App', description: 'A workout logger with progress charts and goal tracking.', category: 'Mobile App', skills: ['React', 'TypeScript', 'MongoDB'] },
  { name: 'Recipe Sharing Community', description: 'A social platform where users share and rate recipes.', category: 'Web App', skills: ['Vue', 'Node.js', 'MongoDB'] },
  { name: 'Real Estate Listing Portal', description: 'A property listing site with search filters and map integration.', category: 'Web App', skills: ['Next.js', 'PostgreSQL', 'REST APIs'] },
  { name: 'Online Code Editor', description: 'A browser-based code editor with live execution sandboxes.', category: 'Tool', skills: ['TypeScript', 'Docker', 'Node.js'] },
  { name: 'Task Management Tool', description: 'A Kanban-style project management tool for small teams.', category: 'Web App', skills: ['React', 'Node.js', 'PostgreSQL'] },
  { name: 'Weather Forecast App', description: 'A weather app with hourly forecasts and severe-weather alerts.', category: 'Mobile App', skills: ['React', 'REST APIs'] },
  { name: 'URL Shortener Service', description: 'A high-throughput service for shortening and redirecting URLs.', category: 'Tool', skills: ['Node.js', 'Redis', 'System Design'] },
  { name: 'Blogging Platform', description: 'A publishing platform with markdown editing and comments.', category: 'Web App', skills: ['Next.js', 'MongoDB', 'Tailwind CSS'] },
  { name: 'Event Booking System', description: 'A platform for discovering and booking tickets to local events.', category: 'Web App', skills: ['React', 'Express', 'MySQL'] },
  { name: 'Ride Sharing App', description: 'A ride-hailing app with live driver tracking and fare estimation.', category: 'Mobile App', skills: ['React', 'Node.js', 'Kafka', 'System Design'] },
  { name: 'Cryptocurrency Portfolio Tracker', description: 'A dashboard for tracking crypto holdings and price alerts.', category: 'Web App', skills: ['React', 'GraphQL', 'Redis'] },
  { name: 'Hospital Management System', description: 'An enterprise system for managing patient records and appointments.', category: 'Enterprise', skills: ['Java', 'Spring Boot', 'MySQL', 'System Design'] },
  { name: 'Library Management System', description: 'A catalog and lending system for a public library network.', category: 'Enterprise', skills: ['Java', 'Spring Boot', 'PostgreSQL'] },
  { name: 'Freelance Marketplace', description: 'A marketplace connecting freelancers with short-term projects.', category: 'Platform', skills: ['Next.js', 'Node.js', 'PostgreSQL', 'REST APIs'] },
  { name: 'Online Quiz Platform', description: 'A quiz-building tool with leaderboards and timed challenges.', category: 'Web App', skills: ['Vue', 'Express', 'MongoDB'] },
  { name: 'Music Streaming App', description: 'A music player with playlists, offline caching, and recommendations.', category: 'Mobile App', skills: ['React', 'Node.js', 'AWS', 'Redis'] },
  { name: 'Travel Booking Platform', description: 'A platform for booking flights, hotels, and itineraries.', category: 'Platform', skills: ['Next.js', 'PostgreSQL', 'Microservices'] },
  { name: 'Parking Management System', description: 'An IoT-integrated system for tracking parking space availability.', category: 'Enterprise', skills: ['Java', 'Kafka', 'MySQL'] },
  { name: 'Customer Support Chatbot', description: 'An AI-assisted chatbot for handling tier-1 support tickets.', category: 'Tool', skills: ['Python', 'Node.js', 'GraphQL'] },
];

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Krishna', 'Ishaan', 'Rohan',
  'Ananya', 'Diya', 'Priya', 'Isha', 'Kavya', 'Riya', 'Meera', 'Sneha', 'Neha', 'Pooja',
  'Anurag', 'Rahul', 'Amit', 'Vikram', 'Karthik', 'Suresh', 'Manoj', 'Deepak', 'Nikhil', 'Siddharth',
  'James', 'Michael', 'David', 'Daniel', 'Matthew', 'Ryan', 'Ethan', 'Noah', 'Lucas', 'Benjamin',
  'Emma', 'Olivia', 'Sophia', 'Ava', 'Mia', 'Grace', 'Chloe', 'Zoe', 'Lily', 'Ella',
  'Wei', 'Jun', 'Hiro', 'Yuki', 'Min-jun', 'Ji-woo', 'Haruto', 'Sora', 'Kenji', 'Aiko',
  'Carlos', 'Diego', 'Mateo', 'Sofia', 'Valentina', 'Camila', 'Lucia', 'Mariana', 'Gabriel', 'Rafael',
  'Liam', 'Oliver', 'Jack', 'Harry', 'George', 'Charlie', 'Freddie', 'Alfie', 'Oscar', 'Leo',
  'Fatima', 'Amara', 'Zara', 'Layla', 'Amir', 'Omar', 'Hassan', 'Yusuf', 'Sara', 'Nadia',
  'Ingrid', 'Freya', 'Astrid', 'Lars', 'Erik', 'Sven', 'Anya', 'Katarina', 'Milan', 'Nikola',
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Menon',
  'Smith', 'Johnson', 'Brown', 'Williams', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor',
  'Chen', 'Wang', 'Li', 'Zhang', 'Kim', 'Park', 'Tanaka', 'Suzuki', 'Watanabe', 'Yamamoto',
  'Garcia', 'Martinez', 'Rodriguez', 'Lopez', 'Gonzalez', 'Hernandez', 'Torres', 'Flores', 'Ramirez', 'Cruz',
  'Khan', 'Ahmed', 'Ali', 'Hussain', 'Malik', 'Andersen', 'Nilsson', 'Larsen', 'Novak', 'Horvat',
];

const LOCATIONS = [
  'Bengaluru, India', 'Jaipur, India', 'Pune, India', 'Hyderabad, India', 'Delhi, India', 'Mumbai, India',
  'San Francisco, USA', 'Seattle, USA', 'Austin, USA', 'New York, USA',
  'London, UK', 'Manchester, UK', 'Berlin, Germany', 'Amsterdam, Netherlands',
  'Toronto, Canada', 'Vancouver, Canada', 'Singapore', 'Tokyo, Japan', 'Seoul, South Korea',
  'Sydney, Australia', 'Melbourne, Australia', 'Dublin, Ireland', 'Lisbon, Portugal', 'São Paulo, Brazil',
];

const BIO_TEMPLATES = [
  (skill: string) => `Builds practical, production-ready software with ${skill} and a focus on clean architecture.`,
  (skill: string) => `Passionate about ${skill} and mentoring engineers on best practices.`,
  (skill: string) => `Specializes in ${skill}, with a track record of shipping fast without breaking things.`,
  (skill: string) => `Enjoys solving hard problems with ${skill} and writing about what I learn along the way.`,
  (skill: string) => `Full-stack engineer who leans on ${skill} for most day-to-day work.`,
];

export interface GeneratedSeed {
  skills: SeedSkill[];
  projects: SeedProject[];
  users: SeedUser[];
  relationships: SeedRelationships;
}

export function generateSeedData(seed = 42): GeneratedSeed {
  const rng = createRng(seed);

  const skills: SeedSkill[] = SKILL_DEFS.map(s => ({ id: slugify(s.name), name: s.name, category: s.category }));
  const skillByName = new Map(skills.map(s => [s.name, s]));

  const projects: SeedProject[] = PROJECT_DEFS.map((p, i) => ({
    id: slugify(p.name),
    name: p.name,
    description: p.description,
    category: p.category,
    year: 2018 + (i % 8),
    requiredSkills: p.skills.map(name => skillByName.get(name)!.id),
  }));

  // Build 100 unique (first, last) name combinations.
  const nameCombos: Array<{ first: string; last: string }> = [];
  outer: for (const last of LAST_NAMES) {
    for (const first of FIRST_NAMES) {
      nameCombos.push({ first, last });
      if (nameCombos.length >= 260) break outer;
    }
  }
  const shuffledCombos = pickRandom(nameCombos, 100, rng);

  // Guarantee the example developer from the project brief exists in the dataset.
  const anuragIndex = shuffledCombos.findIndex(c => c.first === 'Anurag' && c.last === 'Kumar');
  if (anuragIndex === -1) {
    shuffledCombos[0] = { first: 'Anurag', last: 'Kumar' };
  } else if (anuragIndex !== 0) {
    [shuffledCombos[0], shuffledCombos[anuragIndex]] = [shuffledCombos[anuragIndex], shuffledCombos[0]];
  }

  const usernameCounts = new Map<string, number>();
  const users: SeedUser[] = shuffledCombos.map((combo, index) => {
    const isAnurag = index === 0;
    const name = `${combo.first} ${combo.last}`;
    const baseUsername = slugify(`${combo.first}${combo.last}`).replace(/-/g, '');
    const count = usernameCounts.get(baseUsername) ?? 0;
    usernameCounts.set(baseUsername, count + 1);
    const username = count === 0 ? baseUsername : `${baseUsername}${count}`;
    const id = `user-${username}`;

    const experience = isAnurag ? 2 : randomInt(0, 15, rng);
    const skillCount = isAnurag ? 8 : randomInt(3, 7, rng);
    const userSkills = isAnurag
      ? ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'MongoDB']
          .map(n => skillByName.get(n)!.id)
      : pickRandom(skills, skillCount, rng).map(s => s.id);

    const topSkillName = skills.find(s => s.id === userSkills[0])?.name ?? 'software engineering';
    const bio = isAnurag
      ? 'MERN stack developer who enjoys building clean, scalable full-stack products end to end.'
      : BIO_TEMPLATES[randomInt(0, BIO_TEMPLATES.length - 1, rng)](topSkillName);

    // Prefer projects whose required skills overlap this user's skills, so the graph
    // has meaningful structure for recommendations and related-skill queries.
    const overlapping = projects.filter(p => p.requiredSkills.some(s => userSkills.includes(s)));
    const projectPool = overlapping.length > 0 ? overlapping : projects;
    const projectCount = isAnurag ? 2 : randomInt(1, 3, rng);
    const userProjects = isAnurag
      ? [projects.find(p => p.name === 'BookBazaar')!.id, projects.find(p => p.name === 'Developer Portfolio')!.id]
      : pickRandom(projectPool, projectCount, rng).map(p => p.id);

    return {
      id,
      name,
      username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
      bio,
      location: LOCATIONS[randomInt(0, LOCATIONS.length - 1, rng)],
      experience,
      skills: userSkills,
      projects: userProjects,
    };
  });

  const follows: Array<{ from: string; to: string }> = [];
  const followSet = new Set<string>();
  for (const user of users) {
    const followCount = randomInt(2, 5, rng);
    const candidates = pickRandom(
      users.filter(u => u.id !== user.id),
      followCount,
      rng
    );
    for (const candidate of candidates) {
      const key = `${user.id}->${candidate.id}`;
      if (!followSet.has(key)) {
        followSet.add(key);
        follows.push({ from: user.id, to: candidate.id });
      }
    }
  }

  return { skills, projects, users, relationships: { follows } };
}

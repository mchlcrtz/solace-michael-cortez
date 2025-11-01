import { Advocate } from "@/types";

const specialties = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

const firstNames = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
  "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
  "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
  "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
  "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Dorothy", "George", "Melissa", "Edward", "Deborah",
  "Ronald", "Stephanie", "Timothy", "Rebecca", "Jason", "Sharon", "Jeffrey", "Laura", "Ryan", "Cynthia",
  "Jacob", "Kathleen", "Gary", "Amy", "Nicholas", "Angela", "Eric", "Shirley", "Jonathan", "Anna",
  "Stephen", "Brenda", "Larry", "Pamela", "Justin", "Emma", "Scott", "Nicole", "Brandon", "Helen",
  "Benjamin", "Samantha", "Samuel", "Katherine", "Gregory", "Christine", "Frank", "Debra", "Raymond", "Rachel",
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
  "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez",
  "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart",
  "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson",
  "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson",
  "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes", "Price",
  "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez", "Powell",
];

const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego",
  "Dallas", "San Jose", "Austin", "Jacksonville", "San Francisco", "Columbus", "Fort Worth", "Charlotte",
  "Indianapolis", "Seattle", "Washington", "Boston", "El Paso", "Nashville", "Detroit", "Denver",
  "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque",
  "Tucson", "Fresno", "Sacramento", "Mesa", "Atlanta", "Kansas City", "Colorado Springs", "Raleigh",
  "Omaha", "Miami", "Long Beach", "Virginia Beach", "Oakland", "Minneapolis", "Tulsa", "Arlington",
  "Tampa", "New Orleans", "Wichita", "Cleveland", "Bakersfield", "Aurora", "Anaheim", "Honolulu",
  "Santa Ana", "Riverside", "Corpus Christi", "Lexington", "Stockton", "Henderson", "Saint Paul", "St. Louis",
  "Cincinnati", "St. Petersburg", "Pittsburgh", "Greensboro", "Lincoln", "Anchorage", "Plano", "Orlando",
  "Irvine", "Newark", "Durham", "Chula Vista", "Toledo", "Fort Wayne", "St. Louis", "Jersey City",
  "Laredo", "Madison", "Chandler", "Buffalo", "Lubbock", "Scottsdale", "Reno", "Glendale", "Gilbert",
  "Winston Salem", "North Las Vegas", "Chesapeake", "Norfolk", "Fremont", "Garland", "Irving", "Hialeah",
];

const degrees = ["MD", "PhD", "MSW"];

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomSpecialties = (min: number = 1, max: number = 4): string[] => {
  const numSpecialties = getRandomInt(min, max);
  const shuffled = [...specialties].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numSpecialties);
};

const generatePhoneNumber = (): number => {
  return getRandomInt(1000000000, 9999999999);
};

const generateAdvocate = (): Advocate => {
  return {
    firstName: getRandomElement(firstNames),
    lastName: getRandomElement(lastNames),
    city: getRandomElement(cities),
    degree: getRandomElement(degrees),
    specialties: getRandomSpecialties(1, 5),
    yearsOfExperience: getRandomInt(1, 35),
    phoneNumber: generatePhoneNumber(),
  };
};

const generateAdvocateData = (count: number = 1000): Advocate[] => {
  return Array.from({ length: count }, () => generateAdvocate());
};

const advocateData: Advocate[] = generateAdvocateData(1000);

export { advocateData, generateAdvocateData };

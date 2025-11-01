import { Advocate } from "@/types";

export function sortAdvocates(advocates: Advocate[], sortOption: string): Advocate[] {
  const sorted = [...advocates];
  
  switch (sortOption) {
    case "name-asc":
      return sorted.sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    case "name-desc":
      return sorted.sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameB.localeCompare(nameA);
      });
    case "experience-desc":
      return sorted.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
    case "experience-asc":
      return sorted.sort((a, b) => a.yearsOfExperience - b.yearsOfExperience);
    case "city-asc":
      return sorted.sort((a, b) => a.city.localeCompare(b.city));
    default:
      return sorted;
  }
}


"use client";

import styled from "styled-components";
import { useEffect, useState, useCallback, useRef } from "react";
import { Advocate } from "@/types";
import { AdvocateSearch } from "@/components/advocate-search";
import { AdvocateResults } from "@/components/advocate-results";

const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: hsl(var(--background));
  font-family: var(--font-sans);
  
  @media (min-width: 768px) {
    height: 100vh;
    min-height: auto;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 80rem;
  margin: 0 auto;
  width: 100%;
  
  @media (min-width: 768px) {
    height: 100%;
    flex: none;
    border-left: 1px solid hsl(var(--border));
    border-right: 1px solid hsl(var(--border));
    border-bottom: 1px solid hsl(var(--border));
  }
`;

const HeaderSection = styled.div`
  padding: 1rem;
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const TitleSection = styled.div`
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 1.875rem;
  line-height: 1.2;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
  font-family: var(--font-sans);
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  color: hsl(var(--muted-foreground));
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 400;
  font-family: var(--font-sans);
  
  @media (min-width: 768px) {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
`;

const StickySearchContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: hsl(var(--background));
  z-index: 10;
  padding-bottom: 1rem;
  
  @media (min-width: 768px) {
    padding-bottom: 0.5rem;
  }
`;

const ContentSection = styled.div`
  padding: 1rem;
  padding-bottom: 1rem;
  flex: 1;
  overflow-y: auto;
  border-top: 1px solid hsl(var(--border));
  min-height: 0;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem;
`;

const PaginationButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid hsl(var(--border));
  background-color: ${props => props.$active ? 'hsl(var(--primary))' : 'hsl(var(--background))'};
  color: ${props => props.$active ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))'};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? '0.5' : '1'};
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.$active ? 'hsl(var(--primary))' : 'hsl(var(--accent))'};
    opacity: 1;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.span`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  margin: 0 1rem;
`;

export default function Home() {
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearsFilter, setYearsFilter] = useState("all");
  const [titleFilter, setTitleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAdvocates = useCallback(async (search: string = "", years: string = "all", title: string = "all", page: number = 1) => {
    const startTime = Date.now();
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      const sanitizedSearch = search.trim().slice(0, 100);
      if (sanitizedSearch) {
        params.append("search", sanitizedSearch);
      }
      if (years && years !== "all") {
        params.append("years", years);
      }
      if (title && title !== "all") {
        params.append("title", title);
      }
      params.append("page", page.toString());
      params.append("limit", "25");
      
      const url = `/api/advocates?${params.toString()}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch advocates: ${response.status}`);
      }
      
      const jsonResponse = await response.json();
      const advocatesData = Array.isArray(jsonResponse.data) ? [...jsonResponse.data] : [];
      const pagination = jsonResponse.pagination || { page: 1, totalPages: 1, total: 0 };
      
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 500;
      
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
      return {
        advocates: advocatesData,
        pagination
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError("Failed to load advocates. Please try again.");
      }
      return { advocates: [], pagination: { page: 1, totalPages: 1, total: 0 } };
    } finally {
      setIsLoading(false);
    }
  }, []);

  function sortAdvocates(advocates: Advocate[], sortOption: string): Advocate[] {
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

  useEffect(() => {
    fetchAdvocates(searchTerm, yearsFilter, titleFilter, currentPage).then((result) => {
      const sorted = sortAdvocates(result.advocates || [], sortBy);
      setFilteredAdvocates(sorted);
      setTotalPages(result.pagination.totalPages);
      setTotalResults(result.pagination.total);
    });
  }, [fetchAdvocates, searchTerm, yearsFilter, titleFilter, currentPage, sortBy]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchAdvocates(newSearchTerm, yearsFilter, titleFilter, 1).then((result) => {
        const sorted = sortAdvocates(result.advocates || [], sortBy);
        setFilteredAdvocates(sorted);
        setTotalPages(result.pagination.totalPages);
        setTotalResults(result.pagination.total);
      });
    }, 800);
  };

  const onYearsFilterChange = (value: string) => {
    setYearsFilter(value);
    setCurrentPage(1);
    fetchAdvocates(searchTerm, value, titleFilter, 1).then((result) => {
      const sorted = sortAdvocates(result.advocates || [], sortBy);
      setFilteredAdvocates(sorted);
      setTotalPages(result.pagination.totalPages);
      setTotalResults(result.pagination.total);
    });
  };

  const onTitleFilterChange = (value: string) => {
    setTitleFilter(value);
    setCurrentPage(1);
    fetchAdvocates(searchTerm, yearsFilter, value, 1).then((result) => {
      const sorted = sortAdvocates(result.advocates || [], sortBy);
      setFilteredAdvocates(sorted);
      setTotalPages(result.pagination.totalPages);
      setTotalResults(result.pagination.total);
    });
  };

  const onSortByChange = (value: string) => {
    setSortBy(value);
    const sorted = sortAdvocates(filteredAdvocates, value);
    setFilteredAdvocates(sorted);
  };

  const onReset = () => {
    setSearchTerm("");
    setYearsFilter("all");
    setTitleFilter("all");
    setSortBy("name-asc");
    setCurrentPage(1);
    fetchAdvocates("", "all", "all", 1).then((result) => {
      const sorted = sortAdvocates(result.advocates || [], "name-asc");
      setFilteredAdvocates(sorted);
      setTotalPages(result.pagination.totalPages);
      setTotalResults(result.pagination.total);
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Main>
      <Container>
        <HeaderSection>
          <TitleSection>
            <Title>
              Solace Advocates
            </Title>
            <Description>
              Find an advocate who will help untangle your healthcare—covered by Medicare.
            </Description>
          </TitleSection>
          <StickySearchContainer>
            <AdvocateSearch
              searchTerm={searchTerm}
              isLoading={isLoading}
              yearsFilter={yearsFilter}
              titleFilter={titleFilter}
              sortBy={sortBy}
              resultCount={totalResults}
              onChange={onChange}
              onYearsFilterChange={onYearsFilterChange}
              onTitleFilterChange={onTitleFilterChange}
              onSortByChange={onSortByChange}
              onReset={onReset}
            />
          </StickySearchContainer>
        </HeaderSection>
        <ContentSection>
          <AdvocateResults
            advocates={filteredAdvocates}
            isLoading={isLoading}
            error={error}
          />
          {!isLoading && !error && totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationButton>
              <PaginationInfo>
                Page {currentPage} of {totalPages}
              </PaginationInfo>
              <PaginationButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationButton>
            </PaginationContainer>
          )}
        </ContentSection>
      </Container>
    </Main>
  );
}

"use client";

import styled from "styled-components";
import { useEffect, useState, useCallback, useRef } from "react";
import { Advocate } from "@/types";
import { AdvocateResults } from "@/components/advocate-results";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { sortAdvocates } from "@/lib/advocate-utils";

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

  const triggerFetch = useCallback((newSearch: string, newYears: string, newTitle: string, newPage: number, newSort: string) => {
    setSearchTerm(newSearch);
    setYearsFilter(newYears);
    setTitleFilter(newTitle);
    setSortBy(newSort);
    setCurrentPage(newPage);
  }, []);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchAdvocates(searchTerm, yearsFilter, titleFilter, currentPage).then((result) => {
        const sorted = sortAdvocates(result.advocates || [], sortBy);
        setFilteredAdvocates(sorted);
        setTotalPages(result.pagination.totalPages);
        setTotalResults(result.pagination.total);
      });
    }, searchTerm !== "" ? 800 : 0);
  }, [fetchAdvocates, searchTerm, yearsFilter, titleFilter, currentPage, sortBy]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    triggerFetch(e.target.value, yearsFilter, titleFilter, 1, sortBy);
  };

  const onYearsFilterChange = (value: string) => {
    triggerFetch(searchTerm, value, titleFilter, 1, sortBy);
  };

  const onTitleFilterChange = (value: string) => {
    triggerFetch(searchTerm, yearsFilter, value, 1, sortBy);
  };

  const onSortByChange = (value: string) => {
    triggerFetch(searchTerm, yearsFilter, titleFilter, currentPage, value);
  };

  const onReset = () => {
    triggerFetch("", "all", "all", 1, "name-asc");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Main>
      <Container>
        <PageHeader
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
        <ContentSection>
          <AdvocateResults
            advocates={filteredAdvocates}
            isLoading={isLoading}
            error={error}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </ContentSection>
      </Container>
    </Main>
  );
}

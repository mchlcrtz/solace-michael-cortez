"use client";

import styled from "styled-components";
import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchSection = styled.section`
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const ScreenReaderHeading = styled.h2`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const SearchContainer = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: hsl(var(--foreground));
  margin-bottom: 0.75rem;
  font-family: var(--font-sans);
`;

const SearchStatus = styled.p`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
  margin-bottom: 0.75rem;
  font-family: var(--font-sans);
`;

const StrongText = styled.strong`
  color: hsl(var(--foreground));
  font-weight: 600;
  font-family: var(--font-sans);
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const StyledInput = styled(Input)`
  flex: 1;
  height: 2.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
`;

const StyledSelectTrigger = styled(SelectTrigger)`
  width: 100%;
  height: 2.75rem;
  
  @media (min-width: 768px) {
    width: 200px;
  }
`;

const StyledSelectTriggerTitle = styled(SelectTrigger)`
  width: 100%;
  height: 2.75rem;
  
  @media (min-width: 768px) {
    width: 150px;
  }
`;

const StyledSelectTriggerSort = styled(SelectTrigger)`
  width: 100%;
  height: 2.75rem;
  
  @media (min-width: 768px) {
    width: 180px;
  }
`;

const StyledButton = styled(Button)`
  height: 2.75rem;
  width: 100%;
  
  @media (min-width: 768px) {
    width: auto;
  }
`;

const LoadingStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
  margin-top: 0.75rem;
`;

const StyledLoader = styled(Loader2)`
  height: 1rem;
  width: 1rem;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ResultCount = styled.p`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
  margin-top: 0.75rem;
  font-family: var(--font-sans);
`;

interface AdvocateSearchProps {
  searchTerm: string;
  isLoading: boolean;
  yearsFilter: string;
  titleFilter: string;
  sortBy: string;
  resultCount: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onYearsFilterChange: (value: string) => void;
  onTitleFilterChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onReset: () => void;
}

export function AdvocateSearch({
  searchTerm,
  isLoading,
  yearsFilter,
  titleFilter,
  sortBy,
  resultCount,
  onChange,
  onYearsFilterChange,
  onTitleFilterChange,
  onSortByChange,
  onReset,
}: AdvocateSearchProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
      searchInputRef.current.focus();
    }
    onReset();
  };

  return (
    <SearchSection aria-labelledby="search-heading">
      <ScreenReaderHeading id="search-heading">
        Search for advocates
      </ScreenReaderHeading>
      <SearchContainer role="search" aria-label="Search advocates">
        <Label htmlFor="advocate-search">
          What can we help you with today?
        </Label>
        {searchTerm && (
          <SearchStatus
            id="search-status"
            aria-live="polite"
          >
            Searching for: <StrongText>{searchTerm}</StrongText>
          </SearchStatus>
        )}
        <ControlsContainer>
          <StyledInput
            id="advocate-search"
            ref={searchInputRef}
            onChange={onChange}
            type="search"
            placeholder="Search advocates by name, specialty, or location..."
            aria-label="Search advocates by name, specialty, or location"
            aria-describedby={isLoading ? "loading-status" : undefined}
            aria-busy={isLoading}
          />
          <Select value={yearsFilter} onValueChange={onYearsFilterChange}>
            <StyledSelectTrigger>
              <SelectValue placeholder="Years of experience" />
            </StyledSelectTrigger>
            <SelectContent>
              <SelectItem value="all">All experience levels</SelectItem>
              <SelectItem value="0-5">0-5 years</SelectItem>
              <SelectItem value="6-10">6-10 years</SelectItem>
              <SelectItem value="11-15">11-15 years</SelectItem>
              <SelectItem value="16+">16+ years</SelectItem>
            </SelectContent>
          </Select>
          <Select value={titleFilter} onValueChange={onTitleFilterChange}>
            <StyledSelectTriggerTitle>
              <SelectValue placeholder="Title" />
            </StyledSelectTriggerTitle>
            <SelectContent>
              <SelectItem value="all">All titles</SelectItem>
              <SelectItem value="MD">MD</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
              <SelectItem value="MSW">MSW</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <StyledSelectTriggerSort>
              <SelectValue placeholder="Sort by" />
            </StyledSelectTriggerSort>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="experience-desc">Experience (High to Low)</SelectItem>
              <SelectItem value="experience-asc">Experience (Low to High)</SelectItem>
              <SelectItem value="city-asc">City (A-Z)</SelectItem>
            </SelectContent>
          </Select>
          <StyledButton
            onClick={handleReset}
            aria-label="Reset search and clear search field"
            type="button"
            variant="outline"
          >
            Reset
          </StyledButton>
        </ControlsContainer>
        {isLoading && (
          <LoadingStatus
            id="loading-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <StyledLoader aria-hidden="true" />
            <span>Searching...</span>
          </LoadingStatus>
        )}
        {!isLoading && (
          <ResultCount
            id="result-count"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {resultCount === 0 
              ? "No advocates found"
              : `${resultCount} ${resultCount === 1 ? 'advocate' : 'advocates'} found`
            }
          </ResultCount>
        )}
      </SearchContainer>
    </SearchSection>
  );
}


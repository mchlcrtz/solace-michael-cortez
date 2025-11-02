"use client";

import styled from "styled-components";
import { AdvocateSearch } from "@/components/advocate-search";

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

interface PageHeaderProps {
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

export function PageHeader({
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
}: PageHeaderProps) {
  return (
    <HeaderSection>
      <TitleSection>
        <Title>
          Solace Advocates
        </Title>
        <Description>
          Find an advocate who will help untangle your healthcare.
        </Description>
      </TitleSection>
      <StickySearchContainer>
        <AdvocateSearch
          searchTerm={searchTerm}
          isLoading={isLoading}
          yearsFilter={yearsFilter}
          titleFilter={titleFilter}
          sortBy={sortBy}
          resultCount={resultCount}
          onChange={onChange}
          onYearsFilterChange={onYearsFilterChange}
          onTitleFilterChange={onTitleFilterChange}
          onSortByChange={onSortByChange}
          onReset={onReset}
        />
      </StickySearchContainer>
    </HeaderSection>
  );
}


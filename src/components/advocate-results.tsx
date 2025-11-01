"use client";

import styled from "styled-components";
import { Advocate } from "@/types";
import { ProviderCard } from "@/components/provider-card";
import { ProviderCardSkeleton } from "@/components/provider-card-skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";

const ResultsSection = styled.section`
  overflow-y: auto;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ListItemWrapper = styled.div``;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 4rem 0;
  }
`;

const EmptyStateTitle = styled.p`
  color: hsl(var(--foreground));
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-family: var(--font-sans);
  letter-spacing: -0.01em;
`;

const EmptyStateDescription = styled.p`
  color: hsl(var(--muted-foreground));
  font-size: 1rem;
  line-height: 1.5rem;
  max-width: 28rem;
  font-family: var(--font-sans);
`;

const ErrorState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 4rem 0;
  }
`;

const ErrorTitle = styled.p`
  color: hsl(var(--foreground));
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-family: var(--font-sans);
  letter-spacing: -0.01em;
`;

const ErrorDescription = styled.p`
  color: hsl(var(--muted-foreground));
  font-size: 1rem;
  line-height: 1.5rem;
  max-width: 28rem;
  font-family: var(--font-sans);
`;

interface AdvocateResultsProps {
  advocates: Advocate[];
  isLoading: boolean;
  error?: string | null;
}

export function AdvocateResults({ advocates, isLoading, error }: AdvocateResultsProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <ResultsSection 
        aria-label="Advocate results" 
        aria-live="polite" 
        aria-atomic="false"
      >
        <GridContainer role="list">
          {error ? (
            <ErrorState role="alert" aria-live="assertive">
              <ErrorTitle>Error loading advocates</ErrorTitle>
              <ErrorDescription>{error}</ErrorDescription>
            </ErrorState>
          ) : isLoading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ListItemWrapper key={i} role="listitem">
                  <ProviderCardSkeleton />
                </ListItemWrapper>
              ))}
            </>
          ) : advocates.length > 0 ? (
            advocates.map((advocate, index) => {
              return (
                <ListItemWrapper key={`${advocate.firstName}-${advocate.lastName}-${index}`} role="listitem">
                  <ProviderCard
                    name={`${advocate.firstName} ${advocate.lastName}`}
                    title={advocate.degree}
                    city={advocate.city}
                    years={advocate.yearsOfExperience}
                    phone={advocate.phoneNumber.toString()}
                    specialties={advocate.specialties}
                    imageUrl={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      `${advocate.firstName}+${advocate.lastName}`
                    )}`}
                  />
                </ListItemWrapper>
              );
            })
          ) : (
            <EmptyState role="status" aria-live="polite">
              <EmptyStateTitle>No advocates found</EmptyStateTitle>
              <EmptyStateDescription>
                Try adjusting your search criteria or browse all available advocates
              </EmptyStateDescription>
            </EmptyState>
          )}
        </GridContainer>
      </ResultsSection>
    </TooltipProvider>
  );
}


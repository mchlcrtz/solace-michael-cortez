"use client";

import styled from "styled-components";

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

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <PaginationContainer>
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </PaginationButton>
      <PaginationInfo>
        Page {currentPage} of {totalPages}
      </PaginationInfo>
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </PaginationButton>
    </PaginationContainer>
  );
}


import styled from "styled-components";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  
  transition: box-shadow 200ms;
`;

const StyledCardHeader = styled(CardHeader)`
  padding-bottom: 1rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const InfoContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const StyledCardTitle = styled(CardTitle)`
  font-size: 1.125rem;
  line-height: 1.75rem;
  margin-bottom: 0.25rem;
  font-weight: 600;
  font-family: var(--font-sans);
  letter-spacing: -0.01em;
`;

const StyledCardDescription = styled(CardDescription)`
  font-size: 1rem;
  line-height: 1.5rem;
  font-family: var(--font-sans);
`;

const StyledCardDescriptionWithMargin = styled(StyledCardDescription)`
  margin-top: 0.25rem;
`;

const StyledAvatar = styled(Avatar)`
  background-color: hsl(var(--primary) / 0.1);
  height: 4rem;
  width: 4rem;
  box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
`;

const StyledCardContent = styled(CardContent)`
  flex: 1;
  padding-bottom: 1rem;
`;

const SpecialtiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TooltipWrapper = styled.div`
  display: inline-block;
`;

const StyledCardFooter = styled(CardFooter)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid hsl(var(--border));
  
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
`;

const StyledAddress = styled.address`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
  display: flex;
  align-items: center;
  font-style: normal;
`;

const ScreenReaderOnly = styled.h4`
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

const StyledBadge = styled(Badge)<{ $cursor?: string }>`
  font-size: 0.75rem;
  line-height: 1rem;
  ${props => props.$cursor && `cursor: ${props.$cursor};`}
`;

const StyledTooltipContent = styled(TooltipContent)`
  max-width: 20rem;
`;

const StyledButton = styled(Button)`
  flex-shrink: 0;
  width: 100%;
  
  @media (min-width: 640px) {
    width: auto;
  }
`;

export interface ProviderCardProps {
  name: string
  title: string
  city: string
  years: number
  phone: string
  specialties: string[]
  imageUrl: string
}

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)})-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  return phone
}

function parseSpecialty(specialty: string): { main: string; tooltip: string | null } {
  const match = specialty.match(/^(.+?)\s*\((.+?)\)/);
  if (match) {
    return {
      main: match[1].trim(),
      tooltip: match[2].trim(),
    };
  }
  return {
    main: specialty,
    tooltip: null,
  };
}

export function ProviderCard({
  name,
  title,
  city,
  years,
  phone,
  specialties,
  imageUrl,
}: ProviderCardProps) {
  const formattedPhone = formatPhoneNumber(phone);
  
  return (
    <StyledCard role="article" aria-labelledby={`provider-name-${name.replace(/\s+/g, '-').toLowerCase()}`}>
        <StyledCardHeader>
          <HeaderContent>
            <StyledAvatar>
              <AvatarImage src={imageUrl} alt={`${name}'s profile picture`} />
            </StyledAvatar>
            <InfoContainer>
              <StyledCardTitle 
                id={`provider-name-${name.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {name}
              </StyledCardTitle>
              <StyledCardDescription>{title}</StyledCardDescription>
              <StyledCardDescriptionWithMargin>{city} • {years} {years === 1 ? 'year' : 'years'} experience</StyledCardDescriptionWithMargin>
            </InfoContainer>
          </HeaderContent>
        </StyledCardHeader>
        <StyledCardContent>
          <div>
            <ScreenReaderOnly>Specialties</ScreenReaderOnly>
            <SpecialtiesContainer role="list" aria-label="Specialties">
              {specialties.slice().sort().map((spec: string) => {
                const { main, tooltip } = parseSpecialty(spec);
                
                if (tooltip) {
                  return (
                    <Tooltip key={spec}>
                      <TooltipTrigger asChild>
                        <TooltipWrapper>
                          <StyledBadge 
                            variant="secondary" 
                            role="listitem"
                            $cursor="help"
                          >
                            {main}
                          </StyledBadge>
                        </TooltipWrapper>
                      </TooltipTrigger>
                      <StyledTooltipContent side="top" align="center">
                        {tooltip}
                      </StyledTooltipContent>
                    </Tooltip>
                  );
                }
                
                return (
                  <StyledBadge 
                    key={spec} 
                    variant="secondary" 
                    role="listitem"
                  >
                    {main}
                  </StyledBadge>
                );
              })}
            </SpecialtiesContainer>
          </div>
        </StyledCardContent>
        <StyledCardFooter>
          <StyledAddress aria-label={`Phone number: ${formattedPhone}`}>
            {formattedPhone}
          </StyledAddress>
          <StyledButton 
            aria-label={`Contact ${name} at ${formattedPhone}`}
          >
            Contact
          </StyledButton>
        </StyledCardFooter>
      </StyledCard>
  )
}


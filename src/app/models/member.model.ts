export interface Member {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  familyMembers: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  relationship: string;
  memberId: string;
}

export interface Claim {
  id: string;
  memberId: string;
  claimNumber: string;
  dateOfService: Date;
  provider: string;
  diagnosis: string;
  amount: number;
  status: 'pending' | 'approved' | 'denied' | 'processing';
  dateSubmitted: Date;
}

export interface Benefit {
  id: string;
  memberId: string;
  benefitType: string;
  description: string;
  coverageAmount: number;
  deductible: number;
  copay: number;
  coinsurance: number;
  planYear: number;
}

export interface Deductible {
  id: string;
  memberId: string;
  planYear: number;
  individualDeductible: number;
  familyDeductible: number;
  individualMet: number;
  familyMet: number;
  remainingIndividual: number;
  remainingFamily: number;
}

export interface PriorAuthorization {
  id: string;
  memberId: string;
  authNumber: string;
  requestDate: Date;
  approvedDate?: Date;
  expirationDate?: Date;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  serviceType: string;
  provider: string;
  notes: string;
}

export interface CallSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  member?: Member;
  callNotes: string;
  status: 'active' | 'completed';
  agent: string;
}
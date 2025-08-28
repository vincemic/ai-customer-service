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
  enrollmentDate?: Date;
  planCode?: string;
  planName?: string;
  groupNumber?: string;
  employerName?: string;
  primaryCarePhysician?: string;
  emergencyContact?: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  relationship: string;
  memberId: string;
  isSubscriber?: boolean;
  enrollmentDate?: Date;
  status?: 'active' | 'inactive' | 'terminated';
}

export interface Claim {
  id: string;
  memberId: string;
  claimNumber: string;
  dateOfService: Date;
  provider: string;
  providerNPI?: string;
  diagnosis: string;
  diagnosisCode?: string;
  procedureCode?: string;
  amount: number;
  allowedAmount?: number;
  paidAmount?: number;
  memberResponsibility?: number;
  status: 'pending' | 'approved' | 'denied' | 'processing' | 'paid';
  dateSubmitted: Date;
  dateProcessed?: Date;
  placeOfService?: string;
  serviceCategory?: 'medical' | 'dental' | 'vision' | 'pharmacy' | 'mental_health';
  denialReason?: string;
}

export interface Accumulator {
  id: string;
  memberId: string;
  planYear: number;
  type: 'deductible' | 'out_of_pocket' | 'coinsurance' | 'copay' | 'benefit_max';
  category: 'medical' | 'dental' | 'vision' | 'pharmacy' | 'mental_health' | 'all';
  individualLimit: number;
  familyLimit?: number;
  individualMet: number;
  familyMet?: number;
  individualRemaining: number;
  familyRemaining?: number;
  lastUpdated: Date;
}

export interface ClaimHistory {
  id: string;
  memberId: string;
  year: number;
  totalClaims: number;
  totalAmount: number;
  totalPaid: number;
  totalDenied: number;
  averageClaimAmount: number;
  mostFrequentProvider?: string;
  mostCommonDiagnosis?: string;
}

export interface CallHistory {
  id: string;
  memberId: string;
  callDate: Date;
  agent: string;
  duration: number; // in minutes
  callType: 'inquiry' | 'claim' | 'benefit' | 'authorization' | 'complaint' | 'other';
  resolution: 'resolved' | 'pending' | 'escalated' | 'transferred';
  notes: string;
  followUpRequired: boolean;
  followUpDate?: Date;
}

export interface AuthorizationHistory {
  id: string;
  memberId: string;
  requestDate: Date;
  serviceType: string;
  provider: string;
  status: 'approved' | 'denied' | 'pending' | 'expired' | 'cancelled';
  approvedUnits?: number;
  usedUnits?: number;
  expirationDate?: Date;
  denialReason?: string;
  reviewDate?: Date;
  reviewer?: string;
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
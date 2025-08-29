import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Accumulator, AuthorizationHistory, Benefit, CallHistory, Claim, ClaimHistory, Deductible, Member, PriorAuthorization } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private mockMembers: Member[] = [
    {
      id: '1',
      memberId: 'M123456789',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1985-06-15'),
      email: 'john.doe@email.com',
      phone: '555-123-4567',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345'
      },
      familyMembers: [
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          dateOfBirth: new Date('1987-03-22'),
          relationship: 'Spouse',
          memberId: 'M123456789'
        },
        {
          id: '3',
          firstName: 'Bobby',
          lastName: 'Doe',
          dateOfBirth: new Date('2010-09-10'),
          relationship: 'Child',
          memberId: 'M123456789'
        }
      ]
    },
    {
      id: '4',
      memberId: 'M987654321',
      firstName: 'Alice',
      lastName: 'Smith',
      dateOfBirth: new Date('1990-12-03'),
      email: 'alice.smith@email.com',
      phone: '555-987-6543',
      address: {
        street: '456 Oak Ave',
        city: 'Springfield',
        state: 'IL',
        zipCode: '54321'
      },
      familyMembers: []
    },
    {
      id: '5',
      memberId: 'M555111222',
      firstName: 'Robert',
      lastName: 'Johnson',
      dateOfBirth: new Date('1978-04-12'),
      email: 'robert.johnson@email.com',
      phone: '555-111-2222',
      address: {
        street: '789 Pine Street',
        city: 'Madison',
        state: 'WI',
        zipCode: '53703'
      },
      familyMembers: []
    },
    {
      id: '6',
      memberId: 'M444333222',
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: new Date('1982-09-25'),
      email: 'sarah.johnson@email.com',
      phone: '555-444-3333',
      address: {
        street: '321 Elm Drive',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201'
      },
      familyMembers: []
    },
    {
      id: '7',
      memberId: 'M888777666',
      firstName: 'Michael',
      lastName: 'Smith',
      dateOfBirth: new Date('1975-11-08'),
      email: 'michael.smith@email.com',
      phone: '555-888-7777',
      address: {
        street: '654 Maple Avenue',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301'
      },
      familyMembers: []
    }
  ];

  findMember(criteria: { memberId?: string; firstName?: string; lastName?: string; dateOfBirth?: Date }): Observable<Member | null> {
    const member = this.mockMembers.find(m => {
      const matchesMemberId = !criteria.memberId || m.memberId.toLowerCase().includes(criteria.memberId.toLowerCase());
      const matchesFirstName = !criteria.firstName || m.firstName.toLowerCase().includes(criteria.firstName.toLowerCase());
      const matchesLastName = !criteria.lastName || m.lastName.toLowerCase().includes(criteria.lastName.toLowerCase());
      const matchesDob = !criteria.dateOfBirth || m.dateOfBirth.getTime() === criteria.dateOfBirth.getTime();
      
      return matchesMemberId && matchesFirstName && matchesLastName && matchesDob;
    });

    return of(member || null).pipe(delay(500)); // Simulate API delay
  }

  searchMembers(criteria: { memberId?: string; firstName?: string; lastName?: string; dateOfBirth?: Date }): Observable<Member[]> {
    const matchingMembers = this.mockMembers.filter(m => {
      const matchesMemberId = !criteria.memberId || m.memberId.toLowerCase().includes(criteria.memberId.toLowerCase());
      const matchesFirstName = !criteria.firstName || m.firstName.toLowerCase().includes(criteria.firstName.toLowerCase());
      const matchesLastName = !criteria.lastName || m.lastName.toLowerCase().includes(criteria.lastName.toLowerCase());
      const matchesDob = !criteria.dateOfBirth || m.dateOfBirth.getTime() === criteria.dateOfBirth.getTime();
      
      return matchesMemberId && matchesFirstName && matchesLastName && matchesDob;
    });

    return of(matchingMembers).pipe(delay(500)); // Simulate API delay
  }

  getMemberById(id: string): Observable<Member | null> {
    const member = this.mockMembers.find(m => m.id === id);
    return of(member || null).pipe(delay(300));
  }

  getMemberClaims(memberId: string): Observable<Claim[]> {
    const mockClaims: Claim[] = [
      {
        id: '1',
        memberId,
        claimNumber: 'CLM2024001',
        dateOfService: new Date('2024-01-15'),
        provider: 'City General Hospital',
        diagnosis: 'Annual Physical',
        amount: 350.00,
        status: 'approved',
        dateSubmitted: new Date('2024-01-20')
      },
      {
        id: '2',
        memberId,
        claimNumber: 'CLM2024002',
        dateOfService: new Date('2024-02-10'),
        provider: 'Dr. Smith Family Practice',
        diagnosis: 'Flu Treatment',
        amount: 125.00,
        status: 'processing',
        dateSubmitted: new Date('2024-02-12')
      }
    ];

    return of(mockClaims).pipe(delay(400));
  }

  getMemberBenefits(memberId: string): Observable<Benefit[]> {
    const mockBenefits: Benefit[] = [
      {
        id: '1',
        memberId,
        benefitType: 'Medical',
        description: 'Comprehensive Medical Coverage',
        coverageAmount: 1000000,
        deductible: 1500,
        copay: 25,
        coinsurance: 20,
        planYear: 2024
      },
      {
        id: '2',
        memberId,
        benefitType: 'Dental',
        description: 'Basic Dental Coverage',
        coverageAmount: 2000,
        deductible: 50,
        copay: 10,
        coinsurance: 0,
        planYear: 2024
      }
    ];

    return of(mockBenefits).pipe(delay(350));
  }

  getMemberDeductibles(memberId: string): Observable<Deductible[]> {
    const mockDeductibles: Deductible[] = [
      {
        id: '1',
        memberId,
        planYear: 2024,
        individualDeductible: 1500,
        familyDeductible: 3000,
        individualMet: 450,
        familyMet: 450,
        remainingIndividual: 1050,
        remainingFamily: 2550
      }
    ];

    return of(mockDeductibles).pipe(delay(300));
  }

  getPriorAuthorizations(memberId: string): Observable<PriorAuthorization[]> {
    const mockAuths: PriorAuthorization[] = [
      {
        id: '1',
        memberId,
        authNumber: 'AUTH2024001',
        requestDate: new Date('2024-01-05'),
        approvedDate: new Date('2024-01-07'),
        expirationDate: new Date('2024-07-07'),
        status: 'approved',
        serviceType: 'MRI Scan',
        provider: 'Imaging Center',
        notes: 'Pre-approved for lower back MRI'
      }
    ];

    return of(mockAuths).pipe(delay(400));
  }

  getMemberAccumulators(memberId: string): Observable<Accumulator[]> {
    const mockAccumulators: Accumulator[] = [
      {
        id: '1',
        memberId,
        planYear: 2024,
        type: 'deductible',
        category: 'medical',
        individualLimit: 1500,
        familyLimit: 3000,
        individualMet: 450,
        familyMet: 450,
        individualRemaining: 1050,
        familyRemaining: 2550,
        lastUpdated: new Date('2024-02-15')
      },
      {
        id: '2',
        memberId,
        planYear: 2024,
        type: 'out_of_pocket',
        category: 'medical',
        individualLimit: 6000,
        familyLimit: 12000,
        individualMet: 800,
        familyMet: 800,
        individualRemaining: 5200,
        familyRemaining: 11200,
        lastUpdated: new Date('2024-02-15')
      },
      {
        id: '3',
        memberId,
        planYear: 2024,
        type: 'deductible',
        category: 'dental',
        individualLimit: 50,
        individualMet: 0,
        individualRemaining: 50,
        lastUpdated: new Date('2024-01-01')
      }
    ];

    return of(mockAccumulators).pipe(delay(350));
  }

  getClaimHistory(memberId: string): Observable<ClaimHistory[]> {
    const mockClaimHistory: ClaimHistory[] = [
      {
        id: '1',
        memberId,
        year: 2024,
        totalClaims: 8,
        totalAmount: 2840.50,
        totalPaid: 2420.30,
        totalDenied: 0,
        averageClaimAmount: 355.06,
        mostFrequentProvider: 'City General Hospital',
        mostCommonDiagnosis: 'Preventive Care'
      },
      {
        id: '2',
        memberId,
        year: 2023,
        totalClaims: 12,
        totalAmount: 4200.75,
        totalPaid: 3800.50,
        totalDenied: 400.25,
        averageClaimAmount: 350.06,
        mostFrequentProvider: 'Dr. Smith Family Practice',
        mostCommonDiagnosis: 'General Checkup'
      }
    ];

    return of(mockClaimHistory).pipe(delay(400));
  }

  getCallHistory(memberId: string): Observable<CallHistory[]> {
    const mockCallHistory: CallHistory[] = [
      {
        id: '1',
        memberId,
        callDate: new Date('2024-02-20'),
        agent: 'Sarah Johnson',
        duration: 12,
        callType: 'benefit',
        resolution: 'resolved',
        notes: 'Member inquired about dental coverage limits. Provided benefit summary.',
        followUpRequired: false
      },
      {
        id: '2',
        memberId,
        callDate: new Date('2024-01-15'),
        agent: 'Mike Rodriguez',
        duration: 8,
        callType: 'claim',
        resolution: 'resolved',
        notes: 'Assisted member with claim status inquiry for recent hospital visit.',
        followUpRequired: false
      },
      {
        id: '3',
        memberId,
        callDate: new Date('2023-12-10'),
        agent: 'Jennifer Lee',
        duration: 25,
        callType: 'authorization',
        resolution: 'escalated',
        notes: 'Member needs prior authorization for MRI. Escalated to medical review team.',
        followUpRequired: true,
        followUpDate: new Date('2023-12-12')
      }
    ];

    return of(mockCallHistory).pipe(delay(450));
  }

  getAuthorizationHistory(memberId: string): Observable<AuthorizationHistory[]> {
    const mockAuthHistory: AuthorizationHistory[] = [
      {
        id: '1',
        memberId,
        requestDate: new Date('2024-01-05'),
        serviceType: 'MRI - Lower Back',
        provider: 'City Imaging Center',
        status: 'approved',
        approvedUnits: 1,
        usedUnits: 1,
        expirationDate: new Date('2024-07-05'),
        reviewDate: new Date('2024-01-07'),
        reviewer: 'Dr. Patricia Wilson'
      },
      {
        id: '2',
        memberId,
        requestDate: new Date('2023-11-20'),
        serviceType: 'Physical Therapy',
        provider: 'Wellness Rehabilitation Center',
        status: 'approved',
        approvedUnits: 12,
        usedUnits: 8,
        expirationDate: new Date('2024-02-20'),
        reviewDate: new Date('2023-11-22'),
        reviewer: 'Dr. Mark Thompson'
      },
      {
        id: '3',
        memberId,
        requestDate: new Date('2023-08-15'),
        serviceType: 'Specialist Consultation',
        provider: 'Cardiology Associates',
        status: 'denied',
        denialReason: 'Not medically necessary based on current symptoms',
        reviewDate: new Date('2023-08-17'),
        reviewer: 'Dr. Lisa Chen'
      }
    ];

    return of(mockAuthHistory).pipe(delay(400));
  }
}
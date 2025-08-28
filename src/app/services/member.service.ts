import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Member, Claim, Benefit, Deductible, PriorAuthorization } from '../models/member.model';

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
}
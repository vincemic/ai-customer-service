import { inject, Injectable } from '@angular/core';
import { Accumulator, Address, AuthorizationHistory, Benefit, CallHistory, Claim, ClaimHistory, Deductible, EmailAddress, Member, PhoneNumber, PriorAuthorization } from '../models/member.model';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private loadingService = inject(LoadingService);
  private mockMembers: Member[] = [
    {
      id: '1',
      memberId: 'M123456789',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1985-06-15'),
      email: 'john.doe@email.com', // Legacy field
      phone: '555-123-4567', // Legacy field
      address: { // Legacy field
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345'
      },
      addresses: [
        {
          id: 'addr_1',
          type: 'home',
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA',
          isPrimary: true,
          isActive: true
        },
        {
          id: 'addr_2',
          type: 'work',
          street: '456 Business Blvd',
          street2: 'Suite 100',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12346',
          country: 'USA',
          isPrimary: false,
          isActive: true
        }
      ],
      emailAddresses: [
        {
          id: 'email_1',
          type: 'personal',
          email: 'john.doe@email.com',
          isPrimary: true,
          isActive: true,
          isVerified: true,
          verificationDate: new Date('2023-01-15')
        },
        {
          id: 'email_2',
          type: 'work',
          email: 'john.doe@company.com',
          isPrimary: false,
          isActive: true,
          isVerified: true,
          verificationDate: new Date('2023-02-01')
        }
      ],
      phoneNumbers: [
        {
          id: 'phone_1',
          type: 'mobile',
          number: '555-123-4567',
          isPrimary: true,
          isActive: true,
          canReceiveText: true,
          isVerified: true,
          verificationDate: new Date('2023-01-10')
        },
        {
          id: 'phone_2',
          type: 'home',
          number: '555-987-6543',
          isPrimary: false,
          isActive: true,
          canReceiveText: false,
          isVerified: false
        },
        {
          id: 'phone_3',
          type: 'work',
          number: '555-555-1234',
          extension: '1001',
          isPrimary: false,
          isActive: true,
          canReceiveText: false,
          isVerified: true,
          verificationDate: new Date('2023-02-15')
        }
      ],
      familyMembers: [
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          dateOfBirth: new Date('1987-03-22'),
          relationship: 'Spouse',
          memberId: 'M123456789',
          phone: '555-123-4568', // Legacy field
          addresses: [
            {
              id: 'addr_3',
              type: 'home',
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zipCode: '12345',
              country: 'USA',
              isPrimary: true,
              isActive: true
            }
          ],
          emailAddresses: [
            {
              id: 'email_3',
              type: 'personal',
              email: 'jane.doe@email.com',
              isPrimary: true,
              isActive: true,
              isVerified: true,
              verificationDate: new Date('2023-01-20')
            }
          ],
          phoneNumbers: [
            {
              id: 'phone_4',
              type: 'mobile',
              number: '555-123-4568',
              isPrimary: true,
              isActive: true,
              canReceiveText: true,
              isVerified: true,
              verificationDate: new Date('2023-01-20')
            }
          ]
        },
        {
          id: '3',
          firstName: 'Bobby',
          lastName: 'Doe',
          dateOfBirth: new Date('2010-09-10'),
          relationship: 'Child',
          memberId: 'M123456789',
          addresses: [
            {
              id: 'addr_4',
              type: 'home',
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zipCode: '12345',
              country: 'USA',
              isPrimary: true,
              isActive: true
            }
          ],
          emailAddresses: [],
          phoneNumbers: []
        }
      ]
    },
    {
      id: '4',
      memberId: 'M987654321',
      firstName: 'Alice',
      lastName: 'Smith',
      dateOfBirth: new Date('1990-12-03'),
      email: 'alice.smith@email.com', // Legacy field
      phone: '555-987-6543', // Legacy field
      address: { // Legacy field
        street: '456 Oak Ave',
        city: 'Springfield',
        state: 'IL',
        zipCode: '54321'
      },
      addresses: [
        {
          id: 'addr_5',
          type: 'home',
          street: '456 Oak Ave',
          city: 'Springfield',
          state: 'IL',
          zipCode: '54321',
          country: 'USA',
          isPrimary: true,
          isActive: true
        },
        {
          id: 'addr_6',
          type: 'mailing',
          street: 'PO Box 789',
          city: 'Springfield',
          state: 'IL',
          zipCode: '54322',
          country: 'USA',
          isPrimary: false,
          isActive: true
        }
      ],
      emailAddresses: [
        {
          id: 'email_4',
          type: 'personal',
          email: 'alice.smith@email.com',
          isPrimary: true,
          isActive: true,
          isVerified: true,
          verificationDate: new Date('2023-03-10')
        }
      ],
      phoneNumbers: [
        {
          id: 'phone_5',
          type: 'mobile',
          number: '555-654-3210',
          isPrimary: true,
          isActive: true,
          canReceiveText: true,
          isVerified: true,
          verificationDate: new Date('2023-03-10')
        }
      ],
      familyMembers: []
    },
    {
      id: '5',
      memberId: 'M555111222',
      firstName: 'Robert',
      lastName: 'Johnson',
      dateOfBirth: new Date('1978-04-12'),
      email: 'robert.johnson@email.com', // Legacy field
      phone: '555-111-2222', // Legacy field
      address: { // Legacy field
        street: '789 Pine Street',
        city: 'Madison',
        state: 'WI',
        zipCode: '53703'
      },
      addresses: [
        {
          id: 'addr_7',
          type: 'home',
          street: '789 Pine Street',
          city: 'Madison',
          state: 'WI',
          zipCode: '53703',
          country: 'USA',
          isPrimary: true,
          isActive: true
        }
      ],
      emailAddresses: [
        {
          id: 'email_5',
          type: 'personal',
          email: 'robert.johnson@email.com',
          isPrimary: true,
          isActive: true,
          isVerified: true,
          verificationDate: new Date('2023-01-05')
        },
        {
          id: 'email_6',
          type: 'alternate',
          email: 'rjohnson.backup@email.com',
          isPrimary: false,
          isActive: true,
          isVerified: false
        }
      ],
      phoneNumbers: [
        {
          id: 'phone_6',
          type: 'mobile',
          number: '555-111-2222',
          isPrimary: true,
          isActive: true,
          canReceiveText: true,
          isVerified: true
        }
      ],
      familyMembers: []
    },
    {
      id: '6',
      memberId: 'M444333222',
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: new Date('1982-09-25'),
      email: 'sarah.johnson@email.com', // Legacy field
      phone: '555-444-3333', // Legacy field
      address: { // Legacy field
        street: '321 Elm Drive',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201'
      },
      addresses: [
        {
          id: 'addr_8',
          type: 'home',
          street: '321 Elm Drive',
          city: 'Portland',
          state: 'OR',
          zipCode: '97201',
          country: 'USA',
          isPrimary: true,
          isActive: true
        },
        {
          id: 'addr_9',
          type: 'temporary',
          street: '555 Hotel Lane',
          street2: 'Room 301',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA',
          isPrimary: false,
          isActive: true,
          effectiveDate: new Date('2024-02-01'),
          expirationDate: new Date('2024-04-01')
        }
      ],
      emailAddresses: [
        {
          id: 'email_7',
          type: 'personal',
          email: 'sarah.johnson@email.com',
          isPrimary: true,
          isActive: true,
          isVerified: true,
          verificationDate: new Date('2023-02-14')
        }
      ],
      phoneNumbers: [
        {
          id: 'phone_7',
          type: 'mobile',
          number: '555-333-2222',
          isPrimary: true,
          isActive: true,
          canReceiveText: true,
          isVerified: true
        }
      ],
      familyMembers: []
    },
    {
      id: '7',
      memberId: 'M888777666',
      firstName: 'Michael',
      lastName: 'Smith',
      dateOfBirth: new Date('1975-11-08'),
      email: 'michael.smith@email.com', // Legacy field
      phone: '555-888-7777', // Legacy field
      address: { // Legacy field
        street: '654 Maple Avenue',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301'
      },
      addresses: [
        {
          id: 'addr_10',
          type: 'home',
          street: '654 Maple Avenue',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          country: 'USA',
          isPrimary: true,
          isActive: true
        },
        {
          id: 'addr_11',
          type: 'billing',
          street: '123 Financial Plaza',
          street2: 'Apt 4B',
          city: 'Austin',
          state: 'TX',
          zipCode: '73302',
          country: 'USA',
          isPrimary: false,
          isActive: true
        }
      ],
      emailAddresses: [
        {
          id: 'email_8',
          type: 'personal',
          email: 'michael.smith@email.com',
          isPrimary: true,
          isActive: true,
          isVerified: true,
          verificationDate: new Date('2023-01-01')
        },
        {
          id: 'email_9',
          type: 'work',
          email: 'msmith@techcorp.com',
          isPrimary: false,
          isActive: true,
          isVerified: true,
          verificationDate: new Date('2023-01-15')
        }
      ],
      phoneNumbers: [
        {
          id: 'phone_8',
          type: 'mobile',
          number: '555-777-6666',
          isPrimary: true,
          isActive: true,
          canReceiveText: true,
          isVerified: true
        },
        {
          id: 'phone_9',
          type: 'work',
          number: '555-888-9999',
          extension: '2055',
          isPrimary: false,
          isActive: true,
          canReceiveText: false,
          isVerified: true
        }
      ],
      familyMembers: []
    }
  ];

  async searchMembers(criteria: {
    memberId?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
  }): Promise<Member[]> {
    console.log('Searching members with criteria:', criteria);
    
    return this.loadingService.withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return this.mockMembers.filter(member => {
        if (criteria.memberId) {
          const memberIdMatch = member.memberId.toLowerCase().includes(criteria.memberId.toLowerCase());
          if (!memberIdMatch) return false;
        }
        
        if (criteria.firstName) {
          const firstNameMatch = member.firstName.toLowerCase().includes(criteria.firstName.toLowerCase());
          if (!firstNameMatch) return false;
        }
        
        if (criteria.lastName) {
          const lastNameMatch = member.lastName.toLowerCase().includes(criteria.lastName.toLowerCase());
          if (!lastNameMatch) return false;
        }
        
        if (criteria.dateOfBirth) {
          const dobMatch = member.dateOfBirth.toDateString() === criteria.dateOfBirth.toDateString();
          if (!dobMatch) return false;
        }
        
        return true;
      });
    }, 'Searching for member...');
  }

  async getMemberDetails(memberId: string): Promise<Member | null> {
    return this.loadingService.withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const member = this.mockMembers.find(m => m.id === memberId);
      
      if (member) {
        // Add comprehensive mock data for detailed view
        return {
          ...member,
          benefits: [
            {
              id: 'ben_1',
              type: 'Medical',
              planName: 'Health Plus Premium',
              effectiveDate: new Date('2024-01-01'),
              terminationDate: new Date('2024-12-31'),
              isActive: true,
              deductibles: [
                {
                  id: 'ded_1',
                  type: 'Individual',
                  amount: 1500,
                  yearToDateMet: 750,
                  planYear: 2024,
                  isActive: true
                },
                {
                  id: 'ded_2',
                  type: 'Family',
                  amount: 3000,
                  yearToDateMet: 1200,
                  planYear: 2024,
                  isActive: true
                }
              ],
              accumulators: [
                {
                  id: 'acc_1',
                  type: 'Out of Pocket Max',
                  amount: 5000,
                  yearToDateMet: 2500,
                  planYear: 2024,
                  isActive: true
                }
              ]
            }
          ],
          claimHistory: [
            {
              id: 'claim_1',
              claimNumber: 'CLM-2024-001234',
              serviceDate: new Date('2024-02-15'),
              provider: 'City Medical Center',
              amount: 250.00,
              status: 'Paid',
              processedDate: new Date('2024-02-20')
            }
          ],
          authorizationHistory: [
            {
              id: 'auth_1',
              authNumber: 'AUTH-2024-567890',
              serviceType: 'MRI Scan',
              provider: 'Advanced Imaging',
              requestDate: new Date('2024-03-01'),
              status: 'Approved',
              effectiveDate: new Date('2024-03-05'),
              expirationDate: new Date('2024-06-05')
            }
          ],
          callHistory: [
            {
              id: 'call_1',
              date: new Date('2024-03-10'),
              type: 'Inbound',
              duration: '00:12:34',
              reason: 'Benefits Inquiry',
              agent: 'Sarah Johnson',
              notes: 'Member inquired about coverage for specialist visit'
            }
          ],
          priorAuthorizations: [
            {
              id: 'pa_1',
              serviceType: 'Physical Therapy',
              provider: 'Wellness Rehabilitation',
              requestDate: new Date('2024-02-28'),
              status: 'Approved',
              approvedSessions: 12,
              usedSessions: 3,
              effectiveDate: new Date('2024-03-01'),
              expirationDate: new Date('2024-05-31')
            }
          ]
        };
      }
      
      return null;
    }, 'Loading member details...');
  }

  // Additional member data methods
  async getMemberClaims(memberId: string): Promise<Claim[]> {
    return this.loadingService.withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: 'claim_1',
          memberId: memberId,
          claimNumber: 'CLM-2024-001234',
          dateOfService: new Date('2024-02-15'),
          provider: 'City Medical Center',
          amount: 250.00,
          diagnosis: 'Annual Physical Exam',
          status: 'paid',
          dateSubmitted: new Date('2024-02-16')
        }
      ];
    }, 'Loading claims...');
  }

  async getMemberBenefits(memberId: string): Promise<Benefit[]> {
    return this.loadingService.withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: 'ben_1',
          memberId: memberId,
          benefitType: 'Medical',
          description: 'Health Plus Premium',
          coverageAmount: 50000,
          deductible: 1500,
          copay: 25,
          coinsurance: 20,
          planYear: 2024
        }
      ];
    }, 'Loading benefits...');
  }

  async getMemberAccumulators(memberId: string): Promise<Accumulator[]> {
    return this.loadingService.withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: 'acc_1',
          memberId: memberId,
          planYear: 2024,
          type: 'out_of_pocket',
          category: 'medical',
          individualLimit: 5000,
          familyLimit: 10000,
          individualMet: 2500,
          familyMet: 3500,
          individualRemaining: 2500,
          familyRemaining: 6500,
          lastUpdated: new Date('2024-03-15')
        }
      ];
    }, 'Loading accumulators...');
  }

  async getPriorAuthorizations(memberId: string): Promise<PriorAuthorization[]> {
    return this.loadingService.withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: 'pa_1',
          memberId: memberId,
          authNumber: 'AUTH-2024-567890',
          requestDate: new Date('2024-02-28'),
          approvedDate: new Date('2024-03-01'),
          expirationDate: new Date('2024-05-31'),
          status: 'approved',
          serviceType: 'Physical Therapy',
          provider: 'Wellness Rehabilitation',
          notes: 'Approved for 12 sessions following knee injury'
        }
      ];
    }, 'Loading prior authorizations...');
  }

  async getClaimHistory(memberId: string): Promise<ClaimHistory[]> {
    return this.loadingService.withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: 'claimhist_1',
          memberId: memberId,
          year: 2024,
          totalClaims: 15,
          totalAmount: 3750.00,
          totalPaid: 3000.00,
          totalDenied: 250.00,
          averageClaimAmount: 250.00,
          mostFrequentProvider: 'City Medical Center',
          mostCommonDiagnosis: 'Routine Checkup'
        }
      ];
    }, 'Loading claim history...');
  }

  async getCallHistory(memberId: string): Promise<CallHistory[]> {
    return this.loadingService.withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: 'call_1',
          memberId: memberId,
          callDate: new Date('2024-03-10'),
          agent: 'Sarah Johnson',
          duration: 12,
          callType: 'benefit',
          resolution: 'resolved',
          notes: 'Member inquired about coverage for specialist visit',
          followUpRequired: false
        }
      ];
    }, 'Loading call history...');
  }

  async getAuthorizationHistory(memberId: string): Promise<AuthorizationHistory[]> {
    return this.loadingService.withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: 'authhist_1',
          memberId: memberId,
          requestDate: new Date('2024-03-01'),
          serviceType: 'MRI Scan',
          provider: 'Advanced Imaging',
          status: 'approved',
          approvedUnits: 1,
          usedUnits: 0,
          expirationDate: new Date('2024-06-05'),
          reviewDate: new Date('2024-03-02'),
          reviewer: 'Dr. Medical Review'
        }
      ];
    }, 'Loading authorization history...');
  }
}
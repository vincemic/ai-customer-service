import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Accumulator, AuthorizationHistory, Benefit, CallHistory, Claim, ClaimHistory, Member, PriorAuthorization } from '../../models/member.model';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-member-data-view',
  templateUrl: './member-data-view.component.html',
  styleUrls: ['./member-data-view.component.css'],
  imports: [CommonModule]
})
export class MemberDataViewComponent implements OnInit {
  private memberService = inject(MemberService);
  
  member = input.required<Member>();
  
  selectedTab = signal<'claims' | 'benefits' | 'accumulators' | 'authorizations' | 'history'>('claims');
  
  claims = signal<Claim[]>([]);
  benefits = signal<Benefit[]>([]);
  accumulators = signal<Accumulator[]>([]);
  priorAuthorizations = signal<PriorAuthorization[]>([]);
  claimHistory = signal<ClaimHistory[]>([]);
  callHistory = signal<CallHistory[]>([]);
  authorizationHistory = signal<AuthorizationHistory[]>([]);
  
  loading = signal(false);
  
  // Computed values for claims
  totalClaimsAmount = computed(() => 
    this.claims().reduce((total, claim) => total + claim.amount, 0)
  );
  
  totalPaidAmount = computed(() => 
    this.claims().reduce((total, claim) => total + (claim.paidAmount || 0), 0)
  );
  
  pendingClaims = computed(() => 
    this.claims().filter(claim => claim.status === 'pending' || claim.status === 'processing')
  );
  
  recentClaims = computed(() => 
    this.claims()
      .sort((a, b) => new Date(b.dateOfService).getTime() - new Date(a.dateOfService).getTime())
      .slice(0, 10)
  );
  
  // Computed values for accumulators
  currentYearAccumulators = computed(() => {
    const currentYear = new Date().getFullYear();
    return this.accumulators().filter(acc => acc.planYear === currentYear);
  });
  
  deductibleAccumulators = computed(() => 
    this.currentYearAccumulators().filter(acc => acc.type === 'deductible')
  );
  
  outOfPocketAccumulators = computed(() => 
    this.currentYearAccumulators().filter(acc => acc.type === 'out_of_pocket')
  );
  
  // Computed values for authorizations
  activeAuthorizations = computed(() => 
    this.priorAuthorizations().filter(auth => auth.status === 'approved' && 
      (!auth.expirationDate || new Date(auth.expirationDate) > new Date()))
  );
  
  expiredAuthorizations = computed(() => 
    this.priorAuthorizations().filter(auth => 
      auth.expirationDate && new Date(auth.expirationDate) <= new Date())
  );
  
  ngOnInit() {
    this.loadMemberData();
  }
  
  setSelectedTab(tab: 'claims' | 'benefits' | 'accumulators' | 'authorizations' | 'history') {
    this.selectedTab.set(tab);
  }
  
  async loadMemberData() {
    this.loading.set(true);
    
    try {
      const [claims, benefits, accumulators, priorAuths] = await Promise.all([
        this.memberService.getMemberClaims(this.member().id),
        this.memberService.getMemberBenefits(this.member().id),
        this.memberService.getMemberAccumulators(this.member().id),
        this.memberService.getPriorAuthorizations(this.member().id)
      ]);
      
      this.claims.set(claims || []);
      this.benefits.set(benefits || []);
      this.accumulators.set(accumulators || []);
      this.priorAuthorizations.set(priorAuths || []);
      
      // Load history data
      const [claimHist, callHist, authHist] = await Promise.all([
        this.memberService.getClaimHistory(this.member().id),
        this.memberService.getCallHistory(this.member().id),
        this.memberService.getAuthorizationHistory(this.member().id)
      ]);
      
      this.claimHistory.set(claimHist || []);
      this.callHistory.set(callHist || []);
      this.authorizationHistory.set(authHist || []);
      
    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      this.loading.set(false);
    }
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
  
  formatPercent(value: number): string {
    return `${value}%`;
  }
  
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'approved': 'status-approved',
      'pending': 'status-pending',
      'denied': 'status-denied',
      'processing': 'status-processing',
      'paid': 'status-paid',
      'expired': 'status-expired',
      'active': 'status-active',
      'resolved': 'status-resolved',
      'escalated': 'status-escalated'
    };
    return statusClasses[status] || 'status-default';
  }
  
  calculateProgress(met: number, limit: number): number {
    return limit > 0 ? Math.min((met / limit) * 100, 100) : 0;
  }
}
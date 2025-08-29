import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Benefit, Claim, Deductible, Member, PriorAuthorization } from '../models/member.model';
import { MemberService } from '../services/member.service';
import { MemberDataViewComponent } from './member-data-view/member-data-view.component';
import { MemberDemographicsComponent } from './member-demographics/member-demographics.component';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
  imports: [CommonModule, MemberDemographicsComponent, MemberDataViewComponent]
})
export class MemberDetailsComponent implements OnInit {
  private memberService = inject(MemberService);
  
  member = input.required<Member>();
  
  activeTab = signal<'demographics' | 'data' | 'legacy'>('demographics');
  
  claims = signal<Claim[]>([]);
  benefits = signal<Benefit[]>([]);
  deductibles = signal<Deductible[]>([]);
  authorizations = signal<PriorAuthorization[]>([]);
  
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadMemberData();
  }

  private async loadMemberData(): Promise<void> {
    const memberId = this.member().id;
    
    try {
      // Load all member-related data in parallel
      const [claims, benefits, deductibles, auths] = await Promise.all([
        this.memberService.getMemberClaims(memberId),
        this.memberService.getMemberBenefits(memberId),
        this.memberService.getMemberDeductibles(memberId),
        this.memberService.getPriorAuthorizations(memberId)
      ]);
      
      this.claims.set(claims);
      this.benefits.set(benefits);
      this.deductibles.set(deductibles);
      this.authorizations.set(auths);
    } catch (error) {
      console.error('Error loading member data:', error);
    }
  }

  setActiveTab(tab: 'demographics' | 'data' | 'legacy'): void {
    this.activeTab.set(tab);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'denied': return 'status-denied';
      case 'processing': return 'status-processing';
      case 'expired': return 'status-expired';
      default: return '';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US').format(date);
  }
}
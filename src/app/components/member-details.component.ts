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

  private loadMemberData(): void {
    const memberId = this.member().id;
    
    // Load all member-related data
    this.memberService.getMemberClaims(memberId).subscribe(claims => {
      this.claims.set(claims);
    });
    
    this.memberService.getMemberBenefits(memberId).subscribe(benefits => {
      this.benefits.set(benefits);
    });
    
    this.memberService.getMemberDeductibles(memberId).subscribe(deductibles => {
      this.deductibles.set(deductibles);
    });
    
    this.memberService.getPriorAuthorizations(memberId).subscribe(auths => {
      this.authorizations.set(auths);
    });
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
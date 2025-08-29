import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { Member } from '../../models/member.model';

@Component({
  selector: 'app-member-demographics',
  templateUrl: './member-demographics.component.html',
  styleUrls: ['./member-demographics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class MemberDemographicsComponent {
  member = input.required<Member>();
  
  selectedTab = signal<'primary' | 'dependents' | 'contacts'>('primary');
  
  age = computed(() => {
    const today = new Date();
    const birthDate = new Date(this.member().dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  });
  
  activeDependents = computed(() => 
    this.member().familyMembers?.filter(fm => fm.status !== 'terminated') || []
  );
  
  inactiveDependents = computed(() => 
    this.member().familyMembers?.filter(fm => fm.status === 'terminated') || []
  );
  
  setSelectedTab(tab: 'primary' | 'dependents' | 'contacts') {
    this.selectedTab.set(tab);
  }
  
  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
  
  formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }
}
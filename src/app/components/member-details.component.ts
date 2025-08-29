import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { Member } from '../models/member.model';
import { MemberDataViewComponent } from './member-data-view/member-data-view.component';
import { MemberDemographicsComponent } from './member-demographics/member-demographics.component';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
  imports: [CommonModule, MemberDemographicsComponent, MemberDataViewComponent]
})
export class MemberDetailsComponent {
  member = input.required<Member>();
  
  activeTab = signal<'demographics' | 'data'>('demographics');

  setActiveTab(tab: 'demographics' | 'data'): void {
    this.activeTab.set(tab);
  }
}
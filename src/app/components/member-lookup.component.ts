import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Member } from '../models/member.model';
import { CallSessionService } from '../services/call-session.service';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-member-lookup',
  templateUrl: './member-lookup.component.html',
  styleUrls: ['./member-lookup.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class MemberLookupComponent {
  private memberService = inject(MemberService);
  private callSessionService = inject(CallSessionService);
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  searchError = signal<string | null>(null);
  foundMember = signal<Member | null>(null);

  searchForm = this.fb.group({
    memberId: ['', [Validators.pattern(/^[A-Za-z]\d{8,9}$/)]],
    firstName: ['', [Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    dateOfBirth: ['', [Validators.required]]
  });

  canSearch = computed(() => {
    const form = this.searchForm;
    return form.valid && !this.isLoading();
  });

  onSearchMember(): void {
    if (!this.canSearch()) return;

    this.isLoading.set(true);
    this.searchError.set(null);

    const formValue = this.searchForm.value;
    const searchCriteria = {
      memberId: formValue.memberId || undefined,
      firstName: formValue.firstName || undefined,
      lastName: formValue.lastName || undefined,
      dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : undefined
    };

    this.memberService.findMember(searchCriteria).subscribe({
      next: (member) => {
        this.isLoading.set(false);
        if (member) {
          this.foundMember.set(member);
          this.callSessionService.setMember(member);
        } else {
          this.searchError.set('No member found with the provided information.');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.searchError.set('An error occurred while searching for the member.');
        console.error('Search error:', error);
      }
    });
  }

  onClearSearch(): void {
    this.searchForm.reset();
    this.foundMember.set(null);
    this.searchError.set(null);
  }
}
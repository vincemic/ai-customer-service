import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Member } from '../models/member.model';
import { AgentSessionService } from '../services/agent-session.service';
import { LoadingService } from '../services/loading.service';
import { MemberStateService } from '../services/member-state.service';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-member-lookup',
  templateUrl: './member-lookup.component.html',
  styleUrls: ['./member-lookup.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class MemberLookupComponent {
  private memberService = inject(MemberService);
  private agentSessionService = inject(AgentSessionService);
  private memberStateService = inject(MemberStateService);
  private fb = inject(FormBuilder);
  private loadingService = inject(LoadingService);

  searchError = signal<string | null>(null);
  searchResults = signal<Member[]>([]);
  selectedMember = signal<Member | null>(null);
  
  // Signal to track form values for reactivity
  formValues = signal<any>({});

  // Expose loading state from service
  isLoading = this.loadingService.isLoading;

  searchForm = this.fb.group({
    memberId: ['', [Validators.pattern(/^[A-Za-z]\d{8,9}$/)]],
    firstName: ['', [Validators.minLength(2)]],
    lastName: ['', [Validators.minLength(2)]], // Remove required, handle in canSearch logic
    dateOfBirth: [''] // Optional field
  });

  constructor() {
    // Subscribe to form changes and update the signal
    this.searchForm.valueChanges.subscribe(values => {
      this.formValues.set(values);
    });
    
    // Initialize with current form values
    this.formValues.set(this.searchForm.value);
  }

  canSearch = computed(() => {
    // Get current form values from signal (this makes it reactive)
    const formValue = this.formValues();
    
    // Check if we have Member ID (quick search)
    const memberId = formValue.memberId?.trim();
    const hasValidMemberId = memberId && memberId.length >= 3; // Basic validation
    
    // Check if we have minimum required info for detailed search
    const lastName = formValue.lastName?.trim();
    const hasValidLastName = lastName && lastName.length >= 2;
    
    // We can search if we have either a member ID OR a valid last name
    const hasMinimumData = hasValidMemberId || hasValidLastName;
    
    // Check for validation errors only on filled fields
    const hasErrors = this.hasValidationErrors();
    
    const canSearchResult = hasMinimumData && !hasErrors;
    
    // Debug logging
    console.log('canSearch debug:', {
      memberId: memberId,
      hasValidMemberId,
      lastName: lastName,
      hasValidLastName,
      hasMinimumData,
      hasErrors,
      result: canSearchResult,
      formStatus: this.searchForm.status,
      formValid: this.searchForm.valid,
      formValues: formValue,
      formErrors: {
        memberId: this.searchForm.get('memberId')?.errors,
        firstName: this.searchForm.get('firstName')?.errors,
        lastName: this.searchForm.get('lastName')?.errors,
        dateOfBirth: this.searchForm.get('dateOfBirth')?.errors
      }
    });
    
    return canSearchResult;
  });

  private hasValidationErrors(): boolean {
    const form = this.searchForm;
    
    // Check member ID errors only if it has a value
    const memberIdValue = form.get('memberId')?.value?.trim();
    if (memberIdValue && form.get('memberId')?.errors) {
      return true;
    }
    
    // Check first name errors only if it has a value
    const firstNameValue = form.get('firstName')?.value?.trim();
    if (firstNameValue && form.get('firstName')?.errors) {
      return true;
    }
    
    // Check last name errors only if it has a value
    const lastNameValue = form.get('lastName')?.value?.trim();
    if (lastNameValue && form.get('lastName')?.errors) {
      return true;
    }
    
    // Check date of birth errors only if it has a value
    const dobValue = form.get('dateOfBirth')?.value?.trim();
    if (dobValue && form.get('dateOfBirth')?.errors) {
      return true;
    }
    
    return false;
  }

  async onSearchMember(): Promise<void> {
    if (!this.canSearch()) return;

    // Validate that we have minimum search criteria
    const formValue = this.searchForm.value;
    const memberId = formValue.memberId?.trim();
    const lastName = formValue.lastName?.trim();
    
    if (!memberId && !lastName) {
      this.searchError.set('Please provide either a Member ID or Last Name to search.');
      return;
    }

    this.searchError.set(null);

    const searchCriteria = {
      memberId: memberId || undefined,
      firstName: formValue.firstName?.trim() || undefined,
      lastName: lastName || undefined,
      dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : undefined
    };

    try {
      const members = await this.memberService.searchMembers(searchCriteria);
      this.searchResults.set(members);
      this.searchError.set(members.length === 0 ? 'No members found matching search criteria' : null);
    } catch (error) {
      this.searchError.set('An error occurred while searching for members.');
      this.searchResults.set([]);
      console.error('Search error:', error);
    }
  }

  onClearSearch(): void {
    console.log('onClearSearch called');
    
    // Clear form data
    this.searchForm.reset();
    
    // Clear all search-related state
    this.searchResults.set([]);
    this.selectedMember.set(null);
    this.searchError.set(null);
    
    // Clear member state service
    this.memberStateService.clearCurrentMember();
    
    // Reset form controls to ensure they're in a clean state
    Object.keys(this.searchForm.controls).forEach(key => {
      const control = this.searchForm.get(key);
      if (control) {
        control.markAsUntouched();
        control.markAsPristine();
        control.updateValueAndValidity();
      }
    });
    
    console.log('Form cleared, button should still be visible');
  }

  onSelectMember(member: Member): void {
    this.selectedMember.set(member);
    this.memberStateService.setCurrentMember(member);
    this.agentSessionService.setCallMember(member.id);
  }
}
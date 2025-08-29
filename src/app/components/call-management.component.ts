import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentSessionService } from '../services/agent-session.service';

@Component({
  selector: 'app-call-management',
  templateUrl: './call-management.component.html',
  styleUrls: ['./call-management.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CallManagementComponent implements OnInit, OnDestroy {
  private agentSessionService = inject(AgentSessionService);
  private fb = inject(FormBuilder);
  private updateInterval?: number;

  // Input to control if header should be shown
  headerMode = input(true);

  currentCall = this.agentSessionService.currentCall$;
  isOnCall = this.agentSessionService.isOnCall;
  
  showEndCallModal = signal(false);
  callNotes = signal('');
  
  endCallForm = this.fb.group({
    outcome: ['completed', [Validators.required]],
    finalNotes: ['', [Validators.maxLength(1000)]]
  });

  callDuration = computed(() => {
    const call = this.currentCall();
    if (!call) return '00:00:00';
    
    const duration = this.agentSessionService.currentCallDuration();
    return this.formatDuration(duration);
  });

  ngOnInit(): void {
    // Update call duration every second
    this.updateInterval = window.setInterval(() => {
      if (this.isOnCall()) {
        this.callDuration();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  onEndCall(): void {
    const currentNotes = this.callNotes();
    this.endCallForm.patchValue({
      finalNotes: currentNotes
    });
    this.showEndCallModal.set(true);
  }

  confirmEndCall(): void {
    if (this.endCallForm.valid) {
      const formValue = this.endCallForm.value;
      const finalNotes = formValue.finalNotes || '';
      const outcome = formValue.outcome as any || 'completed';
      
      this.agentSessionService.endCall(finalNotes, outcome);
      this.showEndCallModal.set(false);
      this.endCallForm.reset();
      this.callNotes.set('');
    }
  }

  cancelEndCall(): void {
    this.showEndCallModal.set(false);
    this.endCallForm.reset();
  }

  updateCallNotes(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const notes = target.value;
    this.callNotes.set(notes);
    this.agentSessionService.updateCallNotes(notes);
  }

  formatTime(date: Date): string {
    return this.agentSessionService.formatTime(date);
  }

  private formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getOutcomeColor(outcome: string): string {
    switch (outcome) {
      case 'completed': return '#10b981';
      case 'transferred': return '#3b82f6';
      case 'abandoned': return '#ef4444';
      default: return '#6b7280';
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.endCallForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'outcome': 'Call outcome',
      'finalNotes': 'Final notes'
    };
    
    return displayNames[fieldName] || fieldName;
  }
}
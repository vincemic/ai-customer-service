import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CallSessionService } from '../services/call-session.service';

@Component({
  selector: 'app-call-session',
  templateUrl: './call-session.component.html',
  styleUrls: ['./call-session.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CallSessionComponent {
  private callSessionService = inject(CallSessionService);
  private fb = inject(FormBuilder);

  currentSession = this.callSessionService.currentSession$;
  
  showEndCallModal = signal(false);
  
  endCallForm = this.fb.group({
    finalNotes: ['', [Validators.maxLength(500)]]
  });

  callDuration = computed(() => {
    const session = this.currentSession();
    if (!session || !session.startTime) return '00:00:00';
    
    const start = new Date(session.startTime);
    const end = session.endTime ? new Date(session.endTime) : new Date();
    const diff = end.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  ngOnInit(): void {
    // Start a new call session if none exists
    if (!this.currentSession()) {
      this.startNewCall();
    }
    
    // Update call duration every second
    setInterval(() => {
      // This will trigger the computed signal to recalculate
      if (this.currentSession()?.status === 'active') {
        // Force update by accessing the computed value
        this.callDuration();
      }
    }, 1000);
  }

  startNewCall(): void {
    // In a real app, you'd get the agent name from authentication
    const agentName = 'Agent Smith'; // Placeholder
    this.callSessionService.startCall(agentName);
  }

  onEndCall(): void {
    this.showEndCallModal.set(true);
  }

  confirmEndCall(): void {
    const finalNotes = this.endCallForm.get('finalNotes')?.value || '';
    this.callSessionService.endCall(finalNotes);
    this.showEndCallModal.set(false);
    this.endCallForm.reset();
  }

  cancelEndCall(): void {
    this.showEndCallModal.set(false);
    this.endCallForm.reset();
  }

  updateCallNotes(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.callSessionService.updateCallNotes(target.value);
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  }
}
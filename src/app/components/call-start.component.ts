import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CallSessionService } from '../services/call-session.service';

@Component({
  selector: 'app-call-start',
  templateUrl: './call-start.component.html',
  styleUrls: ['./call-start.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CallStartComponent {
  private callSessionService = inject(CallSessionService);
  private fb = inject(FormBuilder);

  isStarting = signal(false);
  
  callStartForm = this.fb.group({
    agentName: ['', [Validators.required, Validators.minLength(2)]],
    callType: ['inbound', [Validators.required]],
    priority: ['normal', [Validators.required]]
  });

  onStartCall(): void {
    if (this.callStartForm.valid) {
      this.isStarting.set(true);
      
      const formValue = this.callStartForm.value;
      const agentName = formValue.agentName || 'Unknown Agent';
      
      // Simulate brief loading
      setTimeout(() => {
        this.callSessionService.startCall(agentName);
        this.isStarting.set(false);
      }, 500);
    } else {
      // Mark all fields as touched to show validation errors
      this.callStartForm.markAllAsTouched();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.callStartForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'agentName': 'Agent name',
      'callType': 'Call type',
      'priority': 'Priority'
    };
    
    return displayNames[fieldName] || fieldName;
  }
}
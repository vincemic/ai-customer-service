import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentSessionService } from '../services/agent-session.service';

@Component({
  selector: 'app-agent-login',
  templateUrl: './agent-login.component.html',
  styleUrls: ['./agent-login.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AgentLoginComponent {
  private agentSessionService = inject(AgentSessionService);
  private fb = inject(FormBuilder);

  isLoggingIn = signal(false);
  
  loginForm = this.fb.group({
    agentName: ['', [Validators.required, Validators.minLength(2)]],
    department: ['customer-service', [Validators.required]]
  });

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoggingIn.set(true);
      
      const formValue = this.loginForm.value;
      const agentName = formValue.agentName || 'Unknown Agent';
      
      // Simulate brief loading/authentication
      setTimeout(() => {
        this.agentSessionService.login(agentName);
        this.isLoggingIn.set(false);
        this.loginForm.reset();
      }, 800);
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        return `Please enter a valid ${this.getFieldDisplayName(fieldName)}`;
      }
    }
    
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'agentName': 'Agent name',
      'department': 'Department'
    };
    
    return displayNames[fieldName] || fieldName;
  }
}
import { Component, signal, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemberLookupComponent } from './components/member-lookup.component';
import { MemberDetailsComponent } from './components/member-details.component';
import { CallSessionComponent } from './components/call-session.component';
import { CallSessionService } from './services/call-session.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    CommonModule, 
    MemberLookupComponent, 
    MemberDetailsComponent, 
    CallSessionComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private callSessionService = inject(CallSessionService);
  
  protected readonly title = signal('Health Insurance Call Center');
  
  currentSession = this.callSessionService.currentSession$;
  
  // Computed property to check if a member is identified
  memberIdentified = computed(() => {
    const session = this.currentSession();
    return session?.member != null;
  });
}

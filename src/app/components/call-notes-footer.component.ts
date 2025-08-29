import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { AgentSessionService } from '../services/agent-session.service';

@Component({
  selector: 'app-call-notes-footer',
  template: `
    @if (isOnCall() && currentCall(); as call) {
      <div class="call-notes-footer" [class.expanded]="isExpanded()">
        <div class="footer-header" (click)="toggleExpanded()">
          <div class="header-left">
            <span class="footer-title">Call Notes</span>
            <span class="call-id">{{ call.id }}</span>
          </div>
          <div class="header-right">
            <span class="call-duration">{{ callDuration() }}</span>
            <button class="toggle-btn" [attr.aria-label]="isExpanded() ? 'Collapse notes' : 'Expand notes'">
              {{ isExpanded() ? '▼' : '▲' }}
            </button>
          </div>
        </div>
        
        @if (isExpanded()) {
          <div class="footer-content">
            <div class="notes-input-container">
              <textarea
                class="call-notes-input"
                placeholder="Enter call notes and interaction details..."
                [value]="callNotes()"
                (input)="updateCallNotes($event)"
                rows="6"
                aria-label="Call notes"
              ></textarea>
              <div class="character-count">
                {{ callNotes().length }} characters
              </div>
            </div>
            
            <div class="quick-actions">
              <button class="quick-action-btn" (click)="addQuickNote('Customer called about billing inquiry')" title="Add billing note">
                Billing
              </button>
              <button class="quick-action-btn" (click)="addQuickNote('Technical support requested')" title="Add technical note">
                Technical
              </button>
              <button class="quick-action-btn" (click)="addQuickNote('Account information updated')" title="Add account note">
                Account
              </button>
              <button class="quick-action-btn" (click)="addQuickNote('Follow-up required')" title="Add follow-up note">
                Follow-up
              </button>
              <button class="quick-action-btn" (click)="clearNotes()" title="Clear all notes">
                Clear
              </button>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .call-notes-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--vscode-activitybar-bg);
      border-top: 2px solid var(--vscode-blue);
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
      z-index: 999;
      max-height: 50vh;
      overflow: hidden;
      transition: all var(--transition-fast);
    }

    .call-notes-footer.expanded {
      max-height: 60vh;
    }

    .footer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md) var(--spacing-lg);
      cursor: pointer;
      background: var(--vscode-activitybar-bg);
      user-select: none;
      transition: background-color var(--transition-fast);
    }

    .footer-header:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      flex: 1;
    }

    .footer-title {
      font-weight: var(--font-weight-semibold);
      color: var(--text-bright);
      font-size: 1rem;
    }

    .call-id {
      font-size: var(--font-size-small);
      color: var(--text-secondary);
      font-family: var(--font-family-mono);
      background: rgba(0, 122, 204, 0.1);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      border: 1px solid rgba(0, 122, 204, 0.2);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .call-duration {
      font-family: var(--font-family-mono);
      color: var(--vscode-blue-light);
      font-weight: var(--font-weight-bold);
      background: rgba(0, 122, 204, 0.1);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      border: 1px solid rgba(0, 122, 204, 0.2);
    }

    .toggle-btn {
      background: transparent;
      border: 1px solid var(--border-primary);
      color: var(--text-bright);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
      font-size: 0.8rem;
      min-width: 28px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-btn:hover {
      background: var(--vscode-blue);
      border-color: var(--vscode-blue);
    }

    .footer-content {
      padding: 0 var(--spacing-lg) var(--spacing-lg);
      background: var(--background-primary);
      display: flex;
      gap: var(--spacing-lg);
    }

    .notes-input-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .call-notes-input {
      width: 100%;
      padding: var(--spacing-md);
      border: 1px solid var(--vscode-input-border);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-family: inherit;
      resize: none;
      transition: all var(--transition-fast);
      background: var(--vscode-input-bg);
      color: var(--vscode-input-fg);
      line-height: 1.5;
    }

    .call-notes-input::placeholder {
      color: var(--vscode-input-placeholder);
    }

    .call-notes-input:focus {
      outline: none;
      border-color: var(--border-focus);
      box-shadow: 0 0 0 1px var(--border-focus);
    }

    .character-count {
      font-size: var(--font-size-small);
      color: var(--text-secondary);
      text-align: right;
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      min-width: 140px;
    }

    .quick-action-btn {
      background: var(--background-secondary);
      border: 1px solid var(--border-primary);
      color: var(--text-bright);
      padding: var(--spacing-sm);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
      font-size: 0.8rem;
      text-align: left;
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .quick-action-btn:hover {
      background: var(--vscode-blue);
      border-color: var(--vscode-blue);
      transform: translateY(-1px);
    }

    .quick-action-btn:last-child {
      margin-top: var(--spacing-sm);
      background: var(--vscode-red);
      border-color: var(--vscode-red);
    }

    .quick-action-btn:last-child:hover {
      background: var(--vscode-red-dark);
      border-color: var(--vscode-red-dark);
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
      }

      .header-left {
        gap: var(--spacing-sm);
      }

      .header-right {
        gap: var(--spacing-sm);
      }

      .call-id {
        display: none;
      }

      .quick-actions {
        flex-direction: row;
        flex-wrap: wrap;
        min-width: unset;
      }

      .quick-action-btn {
        flex: 1;
        min-width: 80px;
        justify-content: center;
        text-align: center;
      }

      .call-notes-footer {
        max-height: 40vh;
      }

      .call-notes-footer.expanded {
        max-height: 70vh;
      }
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .call-notes-footer,
      .footer-header,
      .toggle-btn,
      .quick-action-btn,
      .call-notes-input {
        transition: none !important;
        transform: none !important;
      }
    }
  `]
})
export class CallNotesFooterComponent implements OnInit, OnDestroy {
  private agentSessionService = inject(AgentSessionService);
  private updateInterval?: number;

  // Use AgentSessionService for both call status and notes
  currentCall = this.agentSessionService.currentCall$;
  isOnCall = this.agentSessionService.isOnCall;
  
  isExpanded = signal(false);
  callNotes = signal('');

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

    // Initialize call notes from agent session service
    try {
      const call = this.currentCall();
      if (call?.notes) {
        this.callNotes.set(call.notes);
      }
    } catch (error) {
      console.log('Could not initialize call notes from AgentSessionService');
    }
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  toggleExpanded(): void {
    this.isExpanded.update(expanded => !expanded);
  }

  updateCallNotes(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const notes = target.value;
    this.callNotes.set(notes);
    // Save call notes via agent session service
    this.agentSessionService.updateCallNotes(notes);
  }

  addQuickNote(note: string): void {
    const currentNotes = this.callNotes();
    const timestamp = new Date().toLocaleTimeString();
    const newNote = `[${timestamp}] ${note}`;
    
    const updatedNotes = currentNotes 
      ? `${currentNotes}\n${newNote}` 
      : newNote;
    
    this.callNotes.set(updatedNotes);
    // Save call notes via agent session service
    this.agentSessionService.updateCallNotes(updatedNotes);
  }

  clearNotes(): void {
    if (confirm('Are you sure you want to clear all call notes?')) {
      this.callNotes.set('');
      // Save call notes via agent session service
      this.agentSessionService.updateCallNotes('');
    }
  }

  private formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
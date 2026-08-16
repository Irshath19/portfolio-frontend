const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const SESSION_STORAGE_KEY = 'devgarage_session_id';

class AnalyticsService {
  private sessionId: string;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastTrackedPage: string | null = null;
  private isInitialized = false;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    try {
      let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!id) {
        id = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
        sessionStorage.setItem(SESSION_STORAGE_KEY, id);
      }
      return id;
    } catch {
      return 'sess_' + Math.random().toString(36).substring(2, 11);
    }
  }

  // 1. Initialize Visitor Session
  public async initSession(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      const payload = {
        sessionId: this.sessionId,
        landingPage: window.location.pathname || '/',
        referrer: document.referrer || '',
        screenWidth: window.innerWidth || null,
        screenHeight: window.innerHeight || null,
        language: navigator.language || 'en',
      };

      // Non-blocking fetch
      fetch(`${API_BASE}/analytics/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});

      // Start initial page view and heartbeat
      this.trackPageView(window.location.hash || '/');
      this.startHeartbeat();
      this.setupVisibilityListener();
    } catch (err) {
      // Fail silently to never impact user experience
    }
  }

  // 2. Track Page or Section View
  public trackPageView(page: string): void {
    const formattedPage = page.startsWith('#') ? page : page.startsWith('/') ? page : `/${page}`;
    if (this.lastTrackedPage === formattedPage) return;
    this.lastTrackedPage = formattedPage;

    try {
      fetch(`${API_BASE}/analytics/page-view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          page: formattedPage,
        }),
      }).catch(() => {});
    } catch {}
  }

  // 3. Track Custom Interaction Event
  public trackEvent(eventType: string, page: string = '/', metadata?: Record<string, any>): void {
    try {
      fetch(`${API_BASE}/analytics/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          eventType,
          page,
          metadata,
        }),
      }).catch(() => {});
    } catch {}
  }

  // 4. Track Project Modal View
  public trackProjectView(projectId: string, title?: string): void {
    this.trackEvent('project_view', `#projects/${projectId}`, { projectId, title });
  }

  // 5. Lightweight Heartbeat (every 20s while active)
  private startHeartbeat(): void {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetch(`${API_BASE}/analytics/heartbeat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: this.sessionId,
            durationIncrement: 20,
          }),
        }).catch(() => {});
      }
    }, 20000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.startHeartbeat();
      } else {
        this.stopHeartbeat();
      }
    });
  }
}

export const analytics = new AnalyticsService();

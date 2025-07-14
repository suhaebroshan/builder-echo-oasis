import { notificationService } from "./notifications";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:MM format
  endTime?: string; // HH:MM format
  isAllDay: boolean;
  category:
    | "personal"
    | "work"
    | "holiday"
    | "birthday"
    | "reminder"
    | "meeting";
  color: string;
  reminderMinutes?: number; // Minutes before event to remind
  isRecurring: boolean;
  recurringType?: "daily" | "weekly" | "monthly" | "yearly";
  recurringEnd?: string; // YYYY-MM-DD format
  createdAt: Date;
  updatedAt: Date;
}

export interface Festival {
  name: string;
  date: string; // MM-DD format for annual events
  description: string;
  category:
    | "hindu"
    | "muslim"
    | "christian"
    | "sikh"
    | "secular"
    | "international";
  color: string;
}

export class CalendarService {
  private static instance: CalendarService;
  private events: CalendarEvent[] = [];
  private festivals: Festival[] = [];
  private reminderTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private readonly STORAGE_KEY = "sios_calendar_events";

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  constructor() {
    this.loadEvents();
    this.loadFestivals();
    this.scheduleReminders();

    // Check for reminders every minute
    setInterval(() => {
      this.checkReminders();
    }, 60000);
  }

  // Event Management
  addEvent(
    eventData: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">,
  ): string {
    const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const event: CalendarEvent = {
      ...eventData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.events.push(event);
    this.saveEvents();
    this.scheduleEventReminder(event);

    // Create recurring events if needed
    if (event.isRecurring && event.recurringType && event.recurringEnd) {
      this.createRecurringEvents(event);
    }

    return id;
  }

  updateEvent(id: string, updates: Partial<CalendarEvent>): boolean {
    const index = this.events.findIndex((event) => event.id === id);
    if (index === -1) return false;

    this.events[index] = {
      ...this.events[index],
      ...updates,
      updatedAt: new Date(),
    };

    this.saveEvents();
    this.scheduleEventReminder(this.events[index]);
    return true;
  }

  deleteEvent(id: string): boolean {
    const index = this.events.findIndex((event) => event.id === id);
    if (index === -1) return false;

    // Clear any scheduled reminders
    const timeout = this.reminderTimeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.reminderTimeouts.delete(id);
    }

    this.events.splice(index, 1);
    this.saveEvents();
    return true;
  }

  getEvents(): CalendarEvent[] {
    return [...this.events];
  }

  getEventsForDate(date: string): CalendarEvent[] {
    return this.events.filter((event) => event.date === date);
  }

  getEventsForMonth(year: number, month: number): CalendarEvent[] {
    const monthStr = `${year}-${(month + 1).toString().padStart(2, "0")}`;
    return this.events.filter((event) => event.date.startsWith(monthStr));
  }

  // Festival Management
  private loadFestivals(): void {
    this.festivals = [
      // Hindu Festivals
      {
        name: "Diwali",
        date: "11-12",
        description: "Festival of Lights",
        category: "hindu",
        color: "#ff6b35",
      },
      {
        name: "Holi",
        date: "03-13",
        description: "Festival of Colors",
        category: "hindu",
        color: "#ff6b35",
      },
      {
        name: "Dussehra",
        date: "10-15",
        description: "Victory of Good over Evil",
        category: "hindu",
        color: "#ff6b35",
      },
      {
        name: "Ganesh Chaturthi",
        date: "08-31",
        description: "Lord Ganesha's Birthday",
        category: "hindu",
        color: "#ff6b35",
      },
      {
        name: "Krishna Janmashtami",
        date: "08-18",
        description: "Lord Krishna's Birthday",
        category: "hindu",
        color: "#ff6b35",
      },

      // Muslim Festivals
      {
        name: "Eid al-Fitr",
        date: "04-21",
        description: "End of Ramadan",
        category: "muslim",
        color: "#4ecdc4",
      },
      {
        name: "Eid al-Adha",
        date: "06-28",
        description: "Festival of Sacrifice",
        category: "muslim",
        color: "#4ecdc4",
      },
      {
        name: "Ramadan Begins",
        date: "03-22",
        description: "Holy Month of Fasting",
        category: "muslim",
        color: "#4ecdc4",
      },

      // Christian Festivals
      {
        name: "Christmas",
        date: "12-25",
        description: "Birth of Jesus Christ",
        category: "christian",
        color: "#95e1d3",
      },
      {
        name: "Easter",
        date: "03-31",
        description: "Resurrection of Jesus",
        category: "christian",
        color: "#95e1d3",
      },
      {
        name: "Good Friday",
        date: "03-29",
        description: "Crucifixion of Jesus",
        category: "christian",
        color: "#95e1d3",
      },

      // Sikh Festivals
      {
        name: "Guru Nanak Jayanti",
        date: "11-27",
        description: "Guru Nanak's Birthday",
        category: "sikh",
        color: "#f38ba8",
      },
      {
        name: "Baisakhi",
        date: "04-13",
        description: "Sikh New Year",
        category: "sikh",
        color: "#f38ba8",
      },

      // Secular/International
      {
        name: "New Year's Day",
        date: "01-01",
        description: "Beginning of the Year",
        category: "secular",
        color: "#ffd93d",
      },
      {
        name: "International Women's Day",
        date: "03-08",
        description: "Women's Rights Day",
        category: "international",
        color: "#ff6b9d",
      },
      {
        name: "Earth Day",
        date: "04-22",
        description: "Environmental Awareness",
        category: "international",
        color: "#6bcf7f",
      },
      {
        name: "World Health Day",
        date: "04-07",
        description: "Global Health Awareness",
        category: "international",
        color: "#6bcf7f",
      },
      {
        name: "Halloween",
        date: "10-31",
        description: "Spooky Holiday",
        category: "secular",
        color: "#ff8c42",
      },
      {
        name: "Thanksgiving",
        date: "11-23",
        description: "Day of Gratitude",
        category: "secular",
        color: "#ffb347",
      },
      {
        name: "Valentine's Day",
        date: "02-14",
        description: "Day of Love",
        category: "secular",
        color: "#ff6b9d",
      },
    ];
  }

  getFestivalsForDate(date: string): Festival[] {
    const monthDay = date.substring(5); // Extract MM-DD from YYYY-MM-DD
    return this.festivals.filter((festival) => festival.date === monthDay);
  }

  getFestivalsForMonth(month: number): Festival[] {
    const monthStr = (month + 1).toString().padStart(2, "0");
    return this.festivals.filter((festival) =>
      festival.date.startsWith(monthStr),
    );
  }

  // Reminders
  private scheduleEventReminder(event: CalendarEvent): void {
    if (!event.reminderMinutes || event.reminderMinutes <= 0) return;

    const eventDateTime = new Date(`${event.date} ${event.time || "00:00"}`);
    const reminderTime = new Date(
      eventDateTime.getTime() - event.reminderMinutes * 60 * 1000,
    );
    const now = new Date();

    if (reminderTime <= now) return; // Past reminder time

    // Clear existing reminder
    const existingTimeout = this.reminderTimeouts.get(event.id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Schedule new reminder
    const timeout = setTimeout(() => {
      this.triggerEventReminder(event);
      this.reminderTimeouts.delete(event.id);
    }, reminderTime.getTime() - now.getTime());

    this.reminderTimeouts.set(event.id, timeout);
  }

  private async triggerEventReminder(event: CalendarEvent): Promise<void> {
    const timeStr = event.time ? ` at ${event.time}` : "";
    const message = `${event.title}${timeStr}${event.description ? " - " + event.description : ""}`;

    await notificationService.showCalendarEvent(
      {
        id: event.id,
        title: event.title,
        description: event.description,
      },
      () => {
        // Focus calendar app when notification is clicked
        window.focus();
      },
    );
  }

  private checkReminders(): void {
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const currentDateStr = now.toISOString().split("T")[0];

    // Check for events that need immediate reminders
    this.events.forEach((event) => {
      if (
        event.date === currentDateStr &&
        event.time === currentTimeStr &&
        event.reminderMinutes === 0
      ) {
        this.triggerEventReminder(event);
      }
    });
  }

  private scheduleReminders(): void {
    this.events.forEach((event) => {
      this.scheduleEventReminder(event);
    });
  }

  // Recurring Events
  private createRecurringEvents(baseEvent: CalendarEvent): void {
    if (
      !baseEvent.isRecurring ||
      !baseEvent.recurringType ||
      !baseEvent.recurringEnd
    )
      return;

    const startDate = new Date(baseEvent.date);
    const endDate = new Date(baseEvent.recurringEnd);
    const events: CalendarEvent[] = [];

    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 1); // Start from next occurrence

    while (currentDate <= endDate) {
      const newEvent: CalendarEvent = {
        ...baseEvent,
        id: `${baseEvent.id}-recurring-${currentDate.toISOString().split("T")[0]}`,
        date: currentDate.toISOString().split("T")[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      events.push(newEvent);

      // Increment date based on recurring type
      switch (baseEvent.recurringType) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "yearly":
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
    }

    this.events.push(...events);
    this.saveEvents();

    // Schedule reminders for new events
    events.forEach((event) => {
      this.scheduleEventReminder(event);
    });
  }

  // Calendar Navigation
  getCalendarData(year: number, month: number) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    // Previous month padding
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const dateStr = `${prevYear}-${(prevMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      days.push({
        day,
        date: dateStr,
        isCurrentMonth: false,
        isToday: false,
        events: this.getEventsForDate(dateStr),
        festivals: this.getFestivalsForDate(dateStr),
      });
    }

    // Current month days
    const today = new Date().toISOString().split("T")[0];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      days.push({
        day,
        date: dateStr,
        isCurrentMonth: true,
        isToday: dateStr === today,
        events: this.getEventsForDate(dateStr),
        festivals: this.getFestivalsForDate(dateStr),
      });
    }

    // Next month padding
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let day = 1; day <= remainingDays; day++) {
      const dateStr = `${nextYear}-${(nextMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      days.push({
        day,
        date: dateStr,
        isCurrentMonth: false,
        isToday: false,
        events: this.getEventsForDate(dateStr),
        festivals: this.getFestivalsForDate(dateStr),
      });
    }

    return days;
  }

  // Storage
  private loadEvents(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored).map((event: any) => ({
          ...event,
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
        }));
      }
    } catch (error) {
      console.error("Error loading calendar events:", error);
      this.events = [];
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.error("Error saving calendar events:", error);
    }
  }

  // Utilities
  getUpcomingEvents(days: number = 7): CalendarEvent[] {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);

    return this.events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= future;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  searchEvents(query: string): CalendarEvent[] {
    const lowerQuery = query.toLowerCase();
    return this.events.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerQuery) ||
        (event.description &&
          event.description.toLowerCase().includes(lowerQuery)),
    );
  }

  exportCalendar(): string {
    return JSON.stringify(
      {
        events: this.events,
        exportDate: new Date().toISOString(),
      },
      null,
      2,
    );
  }

  importCalendar(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.events && Array.isArray(data.events)) {
        this.events = data.events.map((event: any) => ({
          ...event,
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
        }));
        this.saveEvents();
        this.scheduleReminders();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error importing calendar:", error);
      return false;
    }
  }

  cleanup(): void {
    // Clear all reminder timeouts
    this.reminderTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.reminderTimeouts.clear();
  }
}

export const calendarService = CalendarService.getInstance();

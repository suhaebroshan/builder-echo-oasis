import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ResizableWindow } from "../ResizableWindow";
import { cn } from "../../lib/utils";
import { calendarService, type CalendarEvent } from "../../services/calendar";

type ViewMode = "month" | "week" | "day";

interface CalendarDay {
  day: number;
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  festivals: any[];
}

export function CalendarApp() {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    isAllDay: false,
    category: "personal" as CalendarEvent["category"],
    color: "#3b82f6",
    reminderMinutes: 15,
    isRecurring: false,
    recurringType: "weekly" as CalendarEvent["recurringType"],
    recurringEnd: "",
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const categoryColors = {
    personal: "#3b82f6",
    work: "#ef4444",
    holiday: "#10b981",
    birthday: "#f59e0b",
    reminder: "#8b5cf6",
    meeting: "#06b6d4",
  };

  useEffect(() => {
    loadCalendarData();
    loadEvents();
  }, [currentDate, viewMode]);

  useEffect(() => {
    if (selectedDate && !newEvent.date) {
      setNewEvent((prev) => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  const loadCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const data = calendarService.getCalendarData(year, month);
    setCalendarData(data);
  };

  const loadEvents = () => {
    setEvents(calendarService.getEvents());
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowEventForm(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description || "",
      date: event.date,
      time: event.time || "",
      endTime: event.endTime || "",
      isAllDay: event.isAllDay,
      category: event.category,
      color: event.color,
      reminderMinutes: event.reminderMinutes || 15,
      isRecurring: event.isRecurring,
      recurringType: event.recurringType || "weekly",
      recurringEnd: event.recurringEnd || "",
    });
    setShowEventForm(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const eventData = {
      ...newEvent,
      color: categoryColors[newEvent.category],
    };

    if (editingEvent) {
      calendarService.updateEvent(editingEvent.id, eventData);
    } else {
      calendarService.addEvent(eventData);
    }

    setShowEventForm(false);
    setEditingEvent(null);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      endTime: "",
      isAllDay: false,
      category: "personal",
      color: "#3b82f6",
      reminderMinutes: 15,
      isRecurring: false,
      recurringType: "weekly",
      recurringEnd: "",
    });
    loadEvents();
    loadCalendarData();
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      calendarService.deleteEvent(editingEvent.id);
      setShowEventForm(false);
      setEditingEvent(null);
      loadEvents();
      loadCalendarData();
    }
  };

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-1">
      {/* Day headers */}
      {dayNames.map((day) => (
        <div
          key={day}
          className="p-2 text-center text-sm font-medium text-white/70 border-b border-white/10"
        >
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {calendarData.map((dayData, index) => (
        <div
          key={index}
          className={cn(
            "min-h-[80px] p-1 border border-white/5 hover:bg-white/5 cursor-pointer transition-colors",
            !dayData.isCurrentMonth && "opacity-40",
            dayData.isToday && "bg-blue-500/20 border-blue-500/40",
          )}
          onClick={() => handleDateClick(dayData.date)}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={cn(
                "text-sm",
                dayData.isToday
                  ? "font-bold text-blue-400"
                  : dayData.isCurrentMonth
                    ? "text-white"
                    : "text-white/40",
              )}
            >
              {dayData.day}
            </span>
            {(dayData.events.length > 0 || dayData.festivals.length > 0) && (
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
            )}
          </div>

          {/* Events */}
          <div className="space-y-1">
            {dayData.festivals.slice(0, 1).map((festival, idx) => (
              <div
                key={idx}
                className="text-xs px-1 py-0.5 rounded bg-orange-500/20 text-orange-300 truncate"
                title={festival.name}
              >
                🎉 {festival.name}
              </div>
            ))}
            {dayData.events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="text-xs px-1 py-0.5 rounded text-white truncate"
                style={{ backgroundColor: event.color + "40" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event);
                }}
                title={event.title}
              >
                {event.isAllDay ? "📅" : "⏰"} {event.title}
              </div>
            ))}
            {dayData.events.length > 2 && (
              <div className="text-xs text-white/60">
                +{dayData.events.length - 2} more
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <div className="grid grid-cols-7 gap-1 h-96">
        {weekDays.map((day, index) => {
          const dateStr = day.toISOString().split("T")[0];
          const dayEvents = calendarService.getEventsForDate(dateStr);
          const festivals = calendarService.getFestivalsForDate(dateStr);

          return (
            <div
              key={index}
              className="border border-white/10 p-2 hover:bg-white/5 cursor-pointer"
              onClick={() => handleDateClick(dateStr)}
            >
              <div className="text-sm font-medium text-white mb-2">
                {day.toLocaleDateString(undefined, {
                  weekday: "short",
                  day: "numeric",
                })}
              </div>
              <div className="space-y-1">
                {festivals.map((festival, idx) => (
                  <div
                    key={idx}
                    className="text-xs px-1 py-0.5 rounded bg-orange-500/20 text-orange-300 truncate"
                  >
                    🎉 {festival.name}
                  </div>
                ))}
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer"
                    style={{ backgroundColor: event.color + "40" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    {event.time || "All day"}: {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = currentDate.toISOString().split("T")[0];
    const dayEvents = calendarService.getEventsForDate(dateStr);
    const festivals = calendarService.getFestivalsForDate(dateStr);

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white">
            {currentDate.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </div>

        <div className="space-y-3">
          {festivals.map((festival, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-orange-500/20 border border-orange-500/40"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🎉</span>
                <div>
                  <h4 className="font-semibold text-orange-300">
                    {festival.name}
                  </h4>
                  <p className="text-sm text-orange-200">
                    {festival.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {dayEvents.length === 0 && festivals.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <div className="text-4xl mb-2">📅</div>
              <p>No events today</p>
              <button
                onClick={() => handleDateClick(dateStr)}
                className="mt-2 px-4 py-2 text-sm bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                Add Event
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {dayEvents
                .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                .map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border cursor-pointer hover:bg-white/5 transition-colors"
                    style={{
                      backgroundColor: event.color + "20",
                      borderColor: event.color + "40",
                    }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">
                          {event.title}
                        </h4>
                        {event.description && (
                          <p className="text-sm text-white/80 mt-1">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-white/60">
                          <span>
                            {event.isAllDay
                              ? "All day"
                              : `${event.time}${event.endTime ? ` - ${event.endTime}` : ""}`}
                          </span>
                          <span className="capitalize">{event.category}</span>
                          {event.reminderMinutes && (
                            <span>🔔 {event.reminderMinutes}min before</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ResizableWindow appId="calendar" title="📆 Calendar">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevious}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                →
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30 transition-colors text-sm"
              >
                Today
              </button>
            </div>

            <h2 className="text-lg font-semibold text-white">
              {viewMode === "day"
                ? currentDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            </h2>

            <div className="flex items-center gap-2">
              {["month", "week", "day"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as ViewMode)}
                  className={cn(
                    "px-3 py-1 rounded text-sm transition-colors",
                    viewMode === mode
                      ? "bg-white/20 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/10",
                  )}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === "month" && renderMonthView()}
          {viewMode === "week" && renderWeekView()}
          {viewMode === "day" && renderDayView()}
        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md mx-4 p-6 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingEvent ? "Edit Event" : "Create Event"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Event title"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Event description"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Category
                    </label>
                    <select
                      value={newEvent.category}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          category: e.target.value as CalendarEvent["category"],
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                      <option value="meeting">Meeting</option>
                      <option value="birthday">Birthday</option>
                      <option value="reminder">Reminder</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-white/70">
                    <input
                      type="checkbox"
                      checked={newEvent.isAllDay}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          isAllDay: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    All day
                  </label>
                </div>

                {!newEvent.isAllDay && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-white/70 mb-1">
                        Start time
                      </label>
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            time: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/70 mb-1">
                        End time
                      </label>
                      <input
                        type="time"
                        value={newEvent.endTime}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-white/70 mb-1">
                    Reminder (minutes before)
                  </label>
                  <select
                    value={newEvent.reminderMinutes}
                    onChange={(e) =>
                      setNewEvent((prev) => ({
                        ...prev,
                        reminderMinutes: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value={0}>No reminder</option>
                    <option value={5}>5 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={1440}>1 day</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-white/70">
                    <input
                      type="checkbox"
                      checked={newEvent.isRecurring}
                      onChange={(e) =>
                        setNewEvent((prev) => ({
                          ...prev,
                          isRecurring: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    Recurring
                  </label>
                </div>

                {newEvent.isRecurring && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-white/70 mb-1">
                        Repeat
                      </label>
                      <select
                        value={newEvent.recurringType}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            recurringType: e.target
                              .value as CalendarEvent["recurringType"],
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-white/70 mb-1">
                        Until
                      </label>
                      <input
                        type="date"
                        value={newEvent.recurringEnd}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            recurringEnd: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSaveEvent}
                    disabled={!newEvent.title || !newEvent.date}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {editingEvent ? "Update" : "Create"}
                  </button>

                  {editingEvent && (
                    <button
                      onClick={handleDeleteEvent}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowEventForm(false);
                      setEditingEvent(null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResizableWindow>
  );
}

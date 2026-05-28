import React, { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addHours,
  addDays,
  addYears,
  subYears,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import axiosInstance from "../../../app/axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarPage.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

const emptyForm = {
  title: "",
  description: "",
  location: "",
  start: "",
  end: "",
};

const toInputDate = (date) => format(date, "yyyy-MM-dd'T'HH:mm");
const toDateInput = (date) => format(date, "yyyy-MM-dd");

function CalendarToolbar({ date, label, onNavigate, onView, view }) {
  const jumpToDate = (event) => {
    if (!event.target.value) return;
    onNavigate("DATE", new Date(`${event.target.value}T12:00:00`));
  };

  return (
    <div className="guest-calendar-toolbar">
      <div className="calendar-nav-group" aria-label="Calendar navigation">
        <button type="button" onClick={() => onNavigate("DATE", subYears(date, 1))}>
          Previous Year
        </button>
        <button type="button" onClick={() => onNavigate("PREV")}>
          Previous
        </button>
        <button type="button" onClick={() => onNavigate("TODAY")}>
          Today
        </button>
        <button type="button" onClick={() => onNavigate("NEXT")}>
          Next
        </button>
        <button type="button" onClick={() => onNavigate("DATE", addYears(date, 1))}>
          Next Year
        </button>
      </div>

      <div className="calendar-current-date" aria-live="polite">
        {label}
      </div>

      <div className="calendar-tools-group">
        <label className="calendar-jump-control">
          Jump to
          <input type="date" value={toDateInput(date)} onChange={jumpToDate} />
        </label>
        <div className="calendar-view-switch" aria-label="Calendar view">
          {["month", "week", "day"].map((viewName) => (
            <button
              key={viewName}
              type="button"
              className={view === viewName ? "is-active" : ""}
              onClick={() => onView(viewName)}
            >
              {viewName[0].toUpperCase() + viewName.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        'Calendar ready. Try "Add Meenakshi temple visit tomorrow at 10 AM" or click a slot to create an event.',
    },
  ]);

  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      })),
    [events]
  );

  const openEventForm = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      start: toInputDate(new Date(event.start)),
      end: toInputDate(new Date(event.end)),
    });
    setShowModal(true);
  };

  const handleSelectSlot = ({ start, end }) => {
    openEventForm({
      id: null,
      title: "",
      description: "",
      location: "",
      start,
      end,
      isNew: true,
    });
  };

  const saveEvent = (e) => {
    e.preventDefault();
    const eventData = {
      id: selectedEvent?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      start: new Date(formData.start).toISOString(),
      end: new Date(formData.end).toISOString(),
    };

    setEvents((prev) => {
      if (selectedEvent?.id) {
        return prev.map((item) => (item.id === selectedEvent.id ? eventData : item));
      }
      return [...prev, eventData];
    });
    setShowModal(false);
  };

  const deleteEvent = () => {
    if (selectedEvent?.id) {
      setEvents((prev) => prev.filter((item) => item.id !== selectedEvent.id));
    }
    setShowModal(false);
  };

  const inferStartDate = (text) => {
    const now = new Date();
    let start = addHours(now, 1);
    const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);

    if (dateMatch) {
      start = new Date(`${dateMatch[0]}T10:00:00`);
    } else if (text.includes("tomorrow")) {
      start = addDays(now, 1);
    }

    const hourMatch = text.match(/(\d{1,2})\s*(am|pm)?/i);
    if (hourMatch) {
      let hour = Number(hourMatch[1]);
      const meridiem = hourMatch[2]?.toLowerCase();
      if (meridiem === "pm" && hour < 12) hour += 12;
      if (meridiem === "am" && hour === 12) hour = 0;
      start.setHours(hour, 0, 0, 0);
    } else {
      start.setHours(10, 0, 0, 0);
    }

    return start;
  };

  const eventFromAction = (payload, sourceText) => {
    const dateHint = payload.dateHint || sourceText;
    const start = inferStartDate(`${dateHint} at ${payload.hourHint || "10 AM"}`);
    const end = addHours(start, Number(payload.durationHours) || 2);

    return {
      id: Date.now().toString(),
      title: payload.title || "Cultural site visit",
      description:
        payload.description || "Created by the guest calendar assistant",
      location: payload.location || "",
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };

  const applyCalendarAction = (action, sourceText) => {
    if (!action || action.type === "NONE") return;

    if (action.type === "CLEAR_EVENTS") {
      setEvents([]);
      return;
    }

    if (action.type === "CREATE_EVENT") {
      setEvents((prev) => [
        ...prev,
        eventFromAction(action.payload || {}, sourceText),
      ]);
    }
  };

  const handleLocalCalendarChat = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes("delete") || lower.includes("clear")) {
      setEvents([]);
      return "I cleared the calendar events for this browser session.";
    }

    if (
      lower.includes("add") ||
      lower.includes("create") ||
      lower.includes("visit")
    ) {
      const start = inferStartDate(lower);
      const end = addHours(start, 2);
      const title = text
        .replace(/add|create/gi, "")
        .replace(/tomorrow|today|at\s+\d{1,2}\s*(am|pm)?/gi, "")
        .trim();

      const event = {
        id: Date.now().toString(),
        title: title || "Cultural site visit",
        description: "Created by calendar assistant",
        location: "",
        start: start.toISOString(),
        end: end.toISOString(),
      };

      setEvents((prev) => [...prev, event]);
      return `Added "${event.title}" on ${start.toLocaleString()}. This event resets on refresh.`;
    }

    return "I can add or clear events. Try: Add Brihadeeswarar temple visit tomorrow at 10 AM.";
  };

  const handleCalendarChat = async (e) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    setChatMessages((prev) => [...prev, { role: "user", content: text }]);
    setChatInput("");

    try {
      const response = await axiosInstance.post("/api/guest/calendar-chat", {
        message: text,
        events,
        history: chatMessages.map((item) => ({
          role: item.role,
          content: item.content,
        })),
      });

      applyCalendarAction(response.data.action, text);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.message,
        },
      ]);
    } catch (error) {
      const fallbackMessage = handleLocalCalendarChat(text);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallbackMessage,
        },
      ]);
    }
  };

  return (
    <Container fluid className="calendar-page">
      <Row className="h-100">
        <Col md={8} className="calendar-view-col">
          <div className="calendar-view-container p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="mb-0">Travel Calendar</h2>
              <span className="badge bg-success">Guest Session</span>
            </div>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              date={calendarDate}
              view={calendarView}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 520 }}
              onNavigate={setCalendarDate}
              onView={setCalendarView}
              onSelectEvent={openEventForm}
              onSelectSlot={handleSelectSlot}
              components={{ toolbar: CalendarToolbar }}
              selectable
              popup
              views={["month", "week", "day"]}
            />
          </div>
        </Col>
        <Col md={4} className="chat-col">
          <div className="card h-100">
            <div className="card-header">Calendar Assistant</div>
            <div className="card-body d-flex flex-column">
              <div className="messages-container mb-3 flex-grow-1 overflow-auto">
                {chatMessages.map((item, index) => (
                  <div
                    key={index}
                    className={`message ${
                      item.role === "user" ? "user-message" : "ai-message"
                    }`}
                  >
                    {item.content}
                  </div>
                ))}
              </div>
              <Form onSubmit={handleCalendarChat} className="d-flex gap-2">
                <Form.Control
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Add a temple visit..."
                />
                <Button type="submit">Send</Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.id ? "Edit Event" : "Create Event"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={saveEvent}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Start</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formData.start}
                    onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>End</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formData.end}
                    onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            {selectedEvent?.id && (
              <Button variant="danger" onClick={deleteEvent} className="me-auto">
                Delete
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default CalendarPage;

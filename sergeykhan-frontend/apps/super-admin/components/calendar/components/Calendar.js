'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
export default function Calendar() {
    const [events, setEvents] = useState([
        { title: 'Рабочая встреча', start: '2024-03-10T10:00:00', end: '2024-03-10T12:00:00', color: '#6366F1' }
    ]);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleDateClick = (arg) => {
        setSelectedDate(arg.date);
        setIsDialogOpen(true);
    };
    const addEvent = () => {
        if (newEventTitle && selectedDate) {
            setEvents([...events, { title: newEventTitle, start: selectedDate, allDay: false, color: '#F87171' }]);
            setNewEventTitle("");
            setSelectedDate(null);
            setIsDialogOpen(false);
        }
    };
    return (<div className="calendar-container">
      <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView="timeGridWeek" events={events} selectable dateClick={handleDateClick} editable droppable height="auto" headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }} buttonText={{
            today: 'Сегодня',
            month: 'Месяц',
            week: 'Неделя',
            day: 'День'
        }}/>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новое событие</DialogTitle>
          </DialogHeader>
          <Input type="text" placeholder="Название события" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)}/>
          <Button onClick={addEvent} className="mt-2">Добавить</Button>
        </DialogContent>
      </Dialog>
    </div>);
}

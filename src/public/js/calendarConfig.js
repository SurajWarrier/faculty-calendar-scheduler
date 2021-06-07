document.addEventListener('DOMContentLoaded', async function() {
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        slotDuration: '01:00',
        editable: true,
        dayMaxEventRows: true,
        nowIndicator: true,
        expandRows: true,
        slotEventOverlap: false,
        fixedWeekCount: false,
        headerToolbar: {
            left: 'dayGridMonth,timeGridWeek,listWeek',
            center: 'title,addEventButton',
            right: 'today prev,next'
        },
        customButtons: {
            addEventButton: {
                text: 'Schedule Event',
                click: function() {
                    let dateStr = prompt('Enter a date in YYYY-MM-DD format');
                    let startTime = prompt('Enter the start time in the format 00:00:00');
                    let endTime = prompt('Enter the end time in the format 00:00:00');
                    let start = dateStr.concat('T', startTime);
                    let end = dateStr.concat('T', endTime)
                    //let start = new Date(dateStr + startTime); // will be in local time
                    //let end = new Date(dateStr + endTime);
                    let title = prompt('Enter the title');

                    if (start && end) { // valid?
                        scheduleEvents(title, start, end)
                            .then(calendar.addEvent({
                                title: title,
                                start: start,
                                end: end,
                                allDay: false
                            }));

                        alert('Great. Event scheduled');
                    }
                    else {
                        alert('Invalid date.');
                    }
                }
            }
        },
        eventChange: async function(info) {
            const response = await fetch('/updateEvent', {
                method: 'POST',
                body: JSON.stringify({eno: info.event.id, title: info.event.title, start: info.event.start, end: info.event.end}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(response);
            return response;
        },
        events: await retrEvents()
    });

    console.log(calendar.getEvents());
    /*
    // batch every modification into one re-render
    calendar.batchRendering(async () => {
        // remove all events
        calendar.getEvents().forEach(event => event.remove());
        let newEvents = await retrEvents();
        // add your new events
        newEvents.forEach(event => calendar.addEvent(event));
    });
     */

    calendar.render();



    async function retrEvents() {
        const response = await fetch('/getEvents');
        console.log(response);
        const json = await response.json();
        console.log(json);
        let events = [];
        json.forEach(function(item) {
            events.push({id: item.eno, title: item.title, start: item.start, end: item.end});
        });
        console.log(events);
        return events;
    }

    async function scheduleEvents(title, start, end) {
        const response = await fetch('/addEvents',{
            method: 'POST',
            body: JSON.stringify({title: title, start: start, end: end}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        return response;
    }
});


document.addEventListener('DOMContentLoaded', function() {
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            center: 'addEventButton'
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

                        calendar.addEvent({
                            title: title,
                            start: start,
                            end: end,
                            allDay: false
                        });
                        alert('Great. Event scheduled');
                    }
                    else {
                        alert('Invalid date.');
                    }
                }
            }
        },
        events: retrEvents()
    });

    // batch every modification into one re-render
    calendar.batchRendering(async () => {
        // remove all events
        calendar.getEvents().forEach(event => event.remove());
        let newEvents = await retrEvents();
        // add your new events
        newEvents.forEach(event => calendar.addEvent(event));
    });

    calendar.render();

    console.log(calendar.getEvents());

    async function retrEvents() {
        const response = await fetch('/getEvents');
        console.log(response);
        const json = await response.json();
        console.log(json);
        //let i = 0;
        let events = [];
        json.forEach(function(item) {
            events.push({title: item.title, start: item.start, end: item.end});
        });
        console.log(events);
        return events;
    }
/*
    async function scheduleEvents(title, start, end) {
        const response = await fetch('/addEvents',{
            method: 'post',
            body: JSON.stringify({calno: curUserId, title: title, start: start, end: end})
        });
    }
 */

});


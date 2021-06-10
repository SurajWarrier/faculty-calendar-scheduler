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
        eventDurationEditable: true,
        headerToolbar: {
            left: 'dayGridMonth,timeGridWeek,listWeek',
            center: 'title',
            right: 'addEventButton removeEventButton today prev,next'
        },
        customButtons: {
            addEventButton: {
                text: 'Schedule Event',
                click: async function() {
                    let modal = document.getElementById("myModal");
                    let span = document.getElementsByClassName("close")[0];
                    $(function () {
                        $('#datetimepicker1').datetimepicker({
                            format: "YYYY-MM-DD HH:mm:ss",
                            minDate: formatDate(new Date())
                        });
                        $('#datetimepicker2').datetimepicker({
                            format: "YYYY-MM-DD HH:mm:ss",
                            minDate: formatDate(new Date())
                        });
                    });
                    modal.style.display = "block";
                    span.onclick = function() {
                        modal.style.display = "none";
                    }
                    window.onclick = function(mEvent) {
                        if (mEvent.target === modal) {
                            modal.style.display = "none";
                        }
                    }
                    const form = document.getElementById("form-to-add-event");
                    form.addEventListener("submit", handleFormSubmit);
                    //let monthNames = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" ];
                    //let today = new Date();
                    //let dateStr = prompt("Please enter date.", today.getFullYear()+"-"+monthNames[today.getMonth()]+"-"+today.getDate());
                    /*
                    if (dateStr != null) {
                        let hh = today.getHours();
                        let mm = today.getMinutes();
                        let ss = today.getSeconds();
                        let startTime = prompt('Enter the start time in the format 00:00:00', hh.toString()+":"+mm.toString()+":"+ss.toString());
                        if (startTime != null) {

                        }
                    }
                     */
                    /*
                    let dateStr = prompt('Enter a date in YYYY-MM-DD format');
                    let startTime = prompt('Enter the start time in the format 00:00:00')
                    let endTime = prompt('Enter the end time in the format 00:00:00');
                    let start = dateStr.concat('T', startTime);
                    let end = dateStr.concat('T', endTime);
                    //let start = new Date(dateStr + startTime); // will be in local time
                    //let end = new Date(dateStr + endTime);
                    let title = prompt('Enter the title');

                    if (start && end) { // valid?
                        const response1 = await scheduleEvents(title, start, end);
                        console.log(response1);
                        let params = {title: title};
                        let query = Object.keys(params)
                            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                            .join('&');
                        let url = '/getId?' + query;
                        console.log(url);
                        const response2 = await fetch(url);
                        console.log(response2);
                        const json = await response2.json();
                        console.log(json);
                        console.log(json[0].eno);
                        const eno = json[0].eno;
                        calendar.addEvent({
                            id: eno,
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

                     */
                }
            },
            removeEventButton: {
                text: 'Remove event',
                click: function() {
                    let title = prompt('Enter the title of the event to be deleted');
                    if (title.length !== 0) {
                        let eno;
                        let i;
                        let eventList = calendar.getEvents();
                        console.log(eventList);
                        for(i = 0; i < eventList.length; i++) {
                            console.log(eventList[i].title);
                            if (eventList[i].title === title) {
                                console.log(eventList[i].id);
                                eno = eventList[i].id;
                                break;
                            }
                        }
                        removeEvent(eno)
                            .then( (r) => {
                                console.log(r);
                                const e = calendar.getEventById(eno);
                                console.log(e);
                                e.remove();
                                console.log("Event removed from the calendar");
                            })
                            .catch( (error) => {
                                console.error(("error: ", error));
                            })
                    }
                }
            }
        },
        eventClick: function(info) {
            alert("Event " + info.event.title);
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
        events: await retrEvents(),
        eventTimeFormat: { // like '14:30:00'
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
        },
        eventColor: 'red',
        eventBackgroundColor: 'red',
        eventBorderColor: 'black',
        eventTextColor: 'white'
    });

    console.log(calendar.getEvents());
    console.log(calendar.getEventById(25))
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

    async function removeEvent(eno) {
        /*
        const response = await fetch('/deleteEvent', {
            method: 'POST',
            body: JSON.stringify({eno: eno}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
         */
        fetch('/deleteEvent', {
            method: 'POST',
            body: JSON.stringify({eno: eno}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch((error) => {
                console.error("error: ", error);
            })
        //console.log("hellloooo");
        //console.log(response);
        //return response;
    }

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }


    async function postFormDataAsJson({ url, formData }) {
        const plainFormData = Object.fromEntries(formData.entries());
        const formDataJsonString = JSON.stringify(plainFormData);
        console.log(plainFormData.title);
        console.log(formDataJsonString);

        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: formDataJsonString,
        };

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        let params = {title: plainFormData.title};
        let query = Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
        let idUrl = '/getId?' + query;
        console.log(idUrl);
        const response2 = await fetch(idUrl);
        console.log(response2);
        const json = await response2.json();
        console.log(json);
        console.log(json[0].eno);
        const eno = json[0].eno;
        const title = plainFormData.title;
        const start = plainFormData.start.replace(/\s/g, 'T')
        const end = plainFormData.end.replace(/\s/g, 'T')
        console.log(start, end);
        calendar.addEvent({
            id: eno,
            title: title,
            start: start,
            end: end,
            allDay: false
        });
        return response.json();
    }


    async function handleFormSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        const url = form.action;
        console.log(url);

        try {
            const formData = new FormData(form);
            const responseData = await postFormDataAsJson({ url, formData });

            console.log({ responseData });
        }
        catch (error) {
            console.error(error);
        }
    }

});


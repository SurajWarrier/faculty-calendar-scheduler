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
                    let modal = document.getElementById("addEventModal");
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
                    form.addEventListener("submit", handleAddFormSubmit);
                }
            },
            removeEventButton: {
                text: 'Remove event',
                click: function() {
                    let modal = document.getElementById("removeEventModal");
                    let span = document.getElementsByClassName("close")[0];
                    $(function () {
                        $('#datetimepicker3').datetimepicker({
                            format: "YYYY-MM-DD HH:mm:ss",
                            minDate: formatDate(new Date())
                        });
                        $('#datetimepicker4').datetimepicker({
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
                    const form = document.getElementById("form-to-delete-event");
                    form.addEventListener("submit", handleDeleteFormSubmit);
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


    async function postAddFormDataAsJson({ url, formData }) {
        const plainAddFormData = Object.fromEntries(formData.entries());
        const addFormDataJsonString = JSON.stringify(plainAddFormData);
        console.log(plainAddFormData.title);
        console.log(addFormDataJsonString);

        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: addFormDataJsonString,
        };

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        let params = {title: plainAddFormData.title};
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
        const title = plainAddFormData.title;
        const start = plainAddFormData.start.replace(/\s/g, 'T')
        const end = plainAddFormData.end.replace(/\s/g, 'T')
        console.log(start, end);
        calendar.addEvent({
            id: eno,
            title: title,
            start: start,
            end: end,
            allDay: false
        });

    }


    async function handleAddFormSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        const url = form.action;
        console.log(url);

        try {
            const formData = new FormData(form);
            const responseData = await postAddFormDataAsJson({ url, formData });

            console.log({ responseData });
        }
        catch (error) {
            console.error(error);
        }
    }

    async function postDeleteFormDataAsJson({ url, formData }) {
        const plainDeleteFormData = Object.fromEntries(formData.entries());
        console.log(plainDeleteFormData);
        const deleteFormDataJsonString = JSON.stringify(plainDeleteFormData);
        console.log(deleteFormDataJsonString);
        let eno;
        let i;
        let eventList = calendar.getEvents();
        console.log(eventList);
        for(i = 0; i < eventList.length; i++) {
            console.log(eventList[i].title);
            if (eventList[i].title === plainDeleteFormData.title) {
                console.log(eventList[i].id);
                eno = eventList[i].id;
                break;
            }
        }

        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({eno: eno})
        };

        const response = await fetch(url, fetchOptions)
        console.log(response);
        const e = calendar.getEventById(eno);
        console.log(e);
        e.remove();
        console.log("Event removed from the calendar");
    }


    async function handleDeleteFormSubmit(event) {

        event.preventDefault();

        const form = event.currentTarget;
        const url = form.action;
        console.log(url);

        try {
            const formData = new FormData(form);
            const responseData = await postDeleteFormDataAsJson({ url, formData });

            console.log({ responseData });
        }
        catch (error) {
            console.error(error);
        }
    }

});


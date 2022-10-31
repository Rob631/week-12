class Flight{
    constructor(number){
        this.number = number
        this.passenger = []
    }
    addPassenger(name,zone){
        this.passenger.push(new Passenger(name,zone));
    }
}

class Passenger{
    constructor(name, zone){
        this.name = name;
        this.zone = zone;
    }
}

class FlightService {
    static url = 'https://63534a9ca9f3f34c37505d0a.mockapi.io/Flights/users';

    static getAllFlights() {
        return $.get(this.url)
    }
    static getFlight(id){
        return $.get(this.url + `/${id}`);
    }
    static createFlight(flight) {
        return $.post(this.url, flight);
    }
    static updateFlight(flight){
        return $.ajax({
            url: this.url + `/${flight.id}`,
            dataType: 'json',
            data: JSON.stringify(flight),
            Type: 'PUT'
        })
    }
    static deleteFlight(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        })
    }
}

class DOMManager{
    static flights;

    static getAllFlights(){
        FlightService.getAllFlights().then(flights => this.render(flights));
    };

    static createFlight(id){
        FlightService.createFlight(new Flight(id))
            .then(() =>{
                return FlightService.getAllFlights();
            })
            .then((flights) => this.render(flights))
    };

    static deleteFlight(id){
        FlightService.deleteFlight(id)
            .then(() =>{
                return FlightService.getAllFlights();
            })
            .then((flights) => this.render(flights));
    };

    static addPassenger(id) {
        for (let flight of this.flights){
            if(flight.id == id){
                flight.passenger.push(new Passenger($(`#${flight.id}-passenger-name`).val(), $(`#${flight.id}-passenger-zone`).val()));
                FlightService.updateFlight(flight)
                    .then(() =>{
                    return FlightService.getAllFlights();
                    })
                    .then((flights) => this.render(flights));
            }   
        }
    }

    static deletePassenger(flightId, passengerId){
        for(let flight of this.flights){
            if(flight.id == flightId){
                for(let passenger of flight.passenger){
                    if(passenger.id == passengerId){
                        flight.passengers.splice(flight.passengers.indexOf(passenger,1));
                        FlightService.updateFlight(flight)
                        .then(() =>{
                            return FlightService.getAllFlights();
                        })
                        .then((flights) => this.render(flights));
                    }
                }
            }
        }
    }

    static render(flights) {
        this.flights = flights;
        $('#app').empty();
        for(let flight of flights) {
            $('#app').prepend(
                `<div id= ${flight.id} class="card">
                    <div class="card-header">
                     <h2>${flight.number}</h2>
                     <button class= "btn btn-danger" onclick="DOMManager.deleteFlight('${flight.id}')">Delete Flight</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${flight.id}-passenger-name" class="form-control" placeholder="Passenger Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${flight.id}-passenger-zone" class="form-control" placeholder="Passenger Zone">
                                </div>
                            </div>
                            <button id="${flight.id}-new-passenger" onclick="DOMManager.addPassenger('${flight.id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>
                `
            );
            for(let passenger of flight.passenger){
                $(`#${flight.id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${passenger.id}"><strong> Name: </strong> ${passenger.name}</span>
                        <span id="name-${passenger.id}"><strong> Zone: </strong> ${passenger.zone}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deletePassenger('${flight.id}', '${passenger.id}')">Delete Passenger</button>
                    `
                )
            }
        }
    }
}

$('#create-new-flight-name').click(() =>{
    DOMManager.createFlight($('#new-flight-name').val());
    $('#new-flight-name').val('');
})

DOMManager.getAllFlights();

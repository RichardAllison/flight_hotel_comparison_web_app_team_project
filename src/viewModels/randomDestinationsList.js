const RandomDestinationsList = function(options) {
  this.depart   = options.flights[0].departure_date;
  this.return   = options.flights[0].return_date;
  this.flights  = options.flights;
  this.searchResultView = document.getElementById('destination-list');
  this.onFlightClick    = options.callback;

  this.clearSearchResultView()
  this.addTitle();
  this.populateView();
}

RandomDestinationsList.prototype.clearSearchResultView = function () {
  this.searchResultView.innerHTML = '';
}

RandomDestinationsList.prototype.addTitle = function() {
  const title = document.createElement('h2');
  title.id    = 'destination-list-title';
  title.innerText = `Destinations available for depart date:
                    ${this.depart}, returning: ${this.return}`;
  this.searchResultView.appendChild(title);
}

RandomDestinationsList.prototype.populateView = function() {
  this.flights.forEach(flightDetails, index => this.addDestination(flightDetails, index));
}

RandomDestinationsList.prototype.addDestination = function(flightDetails, index) {
  const destinationUl = document.createElement('ul');
  destinationUl.classList.add('random-destination-item');
  
  const radioButton = document.createElement('input');
  radioButton.type  = 'radio';
  radioButton.id    = `destination-radio-${index}`;

  const radioButtonLabel = document.createElement('label');
  radioButtonLabel.for   = radioButton.id;
  radioButtonLabel.innerText = flightDetails.destination;

  this.destinationUl.appendChild(radioButton);
  this.destinationUl.appendChild(radioButtonLabel);

  this.searchResultView.appendChild(destinationUl);
}

module.exports = RandomDestinationsList;

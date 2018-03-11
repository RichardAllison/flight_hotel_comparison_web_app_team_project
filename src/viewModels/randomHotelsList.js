const RandomHotelsList = function(options) {
  this.hotels             = options.hotelObjectsFromAPIQuery;
  this.parentHtmlElement  = options.parentElementToAttachHotels;
  this.hotelsList         = null;

  if(options.populatePackageViewCallback !== undefined) {
    this.onHotelClick     = options.populatePackageViewCallback;
  }

  this.checkIfHotelListsExist();
}

RandomHotelsList.prototype.checkIfHotelListsExist = function () {

  // finds all html elements with the 'hotels-list' class
  const existingHotelListsHtmlCollection = document.getElementsByClassName('hotels-list');
  // transforms the above returned HTML Collection into an Array
  const existingHotelListsAsArray = Array.from(existingHotelListsHtmlCollection);

  if (existingHotelListsAsArray.length === 0) {
    this.setupView();
  } else {
    this.findIfParentHtmlElementContainsAnExistingHotelList(existingHotelListsAsArray);
  }
}

RandomHotelsList.prototype.findIfParentHtmlElementContainsAnExistingHotelList = function (arrayOfExistingHotelLists) {

  arrayOfExistingHotelLists.forEach(hotelList => {
    if(this.parentHtmlElement.contains(hotelList)){
      this.parentHtmlElement.removeChild(hotelList)
    }
  })
  this.setupView();
}

RandomHotelsList.prototype.setupView = function () {
  this.createHotelsList();
  this.addHeading();
  this.populateHotelsList();
};

RandomHotelsList.prototype.createHotelsList = function () {

  this.hotelsList = document.createElement('ul');
  this.hotelsList.classList.add('hotels-list');

  this.parentHtmlElement.appendChild(this.hotelsList);
}

RandomHotelsList.prototype.addHeading = function () {
  const heading = document.createElement('h2');

  heading.classList.add('hotels-list-title');
  if(this.hotels.length > 1) {
    heading.innerText = 'Available Hotels';
  } else if (this.hotels.length == 1){
    heading.innerText = 'Hotel'
  } else {
    heading.innerText = 'No Open Hotels Found'
  }

  this.hotelsList.appendChild(heading);
}

RandomHotelsList.prototype.populateHotelsList = function () {

  // const MapWrapper = require('../helpers/mapWrapper.js');
  // this.mapDiv = document.createElement('div');
  // this.mapDiv.id = 'hotels-map'
  // this.parentHtmlElement.appendChild(this.mapDiv);
  // const coords = {lat: this.hotels[0].location.latitude, lng: this.hotels[0].location.longitude}
  // this.hotelsMap =  new MapWrapper(this.mapDiv, coords, 8);
  this.hotels.forEach(hotelDetails => this.addHotelTile(hotelDetails));
}

RandomHotelsList.prototype.addHotelTile = function (hotel) {
  // const coords = {lat: hotel.location.latitude, lng: hotel.location.longitude}
  // const map = document.getElementById('hotels-map').;
  // map.addMarker(coords);

  const hotelTable = document.createElement('table');
  hotelTable.classList.add('destination-hotel-item');

  // hotel information
  const nameRow       = document.createElement('tr');
  nameRow.classList.add('hotel-name');
  const nameCell1     = document.createElement('td');
  nameCell1.innerText = "Name:"
  nameCell1.classList.add('sub-main-column');
  const nameCell2     = document.createElement('td');
  nameCell2.innerText = `${hotel.property_name}`;
  nameCell2.classList.add('info-column');
  nameRow.appendChild(nameCell1);
  nameRow.appendChild(nameCell2);

  const priceRow       = document.createElement('tr');
  priceRow.classList.add('hotel-price');
  const amount         = hotel.total_price.amount;
  const currency       = hotel.total_price.currency;
  const priceCell1     = document.createElement('td');
  priceCell1.innerText = "Price:";
  priceCell1.classList.add('sub-main-column');
  const priceCell2     = document.createElement('td');
  priceCell2.innerText = `${amount} ${currency}`;
  priceCell2.classList.add('info-column');
  priceRow.appendChild(priceCell1);
  priceRow.appendChild(priceCell2);

  // Address information
  const addressRow = document.createElement('tr');
  addressRow.classList.add('hotel-address');
  const address    = hotel.address;

  const addressRowTitleCell = document.createElement('td');
  addressRowTitleCell.setAttribute('rowspan', "4");
  addressRowTitleCell.classList.add('hotel-address-title');
  addressRowTitleCell.classList.add('sub-main-column');
  addressRow.appendChild(addressRowTitleCell);
  const addressRowTitle     = document.createElement('h3');
  addressRowTitle.innerText = 'Address:';
  addressRowTitleCell.appendChild(addressRowTitle);

  const line1          = document.createElement('td');
  line1.classList.add('info-column');
  line1.innerText      = address.line1;
  addressRow.appendChild(line1);

  const cityRow        = document.createElement('tr');
  const city           = document.createElement('td');
  city.classList.add('info-column');
  city.innerText       = address.city;
  cityRow.appendChild(city);

  const postalCodeRow  = document.createElement('tr');
  const postalCode     = document.createElement('td');
  postalCode.classList.add('info-column');
  postalCode.innerText = address.postal_code;
  postalCodeRow.appendChild(postalCode);

  const countryRow     = document.createElement('tr');
  const country        = document.createElement('td');
  country.classList.add('info-column');
  country.innerText    = address.country;
  countryRow.appendChild(country);

  hotelTable.appendChild(nameRow);
  hotelTable.appendChild(priceRow);
  hotelTable.appendChild(addressRow);
  hotelTable.appendChild(cityRow);
  hotelTable.appendChild(postalCodeRow);
  hotelTable.appendChild(countryRow);

  // Room information
  // first checking if there is any room information
  const room    = hotel.rooms[0];
  if (room.room_type_info.room_type !== undefined
    || room.room_type_info.bed_type !== undefined
    || room.room_type_info.number_of_beds !== undefined) {

    const roomRow = document.createElement('tr');
    roomRow.classList.add('hotel-rooms');

    const roomRowTitleCell = document.createElement('td');
    roomRowTitleCell.setAttribute('rowspan', "3");
    roomRowTitleCell.classList.add('hotel-room-title');
    roomRowTitleCell.classList.add('sub-main-column');
    roomRow.appendChild(roomRowTitleCell);
    const roomRowTitle = document.createElement('h3');
    roomRowTitle.innerText = 'Room:';
    roomRowTitleCell.appendChild(roomRowTitle);

    if (room.room_type_info.room_type !== undefined) {
      const roomType     = document.createElement('td');
      roomType.classList.add('info-column');
      roomType.innerText = room.room_type_info.room_type;
      roomRow.appendChild(roomType);
      hotelTable.appendChild(roomRow);
    }

    if (room.room_type_info.bed_type !== undefined) {
      const bedTypeRow  = document.createElement('tr');
      const bedType     = document.createElement('td');
      bedType.classList.add('info-column');
      bedType.innerText = room.room_type_info.bed_type;
      bedTypeRow.appendChild(bedType);
      hotelTable.appendChild(bedTypeRow);
    }

    if (room.room_type_info.number_of_beds !== undefined) {
      const bedNumberRow  = document.createElement('tr');
      const bedNumber     = document.createElement('td');
      bedNumber.classList.add('info-column');
      bedNumber.innerText = room.room_type_info.number_of_beds;
      bedNumberRow.appendChild(bedNumber);
      hotelTable.appendChild(bedNumberRow);
    }

  }

  const callback = function() {
    this.onHotelClick(hotel)
  }
  if(this.onHotelClick !== undefined) {
    // contact details
    const contactsRow = document.createElement('tr');
    contactsRow.classList.add('hotel-contacts');

    const contactsRowTitleCell = document.createElement('td');
    const contactsRowTitle = document.createElement('h3');
    contactsRowTitle.classList.add('hotel-contacts-title');
    contactsRowTitle.innerText = 'Contact Details:';
    contactsRowTitleCell.appendChild(contactsRowTitle);
    contactsRow.appendChild(contactsRowTitleCell);
    hotelTable.appendChild(contactsRow);

    const contacts = hotel.contacts;
    contacts.forEach(contact => {
      const options = {contact: contact, parent: hotelTable}
      this.populateContactTile(options);
    });

    // amenities
    // awards
  }

  if(this.onHotelClick !== undefined) {
    hotelTable.tabindex="0";
    hotelTable.addEventListener('click', callback.bind(this))
  }

  this.hotelsList.appendChild(hotelTable);
}

RandomHotelsList.prototype.populateContactTile = function (options) {
  const parentView  = options.parent;
  const contact     = options.contact;

  const contactRow          = document.createElement('tr');
  const contactTypeCell     = document.createElement('td');
  contactTypeCell.innerText = `${contact.type}`;
  contactRow.appendChild(contactTypeCell);

  const contactDetailCell     = document.createElement('li');
  contactDetailCell.innerText = `${contact.detail}`;
  contactRow.appendChild(contactDetailCell);

  parentView.appendChild(contactRow);
}


module.exports = RandomHotelsList;

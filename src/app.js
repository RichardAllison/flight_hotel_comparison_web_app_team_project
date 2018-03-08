//basic setup to populate browser
const Form        = require('./viewModels/form');
const ResultsView = require('./viewModels/resultsView');
const Request     = require('./helpers/request.js');
const key         = require('./keys/amadeus-comparison-api.js');
const UrlBuilder  = require('./helpers/urlBuilder');
const SEARCH_URL  = require('./helpers/enums/searchUrlEnum');
const PackageView = require('./viewModels/packageView.js');
const ScrollTo    = require('./helpers/scrollTo.js');

const main = function() {
  prepareFormView();
}

const prepareFormView = function() {
  const form = new Form(prepareResultsView);
}

const prepareResultsView = function(InnovationSearchDataFromFormView){
  const resultsView = new ResultsView();

  listDestinations(resultsView, InnovationSearchDataFromFormView);
}


const listDestinations = function(resultsView, InnovationSearchDataFromFormView) {

  const dataForUrlForInspirationAPISearch  = InnovationSearchDataFromFormView.inspirationArray;
  const dataForUrlForLowfareAPISearch      = InnovationSearchDataFromFormView.lowfareArray;

  const urlDetailsToBuild = {
    //appending URL and key
    baseUrl: `${SEARCH_URL.INSPIRATION}${key}`,
    parameterArray: dataForUrlForInspirationAPISearch
  }

  //below object creates the complete URL to make the API query
  const urlBuild = new UrlBuilder(urlDetailsToBuild);
  const url      = urlBuild.finalUrl;

  const callbackForDestinationsRequestToInvoke = function(APIResponseData) {
    const dataToListDestinations = {
      response: APIResponseData,
      callbackToInvokeListFlights: listFlights,
      startingSearchRequirements: dataForUrlForLowfareAPISearch
    }
    resultsView.createDestinationsListView(dataToListDestinations);
  }

  const destinationRequest = new Request(url);
  destinationRequest.get(callbackForDestinationsRequestToInvoke);
}

const listFlights = function(informationForListingFlights) {

  const dataForUrl  = informationForListingFlights.searchRequirements;
  const destinationListView = informationForListingFlights.destinationsList;

  const urlDetailsToBuild = {
    baseUrl: `${SEARCH_URL.LOW_FARE}${key}`,
    parameterArray: dataForUrl
  }

  const urlBuild = new UrlBuilder(urlDetailsToBuild);
  const url = urlBuild.finalUrl;

  const request = new Request(url);

  const callback = function(data) {
    const options = {
      currency: data.currency,
      flights: data.results,
      callback: listHotels
    }
    destinationListView.populateFlights(options);
  }

  request.get(callback);
}

const listHotels = function(informationForMakingHotelSearch){
  const request       = new Request('/api/random_search/hotels');

  const resultsView   = informationForMakingHotelSearch.view;
  // flight details is an object containing the details of a flight from
  // the amadeus API
  const flightDetails = informationForMakingHotelSearch.flightDetails;
  const currencyCode  = informationForMakingHotelSearch.currency;
  // function called getUrlFromFlightDetails can be found below
  const url = getUrlFromFlightDetails(flightDetails, currencyCode)

  // function below is to be invoked when a hotel is selected in the hotel list
  // when invoked it will receive information regarding the chosen hotel
  // and will already contain information on the flight
  const onHotelClickPopulatePackageView  = function(hotel) {
    const informationHash = {
        flight: flightDetails,
        hotel: hotel,
        parent: document.getElementsByTagName('main')[0]
    }
    showPackageDetails(informationHash)
  }

  // below function is callback that is invoked once response returns
  const functionForRequestToInvoke = function(responseFromAPIRequest) {
    const informationForPopulatingHotels = {
      hotelObjectsFromAPIQuery: responseFromAPIRequest.results,
      parentElementToAttachHotels: document.getElementById('results-view-section'),
      populatePackageViewCallback: onHotelClickPopulatePackageView
    }
    resultsView.createHotelsListView(informationForPopulatingHotels);
  }

  const hotelSearchRequest = new Request(url)
  hotelSearchRequest.get(functionForRequestToInvoke);
}


const getUrlFromFlightDetails = function(flightObjectFromAPI, currencyCode) {

  const returnJourneyForChosenFlight = flightObjectFromAPI.itineraries[0].inbound.flights;
  const numberOfStopsOnReturn = returnJourneyForChosenFlight.length;
  const finalStopOnReturn     = returnJourneyForChosenFlight[numberOfStopsOnReturn - 1];

  const outboundJourneyForChosenFlight  = flightObjectFromAPI.itineraries[0].outbound.flights;
  const numberOfStopsOnOutbound         = outboundJourneyForChosenFlight.length;
  const finalStopOnOutbound = outboundJourneyForChosenFlight[numberOfStopsOnOutbound - 1];


  const destinationAirportCode  = finalStopOnOutbound.destination.airport;
  const checkInDate             = finalStopOnOutbound.arrives_at;
  const checkOutDate            = finalStopOnReturn.departs_at;

  const parameterArrayForHotelSearch = [];
  parameterArrayForHotelSearch.push(`location=${destinationAirportCode}`);
  parameterArrayForHotelSearch.push(`check_in=${checkInDate}`);
  parameterArrayForHotelSearch.push(`check_out=${checkOutDate}`);
  parameterArrayForHotelSearch.push(`currency=${currencyCode}`);

  const dataForBuildingHotelSearchUrl = {
    baseUrl: `${SEARCH_URL.HOTEL_AIRPORT}${key}`,
    parameterArray: parameterArrayForHotelSearch
  }

  const urlBuilder = new UrlBuilder(dataForBuildingHotelSearchUrl);
  return urlBuilder.finalUrl;
}


const showPackageDetails = function(data) {

  new PackageView(data);

  const scroll = new ScrollTo('package-view');
  scroll.scrollTo();
}


document.addEventListener('DOMContentLoaded', main);

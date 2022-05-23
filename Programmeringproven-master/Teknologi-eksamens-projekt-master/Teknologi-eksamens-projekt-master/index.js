let data
let anbefalingBtn, narmesteBtn
let button1, button2, button3
var apidata
var cardpressed = true

function setup(){
    //Removing the default canvas created by p5js, We are using p5js for its other capabilities than its canvas.
    noCanvas()

    //Assigning values to already existing variables (HTML elements)
    anbefalingBtn = select('#anbefaling_btn')
    button1 = select('#button1')
    button2 = select('#button2')
    button3 = select('#button3')
    
    //Clarifying our accestoken used for our api that creates the map
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWxiYXRyb3NzZGsiLCJhIjoiY2wyN2NlcWVlMDB1MzNscWhicTh6ZWh2aCJ9.dUMy9S_emcOhW4OHrqONQg';

    //Creating the new map by using an api
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [12.568759518980915, 55.66447035003021], // starting position [lng, lat]
        zoom: 10 // starting zoom
    })

    //Fetch weather data from api and save in global variable "apidata"
    fetch('https://api.vandudsigten.dk/beaches')
    .then(res => res.json())
    .then(json => {
        apidata = json
    })
    
    //Fetch self made data about bathing spots from local json file 
    fetch('./index.json')
        //get response object parse to json()
        .then( res => res.json() )
        //when parse done, json object as variable.
        .then( json => {
            data = json.badesteder

            //Map this data and call multiple functions with the "badesteder" variabel which is a json object (Should be called badested)
            json.badesteder.map( badesteder => {
                newMarker(badesteder)
                newCard(badesteder)
                newPopUp(badesteder)
    })
    
    // Search function til page 2
    select('#input2').input( ()=>{
        //Getting searchbar value and converting to lower case
        let q = select('#input2').value().toLowerCase()
        
        //Filter json data sets to onlyc include cards that include the searchbar value (q)
        let result = data.filter( event => 
        event.name.toLowerCase().includes(q) )
    
        //Empty cardholder (Remove all cards)
        select('.cardholder').html('')
    
        //Map the filtered cards only including cards corresponding to search results
        result.map( event => newCard(event) )
    })
    
})

//Lav markers på kortet på første side 
const newMarker = (badested) => {
    //Get coordinates from json file and split them into the lat and lng
    let coords = badested.coordinates
    let coordsarray = coords.split(',')
    
    //Create the new marker with the right coordinates
    const marker = new mapboxgl.Marker()
    marker.setLngLat([coordsarray[1],coordsarray[0]]) //Flip the coordsarray so that the lng comes before the lat
    marker.addTo(map)

    //When marker is pressed make the corresponding card pop up.
    marker.getElement().addEventListener('click', () => {
        stedid = select('#a'+badested['api-id']) //Using the api-id already given in the json to differentiate between the cards, then save this element in a variable
        stedid.addClass('cardpopup') //Assign this element a css class to change its appearance
    })
    
}

}


const newCard = (badesteder) => {
   
    //Create main card structure
    let card = createDiv('')
    let heading = createElement('h2')
    let indhold = createDiv('')
    
    //Add HTML classes for css styling
    card.addClass('card')
    heading.addClass('heading')
    indhold.addClass('indhold')
    
    //Create divs and append them as children to indhold which is a part of the main card structure
    let indholdinfo = createDiv('')
    let indholdapi = createDiv('')
    indholdinfo.addClass('indholdinfo')
    indholdapi.addClass('indholdapi')
    indhold.child(indholdinfo)
    indhold.child(indholdapi)

    //Create renligheds progressbar and heading
    let heading2 = createElement('h4', 'Badestedets renlighed:')
    let progressholder = createDiv('')
    let progress = createDiv('')

    //Add HTML classes for css styling
    heading2.addClass('heading2')
    progressholder.addClass('progressholder')
    progress.addClass('progress')

    //Style "progress" css property width to be equivalent to the JSON value  
    progress.style('width', badesteder.renlighed+'%')

    //Color of progression, Green, Orange, Red
    if((badesteder.renlighed > 0) && (badesteder.renlighed < 50)){
        progress.style('background-color', 'green')
    }else if((badesteder.renlighed > 50) && (badesteder.renlighed < 75)){
        progress.style('background-color', 'orange')
    }else if((badesteder.renlighed > 75) && (badesteder.renlighed < 100)){
        progress.style('background-color', 'red')
    }
    
    //Child newly created elements to their correct parents
    indholdinfo.child(heading2)
    progressholder.child(progress)
    indholdinfo.child(progressholder)


    //Create progressbar and heading for amount of humans
    let heading3 = createElement('h4', 'Mængde mennesker:')
    let progressholder1 = createDiv('')
    let progress1 = createDiv('')

    //Add HTML classes for css styling
    heading3.addClass('heading3')
    progressholder1.addClass('progressholder')
    progress1.addClass('progress')

    //Style "progress" css property width to be equivalent to the JSON value  
    progress1.style('width', badesteder.mennesker+'%')

    //Color of progression
    if((badesteder.mennesker > 0) && (badesteder.mennesker < 50)){
        progress1.style('background-color', 'green')
    }else if((badesteder.mennesker > 50) && (badesteder.mennesker < 75)){
        progress1.style('background-color', 'orange')
    }else if((badesteder.mennesker > 75) && (badesteder.mennesker < 100)){
        progress1.style('background-color', 'red')
    }
    
    //Child newly created elements to their correct parents
    indholdinfo.child(heading3)
    progressholder1.child(progress1)
    indholdinfo.child(progressholder1)


    //Change HTML value of heading to the bathing spots name that we got from JSON
    heading.html(badesteder.name)
    //Child elements to their correct parents
    card.child(heading)
    card.child(indhold)
    cardholder = select('.cardholder')
    cardholder.child(card)


    //Create usersection (bottom of card)
    let usersection = createDiv('')
    usersection.addClass('usersection')
    card.child(usersection)


    //Rating
    let rating = createDiv('')
    rating.addClass('rating')
    usersection.child(rating)
    
    //Create star rating
    let rating1 = createDiv('')
    let rating2 = createDiv('')
    let rating3 = createDiv('')
    
    rating1.addClass('rating1') //Grey stars
    rating2.addClass('rating2') //White star cut out
    rating3.addClass('rating3') //Yellow color bar, on top of rating1 but under rating2 (with css)

    //Child these to their parent rating
    rating.child(rating1)
    rating.child(rating2)
    rating.child(rating3)

    //Style the width of the yellow bar correlating to the value specified in JSON 
    rating3.style('width', badesteder.rating*20+'%')
    

    //Livredder
    let livredder = createDiv('')
    livredder.addClass('livredder')
    usersection.child(livredder)

    //If statemnt to determing whether or not there is lifeguards at the bathing spot
    if (badesteder.livredder == "ja") {
        livredder.style('opacity', '1') //If yes show logo clearly
    } else{
        livredder.style('opacity', '0.15') //If not show logo vaguely
    }


    //Toiletforhold 
    let toilet = createDiv('')
    toilet.addClass('toilet')
    usersection.child(toilet)
    //console.log(badesteder.toiletter)

    //If statemnt to determing whether or not there is toilet facilities at the bathing spot
    if (badesteder.toiletter == "ja") {
        toilet.style('opacity', '1') //If yes show logo clearly
    } else{
        toilet.style('opacity', '0.15') //If not show logo vaguely
    }

    
    //Målgruppe
    let målgruppe = createDiv('')
    målgruppe.addClass('målgruppe')
    usersection.child(målgruppe)

    //If statement that checks the målgruppe in JSON and then styles the appropiate background image correlating with the JSON information
    if (badesteder.maalgruppe == 'familie') {
        målgruppe.style('background-image', 'url(./assets/familie.png)')
    } else if (badesteder.maalgruppe == 'ung') {
        målgruppe.style('background-image', 'url(./assets/ung.png)')        
    } else {
        målgruppe.style('background-image', 'url(./assets/multi.png)')
    }

    
    //Weather card

    //Finds and logs json object of our cards id specified in json
    let bData = apidata.find( obj => obj.id == badesteder['api-id'])
    
    //Function that is supposed to the reload the page in case no data is found, however this does not work since the code fails in the line above already
    if(bData){
        //console.log('found data: ', bData.data[0])
    }else{
        console.log('found no data')
        location.reload()
    }


    //Created heading for card
    let headvejr = createElement('h4', 'Vejr')
    indholdapi.child(headvejr)
    headvejr.addClass('headvejr')

    
    //Created weather

    //Create place to show air temperature which we get from the api
    let lufttemp = createElement('h5', 'Luft: ' + bData.data[0].air_temperature +'°')
    indholdapi.child(lufttemp)
    lufttemp.addClass('lufttemp')
    
    //Create place to show water temperature which we get from the api
    let vandtemp = createElement('h5', 'Vand: ' + bData.data[0].water_temperature +'°')
    indholdapi.child(vandtemp)
    vandtemp.addClass('vandtemp')
    
    //Create place to show wind speed which we get from the api
    let vindspeed = createElement('h5', 'Vind: ' + bData.data[0].wind_speed +' m/s')
    indholdapi.child(vindspeed)
    vindspeed.addClass('vindspeed')

    //Create a holder for the two images we are about to make
    let imgholder = createDiv('')
    indholdapi.child(imgholder)
    imgholder.addClass('imgholder')
    
    //Create div with a background image specified by the weather type we know from the api
    let weathertype = createDiv('')
    imgholder.child(weathertype)
    weathertype.addClass('weathertype')
    weathertype.style('background-image', "url('./assets/weather"+ bData.data[0].weather_type + ".png')")
    
    //Create div with a background image specified by the water quality we know from the api
    let watertype = createDiv('')
    imgholder.child(watertype)
    watertype.addClass('watertype')
    //Have images called weather + the corresponding weather type number that we can also get from the api
    watertype.style('background-image', "url('./assets/water"+ bData.data[0].water_quality + ".png')") 
}

const newPopUp = (badesteder) => {
    //Function that is almost identical to the previously explained function, but with other HTML classes so they can be styled differently
       
    //Main card structure
    let card = createDiv('')
    let heading = createElement('h2')
    let indhold = createDiv('')
    
    card.addClass('cardpopdown')
    heading.addClass('heading')
    indhold.addClass('indholdpop')
    card.id('a'+badesteder['api-id'])
    
    let indholdinfo = createDiv('')
    let indholdapi = createDiv('')
    indholdinfo.addClass('indholdinfo')
    indholdapi.addClass('indholdapi')
    indhold.child(indholdinfo)
    indhold.child(indholdapi)

    //renlighed
    let heading2 = createElement('h4', 'Badestedets renlighed:')
    let progressholder = createDiv('')
    let progress = createDiv('')

    heading2.addClass('heading2')
    progressholder.addClass('progressholder')
    progress.addClass('progress')

    progress.style('width', badesteder.renlighed+'%')

        //color of progression
        if((badesteder.renlighed > 0) && (badesteder.renlighed < 50)){
            progress.style('background-color', 'green')
        }else if((badesteder.renlighed > 50) && (badesteder.renlighed < 75)){
            progress.style('background-color', 'orange')
        }else if((badesteder.renlighed > 75) && (badesteder.renlighed < 100)){
            progress.style('background-color', 'red')
        }
    
    indholdinfo.child(heading2)
    progressholder.child(progress)
    indholdinfo.child(progressholder)


    //mennesker
    let heading3 = createElement('h4', 'Mængde mennesker:')
    let progressholder1 = createDiv('')
    let progress1 = createDiv('')

    heading3.addClass('heading3')
    progressholder1.addClass('progressholder')
    progress1.addClass('progress')

    progress1.style('width', badesteder.mennesker+'%')

        //color of progression
        if((badesteder.mennesker > 0) && (badesteder.mennesker < 50)){
            progress1.style('background-color', 'green')
        }else if((badesteder.mennesker > 50) && (badesteder.mennesker < 75)){
            progress1.style('background-color', 'orange')
        }else if((badesteder.mennesker > 75) && (badesteder.mennesker < 100)){
            progress1.style('background-color', 'red')
        }
    
    indholdinfo.child(heading3)
    progressholder1.child(progress1)
    indholdinfo.child(progressholder1)


    //indhold

    heading.html(badesteder.name)
    card.child(heading)
    card.child(indhold)


    //"user interfaction" section (målgruppe..)
    let usersection = createDiv('')
    usersection.addClass('usersectionpop')
    card.child(usersection)


    //rating
    let rating = createDiv('')
    rating.addClass('rating')
    usersection.child(rating)
    
    let rating1 = createDiv('')
    let rating2 = createDiv('')
    let rating3 = createDiv('')
    
    rating1.addClass('rating1')
    rating2.addClass('rating2')
    rating3.addClass('rating3')

    rating.child(rating1)
    rating.child(rating2)
    rating.child(rating3)

    rating3.style('width', badesteder.rating*20+'%')


    //Livredder
    let livredder = createDiv('')
    livredder.addClass('livredder')
    usersection.child(livredder)

    if (badesteder.livredder == "ja") {
        livredder.style('opacity', '1')
    } else{
        livredder.style('opacity', '0.15')
    }


    //toiletforhold 
    let toilet = createDiv('')
    toilet.addClass('toilet')
    usersection.child(toilet)
    //console.log(badesteder.toiletter)

    if (badesteder.toiletter == "ja") {
        toilet.style('opacity', '1')
    } else{
        toilet.style('opacity', '0.15')
    }

    
    //målgruppe
    let målgruppe = createDiv('')
    målgruppe.addClass('målgruppe')
    usersection.child(målgruppe)

    if (badesteder.maalgruppe == 'familie') {
        målgruppe.style('background-image', 'url(./assets/familie.png)')
    } else if (badesteder.maalgruppe == 'ung') {
        målgruppe.style('background-image', 'url(./assets/ung.png)')        
    } else {
        målgruppe.style('background-image', 'url(./assets/multi.png)')
    }

    
    //Vejr card

    //Finds and logs json object of our cards id specified in json
    let bData = apidata.find( obj => obj.id == badesteder['api-id'])


    //Created heading for card
    let headvejr = createElement('h4', 'Vejr')
    indholdapi.child(headvejr)
    headvejr.addClass('headvejr')

    
    //Created weather
    let lufttemp = createElement('h5', 'Luft: ' + bData.data[0].air_temperature +'°')
    indholdapi.child(lufttemp)
    lufttemp.addClass('lufttemp')

    let vandtemp = createElement('h5', 'Vand: ' + bData.data[0].water_temperature +'°')
    indholdapi.child(vandtemp)
    vandtemp.addClass('vandtemp')

    let vindspeed = createElement('h5', 'Vind: ' + bData.data[0].wind_speed +' m/s')
    indholdapi.child(vindspeed)
    vindspeed.addClass('vindspeed')


    let imgholder = createDiv('')
    indholdapi.child(imgholder)
    imgholder.addClass('imgholder')
    
    let weathertype = createDiv('')
    imgholder.child(weathertype)
    weathertype.addClass('weathertype')
    weathertype.style('background-image', "url('./assets/weather"+ bData.data[0].weather_type + ".png')")

    let watertype = createDiv('')
    imgholder.child(watertype)
    watertype.addClass('watertype')
    watertype.style('background-image', "url('./assets/water"+ bData.data[0].water_quality + ".png')")



    //This part of the function is different from the previous function

    //Close card

    //If the mouse has been released on the card, then cardpressed is true
    card.mouseReleased(()=>{
        cardpressed = true
    })
    //If page1 is pressed and cardpressed is true then the the mouse has been pressed somewhere not on the card, and the card is hidden with HTML classes which have styling.
    select('.page1').mouseReleased(()=>{
        if (cardpressed == true){
            card.removeClass('cardpopup') //Remove the class that shows the card
            card.addClass('cardpopdown') //Add class that hides the card
        } else{

        }
    })
    //If the div buttons is pressed and cardpressed is true then the the mouse has been pressed somewhere not on the card, and the card is hidden with HTML classes which have styling.
    select('.buttons').mouseReleased(()=>{
        if (cardpressed == true){
            card.removeClass('cardpopup') //Remove the class that shows the card
            card.addClass('cardpopdown') //Add class that hides the card
        } else{

        }
    })

}

 
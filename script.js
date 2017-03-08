function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom : 6,
		streetViewControl : false,
		minZoom : 5,
		fullscreenControl : false,
		center : {
			lat : -41.15,
			lng : 172.65
		}
	});

	if (document.getElementById('map').offsetWidth <= 600 || document.getElementById('map').offsetHeight <= 650) {
		map.setZoom(5);
	}

	for (var i = 0; i < locations.length; i++) {
		var point = locations[i];
		var scale = 1.2;
		var icon;
		if (point[6] != null && point[6]) {
			icon = "icons/prescaled/marker-building.png";
		} else {
			icon = "icons/prescaled/marker.png";
		}
		var marker = new google.maps.Marker({
			position : {
				lat : point[2],
				lng : point[3]
			},
			label : point[4].toString(),
			map : map,
			title : point[1],
			icon : {
				url : icon,
				size : new google.maps.Size(22 * scale, 32 * scale),
				origin : new google.maps.Point(0, 0),
				labelOrigin : new google.maps.Point(11 * scale, 11 * scale),
				anchor : new google.maps.Point(11 * scale, 32 * scale),
				scaledSize : new google.maps.Size(22 * scale, 32 * scale)
			}
		});
		markers[i] = marker;
		marker.addListener('click', function() {
			/*map.setCenter({
			 lat : this.position.lat(),
			 lng : this.position.lng()
			 });*/
		});
	}

	autocomplete = new google.maps.places.Autocomplete(
	/** @type {!HTMLInputElement} */(
		document.getElementById('autocomplete')), {
		componentRestrictions : countryRestrict
	});

	autocomplete.addListener('place_changed', onPlaceChanged);

	//Get the hash if there is any and zoom to it
	var hash = location.hash.substring(1);
	if (hash != "") {
		changeLocation(hash);
	}

	//Set up directions
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer({
		suppressMarkers : true,
		preserveViewport : true,
		suppressInfoWindows : true
	});

	//Update all the number values
	var count = 0;
	var count_auk = 0;
	var count_wlg = 0;
	var count_chc = 0;
	var count_ham = 0;
	var count_dnd = 0;
	var count_has = 0;
	var count_nap = 0;
	var count_whg = 0;
	var count_tpo = 0;

	for (var i = 0; i < locations.length; i++) {
		if (locations[i][4] != "??") {
			count += parseInt(locations[i][4]);
			switch(locations[i][0].split("-")[0]) {
				case "AUK":
					count_auk += parseInt(locations[i][4]);
					break;
				case "WLG":
					count_wlg += parseInt(locations[i][4]);
					break;
				case "CHC":
					count_chc += parseInt(locations[i][4]);
					break;
				case "HAM":
					count_ham += parseInt(locations[i][4]);
					break;
				case "DND":
					count_dnd += parseInt(locations[i][4]);
					break;
				case "HAS":
					count_has += parseInt(locations[i][4]);
					break;
				case "NAP":
					count_nap += parseInt(locations[i][4]);
					break;
				case "WHG":
					count_whg += parseInt(locations[i][4]);
					break;
				case "TPO":
					count_tpo += parseInt(locations[i][4]);
					break;
			}
		}
	}
	
	document.getElementsByClassName("total-parks-number")[0].textContent = count;
	document.getElementsByClassName("total-parks-number")[1].textContent = count;
	
	document.getElementsByClassName("auk-parks-number")[0].textContent = count_auk;
	document.getElementsByClassName("auk-parks-number")[1].textContent = count_auk;
	
	document.getElementsByClassName("wlg-parks-number")[0].textContent = count_wlg;
	document.getElementsByClassName("wlg-parks-number")[1].textContent = count_wlg;
	
	document.getElementsByClassName("chc-parks-number")[0].textContent = count_chc;
	document.getElementsByClassName("chc-parks-number")[1].textContent = count_chc;
	
	document.getElementsByClassName("ham-parks-number")[0].textContent = count_ham;
	document.getElementsByClassName("ham-parks-number")[1].textContent = count_ham;
	
	document.getElementsByClassName("dnd-parks-number")[0].textContent = count_dnd;
	document.getElementsByClassName("dnd-parks-number")[1].textContent = count_dnd;
	
	document.getElementsByClassName("has-parks-number")[0].textContent = count_has;
	document.getElementsByClassName("has-parks-number")[1].textContent = count_has;
	
	document.getElementsByClassName("nap-parks-number")[0].textContent = count_nap;
	document.getElementsByClassName("nap-parks-number")[1].textContent = count_nap;
	
	document.getElementsByClassName("whg-parks-number")[0].textContent = count_whg;
	document.getElementsByClassName("whg-parks-number")[1].textContent = count_whg;
	
	document.getElementsByClassName("tpo-parks-number")[0].textContent = count_tpo;
	document.getElementsByClassName("tpo-parks-number")[1].textContent = count_tpo;
}

function changeLocation(loc) {
	for (var i = 0; i < cities.length; i++) {
		var city = cities[i];
		if (city[0] == loc) {
			map.setCenter({
				lat : city[2],
				lng : city[3]
			});
			map.setZoom(15);
			window.location.hash = '#' + loc;
		}
	}
}

function changeLocationGPS() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(setLocationGPS);
	}
}

function setLocationGPS(position) {
	map.setCenter({
		lat : position.coords.latitude,
		lng : position.coords.longitude
	});
	map.setZoom(15);
}

function onPlaceChanged() {
	var place = autocomplete.getPlace();
	if (place.geometry) {
		map.panTo(place.geometry.location);
		map.setZoom(17);
		document.getElementById("clear-phrase").style.display = "none";
		clearSearchFilter();

		var scale = 1.5;
		dest_marker = new google.maps.Marker({
			position : place.geometry.location,
			map : map,
			icon : {
				url : 'icons/prescaled/marker-x.png',
				size : new google.maps.Size(22 * scale, 22 * scale),
				origin : new google.maps.Point(0, 0),
				labelOrigin : new google.maps.Point(11 * scale, 11 * scale),
				anchor : new google.maps.Point(11 * scale, 11 * scale),
				scaledSize : new google.maps.Size(22 * scale, 22 * scale)
			},
			title : "Destination"
		});
		var destLat = place.geometry.location.lat();
		var destLng = place.geometry.location.lng();

		dest_circle = new google.maps.Circle({
			strokeColor : '#000000',
			strokeOpacity : 0.6,
			strokeWeight : 1,
			fillColor : '#FFFFFF',
			fillOpacity : 0.3,
			map : map,
			center : place.geometry.location,
			radius : 400
		});

		var loadingImg = document.createElement("IMG");
		loadingImg.src = "icons/loading.gif";
		loadingImg.className = "loader-gif";
		var pane = document.getElementById("results");
		pane.appendChild(loadingImg);

		spotsToAdd = [];
		spotsTrying = 0;
		spotsAdded = 0;
		spotsLookedAt = 0;
		for (var i = 0; i < markers.length; i++) {
			var mark = markers[i];
			var distance = distBetween(destLat, destLng, mark.position.lat(), mark.position.lng());
			if (distance >= 0.4) {
				mark.setOpacity(0.4);
			} else {
				mark.setOpacity(0.4);
				spotsTrying++;
				console.log("Trying at to add Park #" + i);
				addDelayedParkingSpot(i, mark, place.geometry.location);
			}
			spotsLookedAt++;
		}

		if (spotsTrying == 0) {
			while (pane.hasChildNodes()) {
				pane.removeChild(pane.lastChild);
			}
			document.getElementById("clear-phrase").style.display = "block";
			var noParksFound = document.createElement("SPAN");
			noParksFound.innerHTML = "No Parks Found";
			noParksFound.className = "no-parks";
			pane.appendChild(noParksFound);
		}
	}
}

function resetPage() {
	window.location.hash = "";
	clearSearchFilter();
	map.setCenter({
		lat : -41.15,
		lng : 172.65
	});
	map.setZoom(6);

	document.getElementById("autocomplete").value = "";
	var pane = document.getElementById("results");
	while (pane.hasChildNodes()) {
		pane.removeChild(pane.lastChild);
	}
}

function clearSearchFilterButton() {
	document.getElementById("autocomplete").value = "";
	document.getElementById("clear-phrase").style.display = "none";
	clearSearchFilter();
}

function clearSearchFilter() {
	directionsDisplay.setMap(null);
	for (var i = 0; i < markers.length; i++) {
		markers[i].setOpacity(1.0);
		google.maps.event.clearListeners(markers[i], 'mouseover');
		google.maps.event.clearListeners(markers[i], 'mouseout');
		google.maps.event.clearListeners(markers[i], 'click');
	}
	if (dest_marker != null) {
		dest_marker.setMap(null);
	}
	if (dest_circle != null) {
		dest_circle.setMap(null);
	}
	clearResultsPane();
}

function clearResultsPane() {
	var pane = document.getElementById("results");
	while (pane.hasChildNodes()) {
		pane.removeChild(pane.lastChild);
	}
	directionsDisplay.setPanel(null);
}

function hideResultsPaneExcept(i) {
	directionsDisplay.setPanel(null);
	console.log("Hiding them all but " + i);
	var pane = document.getElementById("results");
	var children = pane.childNodes;
	var alreadyGotButton = false;
	for (var j = 0; j < children.length; j++) {
		if (children[j].className == "results-card") {
			if (children[j].id != "result-" + i) {
				children[j].style.display = "none";
			} else {
				children[j].style.display = "block";
			}
		} else if (children[j].className == "results-back") {
			alreadyGotButton = true;
			children[j].style.display = "block";
		}
	}
	if (!alreadyGotButton) {
		var backButton = document.createElement("DIV");
		backButton.className = "results-back";
		backButton.innerHTML = "[↶] Back to Search Results";
		backButton.onclick = clearDirectionsFromPane;
		pane.appendChild(backButton);
	}
}

function clearDirectionsFromPane() {
	directionsDisplay.setPanel(null);
	directionsDisplay.setMap(null);

	var pane = document.getElementById("results");
	var children = pane.childNodes;
	for (var j = 0; j < children.length; j++) {
		if (children[j].className == "results-card") {
			children[j].style.display = "block";
		} else if (children[j].className == "results-back") {
			children[j].style.display = "none";
		}
	}
}

function addDelayedParkingSpot(i, mark, dest) {
	setTimeout(function() {
		addParkingSpot(i, mark, dest);
	}, 500 * (spotsTrying - spotsAdded));
}

function addParkingSpot(i, mark, dest) {
	mark.setOpacity(1.0);
	console.log(mark.icon.url);
	var request = {
		origin : mark.position,
		destination : dest,
		provideRouteAlternatives : false,
		travelMode : 'WALKING',
		unitSystem : google.maps.UnitSystem.METRIC
	};
	directionsService.route(request, function(result, status) {
		if (status == 'OK') {
			console.log("ADDED PARK #" + i);
			spotsAdded++;
			var spot = {};
			spot.index = i;
			spot.result = result;
			spotsToAdd.push(spot);
			checkIfAddedAll();
		}
	});
}

function checkIfAddedAll() {
	console.log("Trying: " + spotsTrying + " and Added: " + spotsAdded + " and Looked At: " + spotsLookedAt);
	if (spotsTrying == spotsAdded && spotsLookedAt == markers.length) {
		console.log("YE");
		console.log(spotsToAdd);
		spotsToAdd.sort(function(a, b) {
			console.log("Comparing: " + a.index + " and " + b.index);
			var keyA = a.result.routes[0].legs[0].duration.value;
			keyB = b.result.routes[0].legs[0].duration.value;
			if (keyA < keyB)
				return -1;
			if (keyA > keyB)
				return 1;
			return 0;
		});
		console.log(spotsToAdd);

		var pane = document.getElementById("results");
		while (pane.hasChildNodes()) {
			pane.removeChild(pane.lastChild);
		}
		//Show the clear button
		document.getElementById("clear-phrase").style.display = "block";
		for (var i = 0; i < spotsToAdd.length; i++) {
			pane.appendChild(constructResult(spotsToAdd[i].result, spotsToAdd[i].index));
		}
	}
}

function distBetween(lat1, lng1, lat2, lng2) {
	lat1 = lat1 * (Math.PI / 180);
	lng1 = lng1 * (Math.PI / 180);
	lat2 = lat2 * (Math.PI / 180);
	lng2 = lng2 * (Math.PI / 180);
	return Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng1 - lng2)) * 6371;
}

function constructResult(results, i) {
	var mark = markers[i];
	var oldIcon = mark.icon.url;
	var outer = document.createElement("DIV");
	outer.className = "results-card";
	outer.id = "result-" + i;

	//Give directions (Card)
	outer.onclick = function() {
		hideResultsPaneExcept(i);
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById("results"));
		directionsDisplay.setDirections(results);
	};

	//Give directions (Marker)
	google.maps.event.addListener(mark, 'click', function() {
		hideResultsPaneExcept(i);
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById("results"));
		directionsDisplay.setDirections(results);
	});

	//Hover effects (Card)
	outer.onmouseover = function() {
		mark.setIcon({
			url : 'icons/prescaled/marker-selected.png',
			size : new google.maps.Size(22 * 1.5, 32 * 1.5),
			origin : new google.maps.Point(0, 0),
			labelOrigin : new google.maps.Point(11 * 1.5, 11 * 1.5),
			anchor : new google.maps.Point(11 * 1.5, 32 * 1.5),
			scaledSize : new google.maps.Size(22 * 1.5, 32 * 1.5)
		});
		this.style.background = "#b4e3d0";
	};
	outer.onmouseout = function() {
		mark.setIcon({
			url : oldIcon,
			size : new google.maps.Size(22 * 1.2, 32 * 1.2),
			origin : new google.maps.Point(0, 0),
			labelOrigin : new google.maps.Point(11 * 1.2, 11 * 1.2),
			anchor : new google.maps.Point(11 * 1.2, 32 * 1.2),
			scaledSize : new google.maps.Size(22 * 1.2, 32 * 1.2)
		});
		this.style.background = "#f0f0f0";
	};

	//Hover Effects (Marker)
	google.maps.event.addListener(mark, 'mouseover', function() {
		this.setIcon({
			url : 'icons/prescaled/marker-selected.png',
			size : new google.maps.Size(22 * 1.5, 32 * 1.5),
			origin : new google.maps.Point(0, 0),
			labelOrigin : new google.maps.Point(11 * 1.5, 11 * 1.5),
			anchor : new google.maps.Point(11 * 1.5, 32 * 1.5),
			scaledSize : new google.maps.Size(22 * 1.5, 32 * 1.5)
		});
		var card = document.getElementById("result-" + i);
		if (card != null) {
			card.style.background = "#b4e3d0";
		}
	});

	google.maps.event.addListener(mark, 'mouseout', function() {
		mark.setIcon({
			url : oldIcon,
			size : new google.maps.Size(22 * 1.2, 32 * 1.2),
			origin : new google.maps.Point(0, 0),
			labelOrigin : new google.maps.Point(11 * 1.2, 11 * 1.2),
			anchor : new google.maps.Point(11 * 1.2, 32 * 1.2),
			scaledSize : new google.maps.Size(22 * 1.2, 32 * 1.2)
		});
		var card = document.getElementById("result-" + i);
		if (card != null) {
			card.style.background = "#f0f0f0";
		}
	});

	var img = document.createElement("IMG");
	img.src = "parks/thumbs/" + locations[i][0] + ".jpg";
	img.className = "results-img";
	var details = document.createElement("DIV");
	details.className = "results-details";
	var address = document.createElement("DIV");
	address.className = "results-address";
	address.innerHTML = locations[i][1];
	var numbers = document.createElement("DIV");
	numbers.className = "results-numbers";
	var parks = document.createElement("SPAN");
	parks.innerHTML = locations[i][4] + "P";

	var seconds = results.routes[0].legs[0].duration.value;
	var time = document.createElement("SPAN");
	//time.innerHTML = Math.floor(seconds/60) + ":" + padValue(seconds%60);
	var mins = Math.round(seconds / 60);
	if (mins > 1) {
		time.innerHTML = mins + " mins";
	} else if (mins == 1) {
		time.innerHTML = mins + " min";
	} else if (mins == 0) {
		time.innerHTML = "<1 min";
	}

	var meters = results.routes[0].legs[0].distance.value;
	var distance = document.createElement("SPAN");
	distance.innerHTML = meters + " m";

	numbers.appendChild(parks);
	numbers.appendChild(time);
	numbers.appendChild(distance);

	details.appendChild(address);
	details.appendChild(numbers);

	outer.appendChild(img);
	outer.appendChild(details);

	return outer;
}

function padValue(i) {
	if (i < 10) {
		return "0" + i;
	} else {
		return i;
	}
}

function openSearchTab() {
	var search_icon = document.getElementById("search-icon");
	var close_icon = document.getElementById("search-icon-close");

	var panel = document.getElementsByClassName("panel-left")[0];
	if (panel.classList.contains("open")) {
		panel.classList.remove("open");
		search_icon.style.opacity = 1;
		close_icon.style.opacity = 0;
	} else {
		panel.classList.add("open");
		search_icon.style.opacity = 0;
		close_icon.style.opacity = 1;
	}

	var otherPanel = document.getElementsByClassName("panel-right")[0];
	if (otherPanel.classList.contains("open")) {
		var location_icon = document.getElementById("location-icon");
		var locationClose_icon = document.getElementById("location-icon-close");
		otherPanel.classList.remove("open");
		location_icon.style.opacity = 1;
		locationClose_icon.style.opacity = 0;
	}

	var c = map.getCenter();
	setTimeout(function() {
		google.maps.event.trigger(map, 'resize');
		map.setCenter(c);
	}, 600);
}

function openLocationTab() {
	var location_icon = document.getElementById("location-icon");
	var close_icon = document.getElementById("location-icon-close");

	var panel = document.getElementsByClassName("panel-right")[0];
	if (panel.classList.contains("open")) {
		panel.classList.remove("open");
		location_icon.style.opacity = 1;
		close_icon.style.opacity = 0;
	} else {
		panel.classList.add("open");
		location_icon.style.opacity = 0;
		close_icon.style.opacity = 1;
	}

	var otherPanel = document.getElementsByClassName("panel-left")[0];
	if (otherPanel.classList.contains("open")) {
		var search_icon = document.getElementById("search-icon");
		var searchClose_icon = document.getElementById("search-icon-close");
		otherPanel.classList.remove("open");
		search_icon.style.opacity = 1;
		searchClose_icon.style.opacity = 0;
	}

	var c = map.getCenter();
	setTimeout(function() {
		google.maps.event.trigger(map, 'resize');
		map.setCenter(c);
	}, 600);
}

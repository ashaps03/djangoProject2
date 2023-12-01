$(document).ready(function () {
    $("#searchButtonRed").click(function () {
        const searchTerm = $("#search").val().trim();
        const city = $("#location").val().trim();

        if (searchTerm === "" && city === "") {
            $("#emptySearchAlert").slideDown();
            $("#emptyCityAlert").slideDown();
            $("#eventsContainer").hide();
            return;
        }

        if (searchTerm === "") {
            $("#emptySearchAlert").slideDown();
            $("#emptyCityAlert").slideUp();
            $("#eventsContainer").hide();
            return;
        }

        if (city === "") {
            $("#emptyCityAlert").slideDown();
            $("#emptySearchAlert").slideUp();
            $("#eventsContainer").hide();
            return;
        }

        $("#emptySearchAlert").slideUp();
        $("#emptyCityAlert").slideUp();

        const userInput = searchTerm;
        const apikey = "zxK1zwunjWzu8ug6jCAxxeBOE2LRGOrr";
        const apiUrl = "https://app.ticketmaster.com/discovery/v2/events.json";
        const queryParams = {
            city: city,
            apikey: apikey,
            keyword: userInput
        };

        const queryString = $.param(queryParams);
        const fullUrl = apiUrl + "?" + queryString;

        $.ajax({
            type: "GET",
            url: fullUrl,
            async: true,
            dataType: "json",
            success: function (response) {
                const events = response._embedded ? response._embedded.events : [];

                if (events.length === 0) {
                    showNoResultsAlert();
                } else {
                    updateEventCards(events);
                    updateEventCounter(events.length);
                    $("#eventsContainer").show();
                    $("#noResultsAlert").slideUp();
                }
            },
            error: function (xhr, status, err) {
                console.error("Error:", err);
                showNoResultsAlert();
                $("#emptySearchAlert").slideUp();
                $("#emptyCityAlert").slideUp();
                $("#eventsContainer").hide();
            }
        });
    });

    $("#sortByDate").click(function () {
        sortEvents("date");
    });

    function sortEvents(criteria) {
        const eventCards = $(".card").toArray();

        eventCards.sort(function (a, b) {
            let eventA, eventB;

            if (criteria === "date") {
                const dateA = new Date($(a).find("#eventDate").text() + " " + $(a).find("#eventTime").text());
                const dateB = new Date($(b).find("#eventDate").text() + " " + $(b).find("#eventTime").text());

                eventA = dateA.getTime();
                eventB = dateB.getTime();
            }

            if (eventA < eventB) return -1;
            if (eventA > eventB) return 1;
            return 0;
        });

        $("#cardsContainer").empty();

        $.each(eventCards, function () {
            if ($(this).find(".card-title").text().trim() !== "") {
                $("#cardsContainer").append($(this).clone());
            }
        });
    }

    function updateEventCards(events) {
        const eventsContainer = $("#cardsContainer");
        eventsContainer.empty();

        events.forEach(function (event) {
            const eventName = event.name;
            const eventUrl = event.url;
            const eventImages = event.images;
            const eventDateTime = event.dates.start.dateTime;
            const venueName = event._embedded.venues[0].name;
            const venueLocation = event._embedded.venues[0].address.line1;
            const venueCity = event._embedded.venues[0].city.name;
            const venueState = event._embedded.venues[0].state.stateCode;

            const formattedDate = new Date(eventDateTime).toDateString();
            const formattedTime = formatTime(eventDateTime);

            const price = event.priceRanges ? event.priceRanges[0] : null;
            const formattedPrice = price ? `${price.min.toFixed(2)} - ${price.max.toFixed(2)}` : "N/A";

            const bestImage = findBestImage(eventImages);

            const eventCard = $("#eventCardTemplate").clone().removeAttr("id").css("display", "block");

            eventCard.find(".img-fluid").attr("src", bestImage.url).attr("alt", "Event Image");
            eventCard.find(".card-title").text(eventName);
            eventCard.find("#eventDate").text(formattedDate);
            eventCard.find("#eventTime").text(formattedTime);
            eventCard.find("#venueName").text(venueName + " - " + venueCity);
            eventCard.find("#venueLocation").html(venueLocation + "<br>" + venueCity + ", " + venueState);
            eventCard.find("#ticketLink").attr("href", eventUrl);

            const priceElement = $("<p>").text(`Price: ${formattedPrice}`).css({
                "color": "red",
                "margin-top": "8px"
            });
            eventCard.find(".card-body").find("#eventTime").after(priceElement);

            eventsContainer.append(eventCard);
        });
    }

    function updateEventCounter(count) {
        const eventCountSpan = $("#eventCount");
        eventCounter = count;
        eventCountSpan.text(eventCounter);
    }

    function formatTime(dateTimeString) {
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };

        return new Date(dateTimeString).toLocaleString('en-US', options);
    }

    function findBestImage(images) {
        images.sort(function (a, b) {
            return b.width * b.height - a.width * a.height;
        });

        return images[0];
    }

    function showNoResultsAlert() {
        $("#noResultsAlert").slideDown();
        $("#emptySearchAlert").slideUp();
        $("#emptyCityAlert").slideUp();
        $("#eventsContainer").hide();
        $("body").append('<div class="alert alert-light mt-3 shadow-lg mx-auto" role="alert" style="max-width: 850px;">No results were found!</div>');
    }
});

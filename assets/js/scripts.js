// closes navigation menu
function closeNav() {
    // gets DOM element
    var menuButton = document.getElementById('menu-button');

    // menu button
    menuButton.classList.remove('menu-click-animation-in');
    menuButton.classList.add('menu-click-animation-out');

    // hamburger menu lines
    var i;
    for (i = 1; i < 4; i++) {
        element = document.getElementById('line-' + String(i));
        element.classList.remove('line-' + String(i) +'-animation-in');
        element.classList.add('line-' + String(i) +'-animation-out');
    }

    // navigation list items
    var i;
    for (i = 1; i < 7; i++) {
        // text items
        element = document.getElementById('nav-item-' + String(i));
        element.classList.remove('nav-list-' + String(i) +'-in');
        element.classList.add('nav-list-' + String(i) +'-out');
        // icon items
        element = document.getElementById('nav-icon-' + String(i));
        element.classList.remove('nav-icon-' + String(i) +'-in');
        element.classList.add('nav-icon-' + String(i) +'-out');
    }

    // disables pointer events for navigation div
    element = document.getElementById('menu-list-container');
    element.style.pointerEvents = 'none';
}

// opens navigation menu
function openNav() {
    // gets DOM element
    var menuButton = document.getElementById('menu-button');
    // menu button
    menuButton.classList.add('menu-click-animation-in');
    menuButton.classList.remove('menu-click-animation-out');

    // hamburger menu lines
    var i;
    for (i = 1; i < 4; i++) {
        element = document.getElementById('line-' + String(i));
        element.classList.remove('line-' + String(i) +'-animation-out');
        element.classList.add('line-' + String(i) +'-animation-in');
    }

    // navigation list items
    var i;
    for (i = 1; i < 7; i++) {
        // text items
        element = document.getElementById('nav-item-' + String(i));
        element.classList.remove('nav-list-' + String(i) +'-out');
        element.classList.add('nav-list-' + String(i) +'-in');
        // icon items
        element = document.getElementById('nav-icon-' + String(i));
        element.classList.remove('nav-icon-' + String(i) +'-out');
        element.classList.add('nav-icon-' + String(i) +'-in');
    }

    // enables pointer events for navigation div
    element = document.getElementById('menu-list-container');
    element.style.pointerEvents = 'auto';

    // adds scroll event listener
    // console.log('OPEN NAV');
    document.addEventListener("scroll", closeMenuOnScroll);
}

// scroll event listener to close menu
function closeMenuOnScroll() {
    closeNav();
    document.removeEventListener("scroll", closeMenuOnScroll);
} 

// handles clicks on the menu button (opens/closes menu)
function menuClick() {
    // gets DOM element
    var menuButton = document.getElementById('menu-button');
    // if menu active
    if (menuButton.classList.contains('menu-click-animation-in')) {
        closeNav();
    }
    // if menu not active
    else {
        openNav();
    }
}

// expands & collapses service sections
function serviceExpand(serviceName) {
    // gets elements
    var element = document.getElementById(serviceName + '-description');
    var button = document.getElementById(serviceName + '-button');
    var buttonClose = document.getElementById(serviceName + '-button-close');
    var icon = document.getElementById(serviceName + '-tab');
    

    // if description not previously loaded
    if (element.classList.contains('unloaded')) {
        element.classList.remove('unloaded');
    }

    // if menu active
    if (element.classList.contains('service-expand')) {
        element.classList.remove('service-expand');
        button.classList.remove('button-active-in');
        button.classList.add('button-active-out');
        buttonClose.classList.remove('button-close-in');
        buttonClose.classList.add('button-close-out');
        icon.classList.remove('icon-resize-in');
        icon.classList.add('icon-resize-out');
    }
    // if menu not active
    else {
        element.classList.add('service-expand');
        button.classList.remove('button-active-out');
        button.classList.add('button-active-in');
        buttonClose.classList.remove('button-close-out');
        buttonClose.classList.add('button-close-in');
        icon.classList.remove('icon-resize-out');
        icon.classList.add('icon-resize-in');
    }

    // loads images on section expand
    var allImages = element.getElementsByTagName('img');
    if (allImages.length != 0 && allImages[0].src == '') {
        // console.log('UNLOADED ELEMENTS DETECTED');
        viewportWidth = window.innerWidth; // gets the viewports width in order to serve optimized image
        var i;
        for (i = 0; i < allImages.length; i++) {
            if (viewportWidth <= 479) {
                src = allImages[i].getAttribute('data-src-1'); // image size: 479px x 479px
            } 
            else if (viewportWidth <= 575) {
                src = allImages[i].getAttribute('data-src-2'); // image size: 575px x 575px
            } else {
                src = allImages[i].getAttribute('data-src-3');  // image size: 306px x 306px
            }
            // console.log('(' + String(i) +') LOADING IMAGE: ' + src);
            allImages[i].src = src;
        }
    }
}

// highlights the corresponding gallery image when user mouses over floorplan dot
function highlightGallery(galleryNumber) {
    const galleryContainer = document.getElementById('gallery-container');
    const imageAll = galleryContainer.children;
    const image = imageAll[galleryNumber];
    image.classList.add('highlighted');
}

// removes highlight on mouse out
function removeHighlight(galleryNumber) {
    const galleryContainer = document.getElementById('gallery-container');
    const imageAll = galleryContainer.children;
    const image = imageAll[galleryNumber];
    image.classList.remove('highlighted');
}

// CONTACT FORM //
function sendContact() {
    // check if the value is empty //
    function isNotEmpty(value) {
        if (value == null || typeof value == 'undefined' ) return false;
        return (value.length > 0);
    };

    // checks if the value is an email address //
    function isEmail(email) {
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    };

    // performs the checks and makes changes to the DOM if invalid //
    function fieldValidation(field, validationFunction) {
         if (field == null) return false;

         let isFieldValid = validationFunction(field.value)
         if (!isFieldValid) {
             field.classList.add('field-error');
             document.getElementById('error-message').style.display = 'block';
         } else {
             field.style.border = 'none';
         }

         return isFieldValid;
    }

    // performs the final check //
    function isValid() {
        var valid = true;

        valid &= fieldValidation(name, isNotEmpty);
        valid &= fieldValidation(email, isEmail);
        valid &= fieldValidation(message, isNotEmpty);

        return valid;
    };

    // gets the form values //
    let name = document.getElementById('form-name');
    let email = document.getElementById('form-email');
    let phone = document.getElementById('form-phone');
    let message = document.getElementById('form-message');

    data = {
        form_name: name.value,
        form_email: email.value,
        form_phone: phone.value,
        form_message: message.value,
    }

    function formSuccess() {
        // removes contact form from DOM
        let contactForm = document.getElementById('contact-form');
        contactForm.classList.add('hide-contact-form');

        let confirmationMessage = document.getElementById('confirmation-message');
        confirmationMessage.classList.add('show-confirmation');
    }
    
    if (isValid()) {
        // console.log("VALID");
        $.ajax({
            type: "POST",
            url: "contact_form.php",
            data: data,
            success: formSuccess(),
          });
    }
    else {
        // console.log("INVALID");
    };
};

// STANDALONE NAME CHECK //
function isEmptyStandalone(fieldName) {
    function isEmpty(fieldValue) {
        return fieldValue == '';
    };

    let field = document.getElementById(fieldName);
    let otherErrors = document.getElementsByClassName('field-error');

    if (isEmpty(field.value)) {
        field.classList.add('field-error');
        document.getElementById('error-message').style.display = 'block';
    } else {
        field.classList.remove('field-error');
        if (!otherErrors.length > 0) {
            document.getElementById('error-message').style.display = 'none';
        }
    }
}

// STANDALONE EMAIL CHECK //
function isEmailStandalone() {
    function isEmail(email) {
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    };

    let email = document.getElementById('form-email');
    let otherErrors = document.getElementsByClassName('field-error');

    if (!isEmail(email.value)) {
        email.classList.add('field-error');
        document.getElementById('error-message').style.display = 'block';
    } else {
        email.classList.remove('field-error');
        if (!otherErrors.length > 0) {
            document.getElementById('error-message').style.display = 'none';
        } 
    }
}

// CHANGE PRICE CALCULATIONS FOR DOUBLE HANGAKU CAMPAIGN
function changePrice(basePrice, serviceName, ageRange, entFee, fullPrice, trialNumber, periodOne, periodTwo) {
    console.log(`BASE PRICE: ${basePrice}`);
    console.log(`SERVICE NAME: ${serviceName}`);
    console.log(`AGE RANGE: ${ageRange}`);
    console.log(`ENTRANCE FEE: ${entFee}`);
    console.log(`FULL PRICE: ${fullPrice}`);
    console.log(`TRIAL NUMBER: ${trialNumber}`);
    console.log('=============================');

    // changes calculation digits
    internationalNumberFormat = new Intl.NumberFormat('en-US'); // creates comma separated operator

    let lessonPrice = document.getElementsByClassName('dh-lesson-price'); // calculates lesson price
    var i;
    for (i = 0; i < lessonPrice.length; i++) {
        lessonPrice[i].innerHTML = internationalNumberFormat.format(basePrice);
    }

    let entranceFee = document.getElementsByClassName('dh-entrance-fee'); // calculates entrance fee
    var i; 
    for (i = 0; i < entranceFee.length; i++) {
        entranceFee[i].innerHTML = internationalNumberFormat.format(entFee);
    }

    let subtotal = document.getElementsByClassName('dh-subtotal'); // calculates subtotal
    var i;
    for (i = 0; i < subtotal.length; i++) {
        subtotal[i].innerHTML = internationalNumberFormat.format(basePrice + entFee);
    }

    let total = document.getElementsByClassName('dh-total'); // calculates total
    var i;
    for (i = 0; i < total.length; i++) {
        total[i].innerHTML = internationalNumberFormat.format((basePrice + entFee) * 1.1);
    }

    let number = document.getElementById('dh-trial-number'); // sets number of available trail lesson
    number.innerHTML = trialNumber;

    let firstPeriod = document.getElementsByClassName('dh-first-period'); // sets labels for first and second month/period
    let secondPeriod = document.getElementById('dh-second-period');
    var i;
    for (i = 0; i < firstPeriod.length; i++) {
        firstPeriod[i].innerHTML = periodOne;
    }
    secondPeriod.innerHTML = periodTwo;


    // changes service title
    let serviceTitle = document.getElementById('dh-lesson-type');
    serviceTitle.innerHTML = serviceName;
    // changes service subtitle
    let serviceSubtitle = document.getElementById('dh-age-range');
    serviceSubtitle.innerHTML = ageRange;

    // changes button styling
    let allButtons = document.getElementsByClassName('dh-calculator-button');
    var i;
    for (i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove('dh-button-selected');
        if (allButtons[i].innerHTML == serviceName) {
            allButtons[i].classList.add('dh-button-selected');
        } 
    }

    // updates total discount figure
    let discountBadge = document.getElementById('dh-discount');
    let discountValue = internationalNumberFormat.format( ( entFee + (fullPrice - basePrice) ) * 1.1 )
    discountBadge.innerHTML = discountValue;
}
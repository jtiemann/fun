/*! viewportSize | Author: Tyson Matanich, 2013 | License: MIT */
(function (window) {
  "use strict";
  window.viewportSize = {};

  window.viewportSize.getHeight = function () {
    return getSize("Height");
  };

  window.viewportSize.getWidth = function () {
    return getSize("Width");
  };

  var getSize = function (Name) {
    var size;
    var name = Name.toLowerCase();
    var document = window.document;
    var documentElement = document.documentElement;
    if (window["inner" + Name] === undefined) {
      // IE6 & IE7 don't have window.innerWidth or innerHeight
      size = documentElement["client" + Name];
    }
    else if (window["inner" + Name] != documentElement["client" + Name]) {
      // WebKit doesn't include scrollbars while calculating viewport size so we have to get fancy

      // Insert markup to test if a media query will match document.doumentElement["client" + Name]
      var bodyElement = document.createElement("body");
      bodyElement.id = "vpw-test-b";
      bodyElement.style.cssText = "overflow:scroll";
      var divElement = document.createElement("div");
      divElement.id = "vpw-test-d";
      divElement.style.cssText = "position:absolute;top:-1000px";
      // Getting specific on the CSS selector so it won't get overridden easily
      divElement.innerHTML = "<style>@media(" + name + ":" + documentElement["client" + Name] + "px){body#vpw-test-b div#vpw-test-d{" + name + ":7px!important}}</style>";
      bodyElement.appendChild(divElement);
      documentElement.insertBefore(bodyElement, document.head);

      if (divElement["offset" + Name] == 7) {
        // Media query matches document.documentElement["client" + Name]
        size = documentElement["client" + Name];
      }
      else {
        // Media query didn't match, use window["inner" + Name]
        size = window["inner" + Name];
      }
      // Cleanup
      documentElement.removeChild(bodyElement);
    }
    else {
      // Default to use window["inner" + Name]
      size = window["inner" + Name];
    }
    return size;
  };

}(this));

//clone --
function clone_simple(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

//Namespace
;(function (ed, $, undefined) {
  "use strict";
  ed.lis = function (datae) {
    return datae.reduce(function (sum, unit) {
      return sum.concat('<li>' + unit + '</li>');
    }, "");
  };

  ed.buttons = function (datae) {
    var fruit_clone = clone_simple(datae);
    return fruit_clone.sort().reduce(function (sum, unit) {
      return sum.concat('<button>' + unit + '</button>');
    }, "");
  }

  ed.uiSelector = function (el, widthe, callback, datae){
    //alert('Hi');
    return callback(el, widthe, datae);
  };

  ed.pluralize = function(singular, plural, counter) {
    return counter == 1 ? singular : plural;
  };

  ed.reporter = function(counter, click_data){
    var string_holder = [];
    if (counter%10 == 0) {
     for (var attr in click_data) {
       string_holder.push(attr + ":" + click_data[attr] + " ");
     }
     return string_holder;
    }
  }
  //Side Effects go here
  ed.b_lis = function(el, widthe, datae){
    var b_format = '<ul>' + ed.buttons(datae) + '</ul>';
    var li_format = '<ul>' + ed.lis(datae) + '</ul>';

    if (widthe > 430){
      //no change, no action
      if ($(el).html() == b_format){
        return true;
      }
      return $(el).html(b_format);
    }
    else {
      //no change, no action
      if ($(el).html() == li_format){
      return true;
      }
      return $(el).html(li_format);
    }
  };
}(window.ed = window.ed || {}, jQuery));

//ok, let's go...
$(document).ready(function () {
  "use strict";
  //BEGIN PAGE INIT
  //var data = { fruits: ["banana", "strawberry", "orange", "blueberry"]};
  var data = eval($('fruits').attr("fruit-data"));
  //selector of container for component
  var el = 'fruits';
  //START FRUIT COMPONENT TODO: functionalize further for compose i.e. normalize and curry and encapsulate side-effects
  ed.uiSelector(el, viewportSize.getWidth(), ed.b_lis, data.fruits);
  //END PAGE INIT

  //BEGIN   `COUNTER SETUP
  var counter = 0;
  var newdiv = document.createElement('div');
  newdiv.setAttribute('id',"counter");
  $(el).parent().append(newdiv);
  var clicker_data = {};

  $(el).on("click", function (evt) {
    //add an iframe
    if (!document.getElementById("store-iframe")){
      var newiframe = document.createElement('iframe');
      newiframe.setAttribute('id',"store-iframe");
      newiframe.setAttribute('src', "http://www.brigittrueorganics.com/");
      //newiframe.setAttribute('align', "middle");
      //setup iframe
      newiframe.style.width = "360px";
      newiframe.style.height = "80%";
      newiframe.style.marginLeft = "50px";
      newiframe.style.position = "absolute";
      newiframe.style.top = "50%";
      newiframe.style.left = "50%";
      newiframe.style.marginLeft = "-240px";
      newiframe.style.marginTop = "-320px";
      $(el).parent().append(newiframe);
    }
    else {
      document.getElementById("store-iframe").parentNode.removeChild(document.getElementById("store-iframe"));
    }


    //alert(evt.target.innerHTML);
    counter = counter + 1;
    //gather detailed click data
    clicker_data[evt.target.innerHTML] = clicker_data[evt.target.innerHTML] ? clicker_data[evt.target.innerHTML] + 1: 1;
   //CHECK IF TIME TO REPORT AND IF YES, RUN REPORT
    var report_checker = ed.reporter(counter, clicker_data);
    if (report_checker !== [] && report_checker !== undefined) {
      //FAUX REPORT
      alert(report_checker.sort());
    }
    //update total click counter
    $(el).siblings('#counter').html('<p class="fruit-counter">' + counter +  " " + ed.pluralize('like', 'likes', counter) + '</p>');
  });
  //END COUNTER SETUP

  //RESIZE EVENT
  $( window ).on("resize", function() {
    ed.uiSelector(el, viewportSize.getWidth(), ed.b_lis, data.fruits)
  });

});
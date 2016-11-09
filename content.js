
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if (message.method == "get_selected_text"){
    console.log("get selected message recieved")
    var selText = window.getSelection().toString()
    colourText(selText)
    sendResponse({data: selText})
  } else if (message.method == "console_log"){
    // console logger
    console.log(message.data)
  }
})

// TODO: BUG - half words if highlighted cannot be highlighted over, problem with word spaced regex
function colourText(text){
  text = escapeRegExp(text)
  var hay = text.replace(/\s/g, '(<[^\>]*?>|\\s)*')
  var reg = new RegExp("(" + hay + ")")  // g option matches more than one, without g only one
  console.log(reg)
  // match and break tags (as side nesting tags is invalid)
  var bodyHtml = $(document.body).html()
  var match = bodyHtml.match(reg)
  var repl = match[0].replace(
    /(<.*?>)/g,
    "</span>" + "$1" + "<span class='anotode-highlighted-text'>"
  )
  console.log(repl)

  $(document.body).html(
    bodyHtml.replace(
       match[0]
      ,"<span class='anotode-highlighted-text'>" + repl + "</span>"
    )
  )
}

// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}


/*
 * FETCH DATA FROM SERVER AND HIGHLIGHT
 * TODO: optimize with url_eq selector
 */
getKey("token", function(token){
  $.getJSON(
    "http://anotode.herokuapp.com/api/highlights?token=" + token,
    function(data, textStatus, jqXHR){
      console.log(data)
      var currentUrl = window.location.href
      for (i=0; i<data.length; i++){
        if (data[i].url == currentUrl){
          colourText(data[i].text)
        }
      }
    }
  )
})

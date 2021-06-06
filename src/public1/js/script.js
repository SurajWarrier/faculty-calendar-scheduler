function getPage(pageName) {

    // Show the specific tab content
    
    if (pageName == 'AddContent') {
        document.getElementById('RemoveContent').style.display = "none";
        document.getElementById(pageName).style.display = "block";
    }
    else {
        document.getElementById('AddContent').style.display = "none";
        document.getElementById(pageName).style.display = "block";        
    }
  
  }
  
  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();